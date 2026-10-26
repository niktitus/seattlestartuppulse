import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type Call = (b: Record<string, unknown>) => Promise<any>;
interface MemberP { first_name: string; email: string; stage: string | null; is_mentor: boolean; mentor_status: string }
interface Match {
  id: string; status: string; kind: string; shared_tags: string[]; reason: string | null; other_name: string | null;
  match_members: { id: string; person_id: string; people: MemberP | null }[];
}
interface OutboxRow { id: string; kind: string; to_email: string; subject: string; body: string; status: string; error: string | null; sent_at: string | null; people: { first_name: string } | null }
interface Voucher { id: string; code: string; redeemed: boolean; people: { first_name: string } | null }
interface Checkin { id: string; stage: string; response: string | null; note: string | null; sent_at: string | null; responded_at: string | null; handled_at: string | null; people: { first_name: string; email: string } | null }
interface P2 { matches: Match[]; outbox: OutboxRow[]; vouchers: Voucher[]; checkins: Checkin[]; followups: Checkin[] }

export type Phase2Tab = 'matches' | 'outbox' | 'checkins' | 'vouchers';

const Pill = ({ children, className }: { children: React.ReactNode; className?: string }) =>
  <span className={cn('px-2.5 py-0.5 text-xs rounded-full border border-border text-muted-foreground', className)}>{children}</span>;

export function Phase2Tabs({ tab, call, onChange }: { tab: Phase2Tab; call: Call; onChange: () => void }) {
  const [d, setD] = useState<P2 | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const r = await call({ action: 'phase2-list' }); if (!r.error) setD(r); }, [call]);
  useEffect(() => { void load(); }, [load]);

  const run = async (body: Record<string, unknown>, ok?: (r: any) => string) => {
    setBusy(true); setMsg('');
    const r = await call(body);
    setBusy(false);
    setMsg(r.error ? r.error : ok ? ok(r) : '');
    await load(); onChange();
  };

  if (!d) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const status = msg && <p className="text-sm text-primary" role="status">{msg}</p>;

  if (tab === 'matches') {
    const proposed = d.matches.filter((m) => m.status === 'proposed');
    const approved = d.matches.filter((m) => m.status === 'approved');
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={busy} onClick={() => run({ action: 'propose-matches' }, (r) => `${r.proposed} proposed · ${r.unmatched} still waiting for a match`)}>Propose matches</Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => run({ action: 'draft-with-someone' }, (r) => `${r.created} "having coffee with" confirmations drafted to the Outbox`)}>Draft "coffee with" confirmations</Button>
        </div>
        <p className="text-xs text-muted-foreground">Nothing emails from here. Approving a match drafts confirmations into the Outbox for you to review.</p>
        {status}
        <h2 className="text-sm font-semibold">Proposed ({proposed.length})</h2>
        {proposed.length === 0 && <p className="text-sm text-muted-foreground">No proposals. Tap "Propose matches" to pair everyone who asked.</p>}
        {proposed.map((m) => (
          <MatchCard key={m.id} m={m} others={proposed.filter((o) => o.id !== m.id)}
            onRemove={(id) => run({ action: 'remove-member', member_id: id })}
            onMove={(id, to) => run({ action: 'move-member', member_id: id, match_id: to })}
            actions={<>
              <Button size="sm" disabled={busy} onClick={() => run({ action: 'approve-match', id: m.id }, () => 'Approved — confirmations are in the Outbox')}>Approve</Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => run({ action: 'discard-match', id: m.id })}>Discard</Button>
            </>} />
        ))}
        <h2 className="text-sm font-semibold pt-2">Approved ({approved.length})</h2>
        {approved.map((m) => <MatchCard key={m.id} m={m} others={[]} />)}
      </div>
    );
  }

  if (tab === 'outbox') return <Outbox rows={d.outbox} run={run} busy={busy} status={status} />;

  if (tab === 'checkins') return <Checkins d={d} run={run} busy={busy} status={status} />;

  return <Vouchers rows={d.vouchers} run={run} busy={busy} status={status} />;
}

function MatchCard({ m, others, onRemove, onMove, actions }: {
  m: Match; others: Match[]; onRemove?: (id: string) => void; onMove?: (id: string, to: string) => void; actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <div className="flex flex-wrap gap-1.5 items-center">
        <Pill className={m.reason === 'mentor' ? 'border-primary text-primary' : ''}>{m.kind === 'with_someone' ? 'coffee with' : m.reason ?? 'match'}</Pill>
        {m.shared_tags.map((t) => <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{t}</span>)}
      </div>
      <ul className="space-y-1">
        {m.match_members.map((mm) => (
          <li key={mm.id} className="flex items-center justify-between gap-2 text-sm flex-wrap">
            <span>{mm.people?.first_name} <span className="text-muted-foreground">({mm.people?.stage ?? '—'})</span>
              {mm.people?.is_mentor && mm.people.mentor_status === 'approved' && <span className="ml-1 text-primary">☕ mentor</span>}</span>
            {onRemove && (
              <span className="flex gap-1">
                {others.length > 0 && onMove && (
                  <select aria-label="Move to another match" defaultValue="" onChange={(e) => e.target.value && onMove(mm.id, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                    <option value="">Move to…</option>
                    {others.map((o) => <option key={o.id} value={o.id}>{o.match_members.map((x) => x.people?.first_name).join(' + ')}</option>)}
                  </select>
                )}
                <Button size="sm" variant="ghost" onClick={() => onRemove(mm.id)}>Remove</Button>
              </span>
            )}
          </li>
        ))}
        {m.other_name && <li className="text-sm text-muted-foreground">with {m.other_name} (didn't submit)</li>}
      </ul>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

function Outbox({ rows, run, busy, status }: { rows: OutboxRow[]; run: (b: Record<string, unknown>, ok?: (r: any) => string) => Promise<void>; busy: boolean; status: React.ReactNode }) {
  const [sel, setSel] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ subject: '', body: '' });
  const [filter, setFilter] = useState<'draft' | 'approved' | 'sent' | 'failed'>('draft');
  const shown = rows.filter((r) => r.status === filter);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const counts = (s: string) => rows.filter((r) => r.status === s).length;

  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap">
        {(['draft', 'approved', 'sent', 'failed'] as const).map((f) => (
          <button key={f} onClick={() => { setFilter(f); setSel([]); }}
            className={cn('px-3 py-1 text-xs rounded-full border', filter === f ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground')}>
            {f} ({counts(f)})
          </button>
        ))}
      </div>
      {shown.length > 0 && filter !== 'sent' && (
        <div className="flex flex-wrap gap-2 items-center">
          <Button size="sm" variant="ghost" onClick={() => setSel(sel.length === shown.length ? [] : shown.map((r) => r.id))}>{sel.length === shown.length ? 'Clear' : 'Select all'}</Button>
          {filter !== 'approved' && <Button size="sm" disabled={busy || !sel.length} onClick={() => run({ action: 'set-outbox-status', ids: sel, status: 'approved' }, () => `${sel.length} approved`).then(() => setSel([]))}>Approve {sel.length || ''}</Button>}
          {filter === 'approved' && <Button size="sm" disabled={busy || !sel.length} onClick={() => run({ action: 'send-outbox', ids: sel }, (r) => `${r.sent} sent${r.failed ? ` · ${r.failed} failed` : ''}`).then(() => setSel([]))}>Send {sel.length || ''}</Button>}
          <Button size="sm" variant="outline" disabled={busy || !sel.length} onClick={() => run({ action: 'set-outbox-status', ids: sel, status: 'discarded' }).then(() => setSel([]))}>Discard</Button>
        </div>
      )}
      {status}
      {shown.length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}
      {shown.map((r) => (
        <div key={r.id} className="rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-start gap-3">
            {filter !== 'sent' && <Checkbox checked={sel.includes(r.id)} onCheckedChange={() => toggle(r.id)} aria-label={`Select email to ${r.people?.first_name ?? r.to_email}`} className="mt-1" />}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2 flex-wrap">
                <p className="text-sm font-medium">{r.people?.first_name} <span className="text-muted-foreground font-normal">· {r.to_email}</span></p>
                <Pill>{r.kind.replace(/_/g, ' ')}</Pill>
              </div>
              {editing === r.id ? (
                <div className="space-y-2 pt-2">
                  <Input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} aria-label="Subject" />
                  <Textarea rows={10} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} aria-label="Message" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => run({ action: 'update-outbox', id: r.id, ...draft }, () => 'Saved').then(() => setEditing(null))}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm pt-1">{r.subject}</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap pt-1">{r.body}</p>
                  {r.error && <p className="text-xs text-destructive pt-1">{r.error}</p>}
                  {r.status !== 'sent' && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(r.id); setDraft({ subject: r.subject, body: r.body }); }}>Edit</Button>
                      {r.status !== 'approved' ? (
                        <Button size="sm" variant="outline" onClick={() => run({ action: 'set-outbox-status', ids: [r.id], status: 'approved' })}>Approve</Button>
                      ) : (
                        <Button size="sm" onClick={() => run({ action: 'send-outbox', ids: [r.id] }, (x) => (x.sent ? 'Sent ✓' : 'Send failed'))}>Send now</Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Checkins({ d, run, busy, status }: { d: P2; run: (b: Record<string, unknown>, ok?: (r: any) => string) => Promise<void>; busy: boolean; status: React.ReactNode }) {
  const [writing, setWriting] = useState<string | null>(null);
  const [note, setNote] = useState({ subject: 'Checking in ☕', body: '' });
  const label: Record<string, string> = { met: 'We met ☕', not_yet: 'Not yet', didnt_work: "Didn't work out" };
  return (
    <div className="space-y-4">
      <Button size="sm" disabled={busy} onClick={() => run({ action: 'draft-checkins' }, (r) => `${r.created} check-ins drafted to the Outbox`)}>Draft 2-week check-ins</Button>
      <p className="text-xs text-muted-foreground">Drafts a check-in for everyone whose confirmation went out 14+ days ago. Review and send them in the Outbox.</p>
      {status}
      <h2 className="text-sm font-semibold">Personal follow-up ({d.followups.length})</h2>
      <p className="text-xs text-muted-foreground">"Not yet" or no answer after 7 days. These never get another automated nudge — write them yourself.</p>
      {d.followups.length === 0 && <p className="text-sm text-muted-foreground">No one needs a follow-up right now.</p>}
      {d.followups.map((c) => (
        <div key={c.id} className="rounded-lg border border-primary/40 p-4 space-y-2">
          <div className="flex justify-between flex-wrap gap-2">
            <p className="text-sm font-medium">{c.people?.first_name} <span className="text-muted-foreground font-normal">· {c.people?.email}</span></p>
            <Pill>{c.response ? label[c.response] : 'no answer'}</Pill>
          </div>
          {c.note && <p className="text-xs text-muted-foreground">"{c.note}"</p>}
          {writing === c.id ? (
            <div className="space-y-2">
              <Input value={note.subject} onChange={(e) => setNote({ ...note, subject: e.target.value })} aria-label="Subject" />
              <Textarea rows={6} placeholder={`Hi ${c.people?.first_name ?? ''},`} value={note.body} onChange={(e) => setNote({ ...note, body: e.target.value })} aria-label="Your note" />
              <div className="flex gap-2">
                <Button size="sm" disabled={!note.body.trim()} onClick={() => run({ action: 'draft-personal', checkin_id: c.id, ...note }, () => 'Saved to the Outbox').then(() => { setWriting(null); setNote({ subject: 'Checking in ☕', body: '' }); })}>Save to Outbox</Button>
                <Button size="sm" variant="ghost" onClick={() => setWriting(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setWriting(c.id)}>Write a note</Button>
              <Button size="sm" variant="ghost" onClick={() => run({ action: 'handle-followup', id: c.id })}>Mark handled</Button>
            </div>
          )}
        </div>
      ))}
      <h2 className="text-sm font-semibold pt-2">All check-ins ({d.checkins.length})</h2>
      {d.checkins.map((c) => (
        <div key={c.id} className="flex justify-between text-sm border-b border-border py-2 gap-2 flex-wrap">
          <span>{c.people?.first_name}</span>
          <span className="text-muted-foreground text-xs">{!c.sent_at ? 'not sent yet' : c.response ? label[c.response] : 'waiting'}{c.note ? ' · note' : ''}</span>
        </div>
      ))}
    </div>
  );
}

function Vouchers({ rows, run, busy, status }: { rows: Voucher[]; run: (b: Record<string, unknown>, ok?: (r: any) => string) => Promise<void>; busy: boolean; status: React.ReactNode }) {
  const [codes, setCodes] = useState('');
  const free = rows.filter((v) => !v.people).length;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="codes" className="text-sm font-medium">Add voucher codes from the coffee shop (one per line)</label>
        <Textarea id="codes" rows={4} value={codes} onChange={(e) => setCodes(e.target.value)} />
        <Button size="sm" disabled={busy || !codes.trim()} onClick={() => run({ action: 'add-vouchers', codes }, (r) => `${r.added} codes added`).then(() => setCodes(''))}>Add codes</Button>
      </div>
      <p className="text-xs text-muted-foreground">{free} unassigned. Each confirmation draft takes one automatically; if none are left it says the voucher is on its way.</p>
      {status}
      {rows.map((v) => (
        <div key={v.id} className="flex items-center justify-between text-sm border-b border-border py-2 gap-2">
          <span className="font-mono">{v.code}</span>
          <span className="text-muted-foreground text-xs">{v.people?.first_name ?? 'unassigned'}</span>
          <button onClick={() => run({ action: 'toggle-voucher', id: v.id })}
            className={cn('px-2.5 py-0.5 text-xs rounded-full border', v.redeemed ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground')}>
            {v.redeemed ? 'redeemed' : 'not redeemed'}
          </button>
        </div>
      ))}
    </div>
  );
}
