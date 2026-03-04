import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract signal metadata from event page content using AI
async function extractSignal(
  apiKey: string,
  title: string,
  organizer: string,
  pageContent: string,
  defaults: { cost: string; description: string }
) {
  const signal = {
    audience: ['Any'],
    stage: ['Pre-seed', 'Seed'],
    host_type: 'Community/Independent',
    expected_size: '25-50',
    outcome_framing: null as string | null,
    cost: defaults.cost,
    is_high_signal: false,
    description: defaults.description,
  };

  try {
    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are an event signal analyst for a Seattle startup community platform. Analyze the event page and extract quality signals. Return ONLY a JSON object:
{
  "audience": array from ["FOUNDER ONLY", "OPERATOR ONLY", "TECHNICAL", "OPEN TO ALL"],
  "stage": array from ["PRE-REVENUE", "$0-1M", "$1M-10M", "$10M+", "ALL STAGES"],
  "host_type": one of "VC Firms", "Accelerators/Incubators", "Corporate", "Community/Independent",
  "expected_size": one of "10-25", "25-50", "50-100", "100+",
  "outcome_framing": max 150 chars, format: "Meet [specific roles], leave with [tangible deliverable]". null if unclear,
  "cost": "Free" or the price string,
  "is_high_signal": boolean — true ONLY if: specific notable speakers, selective attendance, clear actionable outcome, hosted by reputable org. Generic networking or meetups = false,
  "description": improved 1-2 sentence description (max 300 chars) capturing the specific value proposition
}
Be conservative with is_high_signal. Most events are NOT high signal.`
          },
          {
            role: 'user',
            content: `Analyze this event page for "${title}" by "${organizer}":\n\n${pageContent}`
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        signal.audience = Array.isArray(parsed.audience) ? parsed.audience : signal.audience;
        signal.stage = Array.isArray(parsed.stage) ? parsed.stage : signal.stage;
        signal.host_type = parsed.host_type || signal.host_type;
        const validSizes = ['10-25', '25-50', '50-100', '100+'];
        signal.expected_size = validSizes.includes(parsed.expected_size) ? parsed.expected_size : signal.expected_size;
        signal.outcome_framing = parsed.outcome_framing || null;
        signal.cost = parsed.cost || signal.cost;
        signal.is_high_signal = parsed.is_high_signal === true;
        signal.description = parsed.description || signal.description;
        console.log(`Signal: "${title}" → high_signal=${signal.is_high_signal}, audience=${signal.audience}`);
      }
    }
  } catch (err) {
    console.error(`Signal extraction failed for "${title}":`, err);
  }

  return signal;
}

// Verify a URL is live and not a soft-404, returning page content if valid
async function verifyUrl(url: string): Promise<{ valid: boolean; content: string }> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });

    // Reject non-OK status codes (404, 410, 500, etc.)
    if (!res.ok) {
      console.log(`URL returned status ${res.status}: ${url}`);
      return { valid: false, content: '' };
    }

    const body = await res.text();
    // Check a larger portion of the page for soft-404 indicators
    const lower = body.substring(0, 20000).toLowerCase();

    const soft404Patterns = [
      'page not found',
      'was not found',
      'does not exist',
      'nothing was found',
      'no longer available',
      'event not found',
      'this event has ended',
      'this event is over',
      'event has passed',
      'event is no longer',
      'has been removed',
      'has been canceled',
      'has been cancelled',
      'no results found',
      'sorry, but the page',
      'we couldn\'t find',
      'we could not find',
      'this page doesn\'t exist',
      'this page does not exist',
      'oops! that page',
      'whoops, the page',
      'error 404',
      'page or event you are looking for',
    ];

    // Also detect pages where "not found" appears with "404" nearby
    const hasNotFound = lower.includes('not found');
    const has404 = lower.includes('404');

    if ((hasNotFound && has404) || soft404Patterns.some(p => lower.includes(p))) {
      console.log(`Soft-404 detected for: ${url}`);
      return { valid: false, content: '' };
    }

    return { valid: true, content: body.substring(0, 15000) };
  } catch {
    return { valid: false, content: '' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Require admin authentication
  const authResult = await verifyAdminToken(req.headers.get('Authorization'));
  if (!authResult.valid) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Rate limit: 1 invocation per IP per hour
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`scrape-events:${ip}`, 1, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

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
            if (startAt && startAt < now) continue;

            const dateFmt = startAt
              ? startAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'TBD';
            const timeFmt = startAt
              ? startAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' })
              : 'TBD';

            const isVirtual = evt.geo_address_info?.mode === 'online' || evt.url?.includes('virtual');

            const eventUrl = `https://lu.ma/${evt.url || ''}`;
            events.push({
              title: evt.name || '',
              date: dateFmt,
              time: timeFmt + ' PST',
              description: (evt.description_short || evt.description || '').substring(0, 200),
              url: eventUrl,
              city: evt.geo_address_info?.city || 'Seattle',
              format: isVirtual ? 'virtual' : 'inperson',
              cost: evt.payment_settings?.is_free !== false ? 'Free' : (evt.payment_settings?.price_label || 'Paid'),
              organizer: source.name,
            });
          }
        } else {
          // Generic HTML scraping with AI extraction
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
- "url": the EXACT event URL/link as it appears in the HTML href attribute (string, or null)
- "city": city name if found (string, default "Seattle")
- "format": "inperson" or "virtual" or "hybrid" (string)
- "cost": "Free" or the price (string)
- "organizer": organizer name (string)
- "iso_date": the event date in ISO format YYYY-MM-DD (string) — this is critical for filtering

CRITICAL RULES:
1. Today's date is ${todayStr}. Do NOT include any event whose date is before today.
2. ONLY use URLs that are EXPLICITLY present as href links in the HTML. Copy the EXACT href value.
3. NEVER fabricate, guess, modify, or construct URLs. If no href link exists for an event, set url to null.
4. Do NOT modify URL paths (e.g. do not change "/calendar-event/" to "/event/").
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

        // Hard filter: skip past events
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureEvents = events.filter(evt => {
          if (!evt.title || !evt.date) return false;
          const isoDate = evt.iso_date ? new Date(evt.iso_date + 'T00:00:00') : null;
          const parsed = isoDate && !isNaN(isoDate.getTime()) ? isoDate : new Date(evt.date);
          if (!isNaN(parsed.getTime()) && parsed < today) {
            console.log(`Skipping past event: "${evt.title}" (${evt.date})`);
            return false;
          }
          return true;
        });

        console.log(`Extracted ${events.length} events, ${futureEvents.length} are future, from ${source.name}`);

        // Insert events: verify URL → extract signal → insert
        for (const evt of futureEvents) {
          const eventUrl = evt.url || '';
          if (!eventUrl || eventUrl === '#') {
            console.log(`Skipping event with no URL: "${evt.title}"`);
            continue;
          }

          // Verify the event page URL is live
          let pageContent = '';
          if (eventUrl !== source.url) {
            const { valid, content } = await verifyUrl(eventUrl);
            if (!valid) {
              console.log(`Skipping unverified URL: "${evt.title}" - ${eventUrl}`);
              continue;
            }
            pageContent = content;
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

          // Extract signal from the verified page content
          const signal = pageContent
            ? await extractSignal(apiKey, evt.title, evt.organizer || source.name, pageContent, {
                cost: evt.cost || 'Free',
                description: (evt.description || '').trim().substring(0, 500),
              })
            : {
                audience: ['Any'],
                stage: ['Pre-seed', 'Seed'],
                host_type: 'Community/Independent',
                expected_size: '25-50',
                outcome_framing: null,
                cost: evt.cost || 'Free',
                is_high_signal: false,
                description: (evt.description || '').trim().substring(0, 500),
              };

          const { error: insertErr } = await supabase
            .from('events')
            .insert({
              title: evt.title.trim().substring(0, 200),
              date: evt.date.trim(),
              time: (evt.time || 'TBD').trim(),
              description: signal.description,
              url: eventUrl,
              city: evt.city || 'Seattle',
              format: evt.format || 'inperson',
              cost: signal.cost,
              organizer: (evt.organizer || source.name).trim(),
              type: 'Event',
              audience: signal.audience,
              stage: signal.stage,
              host_type: signal.host_type,
              expected_size: signal.expected_size,
              outcome_framing: signal.outcome_framing,
              featured: false,
              is_approved: true,
              is_high_signal: signal.is_high_signal,
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
