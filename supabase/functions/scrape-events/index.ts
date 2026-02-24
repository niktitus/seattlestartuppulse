import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const apiKey = Deno.env.get('LOVABLE_API_KEY');

  if (!apiKey) {
    console.error('LOVABLE_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'Missing API key' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // Get active sources
    const { data: sources, error: srcErr } = await supabase
      .from('event_sources')
      .select('*')
      .eq('is_active', true);

    if (srcErr) throw srcErr;
    if (!sources || sources.length === 0) {
      return new Response(JSON.stringify({ message: 'No active sources' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalImported = 0;

    for (const source of sources) {
      try {
        console.log(`Scraping source: ${source.name} - ${source.url}`);

        let events: any[] = [];

        if (source.platform === 'luma') {
          // Use Luma public API directly — returns structured JSON
          const lumaRes = await fetch(source.url, {
            headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
          });

          if (!lumaRes.ok) {
            console.error(`Luma API failed for ${source.name}: ${lumaRes.status}`);
            const errText = await lumaRes.text();
            console.error(errText);
            continue;
          }

          const lumaData = await lumaRes.json();
          const entries = lumaData.entries || [];

          for (const entry of entries) {
            const evt = entry.event;
            if (!evt) continue;

            const startAt = evt.start_at ? new Date(evt.start_at) : null;
            const now = new Date();
            if (startAt && startAt < now) continue; // skip past events

            const dateFmt = startAt
              ? startAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'TBD';
            const timeFmt = startAt
              ? startAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' })
              : 'TBD';

            const isVirtual = evt.geo_address_info?.mode === 'online' || evt.url?.includes('virtual');

            events.push({
              title: evt.name || '',
              date: dateFmt,
              time: timeFmt + ' PST',
              description: (evt.description_short || evt.description || '').substring(0, 200),
              url: `https://lu.ma/${evt.url || ''}`,
              city: evt.geo_address_info?.city || 'Seattle',
              format: isVirtual ? 'virtual' : 'inperson',
              cost: evt.payment_settings?.is_free !== false ? 'Free' : (evt.payment_settings?.price_label || 'Paid'),
              organizer: source.name,
            });
          }
        } else {
          // Generic HTML scraping with AI extraction (Eventbrite, Meetup, GeekWire, etc.)
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

          // Use AI to extract events
          const todayStr = new Date().toISOString().split('T')[0];
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
                  content: `You are an event data extraction assistant. Extract ONLY FUTURE events from the provided web page HTML. The page may be from Eventbrite, Meetup, GeekWire, AllEvents, or any other event listing site.

For each event, return a JSON array of objects with these fields:
- "title": event name (string)
- "date": date like "Feb 20, 2026" — ALWAYS include the year (string)
- "time": time like "6:00 PM PST" (string, or null)
- "description": short description (string, max 200 chars)
- "url": the event URL/link if found (string, or null)
- "city": city name if found (string, default "Seattle")
- "format": "inperson" or "virtual" or "hybrid" (string)
- "cost": "Free" or the price (string)
- "organizer": organizer name (string)
- "iso_date": the event date in ISO format YYYY-MM-DD (string) — this is critical for filtering

CRITICAL: Today's date is ${todayStr}. Do NOT include any event whose date is before today. Only include events happening today or in the future.
Return ONLY a JSON array. If no future events found, return [].`
                },
                {
                  role: 'user',
                  content: `Extract ONLY FUTURE events (on or after ${todayStr}) from this event listing page (source: ${source.name}):\n\n${pageContent}`
                }
              ],
              temperature: 0.1,
              max_tokens: 4000,
            }),
          });

          if (!aiResponse.ok) {
            console.error(`AI extraction failed for ${source.url}: ${aiResponse.status}`);
            continue;
          }

          const aiData = await aiResponse.json();
          const aiContent = aiData.choices?.[0]?.message?.content || '';

          try {
            const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              events = JSON.parse(jsonMatch[0]);
            }
          } catch (e) {
            console.error(`Failed to parse AI response for ${source.url}:`, e);
            continue;
          }
        }

        // Hard filter: skip past events even if AI included them
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const futureEvents = events.filter(evt => {
          if (!evt.title || !evt.date) return false;
          // Try iso_date first, then parse the date string
          const isoDate = evt.iso_date ? new Date(evt.iso_date + 'T00:00:00') : null;
          const parsed = isoDate && !isNaN(isoDate.getTime()) ? isoDate : new Date(evt.date);
          if (!isNaN(parsed.getTime()) && parsed < today) {
            console.log(`Skipping past event: "${evt.title}" (${evt.date})`);
            return false;
          }
          return true;
        });

        console.log(`Extracted ${events.length} events, ${futureEvents.length} are future, from ${source.name}`);

        // Insert events, verifying URLs and skipping duplicates
        for (const evt of futureEvents) {
          // CRITICAL: Verify each event URL exists before inserting
          const eventUrl = evt.url || '';
          if (!eventUrl || eventUrl === '#') {
            console.log(`Skipping event with no URL: "${evt.title}"`);
            continue;
          }

          // Only verify URLs that differ from the source page (AI-generated URLs)
          if (eventUrl !== source.url) {
            try {
              const verifyRes = await fetch(eventUrl, {
                method: 'GET',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                  'Accept': 'text/html,application/xhtml+xml',
                },
                redirect: 'follow',
              });

              if (!verifyRes.ok) {
                console.log(`Skipping event with dead URL (${verifyRes.status}): "${evt.title}" - ${eventUrl}`);
                continue;
              }

              // Check for soft-404 pages (200 status but "not found" content)
              const body = await verifyRes.text();
              const lower = body.substring(0, 5000).toLowerCase();
              if (
                lower.includes('page not found') ||
                lower.includes('does not exist') ||
                lower.includes('nothing was found') ||
                lower.includes('no longer available') ||
                (lower.includes('404') && lower.includes('not found'))
              ) {
                console.log(`Skipping event with soft-404 page: "${evt.title}" - ${eventUrl}`);
                continue;
              }
            } catch (fetchErr) {
              console.log(`Skipping event with unreachable URL: "${evt.title}" - ${eventUrl}`);
              continue;
            }
          }

          // Check for duplicates
          const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('title', evt.title.trim())
            .eq('date', evt.date.trim())
            .limit(1);

          if (existing && existing.length > 0) {
            console.log(`Skipping duplicate: ${evt.title}`);
            continue;
          }

          const { error: insertErr } = await supabase
            .from('events')
            .insert({
              title: evt.title.trim().substring(0, 200),
              date: evt.date.trim(),
              time: (evt.time || 'TBD').trim(),
              description: (evt.description || '').trim().substring(0, 500),
              url: eventUrl,
              city: evt.city || 'Seattle',
              format: evt.format || 'inperson',
              cost: evt.cost || 'Free',
              organizer: (evt.organizer || source.name).trim(),
              type: 'Event',
              audience: ['Any'],
              stage: ['Pre-seed', 'Seed'],
              featured: false,
              is_approved: true,
              is_high_signal: false,
            });

          if (insertErr) {
            console.error(`Failed to insert event "${evt.title}":`, insertErr);
          } else {
            totalImported++;
          }
        }

        // Update last_scraped_at
        await supabase
          .from('event_sources')
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
    console.error('Scrape error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
