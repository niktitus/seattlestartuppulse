import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Allow cron calls: check if the bearer token is a Supabase JWT with anon role
  const authHeader = req.headers.get('Authorization');
  let isCron = false;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payloadB64 = authHeader.replace('Bearer ', '').split('.')[1];
      if (payloadB64) {
        const payload = JSON.parse(atob(payloadB64));
        if (payload.role === 'anon' && payload.iss === 'supabase') isCron = true;
      }
    } catch { /* not a valid JWT */ }
  }

  if (!isCron) {
    const authResult = await verifyAdminToken(authHeader);
    if (!authResult.valid) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`scrape-deadlines:${ip}`, 1, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const apiKey = Deno.env.get('LOVABLE_API_KEY');

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { data: sources, error: srcErr } = await supabase
      .from('deadline_sources')
      .select('*')
      .eq('is_active', true);

    if (srcErr) throw srcErr;
    if (!sources || sources.length === 0) {
      return new Response(JSON.stringify({ message: 'No active deadline sources' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalImported = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    for (const source of sources) {
      try {
        console.log(`Scraping deadline source: ${source.name} - ${source.url}`);

        const pageRes = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
          },
        });

        if (!pageRes.ok) {
          console.error(`Failed to fetch ${source.url}: ${pageRes.status}`);
          continue;
        }

        const html = await pageRes.text();
        const pageContent = html.substring(0, 30000);

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You are a deadline/grant extraction assistant for a Seattle startup community platform. Extract deadlines, grants, and application windows from the page.

Return a JSON array of objects:
- "title": grant/program name (string, max 200 chars)
- "due_date": deadline date like "Mar 31, 2026" (string). If rolling/ongoing, use the next upcoming cycle date or "Ongoing"
- "description": 1-2 sentence description of the grant/opportunity (string, max 300 chars)
- "url": the best URL for applying or learning more (string)
- "type": one of "Grant", "Accelerator", "Fellowship", "Competition", "Other" (string)
- "iso_date": deadline in YYYY-MM-DD format, or null if ongoing

RULES:
1. Today is ${todayStr}. Only include deadlines that are in the future or ongoing/rolling.
2. Use EXACT URLs from the page when available. If none, use the source URL.
3. Be concise and specific in descriptions.
Return ONLY a JSON array. If no deadlines found, return [].`
              },
              {
                role: 'user',
                content: `Extract deadlines/grants from this page (source: ${source.name}, URL: ${source.url}):\n\n${pageContent}`
              }
            ],
            temperature: 0.1,
            max_tokens: 2000,
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI extraction failed for ${source.url}: ${aiResponse.status}`);
          continue;
        }

        const aiData = await aiResponse.json();
        const aiContent = aiData.choices?.[0]?.message?.content || '';

        let deadlines: any[] = [];
        try {
          const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            deadlines = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error(`Failed to parse AI response for ${source.url}:`, e);
          continue;
        }

        // Filter: only future or ongoing
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validDeadlines = deadlines.filter(d => {
          if (!d.title || !d.due_date) return false;
          if (d.due_date === 'Ongoing') return true;
          const isoDate = d.iso_date ? new Date(d.iso_date + 'T00:00:00') : null;
          const parsed = isoDate && !isNaN(isoDate.getTime()) ? isoDate : new Date(d.due_date);
          if (!isNaN(parsed.getTime()) && parsed < today) return false;
          return true;
        });

        console.log(`Extracted ${deadlines.length} deadlines, ${validDeadlines.length} valid from ${source.name}`);

        for (const d of validDeadlines) {
          // Check duplicates
          const { data: existing } = await supabase
            .from('deadlines')
            .select('id')
            .eq('title', d.title.trim())
            .limit(1);

          if (existing && existing.length > 0) {
            console.log(`Skipping duplicate deadline: ${d.title}`);
            continue;
          }

          // Calculate days_left
          let daysLeft = 0;
          if (d.due_date !== 'Ongoing' && d.iso_date) {
            const dueDate = new Date(d.iso_date + 'T00:00:00');
            if (!isNaN(dueDate.getTime())) {
              daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            }
          }

          const { error: insertErr } = await supabase
            .from('deadlines')
            .insert({
              title: d.title.trim().substring(0, 200),
              due_date: d.due_date.trim(),
              description: (d.description || '').trim().substring(0, 500),
              url: d.url || source.url,
              type: d.type || 'Grant',
              days_left: daysLeft,
              is_approved: true,
            });

          if (insertErr) {
            console.error(`Failed to insert deadline "${d.title}":`, insertErr);
          } else {
            totalImported++;
          }
        }

        await supabase
          .from('deadline_sources')
          .update({ last_scraped_at: new Date().toISOString() })
          .eq('id', source.id);

      } catch (sourceErr) {
        console.error(`Error processing source ${source.name}:`, sourceErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, imported: totalImported }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scrape deadlines error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
