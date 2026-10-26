import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TAG_GROUPS } from '@/lib/coffee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const PLEDGES = [
  { key: 'pledge_no_unpaid', label: "I'm not recruiting for unpaid work." },
  { key: 'pledge_no_discovery', label: "I won't use this for customer discovery." },
  { key: 'pledge_mentee_first', label: "I'll keep the mentee's goals first." },
] as const;

export default function CoffeeMentorPage() {
  const [form, setForm] = useState({ first_name: '', email: '', linkedin_url: '', role: '', company: '', voucher_name: '', voucher_contact: '' });
  const [offerTags, setOfferTags] = useState<string[]>([]);
  const [pledges, setPledges] = useState<Record<string, boolean>>({});
  const [partnerShare, setPartnerShare] = useState(false);
  const [badgeOptIn, setBadgeOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const toggleTag = (tag: string) =>
    setOfferTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (offerTags.length === 0) return setError('Pick at least one thing you can offer.');
    if (PLEDGES.some((p) => !pledges[p.key])) return setError('All three pledges are required.');
    setSubmitting(true);
    const { data, error: err } = await supabase.functions.invoke('coffee-submit', {
      body: { action: 'mentor', ...form, offer_tags: offerTags, ...pledges, opt_in_partner_share: partnerShare, show_badge_card: badgeOptIn },
    });
    setSubmitting(false);
    if (err || data?.error) return setError(data?.error || 'Something went wrong. Please try again.');
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">☕</div>
          <h1 className="text-2xl font-semibold">Application received</h1>
          <p className="text-muted-foreground">We've emailed your voucher for a one-click confirmation. Once they vouch and we approve you, you'll get a Mentor badge and can offer mentor coffees.</p>
          <Link to="/fair" className="text-primary font-medium hover:underline">Browse the Silent Community Fair →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">Nov 6 pop-up · AI House</p>
          <h1 className="text-2xl font-semibold">Become a mentor</h1>
          <p className="text-sm text-muted-foreground">Offer 1–3 coffees to women navigating work and AI. Vetted, low-commitment, high-signal.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First name *</Label>
              <Input id="first_name" required value={form.first_name} onChange={set('first_name')} autoComplete="given-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input id="linkedin_url" type="url" placeholder="https://linkedin.com/in/…" value={form.linkedin_url} onChange={set('linkedin_url')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="role">Role *</Label>
              <Input id="role" required value={form.role} onChange={set('role')} placeholder="Engineering Manager" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company} onChange={set('company')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>What you can offer — pick up to 3 *</Label>
            {TAG_GROUPS.map((group) => (
              <div key={group.theme}>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">{group.theme}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.tags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      aria-pressed={offerTags.includes(tag)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-full border transition-colors',
                        offerTags.includes(tag) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Who can vouch for you? *</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="voucher_name">Their name</Label>
                <Input id="voucher_name" required value={form.voucher_name} onChange={set('voucher_name')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="voucher_contact">Their email or LinkedIn</Label>
                <Input id="voucher_contact" required value={form.voucher_contact} onChange={set('voucher_contact')} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">We'll send them a one-click "Yes, I vouch for them" link.</p>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            {PLEDGES.map((p) => (
              <label key={p.key} className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={!!pledges[p.key]} onCheckedChange={(v) => setPledges({ ...pledges, [p.key]: v === true })} className="mt-0.5" />
                <span className="text-sm">{p.label}</span>
              </label>
            ))}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={partnerShare} onCheckedChange={(v) => setPartnerShare(v === true)} className="mt-0.5" />
            <span className="text-sm">OK to share my application with partner reviewers (UW Buerk Center).</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={badgeOptIn} onCheckedChange={(v) => setBadgeOptIn(v === true)} className="mt-0.5" />
            <span className="text-sm">Show my first name, stage, tags and LinkedIn on my badge card.</span>
          </label>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full h-12 text-base">
            {submitting ? 'Sending…' : 'Apply to mentor'}
          </Button>
        </form>
      </div>
    </div>
  );
}
