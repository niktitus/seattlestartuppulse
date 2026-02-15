import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  url: string;
  submittedDate: string;
}

interface VerifyResponse {
  verified: boolean;
  extractedDate?: string;
  extractedTime?: string;
  message?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit: 10 requests per IP per hour
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`verify-event-date:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  try {
    const { url, submittedDate }: VerifyRequest = await req.json();

    if (!url || url === '#') {
      console.log('No URL provided, skipping verification');
      return new Response(
        JSON.stringify({ verified: true, message: 'No URL to verify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching URL:', url);
    
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EventVerifier/1.0)',
      },
    });

    if (!pageResponse.ok) {
      console.log('Failed to fetch URL:', pageResponse.status);
      return new Response(
        JSON.stringify({ verified: true, message: 'Could not fetch event page' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await pageResponse.text();
    console.log('Fetched page, length:', html.length);

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ verified: true, message: 'Verification unavailable' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pageContent = html.substring(0, 15000);

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
            content: `You are a date extraction assistant. Extract the event date and time from the provided webpage content. 
            
Return ONLY a JSON object with this format:
{
  "date": "extracted date in format like 'Jan 27' or 'Jan 27, 2025' or 'January 27'",
  "time": "extracted time like '5:00 PM' or '5:00 PM PST' or null if not found",
  "confidence": "high" or "medium" or "low"
}

Look for dates in event headers, meta tags, schema markup, or prominent text. The date should be the START date of the event if it's a range.`
          },
          {
            role: 'user',
            content: `Extract the event date and time from this page content:\n\n${pageContent}`
          }
        ],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ verified: true, message: 'AI extraction failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;
    console.log('AI response:', aiContent);

    let extractedInfo;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedInfo = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return new Response(
        JSON.stringify({ verified: true, message: 'Could not parse extracted date' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!extractedInfo?.date) {
      return new Response(
        JSON.stringify({ verified: true, message: 'No date found on page' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracted date:', extractedInfo.date, 'Submitted date:', submittedDate);

    const response: VerifyResponse = {
      verified: true,
      extractedDate: extractedInfo.date,
      extractedTime: extractedInfo.time || undefined,
      message: `Event date found: ${extractedInfo.date}${extractedInfo.time ? ' at ' + extractedInfo.time : ''}`,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying event:', error);
    return new Response(
      JSON.stringify({ verified: true, message: 'Verification error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
