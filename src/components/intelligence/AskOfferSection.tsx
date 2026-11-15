import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Pulse } from './LifecycleSection';
import { SectionHead, callIntel } from './shared';

export default function AskOfferSection({ pulses, onChange }: { pulses: Pulse[]; onChange: () => void }) {
  const [kind, setKind] = useState<'ask' | 'offer'>('ask');
  const [text, setText] = useState('');
  const items = pulses.filter((p) => p.source === 'ask' || p.source === 'offer');
  const submit = async () => {
    try { await callIntel({ action: 'pulse_submit', theme: text, source: kind }); setText(''); toast.success('Posted'); onChange(); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <section>
      <SectionHead id="ask-offer" eyebrow="Matching" title="Ask & Offer" sub="Venues, speakers, co-founders, intros. Post what you need or what you can give." />
      <div className="flex gap-1.5 mb-2">
        {(['ask', 'offer'] as const).map((k) => <button key={k} onClick={() => setKind(k)} className={cn('rounded-full border px-3 py-1 text-xs', kind === k ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground')}>{k === 'ask' ? 'I need' : 'I can offer'}</button>)}
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={280} className="h-10"
          placeholder={kind === 'ask' ? 'e.g. 40-person venue in Pioneer Square, Dec 10' : 'e.g. Fremont space with AV, up to 50'} />
        <Button type="submit" disabled={text.trim().length < 3}>Post</Button>
      </form>
      <p className="text-[11px] text-muted-foreground mt-1">Anonymous. Add how to reach you if you want replies.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        {(['ask', 'offer'] as const).map((k) => (
          <div key={k}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{k === 'ask' ? 'Asks' : 'Offers'}</p>
            {items.filter((p) => p.source === k).slice(0, 12).map((p) => <p key={p.id} className="rounded-lg border border-border bg-card p-3 text-sm mb-2">{p.theme}</p>)}
            {!items.some((p) => p.source === k) && <p className="text-sm text-muted-foreground">Nothing yet.</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
