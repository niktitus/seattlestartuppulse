import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const STATUSES = ['new', 'starred', 'asked', 'archived'];

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action === 'submit') {
      const ip = getClientIp(req);
      const rl = await checkRateLimit(supabase, ip, 'fireside-qa', 10, 60);
      if (!rl.allowed) return rateLimitResponse(rl, corsHeaders);
      const question = String(body.question ?? '').trim().slice(0, 500);
      const name = String(body.name ?? '').trim().slice(0, 80) || null;
      if (question.length < 3) return json({ error: 'Please write a question.' }, 400);
      const { error } = await supabase.from('fireside_questions').insert({ question, name });
      if (error) throw error;
      return json({ ok: true });
    }

    const auth = await verifyAdminToken(req.headers.get('Authorization'));
    if (!auth.valid) return json({ error: 'Unauthorized' }, 401);

    if (action === 'list') {
      const { data, error } = await supabase.from('fireside_questions').select('*').order('created_at', { ascending: false }).limit(500);
      if (error) throw error;
      return json({ questions: data });
    }
    if (action === 'update') {
      if (!STATUSES.includes(body.status)) return json({ error: 'Bad status' }, 400);
      const { error } = await supabase.from('fireside_questions').update({ status: body.status }).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }
    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    console.error('fireside-qa error', e);
    return json({ error: 'Something went wrong' }, 500);
  }
});
