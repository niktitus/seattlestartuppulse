import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TAG_GROUPS, STAGES, AVAILABILITY, getIdentity, saveIdentity, getMyFairTags } from '@/lib/coffee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [availability, setAvailability] = useState<string[]>([]);
  const [badgeOptIn, setBadgeOptIn] = useState(existing?.show_badge_card ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 2 ? [...prev, tag] : prev));
  const toggleAvail = (a: string) =>
    setAvailability((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const reset = () => {
    setDone(false);
    setType(null);
    setForm({ ...form, other_name: '', other_email: '', neighborhood: '' });
    setTags([]);
    setAvailability([]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!type) return setError('Pick one of the three options.');
    if (!stage) return setError('Pick your stage.');
    if (type === 'with_someone' && !form.other_name.trim()) return setError("Enter their name.");
    if (type === 'match_me' && tags.length === 0) return setError('Pick 1–2 tags.');
    if (type === 'mentor_offer' && tags.length === 0) return setError('Pick 1–2 tags.');
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">Coffee Commitment</p>
          <h1 className="text-2xl font-semibold">Leave with a coffee on the calendar</h1>
          <p className="text-sm text-muted-foreground">30 seconds, no login. We do the connecting.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">Your first name *</Label>
              <Input id="first_name" required value={form.first_name} onChange={set('first_name')} autoComplete="given-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Your email *</Label>
              <Input id="email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="stage">Your stage *</Label>
              <select id="stage" required value={stage} onChange={(e) => setStage(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Pick one…</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin_url">LinkedIn URL (optional)</Label>
              <Input id="linkedin_url" type="url" placeholder="https://linkedin.com/in/…" value={form.linkedin_url} onChange={set('linkedin_url')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Choose one *</Label>
            <div className="space-y-2">
              {([
                { id: 'with_someone', label: "I'm having coffee with someone I met" },
                { id: 'match_me', label: 'Match me with someone into ___' },
                { id: 'mentor_offer', label: "I'll take a coffee with a mentee into ___ (approved mentors)" },
              ] as { id: CommitType; label: string }[]).map((opt) => (
                <button type="button" key={opt.id} onClick={() => setType(opt.id)} aria-pressed={type === opt.id}
                  className={cn('w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors',
                    type === opt.id ? 'border-primary bg-accent font-medium' : 'border-border hover:border-primary/50')}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {type === 'with_someone' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border p-4">
              <div className="space-y-1.5">
                <Label htmlFor="other_name">Their name *</Label>
                <Input id="other_name" required value={form.other_name} onChange={set('other_name')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="other_email">Their email (if you have it)</Label>
                <Input id="other_email" type="email" value={form.other_email} onChange={set('other_email')} />
              </div>
              <p className="text-xs text-muted-foreground sm:col-span-2">If they submit too, we'll link your commitments automatically.</p>
            </div>
          )}

          {(type === 'match_me' || type === 'mentor_offer') && (
            <div className="space-y-2 rounded-lg border border-border p-4">
              <Label>Pick 1–2 tags *</Label>
              {TAG_GROUPS.map((group) => (
                <div key={group.theme}>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">{group.theme}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tags.map((tag) => (
                      <button type="button" key={tag} onClick={() => toggleTag(tag)} aria-pressed={tags.includes(tag)}
                        className={cn('px-3 py-1.5 text-xs rounded-full border transition-colors',
                          tags.includes(tag) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50')}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {type === 'mentor_offer' && (
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="coffee_count">How many coffees? (1–3)</Label>
                  <Input id="coffee_count" type="number" min={1} max={3} value={coffeeCount} onChange={(e) => setCoffeeCount(Number(e.target.value))} className="w-24" />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>When works for you? (optional)</Label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABILITY.map((a) => (
                <button type="button" key={a} onClick={() => toggleAvail(a)} aria-pressed={availability.includes(a)}
                  className={cn('px-3 py-1.5 text-xs rounded-full border transition-colors',
                    availability.includes(a) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50')}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="neighborhood">Preferred neighborhood (optional)</Label>
            <Input id="neighborhood" placeholder="e.g. Capitol Hill" value={form.neighborhood} onChange={set('neighborhood')} />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={badgeOptIn} onCheckedChange={(v) => setBadgeOptIn(v === true)} className="mt-0.5" />
            <span className="text-sm">Show my first name, stage, tags and LinkedIn on my badge card.</span>
          </label>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full h-12 text-base">
            {submitting ? 'Committing…' : 'Commit to coffee ☕'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Prefer paper? Grab a card at the door — or <Link to="/coffee/paper" className="text-primary hover:underline">print one</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
