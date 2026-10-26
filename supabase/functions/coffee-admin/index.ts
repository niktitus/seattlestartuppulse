import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`coffee-admin:${ip}`, 120, 10 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  const auth = await verifyAdminToken(req.headers.get('authorization'));
  if (!auth.valid) return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    switch (body.action) {
      case 'list': {
        const [mentors, orgs, commitments, people, interests] = await Promise.all([
          supabase.from('people').select('*, vouches(voucher_name, voucher_contact, confirmed_at)').eq('is_mentor', true).order('created_at', { ascending: false }),
          supabase.from('organizations').select('*').order('created_at', { ascending: false }),
          supabase.from('commitments').select('*, people(first_name, email, stage, is_mentor, mentor_status)').order('created_at', { ascending: false }),
          supabase.from('people').select('id, first_name, email, stage, is_mentor, mentor_status, short_id, show_badge_card, badge_tags, linkedin_url').order('created_at', { ascending: false }),
          supabase.from('interests').select('person_id, organization_id'),
        ]);
        const { count: commitmentsMade } = await supabase.from('commitments').select('id', { count: 'exact', head: true });
        const { count: matchesMade } = await supabase.from('matches').select('id', { count: 'exact', head: true }).eq('status', 'approved');
        const { count: coffeesHappened } = await supabase.from('checkins').select('id', { count: 'exact', head: true }).eq('response', 'met');
        return json({
          mentors: mentors.data ?? [], orgs: orgs.data ?? [], commitments: commitments.data ?? [],
          people: people.data ?? [], interests: interests.data ?? [],
          counters: { commitments: commitmentsMade ?? 0, matches: matchesMade ?? 0, coffees: coffeesHappened ?? 0 },
        });
      }

      case 'set-mentor-status': {
        const { id, status } = body;
        if (!['approved', 'declined', 'vouched', 'applied'].includes(status)) return json({ error: 'Bad status' }, 400);
        await supabase.from('people').update({ mentor_status: status }).eq('id', id);
        return json({ ok: true });
      }

      case 'set-org-status': {
        const { id, status } = body;
        if (!['approved', 'pending', 'declined'].includes(status)) return json({ error: 'Bad status' }, 400);
        await supabase.from('organizations').update({ status }).eq('id', id);
        return json({ ok: true });
      }

      case 'quick-entry': {
        // Volunteer typing in a paper commitment card.
        const first_name = typeof body.first_name === 'string' ? body.first_name.trim().slice(0, 100) : '';
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 255) : '';
        const type = typeof body.type === 'string' ? body.type : '';
        if (!first_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Name and email are required.' }, 400);
        if (!['with_someone', 'match_me', 'mentor_offer'].includes(type)) return json({ error: 'Pick a type.' }, 400);

        const { data: existing } = await supabase.from('people').select('id').eq('email', email).maybeSingle();
        let personId = existing?.id as string | undefined;
        if (!personId) {
          const { data, error } = await supabase.from('people').insert({
            first_name, email, short_id: crypto.randomUUID().replace(/-/g, '').slice(0, 8),
            stage: typeof body.stage === 'string' ? body.stage.slice(0, 50) : null,
          }).select('id').single();
          if (error) throw error;
          personId = data.id;
        }
        const tags = Array.isArray(body.tags) ? body.tags.filter((t: unknown) => typeof t === 'string').slice(0, 2) : [];
        const { error } = await supabase.from('commitments').insert({
          person_id: personId, type, tags,
          other_name: typeof body.other_name === 'string' ? body.other_name.trim().slice(0, 150) || null : null,
          other_email: typeof body.other_email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.other_email.trim()) ? body.other_email.trim().toLowerCase() : null,
          coffee_count: type === 'mentor_offer' ? Math.min(3, Math.max(1, Number(body.coffee_count) || 1)) : null,
          source: 'paper',
        });
        if (error) throw error;
        return json({ ok: true });
      }

      default:
        return json({ error: 'Unknown action.' }, 400);
    }
  } catch (error) {
    console.error('coffee-admin error:', error);
    return json({ error: 'Something went wrong.' }, 500);
  }
});
