import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Role-based content emphasis (events, deadlines, news only)
const ROLE_PRIORITIES: Record<string, { sections: string[]; tagline: string }> = {
  'Founder': {
    sections: ['events', 'deadlines', 'news'],
    tagline: 'Curated for founders building in Seattle',
  },
  'Operator': {
    sections: ['events', 'deadlines', 'news'],
    tagline: 'Opportunities for startup operators',
  },
  'Investor': {
    sections: ['events', 'news', 'deadlines'],
    tagline: 'Deal flow & ecosystem signals',
  },
  'Service Provider': {
    sections: ['events', 'news', 'deadlines'],
    tagline: 'Connect with the startup community',
  },
  'Accelerator/Incubator': {
    sections: ['deadlines', 'events', 'news'],
    tagline: 'Programs & ecosystem updates',
  },
  'Ecosystem Builder': {
    sections: ['events', 'news', 'deadlines'],
    tagline: 'Building Seattle\'s startup community',
  },
  'Other': {
    sections: ['events', 'news', 'deadlines'],
    tagline: 'Your weekly Seattle startup briefing',
  },
};

function getWeekDateRange(): { start: string; end: string; label: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
    label: `${fmt(monday)} – ${fmt(sunday)}, ${monday.getFullYear()}`,
  };
}

function buildEmailHtml(
  role: string,
  weekLabel: string,
  events: any[],
  deadlines: any[],
  news: any[],
  learning: any[],
): string {
  const config = ROLE_PRIORITIES[role] || ROLE_PRIORITIES['Other'];

  const eventItems = events.slice(0, 5).map(e =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
      <strong>${e.title}</strong><br/>
      <span style="color:#666;font-size:13px;">${e.date} · ${e.time} · ${e.format}</span><br/>
      <span style="color:#888;font-size:13px;">${e.organizer}</span>
      ${e.url ? `<br/><a href="${e.url}" style="color:#2563eb;font-size:13px;">Details →</a>` : ''}
    </td></tr>`
  ).join('');

  const deadlineItems = deadlines.slice(0, 5).map(d =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
      <strong>${d.title}</strong>
      <span style="color:#dc2626;font-size:13px;font-weight:bold;float:right;">Due ${d.dueDate || 'soon'}</span><br/>
      <span style="color:#666;font-size:13px;">${d.type} · ${d.description?.slice(0, 100) || ''}</span>
    </td></tr>`
  ).join('');

  const newsItems = news.slice(0, 5).map(n =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
      <strong>${n.title}</strong><br/>
      <span style="color:#666;font-size:13px;">${n.source} · ${n.date}</span><br/>
      <span style="color:#888;font-size:13px;">${n.summary?.slice(0, 120) || ''}</span>
    </td></tr>`
  ).join('');

  const learningItems = learning.slice(0, 3).map(l =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
      <strong>${l.course_name}</strong><br/>
      <span style="color:#666;font-size:13px;">${l.skill_category} · ${l.format} · ${l.difficulty}</span><br/>
      <span style="color:#888;font-size:13px;">by ${l.instructor_name}</span>
      ${l.course_url ? `<br/><a href="${l.course_url}" style="color:#2563eb;font-size:13px;">Learn more →</a>` : ''}
    </td></tr>`
  ).join('');

  const sectionHtml: Record<string, string> = {
    events: eventItems ? `<h2 style="color:#1a1a1a;font-size:18px;margin:24px 0 12px;">📅 This Week's Events</h2><table width="100%" cellpadding="0" cellspacing="0">${eventItems}</table>` : '',
    deadlines: deadlineItems ? `<h2 style="color:#1a1a1a;font-size:18px;margin:24px 0 12px;">⏰ Upcoming Deadlines</h2><table width="100%" cellpadding="0" cellspacing="0">${deadlineItems}</table>` : '',
    news: newsItems ? `<h2 style="color:#1a1a1a;font-size:18px;margin:24px 0 12px;">📰 Ecosystem News</h2><table width="100%" cellpadding="0" cellspacing="0">${newsItems}</table>` : '',
  };

  const orderedContent = config.sections.map(s => sectionHtml[s] || '').filter(Boolean).join('');

  // If primary content is light (fewer than 3 sections with content), add learning recommendations
  const primarySectionCount = config.sections.filter(s => sectionHtml[s]).length;
  const learningFallback = (primarySectionCount < 2 && learningItems)
    ? `<h2 style="color:#1a1a1a;font-size:18px;margin:24px 0 12px;">📚 Worth Your Time This Week</h2><table width="100%" cellpadding="0" cellspacing="0">${learningItems}</table>`
    : '';

  const allContent = orderedContent + learningFallback;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Calibri,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#1a1a1a;font-size:22px;margin:0;">Seattle Startup Pulse</h1>
      <p style="color:#888;font-size:14px;margin:4px 0 0;">${config.tagline}</p>
      <p style="color:#666;font-size:13px;margin:8px 0 0;">Week of ${weekLabel}</p>
    </div>
    <hr style="border:none;border-top:2px solid #dc2626;margin:16px 0 24px;"/>
    ${allContent}
    ${!allContent ? '<p style="color:#666;text-align:center;">Nothing new this week — enjoy the quiet!</p>' : ''}
    <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;"/>
    <p style="color:#999;font-size:12px;text-align:center;">
      You're receiving this as a ${role} subscriber.<br/>
      <a href="https://seattlestartuppulse.lovable.app" style="color:#2563eb;">Visit Seattle Startup Pulse</a>
    </p>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('digest_subscribers')
      .select('email, role')
      .is('unsubscribed_at', null);

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No subscribers to send to', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch this week's content
    const week = getWeekDateRange();

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('is_approved', true)
      .gte('date', week.start)
      .lte('date', week.end)
      .order('date', { ascending: true })
      .limit(10);

    // Deadlines and news — update queries when tables exist

    // Fetch learning resources as fallback content
    const { data: learning } = await supabase
      .from('learning_resources')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(5);

    // Group subscribers by role for batch efficiency
    const byRole = new Map<string, string[]>();
    for (const sub of subscribers) {
      const list = byRole.get(sub.role) || [];
      list.push(sub.email);
      byRole.set(sub.role, list);
    }

    let totalSent = 0;
    const errors: string[] = [];

    for (const [role, emails] of byRole.entries()) {
      const html = buildEmailHtml(
        role,
        week.label,
        events || [],
        [], // deadlines — add when table exists
        [], // news — add when table exists
        learning || [],
      );

      // Send in batches of 50 (Resend limit)
      for (let i = 0; i < emails.length; i += 50) {
        const batch = emails.slice(i, i + 50);

        const res = await fetch('https://api.resend.com/emails/batch', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batch.map(email => ({
            from: 'Seattle Startup Pulse <onboarding@resend.dev>',
            to: email,
            subject: `Seattle Startup Pulse — ${week.label}`,
            html,
          }))),
        });

        if (res.ok) {
          totalSent += batch.length;
        } else {
          const errBody = await res.text();
          console.error(`Resend batch error for role ${role}:`, errBody);
          errors.push(`${role}: ${errBody}`);
        }
      }
    }

    console.log(`Digest sent to ${totalSent} subscribers`);

    return new Response(
      JSON.stringify({ success: true, sent: totalSent, errors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Send digest error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
