import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";
import { proposeMatches, needsPersonalFollowUp, isDueForCheckin, type Seeker, type MentorOffer } from "../_shared/coffee-match.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = 'https://seattlestartuppulse.com';
const FROM = 'Seattle Startup Pulse <onboarding@resend.dev>';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const toHtml = (text: string) =>
  `<div style="font-family:sans-serif;font-size:15px;line-height:1.5">${esc(text)
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>').replace(/\n/g, '<br>')}</div>`;

async function sendEmail(to: string, subject: string, html: string): Promise<string | null> {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return 'Email key not configured';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (res.ok) return null;
  const t = await res.text();
  console.error('Resend error:', res.status, t);
  return `Email service said ${res.status}: ${t.slice(0, 200)}`;
}

type Member = { person_id: string; people: { first_name: string; email: string; linkedin_url: string | null } | null };

// Drafts one confirmation per member into the Outbox (never sends), assigning a voucher if one is free.
async function draftConfirmations(supabase: SupabaseClient, matchId: string) {
  const { data: m } = await supabase.from('matches')
    .select('id, kind, shared_tags, other_name, match_members(person_id, people(first_name, email, linkedin_url))').eq('id', matchId).single();
  if (!m) return;
  const members = (m.match_members ?? []) as unknown as Member[];
  for (const me of members) {
    if (!me.people) continue;
    const { data: v } = await supabase.from('vouchers').select('id, code').is('person_id', null).eq('redeemed', false).limit(1).maybeSingle();
    if (v) await supabase.from('vouchers').update({ person_id: me.person_id, match_id: m.id }).eq('id', v.id);
    const others = members.filter((o) => o.person_id !== me.person_id && o.people)
      .map((o) => `${o.people!.first_name} (${o.people!.email})${o.people!.linkedin_url ? ` — ${o.people!.linkedin_url}` : ''}`);
    const voucherLine = v ? `Your coffee is on us — voucher code: ${v.code}` : 'Your coffee voucher is on its way.';
    let intro: string;
    if (m.kind === 'with_someone') {
      intro = others.length
        ? `You said you're having coffee with ${others.join(' and ')}. You both said so, so it's official.`
        : `You said you're having coffee with ${m.other_name ?? 'someone you met'}. Love that.`;
    } else {
      intro = `Meet ${others.join(' and ')}, who's also into ${(m.shared_tags ?? []).join(' and ') || 'the same things you are'}.`;
    }
    await supabase.from('outbox').insert({
      person_id: me.person_id, match_id: m.id, kind: 'confirmation', to_email: me.people.email,
      subject: m.kind === 'with_someone' ? 'Your coffee from the Nov 6 pop-up ☕' : `Meet your coffee match ☕`,
      body: `Hi ${me.people.first_name},\n\n${intro}\n\nSuggested first step: pick a time in the next two weeks.\n\n${voucherLine}\n\nSo glad you came Friday.\n\n— Nik`,
    });
  }
}

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

      case 'phase2-list': {
        const [matches, outbox, vouchers, checkins] = await Promise.all([
          supabase.from('matches').select('*, match_members(id, person_id, commitment_id, people(first_name, email, stage, is_mentor, mentor_status))').order('created_at', { ascending: false }),
          supabase.from('outbox').select('*, people(first_name)').neq('status', 'discarded').order('created_at', { ascending: false }),
          supabase.from('vouchers').select('*, people(first_name)').order('created_at', { ascending: false }),
          supabase.from('checkins').select('*, people(first_name, email)').order('created_at', { ascending: false }),
        ]);
        const followups = (checkins.data ?? []).filter((c) => needsPersonalFollowUp(c));
        return json({ matches: matches.data ?? [], outbox: outbox.data ?? [], vouchers: vouchers.data ?? [], checkins: checkins.data ?? [], followups });
      }

      case 'propose-matches': {
        // Clear previous unapproved proposals, then re-run.
        const { data: oldProps } = await supabase.from('matches').select('id').eq('status', 'proposed');
        const oldIds = (oldProps ?? []).map((m) => m.id);
        if (oldIds.length) {
          await supabase.from('match_members').delete().in('match_id', oldIds);
          await supabase.from('matches').delete().in('id', oldIds);
        }
        const { data: taken } = await supabase.from('match_members').select('commitment_id, matches!inner(status)').eq('matches.status', 'approved');
        const takenCount = new Map<string, number>();
        for (const t of taken ?? []) if (t.commitment_id) takenCount.set(t.commitment_id, (takenCount.get(t.commitment_id) ?? 0) + 1);

        const { data: rows } = await supabase.from('commitments')
          .select('id, person_id, type, tags, coffee_count, people(stage, mentor_status)').in('type', ['match_me', 'mentor_offer']);
        const seekers: Seeker[] = [];
        const mentors: MentorOffer[] = [];
        for (const r of rows ?? []) {
          const p = r.people as unknown as { stage: string | null; mentor_status: string } | null;
          if (r.type === 'match_me' && !takenCount.has(r.id)) seekers.push({ commitment_id: r.id, person_id: r.person_id, stage: p?.stage ?? null, tags: r.tags });
          if (r.type === 'mentor_offer' && p?.mentor_status === 'approved') {
            const capacity = (r.coffee_count ?? 1) - (takenCount.get(r.id) ?? 0);
            if (capacity > 0) mentors.push({ commitment_id: r.id, person_id: r.person_id, tags: r.tags, capacity });
          }
        }
        const { proposals, unmatched } = proposeMatches(seekers, mentors);
        for (const p of proposals) {
          const { data: m, error } = await supabase.from('matches').insert({ status: 'proposed', kind: 'match', shared_tags: p.shared_tags, reason: p.reason }).select('id').single();
          if (error) throw error;
          await supabase.from('match_members').insert(p.members.map((mm) => ({ ...mm, match_id: m.id })));
        }
        return json({ ok: true, proposed: proposals.length, unmatched: unmatched.length });
      }

      case 'remove-member': {
        await supabase.from('match_members').delete().eq('id', String(body.member_id));
        return json({ ok: true });
      }
      case 'move-member': {
        await supabase.from('match_members').update({ match_id: String(body.match_id) }).eq('id', String(body.member_id));
        return json({ ok: true });
      }
      case 'discard-match': {
        await supabase.from('match_members').delete().eq('match_id', String(body.id));
        await supabase.from('matches').delete().eq('id', String(body.id)).eq('status', 'proposed');
        return json({ ok: true });
      }

      case 'approve-match': {
        const { data: m } = await supabase.from('matches').select('*, match_members(person_id)').eq('id', String(body.id)).single();
        if (!m || m.status !== 'proposed') return json({ error: 'Not a proposal.' }, 400);
        if ((m.match_members ?? []).length < 2) return json({ error: 'A match needs at least two people.' }, 400);
        await supabase.from('matches').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', m.id);
        await draftConfirmations(supabase, m.id);
        return json({ ok: true });
      }

      case 'draft-with-someone': {
        const { data: rows } = await supabase.from('commitments').select('id, person_id, other_name, linked_commitment_id').eq('type', 'with_someone');
        const { data: taken } = await supabase.from('match_members').select('commitment_id');
        const used = new Set((taken ?? []).map((t) => t.commitment_id));
        let created = 0;
        for (const c of rows ?? []) {
          if (used.has(c.id)) continue;
          const partner = c.linked_commitment_id ? (rows ?? []).find((r) => r.id === c.linked_commitment_id) : null;
          const { data: m, error } = await supabase.from('matches').insert({
            status: 'approved', kind: 'with_someone', approved_at: new Date().toISOString(),
            other_name: partner ? null : c.other_name,
          }).select('id').single();
          if (error) throw error;
          const members = [{ match_id: m.id, person_id: c.person_id, commitment_id: c.id }];
          used.add(c.id);
          if (partner && !used.has(partner.id)) { members.push({ match_id: m.id, person_id: partner.person_id, commitment_id: partner.id }); used.add(partner.id); }
          await supabase.from('match_members').insert(members);
          await draftConfirmations(supabase, m.id);
          created++;
        }
        return json({ ok: true, created });
      }

      case 'add-vouchers': {
        const codes = String(body.codes ?? '').split(/[\s,]+/).map((c) => c.trim().slice(0, 60)).filter(Boolean);
        if (!codes.length) return json({ error: 'Paste at least one code.' }, 400);
        const { data: existing } = await supabase.from('vouchers').select('code').in('code', codes);
        const have = new Set((existing ?? []).map((e) => e.code));
        const fresh = [...new Set(codes)].filter((c) => !have.has(c));
        if (fresh.length) await supabase.from('vouchers').insert(fresh.map((code) => ({ code })));
        return json({ ok: true, added: fresh.length });
      }
      case 'toggle-voucher': {
        const { data: v } = await supabase.from('vouchers').select('redeemed').eq('id', String(body.id)).single();
        await supabase.from('vouchers').update({ redeemed: !v?.redeemed }).eq('id', String(body.id));
        return json({ ok: true });
      }

      case 'update-outbox': {
        const subject = String(body.subject ?? '').slice(0, 200);
        const text = String(body.body ?? '').slice(0, 10000);
        if (!subject || !text) return json({ error: 'Subject and message are required.' }, 400);
        await supabase.from('outbox').update({ subject, body: text }).eq('id', String(body.id)).in('status', ['draft', 'approved', 'failed']);
        return json({ ok: true });
      }
      case 'set-outbox-status': {
        const status = String(body.status);
        if (!['draft', 'approved', 'discarded'].includes(status)) return json({ error: 'Bad status' }, 400);
        const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
        await supabase.from('outbox').update({ status }).in('id', ids).neq('status', 'sent');
        return json({ ok: true });
      }
      case 'send-outbox': {
        // Only sends rows Nik has approved.
        const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
        const { data: rows } = await supabase.from('outbox').select('*').in('id', ids).eq('status', 'approved');
        let sent = 0, failed = 0;
        for (const r of rows ?? []) {
          const err = await sendEmail(r.to_email, r.subject, toHtml(r.body));
          if (err) { failed++; await supabase.from('outbox').update({ status: 'failed', error: err }).eq('id', r.id); continue; }
          sent++;
          const now = new Date().toISOString();
          await supabase.from('outbox').update({ status: 'sent', sent_at: now, error: null }).eq('id', r.id);
          if (r.checkin_id) await supabase.from('checkins').update({ sent_at: now }).eq('id', r.checkin_id);
        }
        return json({ ok: true, sent, failed });
      }

      case 'draft-checkins': {
        const { data: confs } = await supabase.from('outbox').select('person_id, match_id, sent_at').eq('kind', 'confirmation').eq('status', 'sent');
        const { data: existing } = await supabase.from('checkins').select('person_id, match_id').eq('stage', '2wk');
        const done = new Set((existing ?? []).map((c) => `${c.person_id}:${c.match_id}`));
        let created = 0;
        for (const c of confs ?? []) {
          if (!c.sent_at || !c.person_id || !c.match_id || !isDueForCheckin(c.sent_at) || done.has(`${c.person_id}:${c.match_id}`)) continue;
          done.add(`${c.person_id}:${c.match_id}`);
          const { data: person } = await supabase.from('people').select('first_name, email').eq('id', c.person_id).single();
          if (!person) continue;
          const token = crypto.randomUUID().replace(/-/g, '');
          const { data: ck, error } = await supabase.from('checkins').insert({ person_id: c.person_id, match_id: c.match_id, stage: '2wk', token }).select('id').single();
          if (error) throw error;
          const link = (r: string) => `${SITE_URL}/checkin/${token}?r=${r}`;
          await supabase.from('outbox').insert({
            person_id: c.person_id, match_id: c.match_id, checkin_id: ck.id, kind: 'checkin_2wk', to_email: person.email,
            subject: 'Did your coffee happen? ☕',
            body: `Hi ${person.first_name},\n\nIt's been two weeks since the Nov 6 pop-up. Quick check — did your coffee happen?\n\nWe met ☕: ${link('met')}\nNot yet: ${link('not_yet')}\nIt didn't work out: ${link('didnt_work')}\n\nOne click is plenty. If you want to tell me what helped, there's a spot for that too.\n\n— Nik`,
          });
          created++;
        }
        return json({ ok: true, created });
      }

      case 'handle-followup': {
        await supabase.from('checkins').update({ handled_at: new Date().toISOString() }).eq('id', String(body.id));
        return json({ ok: true });
      }
      case 'draft-personal': {
        const { data: ck } = await supabase.from('checkins').select('id, person_id, match_id, people(email)').eq('id', String(body.checkin_id)).single();
        const email = (ck?.people as unknown as { email: string } | null)?.email;
        if (!ck || !email) return json({ error: 'Not found.' }, 404);
        const subject = String(body.subject ?? '').slice(0, 200);
        const text = String(body.body ?? '').slice(0, 10000);
        if (!subject || !text) return json({ error: 'Write a subject and a note.' }, 400);
        await supabase.from('outbox').insert({ person_id: ck.person_id, match_id: ck.match_id, kind: 'personal', to_email: email, subject, body: text });
        await supabase.from('checkins').update({ handled_at: new Date().toISOString() }).eq('id', ck.id);
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
