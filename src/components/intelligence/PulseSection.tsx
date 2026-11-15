import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Pulse } from './LifecycleSection';
import { DatedEvent, SectionHead, callIntel } from './shared';

export default function PulseSection({ pulses, events, onChange }: { pulses: Pulse[]; events: DatedEvent[]; onChange: () => void }) {
  const [text, setText] = useState('');
  const [sort, setSort] = useState<'recent' | 'top'>('recent');
  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const [bump, setBump] = useState<Record<string, number>>({});
  const byId = new Map(events.map((e) => [e.id, e]));
  const list = [...pulses].sort((a, b) => sort === 'top' ? b.upvotes - a.upvotes : +new Date(b.submitted_at) - +new Date(a.submitted_at));

  const submit = async () => {
    try { await callIntel({ action: 'pulse_submit', theme: text }); setText(''); toast.success('Pulse shared'); onChange(); }
    catch (e: any) { toast.error(e.message); }
  };
  const agree = async (id: string) => {
    setAgreed(new Set([...agreed, id])); setBump({ ...bump, [id]: 1 });
    try { await callIntel({ action: 'pulse_upvote', id }); } catch (e: any) { toast.error(e.message); }
  };

  return (
    <section>
      <SectionHead id="pulse" eyebrow="Pulse" title="What People Are Saying" />
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={280} placeholder="What are you noticing in Seattle tech?" className="h-10" />
        <Button type="submit" disabled={text.trim().length < 3}>Share</Button>
      </form>
      <p className="text-[11px] text-muted-foreground mt-1">Anonymous. No login.</p>
      <div className="flex gap-3 text-xs mt-4 mb-2">
        {(['recent', 'top'] as const).map((s) => <button key={s} onClick={() => setSort(s)} className={cn('pb-0.5 border-b-2', sort === s ? 'border-primary font-semibold' : 'border-transparent text-muted-foreground')}>{s === 'recent' ? 'Most recent' : 'Most agreed'}</button>)}
      </div>
      <div className="space-y-2">
        {!list.length && <p className="text-sm text-muted-foreground py-4 text-center">Be the first to share a pulse.</p>}
        {list.slice(0, 30).map((p) => {
          const ev = p.event_id ? byId.get(p.event_id) : null;
          return (
            <div key={p.id} className="rounded-lg border border-border bg-card p-3 flex gap-3 items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm">{p.theme}</p>
                <div className="flex flex-wrap gap-1.5 items-center mt-1.5 text-[11px] text-muted-foreground">
                  <span className="rounded-full border border-border px-1.5">{p.source === 'event_feedback' ? 'Event feedback' : p.source === 'editorial' ? 'Editorial' : 'Community'}</span>
                  {ev && <a href={ev.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-muted px-1.5 truncate max-w-[180px] hover:underline">{ev.title}</a>}
                  <span>{formatDistanceToNow(new Date(p.submitted_at), { addSuffix: true })}</span>
                </div>
              </div>
              <Button size="sm" variant={agreed.has(p.id) ? 'default' : 'outline'} className="h-8 shrink-0" disabled={agreed.has(p.id)} onClick={() => agree(p.id)}>👆 {p.upvotes + (bump[p.id] || 0)}</Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
