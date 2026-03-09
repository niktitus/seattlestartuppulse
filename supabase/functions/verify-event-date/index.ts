import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`verify-event-date:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  try {
    const { url } = await req.json();

    if (!url || url === '#') {
      return new Response(
        JSON.stringify({ success: false, message: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching URL:', url);

    const pageResponse = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EventVerifier/1.0)' },
    });

    if (!pageResponse.ok) {
      return new Response(
        JSON.stringify({ success: false, message: 'Could not fetch event page' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await pageResponse.text();
    console.log('Fetched page, length:', html.length);

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, message: 'AI extraction unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pageContent = html.substring(0, 20000);

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
            content: `You extract structured event information from webpage content. Return ONLY a JSON object with these fields:
{
  "title": "event title",
  "date": "date in format like 'Mar 15, 2026'",
  "time": "start time like '6:00 PM PST' or 'TBD' if not found",
  "organizer": "hosting organization name",
  "description": "1-2 sentence summary of the event",
  "format": "inperson" or "virtual" or "hybrid",
  "type": "Event" or "Networking" or "Workshop" or "Pitch Event" or "Conference" or "Meetup",
  "city": "city name or 'Virtual' if online",
  "cost": "Free" or dollar amount like "$25" or "Varies",
  "confidence": "high" or "medium" or "low"
}

Extract as much as you can. Use "TBD" or reasonable defaults for fields you can't find. The title must be the actual event name, not the page title. For description, write a concise summary focused on what attendees will experience.`
          },
          {
            role: 'user',
            content: `Extract event details from this page:\n\n${pageContent}`
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ success: false, message: 'AI extraction failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;
    console.log('AI response:', aiContent);

    let extracted;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return new Response(
        JSON.stringify({ success: false, message: 'Could not parse extracted data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!extracted?.title) {
      return new Response(
        JSON.stringify({ success: false, message: 'Could not extract event details from page' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          title: extracted.title,
          date: extracted.date || 'TBD',
          time: extracted.time || 'TBD',
          organizer: extracted.organizer || 'Unknown',
          description: extracted.description || '',
          format: extracted.format || 'inperson',
          type: extracted.type || 'Event',
          city: extracted.city || 'Seattle',
          cost: extracted.cost || 'Free',
          confidence: extracted.confidence || 'medium',
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error extracting event:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Extraction error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
