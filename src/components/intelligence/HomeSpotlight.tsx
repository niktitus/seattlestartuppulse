import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/hooks/useEvents';
import { fmtDate, startOfToday, withDates } from './shared';

export default function HomeSpotlight({ events }: { events: Event[] }) {
  const [rate, setRate] = useState<number | null>(null);
  const [pulses, setPulses] = useState<{ id: string; theme: string }[]>([]);
  useEffect(() => {
    supabase.from('showup_snapshots').select('avg_show_rate').order('snapshot_date', { ascending: false }).limit(1).then(({ data }) => setRate(data?.[0] ? Number(data[0].avg_show_rate) : null));
    supabase.from('pulse_themes').select('id,theme').order('submitted_at', { ascending: false }).limit(2).then(({ data }) => setPulses(data || []));
  }, []);
  const next = withDates(events).filter((e) => e.d >= startOfToday()).slice(0, 3);
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <p className="text-[11px] font-bold tracking-widest text-primary uppercase">From the Intelligence Page</p>
      <ul className="mt-2 space-y-1">{next.map((e) => <li key={e.id} className="text-sm"><span className="text-muted-foreground text-xs mr-2">{fmtDate(e.d)}</span>{e.title}</li>)}</ul>
      {(rate !== null || pulses.length > 0) && (
        <div className="mt-3 pt-3 border-t border-border space-y-1 text-sm">
          {rate !== null && <p><b className="text-primary">{Math.round(rate * 100)}%</b> average show rate</p>}
          {pulses.map((p) => <p key={p.id} className="text-muted-foreground italic">“{p.theme}”</p>)}
        </div>
      )}
      <Link to="/intelligence" className="inline-block text-sm text-primary font-semibold mt-3 hover:underline">See the full picture →</Link>
    </section>
  );
}
