import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`vouch-confirm:${ip}`, 20, 10 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const { token } = await req.json();
    if (typeof token !== 'string' || token.length > 100) return json({ error: 'Invalid link.' }, 400);

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: vouch } = await supabase.from('vouches').select('id, mentor_id, confirmed_at').eq('token', token).maybeSingle();
    if (!vouch) return json({ error: 'This vouch link is invalid or has expired.' }, 404);
    if (vouch.confirmed_at) return json({ ok: true, already: true });

    await supabase.from('vouches').update({ confirmed_at: new Date().toISOString() }).eq('id', vouch.id);
    await supabase.from('people').update({ mentor_status: 'vouched' }).eq('id', vouch.mentor_id).eq('mentor_status', 'applied');
    return json({ ok: true });
  } catch (error) {
    console.error('vouch-confirm error:', error);
    return json({ error: 'Something went wrong.' }, 500);
  }
});
