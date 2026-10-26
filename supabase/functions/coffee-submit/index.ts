import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = 'https://seattlestartuppulse.com';
const FROM = 'Seattle Startup Pulse <onboarding@resend.dev>';

const TAGS = new Set([
  'Mentorship','Funding for women founders','Peer community','Returning to work','Career switching',
  'Negotiation & pay','Leadership','Parents & families','Safety & belonging','Students & early career',
  'AI upskilling','Building with AI','AI careers','Job search','Pitching & storytelling',
  'Writing & editing','Systems thinking','Creativity & design','Founding a company',
]);
const STAGES = new Set(['Student','Early career','Mid-career','Career switcher','Returning to work','Founder','Leader']);

const clean = (v: unknown, max = 500): string => typeof v === 'string' ? v.trim().slice(0, max) : '';
const cleanTags = (v: unknown, max = 3): string[] =>
  Array.isArray(v) ? v.filter((t) => typeof t === 'string' && TAGS.has(t)).slice(0, max) : [];
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 255;
const isUrl = (v: string) => /^https?:\/\/\S+$/i.test(v) && v.length <= 2000;
const shortId = () => crypto.randomUUID().replace(/-/g, '').slice(0, 8);
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'org';

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) { console.error('RESEND_API_KEY not configured'); return; }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) console.error('Resend error:', res.status, await res.text());
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`coffee-submit:${ip}`, 30, 10 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Find-or-create a person by email; returns id. Updates badge fields when provided.
    async function upsertPerson(p: { first_name: string; email: string; stage?: string; linkedin_url?: string; show_badge_card?: boolean; badge_tags?: string[] }) {
      const { data: existing } = await supabase.from('people').select('id, short_id').eq('email', p.email).maybeSingle();
      const patch: Record<string, unknown> = { first_name: p.first_name };
      if (p.stage && STAGES.has(p.stage)) patch.stage = p.stage;
      if (p.linkedin_url && isUrl(p.linkedin_url)) patch.linkedin_url = p.linkedin_url;
      if (typeof p.show_badge_card === 'boolean') patch.show_badge_card = p.show_badge_card;
      if (p.badge_tags?.length) patch.badge_tags = p.badge_tags;
      if (existing) {
        await supabase.from('people').update(patch).eq('id', existing.id);
        return existing.id as string;
      }
      const { data, error } = await supabase.from('people').insert({ ...patch, email: p.email, short_id: shortId() }).select('id').single();
      if (error) throw error;
      return data.id as string;
    }

    switch (body.action) {
      case 'mentor': {
        const first_name = clean(body.first_name, 100);
        const email = clean(body.email, 255).toLowerCase();
        const role = clean(body.role, 150);
        const company = clean(body.company, 150);
        const voucher_name = clean(body.voucher_name, 150);
        const voucher_contact = clean(body.voucher_contact, 255);
        const offer_tags = cleanTags(body.offer_tags, 3);
        const linkedin_url = clean(body.linkedin_url, 2000);
        if (!first_name || !isEmail(email) || !role || !voucher_name || !voucher_contact || offer_tags.length === 0)
          return json({ error: 'Please complete all required fields.' }, 400);
        if (body.pledge_no_unpaid !== true || body.pledge_no_discovery !== true || body.pledge_mentee_first !== true)
          return json({ error: 'All three pledges are required.' }, 400);

        const personId = await upsertPerson({
          first_name, email, linkedin_url,
          show_badge_card: body.show_badge_card === true,
          badge_tags: offer_tags,
        });
        await supabase.from('people').update({
          is_mentor: true, mentor_status: 'applied', role, company, offer_tags,
          opt_in_partner_share: body.opt_in_partner_share === true,
        }).eq('id', personId);

        const token = crypto.randomUUID();
        await supabase.from('vouches').insert({ mentor_id: personId, voucher_name, voucher_contact, token });

        if (isEmail(voucher_contact)) {
          const link = `${SITE_URL}/vouch/${token}`;
          await sendEmail(voucher_contact,
            `Can you vouch for ${first_name}?`,
            `<p>Hi ${esc(voucher_name)},</p><p>${esc(first_name)} applied to mentor at the Nov 6 women's pop-up at AI House in Seattle and named you as someone who can vouch for them.</p><p><a href="${link}">Yes, I vouch for them</a></p><p>If you don't know ${esc(first_name)}, just ignore this email.</p>`);
        }
        await sendEmail(email, 'We got your mentor application ☕',
          `<p>Hi ${esc(first_name)},</p><p>Thanks for offering to mentor at the Nov 6 pop-up at AI House. We've emailed ${esc(voucher_name)} to vouch for you, and we'll be in touch once you're approved.</p><p>— Seattle Startup Pulse</p>`);
        return json({ ok: true });
      }

      case 'org': {
        const name = clean(body.name, 200);
        const who_they_help = clean(body.who_they_help, 140);
        const action_today = clean(body.action_today, 100);
        const url = clean(body.url, 2000);
        const tags = cleanTags(body.tags, 3);
        const themes = Array.isArray(body.themes)
          ? body.themes.filter((t: unknown) => t === 'Women supporting women' || t === 'Work + AI') : [];
        if (!name || !who_they_help || !action_today || !isUrl(url) || tags.length === 0 || themes.length === 0)
          return json({ error: 'Please complete all required fields.' }, 400);
        if (body.agreement !== true) return json({ error: 'The good-faith agreement is required.' }, 400);

        let slug = slugify(name);
        const { data: clash } = await supabase.from('organizations').select('id').eq('slug', slug).maybeSingle();
        if (clash) slug = `${slug}-${shortId().slice(0, 4)}`;

        const office_hours = clean(body.office_hours, 50) || null;
        const { error } = await supabase.from('organizations').insert({
          name, who_they_help, action_today, url, tags, themes, slug,
          logo_url: isUrl(clean(body.logo_url)) ? clean(body.logo_url) : null,
          contact_name: clean(body.contact_name, 150) || null,
          contact_role: clean(body.contact_role, 150) || null,
          contact_info: clean(body.contact_info, 255) || null,
          contact_public: body.contact_public === true,
          office_hours,
        });
        if (error) throw error;
        return json({ ok: true });
      }

      case 'interest': {
        const first_name = clean(body.first_name, 100);
        const email = clean(body.email, 255).toLowerCase();
        const organization_id = clean(body.organization_id, 40);
        if (!first_name || !isEmail(email) || !organization_id) return json({ error: 'Missing details.' }, 400);
        const personId = await upsertPerson({
          first_name, email, stage: clean(body.stage, 50),
          linkedin_url: clean(body.linkedin_url, 2000),
          show_badge_card: body.show_badge_card === true,
        });
        await supabase.from('interests').upsert({ person_id: personId, organization_id }, { onConflict: 'person_id,organization_id' });
        return json({ ok: true, person_id: personId });
      }

      case 'email-list': {
        const email = clean(body.email, 255).toLowerCase();
        if (!isEmail(email)) return json({ error: 'Enter a valid email.' }, 400);
        const { data: person } = await supabase.from('people').select('id, first_name').eq('email', email).maybeSingle();
        if (!person) return json({ error: 'No list found for that email yet.' }, 404);
        const { data: rows } = await supabase.from('interests').select('organizations(name, url, action_today)').eq('person_id', person.id);
        const orgs = (rows ?? []).map((r: Record<string, unknown>) => r.organizations as { name: string; url: string; action_today: string }).filter(Boolean);
        if (orgs.length === 0) return json({ error: 'No list found for that email yet.' }, 404);
        const items = orgs.map((o) => `<li><strong>${esc(o.name)}</strong> — ${esc(o.action_today)}<br><a href="${esc(o.url)}">${esc(o.url)}</a></li>`).join('');
        await sendEmail(email, 'Your Silent Community Fair list ☕',
          `<p>Hi ${esc(person.first_name)},</p><p>Here's everything you tapped at the fair:</p><ul>${items}</ul><p>— Seattle Startup Pulse</p>`);
        return json({ ok: true });
      }

      case 'commitment': {
        const first_name = clean(body.first_name, 100);
        const email = clean(body.email, 255).toLowerCase();
        const type = clean(body.type, 30);
        if (!first_name || !isEmail(email)) return json({ error: 'Name and email are required.' }, 400);
        if (!['with_someone', 'match_me', 'mentor_offer'].includes(type)) return json({ error: 'Pick a commitment type.' }, 400);

        const tags = cleanTags(body.tags, 2);
        const personId = await upsertPerson({
          first_name, email, stage: clean(body.stage, 50),
          linkedin_url: clean(body.linkedin_url, 2000),
          show_badge_card: body.show_badge_card === true,
          badge_tags: tags,
        });

        if (type === 'mentor_offer') {
          const { data: person } = await supabase.from('people').select('mentor_status').eq('id', personId).single();
          if (person?.mentor_status !== 'approved')
            return json({ error: 'Mentor coffees open once your mentor application is approved.' }, 403);
        }
        if (type === 'match_me' && tags.length === 0) return json({ error: 'Pick at least one tag.' }, 400);

        const availability = Array.isArray(body.availability)
          ? body.availability.filter((a: unknown) => ['weekday mornings', 'lunch', 'after work', 'weekends'].includes(a as string)) : [];
        const coffee_count = type === 'mentor_offer' ? Math.min(3, Math.max(1, Number(body.coffee_count) || 1)) : null;

        const { data: commitment, error } = await supabase.from('commitments').insert({
          person_id: personId, type,
          other_name: clean(body.other_name, 150) || null,
          other_email: isEmail(clean(body.other_email)) ? clean(body.other_email).toLowerCase() : null,
          tags, coffee_count,
          availability: availability.length ? availability : null,
          neighborhood: clean(body.neighborhood, 100) || null,
          source: body.source === 'paper' ? 'paper' : 'qr',
        }).select('id').single();
        if (error) throw error;

        // Auto-link when both people submit "having coffee with" each other.
        if (type === 'with_someone') {
          const otherEmail = isEmail(clean(body.other_email)) ? clean(body.other_email).toLowerCase() : null;
          if (otherEmail) {
            const { data: otherPerson } = await supabase.from('people').select('id').eq('email', otherEmail).maybeSingle();
            if (otherPerson) {
              const { data: reciprocal } = await supabase.from('commitments')
                .select('id').eq('person_id', otherPerson.id).eq('type', 'with_someone')
                .ilike('other_email', email).is('linked_commitment_id', null).maybeSingle();
              if (reciprocal) {
                await supabase.from('commitments').update({ linked_commitment_id: reciprocal.id }).eq('id', commitment.id);
                await supabase.from('commitments').update({ linked_commitment_id: commitment.id }).eq('id', reciprocal.id);
              }
            }
          }
        }

        await sendEmail(email, "You're committed ☕",
          `<p>Hi ${esc(first_name)},</p><p>You're committed ☕ We'll email you by Saturday with your coffee details and a voucher.</p><p>— Seattle Startup Pulse</p>`);
        return json({ ok: true });
      }

      case 'badge-opt-out': {
        const email = clean(body.email, 255).toLowerCase();
        if (!isEmail(email)) return json({ error: 'Enter a valid email.' }, 400);
        await supabase.from('people').update({ show_badge_card: false }).eq('email', email);
        return json({ ok: true });
      }

      default:
        return json({ error: 'Unknown action.' }, 400);
    }
  } catch (error) {
    console.error('coffee-submit error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
