import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TAG_GROUPS } from '@/lib/coffee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const THEMES = ['Women supporting women', 'Work + AI'] as const;

export default function FairSubmitPage() {
  const [form, setForm] = useState({
    name: '', logo_url: '', who_they_help: '', action_today: '', url: '',
    contact_name: '', contact_role: '', contact_info: '', office_hours: '',
  });
  const [themes, setThemes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [contactPublic, setContactPublic] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const toggle = (list: string[], v: string, setter: (l: string[]) => void, max: number) =>
    setter(list.includes(v) ? list.filter((t) => t !== v) : list.length < max ? [...list, v] : list);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (themes.length === 0) return setError('Pick at least one theme.');
    if (tags.length === 0) return setError('Pick at least one tag.');
    if (!agreement) return setError('The good-faith agreement is required.');
    setSubmitting(true);
    const { data, error: err } = await supabase.functions.invoke('coffee-submit', {
      body: { action: 'org', ...form, themes, tags, contact_public: contactPublic, agreement },
    });
    setSubmitting(false);
    if (err || data?.error) return setError(data?.error || 'Something went wrong. Please try again.');
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">🪑</div>
          <h1 className="text-2xl font-semibold">Submitted for review</h1>
          <p className="text-muted-foreground">Once approved, your organization gets a card in the fair and a printable QR table tent.</p>
          <Link to="/fair" className="text-primary font-medium hover:underline">See the fair →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">Silent Community Fair · Nov 6 · AI House</p>
          <h1 className="text-2xl font-semibold">Share your organization's resources</h1>
          <p className="text-sm text-muted-foreground">No table staffing needed — your QR card does the talking.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Organization name *</Label>
            <Input id="name" required value={form.name} onChange={set('name')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logo_url">Logo URL (optional)</Label>
            <Input id="logo_url" type="url" placeholder="https://…" value={form.logo_url} onChange={set('logo_url')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="who_they_help">Who you help, in one sentence *</Label>
            <Input id="who_they_help" required maxLength={140} value={form.who_they_help} onChange={set('who_they_help')} />
            <p className="text-xs text-muted-foreground text-right">{form.who_they_help.length}/140</p>
          </div>

          <div className="space-y-2">
            <Label>Theme(s) *</Label>
            <div className="flex flex-wrap gap-1.5">
              {THEMES.map((t) => (
                <button type="button" key={t} onClick={() => toggle(themes, t, setThemes, 2)} aria-pressed={themes.includes(t)}
                  className={cn('px-3 py-1.5 text-xs rounded-full border transition-colors', themes.includes(t) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50')}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags — up to 3 *</Label>
            {TAG_GROUPS.map((group) => (
              <div key={group.theme}>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">{group.theme}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.tags.map((tag) => (
                    <button type="button" key={tag} onClick={() => toggle(tags, tag, setTags, 3)} aria-pressed={tags.includes(tag)}
                      className={cn('px-3 py-1.5 text-xs rounded-full border transition-colors', tags.includes(tag) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50')}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="action_today">One action people can take today *</Label>
            <Input id="action_today" required maxLength={100} value={form.action_today} onChange={set('action_today')} placeholder="Join our monthly mentorship circle" />
            <p className="text-xs text-muted-foreground text-right">{form.action_today.length}/100</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="url">Where to send people *</Label>
            <Input id="url" type="url" required placeholder="https://…" value={form.url} onChange={set('url')} />
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Who to reach out to</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact_name">Name</Label>
                <Input id="contact_name" value={form.contact_name} onChange={set('contact_name')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact_role">Role</Label>
                <Input id="contact_role" value={form.contact_role} onChange={set('contact_role')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_info">Email or LinkedIn</Label>
              <Input id="contact_info" value={form.contact_info} onChange={set('contact_info')} />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={contactPublic} onCheckedChange={(v) => setContactPublic(v === true)} className="mt-0.5" />
              <span className="text-sm">OK to show this contact publicly</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="office_hours">Rep office hours on Nov 6 (optional)</Label>
            <Input id="office_hours" placeholder="e.g. 4:45–5:15 PM" value={form.office_hours} onChange={set('office_hours')} />
            <p className="text-xs text-muted-foreground">A time between 4:35 and 5:30 PM.</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-border p-4">
            <Checkbox checked={agreement} onCheckedChange={(v) => setAgreement(v === true)} className="mt-0.5" />
            <span className="text-sm">Our resources are offered in good faith: no recruiting for unpaid work, no sales pitches to students, and no customer discovery. *</span>
          </label>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full h-12 text-base">
            {submitting ? 'Sending…' : 'Submit for review'}
          </Button>
        </form>
      </div>
    </div>
  );
}
