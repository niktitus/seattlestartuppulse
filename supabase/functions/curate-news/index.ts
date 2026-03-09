import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`curate-news:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  try {
    // Allow cron calls with anon key, otherwise require admin auth
    const authHeader = req.headers.get('Authorization');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const isCron = authHeader === `Bearer ${anonKey}`;

    if (!isCron) {
      const authResult = await verifyAdminToken(authHeader);
      if (!authResult.valid) {
        return new Response(
          JSON.stringify({ success: false, error: authResult.error }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current date for context
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    const dateStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Use AI to generate curated news items
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a Seattle startup ecosystem news curator. Generate 7-10 real, verifiable news items about the Seattle/Pacific Northwest startup ecosystem from the past week. Focus on:
- Funding rounds for Seattle-area startups
- New startup launches or pivots
- Ecosystem developments (accelerators, co-working, events)
- Policy changes affecting WA startups
- Talent/hiring trends in Seattle tech
- Notable exits or acquisitions

Each item must be factual and from a real, verifiable source. Use sources like GeekWire, TechCrunch, Seattle Times, Puget Sound Business Journal, Forbes, Bloomberg, etc.

Current date for reference: ${now.toISOString().split('T')[0]}`
          },
          {
            role: "user",
            content: `Generate this week's curated Seattle startup ecosystem news (week of ${dateStr}). Return real news items that happened this past week.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_news_items",
              description: "Submit curated news items for the Seattle startup ecosystem",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "News headline" },
                        source: { type: "string", description: "Publication name (e.g. GeekWire, TechCrunch)" },
                        date: { type: "string", description: "Date in format 'Mon DD, YYYY'" },
                        summary: { type: "string", description: "2-3 sentence summary of the news" },
                        url: { type: "string", description: "URL to the source article" },
                        category: { type: "string", enum: ["Funding", "Ecosystem", "Policy", "Talent", "Exits", "Product"], description: "News category" }
                      },
                      required: ["title", "source", "date", "summary", "url", "category"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["items"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "submit_news_items" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `AI gateway error (${status})` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(
        JSON.stringify({ success: false, error: "AI did not return structured news data" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newsItems = JSON.parse(toolCall.function.arguments).items;

    if (!newsItems || newsItems.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No news items generated" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert news items (set is_approved to true for immediate visibility)
    const insertData = newsItems.map((item: any) => ({
      title: item.title,
      source: item.source,
      date: item.date,
      summary: item.summary,
      url: item.url,
      category: item.category,
      is_approved: true,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('news')
      .insert(insertData)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully curated ${inserted?.length || 0} news items`);

    return new Response(
      JSON.stringify({ success: true, count: inserted?.length || 0, items: inserted }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in curate-news:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
