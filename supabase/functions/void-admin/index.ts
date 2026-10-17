import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { verifyAdminToken } from '../_shared/admin-auth.ts';
import { safeStats, canQuote, ROLES, TENURES, type Shout } from '../_shared/void-policy.ts';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const filters = z.object({ action: z.literal('list'), role: z.enum(['all',...ROLES]), tenure: z.enum(['all',...TENURES]), month: z.string().regex(/^(all|\d{4}-\d{2})$/) });
const actionSchema = z.union([filters, z.object({ action: z.literal('update'), id: z.string().uuid(), status: z.enum(['reviewed','hidden']) }), z.object({ action: z.literal('resume') })]);
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const auth = await verifyAdminToken(req.headers.get('Authorization'));
  if (!auth.valid) return json({ error: 'Please sign in to the admin panel.' }, 401);
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const parsed = actionSchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: 'Invalid admin request.' }, 400);
    const url = Deno.env.get('SUPABASE_URL'); const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return json({ error: 'Admin configuration is incomplete.' }, 503);
    const db = createClient(url,key,{auth:{persistSession:false}});
    const input = parsed.data;
    if (input.action === 'resume') { const { error } = await db.from('void_ai_state').upsert({ id: 'classifier', paused: false, message: null, http_status: null }); if (error) throw error; return json({ success: true }); }
    if (input.action === 'update') {
      const { error } = await db.from('void_shouts').update({ status: input.status, ...(input.status === 'reviewed' ? { needs_review: false } : {}) }).eq('id',input.id);
      if (error) throw error; return json({ success: true });
    }
    let query = db.from('void_shouts').select('*').order('needs_review',{ascending:false}).order('created_on',{ascending:false}).order('id',{ascending:true});
    if (input.role !== 'all') query = query.eq('role',input.role);
    if (input.tenure !== 'all') query = query.eq('seattle_tenure',input.tenure);
    // Page through every row so counts are not silently truncated by the API row limit.
    const rows: Shout[] = []; let start = 0;
    while (true) { const { data,error } = await query.range(start,start+999); if (error) throw error; const page = data as Shout[]; rows.push(...page); if (page.length < 1000) break; start += 1000; }
    const stats = safeStats(rows); const filteredRows = input.month === 'all' ? rows : rows.filter(r => r.created_on.slice(0,7) === input.month);
    const { data: state } = await db.from('void_ai_state').select('paused,message').eq('id','classifier').maybeSingle();
    return json({ success: true, rows: filteredRows.map(r => ({ ...r, can_quote: canQuote(r,filteredRows) })), stats: input.month === 'all' ? stats : stats.filter(s=>s.month===input.month), trends: stats, state });
  } catch { return json({ error: 'Unable to load or update Void records.' }, 503); }
});