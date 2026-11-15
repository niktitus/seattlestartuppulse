import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const UUID = /^[0-9a-f-]{36}$/i;
const txt = (v: unknown, max: number) => { const s = String(v ?? '').trim().slice(0, max); return s || null; };
const int = (v: unknown, max: number) => { if (v === null || v === undefined || v === '') return null; const n = Math.round(Number(v)); return Number.isFinite(n) && n >= 0 && n <= max ? n : null; };
const strip = (s: string) => s.replace(/<[^>]*>/g, '');

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const ip = getClientIp(req);
  if (!checkRateLimit(`intel:${ip}`, 30, 60_000).allowed) return rateLimitResponse(corsHeaders);
  try {
    const body = await req.json().catch(() => ({}));
    const a = body.action;

    if (a === 'track') {
      if (!UUID.test(String(body.event_id))) return json({ error: 'Bad event' }, 400);
      const { data: existing } = await db.from('event_lifecycle').select('id').eq('event_id', body.event_id).maybeSingle();
      if (existing) return json({ error: 'This event is already being tracked.' }, 409);
      const token = crypto.randomUUID() + crypto.randomUUID();
      const { data, error } = await db.from('event_lifecycle').insert({ event_id: body.event_id, edit_token: token }).select('id').single();
      if (error) throw error;
      return json({ id: data.id, token });
    }

    if (a === 'update_lifecycle') {
      if (!UUID.test(String(body.id))) return json({ error: 'Bad id' }, 400);
      const { data: row } = await db.from('event_lifecycle').select('edit_token').eq('id', body.id).maybeSingle();
      if (!row || typeof body.token !== 'string' || row.edit_token !== body.token) return json({ error: 'Only the person tracking this event can edit it.' }, 403);
      const f = body.fields ?? {};
      const rsvps = int(f.rsvps, 100000), attended = int(f.attended, 100000);
      const patch: Record<string, unknown> = {
        pre_event_notes: txt(f.pre_event_notes, 2000), live_pulse: txt(f.live_pulse, 2000),
        post_event_summary: txt(f.post_event_summary, 2000), top_ask: txt(f.top_ask, 300),
        top_offer: txt(f.top_offer, 300), lessons: txt(f.lessons, 2000),
        connections_made: int(f.connections_made, 100000), rsvps, attended,
        show_rate: rsvps && attended !== null ? Math.min(1, attended / rsvps) : null,
        updated_at: new Date().toISOString(),
      };
      if (['before','during','after'].includes(f.phase)) {
        patch.phase = f.phase; patch.status = f.phase === 'before' ? 'upcoming' : f.phase === 'during' ? 'live' : 'completed';
      }
      const { error } = await db.from('event_lifecycle').update(patch).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (a === 'pulse_submit') {
      if (!checkRateLimit(`pulse:${ip}`, 5, 60_000).allowed) return rateLimitResponse(corsHeaders);
      const theme = strip(String(body.theme ?? '')).trim().slice(0, 280);
      if (theme.length < 3) return json({ error: 'Write a few words.' }, 400);
      const source = ['event_feedback','ask','offer'].includes(String(body.source)) ? String(body.source) : 'submitted';
      const event_id = UUID.test(String(body.event_id ?? '')) ? body.event_id : null;
      const { error } = await db.from('pulse_themes').insert({ theme, source, event_id });
      if (error) throw error;
      return json({ ok: true });
    }

    if (a === 'pulse_upvote' || a === 'follow_track') {
      if (!UUID.test(String(body.id))) return json({ error: 'Bad id' }, 400);
      if (!checkRateLimit(`${a}:${ip}:${body.id}`, 1, 86_400_000).allowed) return json({ ok: true, duplicate: true });
      const table = a === 'pulse_upvote' ? 'pulse_themes' : 'track_picks';
      const col = a === 'pulse_upvote' ? 'upvotes' : 'follows';
      const { data: row } = await db.from(table).select(col).eq('id', body.id).maybeSingle();
      if (!row) return json({ error: 'Not found' }, 404);
      const { error } = await db.from(table).update({ [col]: (row as any)[col] + 1 }).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }
    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    console.error('intelligence error', e);
    return json({ error: 'Something went wrong' }, 500);
  }
});
