import { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { supabase } from '@/integrations/supabase/client';
import { TAG_GROUPS, STAGES } from '@/lib/coffee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Printer } from 'lucide-react';
import { Phase2Tabs } from '@/components/coffee/Phase2Tabs';

interface Mentor {
  id: string; first_name: string; email: string; role: string | null; company: string | null;
  mentor_status: string; offer_tags: string[] | null; linkedin_url: string | null; created_at: string;
  vouches: { voucher_name: string; voucher_contact: string; confirmed_at: string | null }[] | null;
}
interface Org {
  id: string; name: string; who_they_help: string; tags: string[]; status: string; slug: string;
  url: string; action_today: string; office_hours: string | null; created_at: string;
}
interface Commitment {
  id: string; type: string; other_name: string | null; other_email: string | null; tags: string[];
  coffee_count: number | null; availability: string[] | null; neighborhood: string | null;
  source: string; linked_commitment_id: string | null; created_at: string;
  people: { first_name: string; email: string; stage: string | null; is_mentor: boolean; mentor_status: string } | null;
}
interface Person {
  id: string; first_name: string; email: string; stage: string | null; is_mentor: boolean;
  mentor_status: string; short_id: string | null; show_badge_card: boolean; badge_tags: string[] | null;
}
interface Data {
  mentors: Mentor[]; orgs: Org[]; commitments: Commitment[]; people: Person[];
  counters: { commitments: number; matches: number; coffees: number };
}

type Tab = 'mentors' | 'fair' | 'commitments' | 'matches' | 'outbox' | 'checkins' | 'vouchers' | 'quick-entry' | 'print';
const TABS: { id: Tab; label: string }[] = [
  { id: 'mentors', label: 'Mentors' },
  { id: 'fair', label: 'Fair listings' },
  { id: 'commitments', label: 'Commitments' },
  { id: 'matches', label: 'Matches' },
  { id: 'outbox', label: 'Outbox' },
  { id: 'checkins', label: 'Check-ins' },
  { id: 'vouchers', label: 'Vouchers' },
  { id: 'quick-entry', label: 'Quick entry' },
  { id: 'print', label: 'Print' },
];

const STATUS_STYLE: Record<string, string> = {
  applied: 'border-border text-muted-foreground',
  vouched: 'border-primary text-primary',
  approved: 'bg-primary text-primary-foreground border-primary',
  declined: 'bg-muted text-muted-foreground border-border line-through',
  pending: 'border-border text-muted-foreground',
};

export default function CoffeeAdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('coffee-admin-token') ?? '');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<Tab>('mentors');
  const [loading, setLoading] = useState(false);

  const call = useCallback(async (body: Record<string, unknown>, tok = token) => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coffee-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: JSON.stringify(body),
    });
    return res.json();
  }, [token]);

  const load = useCallback(async (tok = token) => {
    setLoading(true);
    const d = await call({ action: 'list' }, tok);
    setLoading(false);
    if (d.error) return;
    setData(d as Data);
  }, [call, token]);

  useEffect(() => { if (token) void load(); }, [token, load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await supabase.functions.invoke('verify-admin', { body: { password } });
    if (error || !data?.success) return setAuthError('Incorrect password');
    sessionStorage.setItem('coffee-admin-token', data.token);
    setToken(data.token);
  };

  const act = async (body: Record<string, unknown>) => {
    await call(body);
    await load();
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={login} className="max-w-sm w-full space-y-4">
          <h1 className="text-2xl font-semibold text-center">Coffee admin</h1>
          <Input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {authError && <p className="text-sm text-destructive">{authError}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-xl font-semibold">Nov 6 pop-up admin</h1>
          {data && (
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span><strong className="text-foreground">{data.counters.commitments}</strong> commitments</span>
              <span><strong className="text-foreground">{data.counters.matches}</strong> matches</span>
              <span><strong className="text-foreground">{data.counters.coffees}</strong> coffees happened</span>
            </div>
          )}
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-border">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground')}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && !data && <p className="text-sm text-muted-foreground">Loading…</p>}

        {data && tab === 'mentors' && (
          <div className="space-y-3">
            {data.mentors.length === 0 && <p className="text-sm text-muted-foreground">No mentor applications yet.</p>}
            {data.mentors.map((m) => (
              <div key={m.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium">{m.first_name} <span className="text-muted-foreground font-normal text-sm">{m.role}{m.company ? ` · ${m.company}` : ''}</span></p>
                    <p className="text-xs text-muted-foreground">{m.email}{m.linkedin_url ? ` · ${m.linkedin_url}` : ''}</p>
                  </div>
                  <span className={cn('px-2.5 py-1 text-xs rounded-full border', STATUS_STYLE[m.mentor_status])}>{m.mentor_status}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.offer_tags?.map((t) => <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{t}</span>)}
                </div>
                {m.vouches?.[0] && (
                  <p className="text-xs text-muted-foreground">
                    Voucher: {m.vouches[0].voucher_name} ({m.vouches[0].voucher_contact}) — {m.vouches[0].confirmed_at ? '✓ vouched' : 'not yet'}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => act({ action: 'set-mentor-status', id: m.id, status: 'approved' })} disabled={m.mentor_status === 'approved'}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => act({ action: 'set-mentor-status', id: m.id, status: 'declined' })} disabled={m.mentor_status === 'declined'}>Decline</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && tab === 'fair' && (
          <div className="space-y-3">
            {data.orgs.length === 0 && <p className="text-sm text-muted-foreground">No fair submissions yet.</p>}
            {data.orgs.map((o) => (
              <div key={o.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium">{o.name}</p>
                    <p className="text-xs text-muted-foreground">{o.who_they_help}</p>
                  </div>
                  <span className={cn('px-2.5 py-1 text-xs rounded-full border', STATUS_STYLE[o.status])}>{o.status}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {o.tags.map((t) => <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{t}</span>)}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => act({ action: 'set-org-status', id: o.id, status: 'approved' })} disabled={o.status === 'approved'}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => act({ action: 'set-org-status', id: o.id, status: 'declined' })} disabled={o.status === 'declined'}>Decline</Button>
                  <a href={`/fair/${o.slug}/card`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="gap-1"><Printer className="h-3.5 w-3.5" /> Card</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && tab === 'commitments' && (
          <div className="space-y-3">
            {data.commitments.length === 0 && <p className="text-sm text-muted-foreground">No commitments yet.</p>}
            {data.commitments.map((c) => (
              <div key={c.id} className="rounded-lg border border-border p-4 space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-medium text-sm">
                    {c.people?.first_name} <span className="text-muted-foreground font-normal">({c.people?.stage ?? '—'})</span>
                    {c.people?.is_mentor && c.people.mentor_status === 'approved' && <span className="ml-1 text-primary">☕</span>}
                  </p>
                  <span className="text-xs text-muted-foreground">{c.type.replace(/_/g, ' ')} · {c.source}{c.linked_commitment_id ? ' · linked ✓' : ''}</span>
                </div>
                {c.other_name && <p className="text-xs text-muted-foreground">With: {c.other_name}{c.other_email ? ` (${c.other_email})` : ''}</p>}
                {c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{t}</span>)}
                  </div>
                )}
                {(c.availability || c.neighborhood) && (
                  <p className="text-xs text-muted-foreground">{c.availability?.join(', ')}{c.neighborhood ? ` · ${c.neighborhood}` : ''}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'quick-entry' && <QuickEntry onDone={() => load()} call={call} />}

        {data && tab === 'print' && <PrintView orgs={data.orgs.filter((o) => o.status === 'approved')} people={data.people.filter((p) => p.show_badge_card && p.short_id)} />}

        {(tab === 'matches' || tab === 'outbox' || tab === 'checkins' || tab === 'vouchers') && (
          <Phase2Tabs key={tab} tab={tab} call={call} onChange={() => load()} />
        )}
      </div>
    </div>
  );
}

function QuickEntry({ onDone, call }: { onDone: () => void; call: (b: Record<string, unknown>) => Promise<unknown> }) {
  const [form, setForm] = useState({ first_name: '', email: '', other_name: '', other_email: '' });
  const [stage, setStage] = useState('');
  const [type, setType] = useState('with_someone');
  const [tags, setTags] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const res = (await call({ action: 'quick-entry', ...form, stage, type, tags, coffee_count: count })) as { ok?: boolean; error?: string };
    if (res.error) return setMsg(res.error);
    setMsg('Saved ✓');
    setForm({ first_name: '', email: '', other_name: '', other_email: '' });
    setTags([]);
    onDone();
  };

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <p className="text-sm text-muted-foreground">Type in a paper card. Fast and simple.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>First name *</Label><Input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
        <div className="space-y-1"><Label>Email *</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Stage</Label>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">—</option>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Type *</Label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="with_someone">Having coffee with someone</option>
            <option value="match_me">Match me</option>
            <option value="mentor_offer">Mentor offer</option>
          </select>
        </div>
      </div>
      {type === 'with_someone' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Their name</Label><Input value={form.other_name} onChange={(e) => setForm({ ...form, other_name: e.target.value })} /></div>
          <div className="space-y-1"><Label>Their email</Label><Input value={form.other_email} onChange={(e) => setForm({ ...form, other_email: e.target.value })} /></div>
        </div>
      )}
      {type !== 'with_someone' && (
        <div className="space-y-1">
          <Label>Tags (up to 2)</Label>
          <div className="flex flex-wrap gap-1.5">
            {TAG_GROUPS.flatMap((g) => g.tags).map((t) => (
              <button type="button" key={t} onClick={() => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : p.length < 2 ? [...p, t] : p))}
                className={cn('px-2.5 py-1 text-xs rounded-full border', tags.includes(t) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground')}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
      {type === 'mentor_offer' && (
        <div className="space-y-1 w-28"><Label>Coffees (1–3)</Label><Input type="number" min={1} max={3} value={count} onChange={(e) => setCount(Number(e.target.value))} /></div>
      )}
      {msg && <p className={cn('text-sm', msg === 'Saved ✓' ? 'text-primary' : 'text-destructive')}>{msg}</p>}
      <Button type="submit">Save card</Button>
    </form>
  );
}

function PrintView({ orgs, people }: { orgs: Org[]; people: Person[] }) {
  const [mode, setMode] = useState<'cards' | 'tags'>('tags');
  return (
    <div className="space-y-4">
      <div className="flex gap-2 print:hidden">
        <Button size="sm" variant={mode === 'tags' ? 'default' : 'outline'} onClick={() => setMode('tags')}>Name tags (4/page)</Button>
        <Button size="sm" variant={mode === 'cards' ? 'default' : 'outline'} onClick={() => setMode('cards')}>All fair cards</Button>
        <Button size="sm" variant="ghost" onClick={() => window.print()} className="gap-1"><Printer className="h-3.5 w-3.5" /> Print</Button>
      </div>

      {mode === 'tags' && (
        <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
          {people.length === 0 && <p className="text-sm text-muted-foreground print:hidden">No one has opted in to a badge card yet.</p>}
          {people.map((p) => (
            <div key={p.id} className="border-2 border-black rounded-lg p-4 text-black bg-white flex justify-between items-center print:break-inside-avoid" style={{ minHeight: '2.6in' }}>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{p.first_name} {p.is_mentor && p.mentor_status === 'approved' && '☕'}</p>
                {p.stage && <p className="text-sm">{p.stage}</p>}
                {p.badge_tags?.[0] && <p className="text-sm font-medium">Ask me about {p.badge_tags[0]}</p>}
              </div>
              <QRCode value={`https://seattlestartuppulse.com/p/${p.short_id}`} size={90} />
            </div>
          ))}
        </div>
      )}

      {mode === 'cards' && (
        <div className="space-y-4">
          {orgs.length === 0 && <p className="text-sm text-muted-foreground print:hidden">No approved listings yet.</p>}
          {orgs.map((o) => (
            <div key={o.id} className="border-2 border-black rounded-lg p-6 text-black bg-white print:break-after-page" style={{ width: '5in', height: '7in' }}>
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">{o.name}</h2>
                  <p>{o.who_they_help}</p>
                  <div className="border-t-2 border-black pt-3">
                    <p className="text-sm font-bold uppercase">Do this today</p>
                    <p className="text-lg font-medium">{o.action_today}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {o.tags.map((t) => <span key={t} className="px-2 py-0.5 text-xs border border-black rounded-full">{t}</span>)}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <QRCode value={`https://seattlestartuppulse.com/fair/${o.slug}`} size={160} />
                  <p className="text-sm font-medium">Scan to save this and find a coffee buddy.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
