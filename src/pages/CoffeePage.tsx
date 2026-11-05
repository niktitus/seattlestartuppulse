import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TAG_GROUPS, STAGES, getIdentity, saveIdentity, getMyFairTags } from '@/lib/coffee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type CommitType = 'with_someone' | 'match_me' | 'mentor_offer';

export default function CoffeePage() {
  const [params] = useSearchParams();
  const prefillName = params.get('with') ?? '';
  const existing = getIdentity();

  const [form, setForm] = useState({
    first_name: existing?.first_name ?? '',
    email: existing?.email ?? '',
    linkedin_url: existing?.linkedin_url ?? '',
    other_name: prefillName,
    other_email: '',
    neighborhood: '',
  });
  const [stage, setStage] = useState(existing?.stage ?? '');
  const [type, setType] = useState<CommitType | null>(prefillName ? 'with_someone' : null);
  const [tags, setTags] = useState<string[]>(getMyFairTags());
  const [coffeeCount, setCoffeeCount] = useState(1);
  const [availability] = useState<string[]>([]);
  const [badgeOptIn] = useState(existing?.show_badge_card ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 2 ? [...prev, tag] : prev));

  const reset = () => {
    setDone(false);
    setType(null);
    setForm({ ...form, other_name: '', other_email: '', neighborhood: '' });
    setTags([]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!type) return setError('Pick what kind of coffee.');
    if (!stage) return setError('Pick your stage.');
    if (type === 'with_someone' && !form.other_name.trim()) return setError("Enter their name.");
    if (type === 'match_me' && tags.length === 0) return setError('Pick at least one topic.');
    if (type === 'mentor_offer' && tags.length === 0) return setError('Pick at least one topic.');
    setSubmitting(true);
    saveIdentity({ first_name: form.first_name, email: form.email, stage, linkedin_url: form.linkedin_url || undefined, show_badge_card: badgeOptIn });
    const { data, error: err } = await supabase.functions.invoke('coffee-submit', {
      body: {
        action: 'commitment', type, ...form, stage, tags, availability,
        coffee_count: type === 'mentor_offer' ? coffeeCount : undefined,
        show_badge_card: badgeOptIn, source: 'qr',
      },
    });
    setSubmitting(false);
    if (err || data?.error) return setError(data?.error || 'Something went wrong. Please try again.');
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-5xl">☕</div>
          <h1 className="text-2xl font-semibold">You're committed ☕</h1>
          <p className="text-muted-foreground">We'll email you by Saturday with your coffee details and a voucher.</p>
          <Button onClick={reset} variant="outline">Make another commitment</Button>
          <div>
            <a href="/" className="text-sm text-primary underline underline-offset-4">Back to the event calendar →</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 pt-6 pb-4 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">Coffee Commitment</p>
          <h1 className="text-2xl font-semibold">Leave with a coffee on the calendar</h1>
          <p className="text-sm text-muted-foreground">30 seconds, no login. We do the connecting.</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-semibold">1. What kind of coffee?</h2>
            <div className="space-y-2">
              {([
                { id: 'with_someone', icon: '🤝', label: 'I met someone today', hint: "We'll nudge you both to book it" },
                { id: 'match_me', icon: '✨', label: 'Match me with someone', hint: 'Pick a topic, we find your person' },
                { id: 'mentor_offer', icon: '🎓', label: "I'm a mentor", hint: 'Offer 1–3 coffees to mentees' },
              ] as { id: CommitType; icon: string; label: string; hint: string }[]).map((opt) => (
                <button type="button" key={opt.id} onClick={() => setType(opt.id)} aria-pressed={type === opt.id}
                  className={cn('w-full flex items-center gap-3 text-left px-4 py-4 min-h-[64px] rounded-xl border transition-colors active:scale-[0.99]',
                    type === opt.id ? 'border-primary bg-accent ring-1 ring-primary' : 'border-border hover:border-primary/50')}>
                  <span className="text-2xl" aria-hidden>{opt.icon}</span>
                  <span className="flex-1">
                    <span className="block text-base font-medium">{opt.label}</span>
                    <span className="block text-sm text-muted-foreground">{opt.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {type === 'with_someone' && (
            <section className="space-y-3">
              <h2 className="text-base font-semibold">2. Who with?</h2>
              <Input id="other_name" aria-label="Their name" placeholder="Their name *" required value={form.other_name} onChange={set('other_name')} className="h-12 text-base" />
              <Input id="other_email" aria-label="Their email" type="email" placeholder="Their email (optional)" value={form.other_email} onChange={set('other_email')} className="h-12 text-base" />
            </section>
          )}

          {(type === 'match_me' || type === 'mentor_offer') && (
            <section className="space-y-3">
              <h2 className="text-base font-semibold">2. Pick up to 2 topics</h2>
              {TAG_GROUPS.map((group) => (
                <div key={group.theme}>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">{group.theme}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <button type="button" key={tag} onClick={() => toggleTag(tag)} aria-pressed={tags.includes(tag)}
                        className={cn('px-3.5 py-2 text-sm rounded-full border transition-colors',
                          tags.includes(tag) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50')}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {type === 'mentor_offer' && (
                <div className="space-y-1.5 pt-1">
                  <Label>How many coffees?</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((n) => (
                      <button type="button" key={n} onClick={() => setCoffeeCount(n)} aria-pressed={coffeeCount === n}
                        className={cn('h-11 w-14 rounded-lg border text-base', coffeeCount === n ? 'bg-primary text-primary-foreground border-primary' : 'border-border')}>{n}</button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {type && (
            <section className="space-y-3">
              <h2 className="text-base font-semibold">3. About you</h2>
              <Input id="first_name" aria-label="First name" placeholder="First name *" required value={form.first_name} onChange={set('first_name')} autoComplete="given-name" className="h-12 text-base" />
              <Input id="email" aria-label="Email" type="email" inputMode="email" placeholder="Email *" required value={form.email} onChange={set('email')} autoComplete="email" className="h-12 text-base" />
              <select id="stage" aria-label="Your stage" required value={stage} onChange={(e) => setStage(e.target.value)}
                className="w-full h-12 rounded-md border border-input bg-background px-3 text-base">
                <option value="">Your stage *</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

            </section>
          )}

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          {type && (
            <div className="sticky bottom-0 -mx-4 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-background/95 backdrop-blur border-t border-border">
              <Button type="submit" disabled={submitting} className="w-full h-12 text-base">
                {submitting ? 'Committing…' : 'Commit to coffee ☕'}
              </Button>
            </div>
          )}
        </form>

        <div className="rounded-lg border border-border bg-card p-4 space-y-1">
          <p className="text-base font-semibold">Looking for someone to have coffee with?</p>
          <p className="text-sm text-muted-foreground">Browse Seattle's entrepreneurial community — the groups that exist, where they meet, and who each one is for.</p>
          <a href="/groups" className="inline-block text-sm font-medium text-primary underline underline-offset-4">Browse Communities →</a>
        </div>

        <div className="pt-2 pb-2 text-center">
          <a href="/" className="text-sm text-primary underline underline-offset-4">Back to the event calendar →</a>
        </div>
      </div>
    </div>
  );
}
