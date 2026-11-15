import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DatedEvent, FormatBadge, SectionHead, callIntel, fmtDate, startOfToday } from './shared';

interface Track { id?: string; name: string; description: string; events: DatedEvent[]; follows?: number }

const AUTO = [
  { name: 'The Builder Track', description: 'Hands-on rooms for engineers and technical founders.', re: /workshop|hack|build|engineer|technical|developer|ai|demo/i },
  { name: 'The Fundraising Track', description: 'Where founders and investors actually meet.', re: /investor|angel|vc|venture|pitch|fundrais|capital/i },
  { name: 'The New-to-Seattle Track', description: 'Low-pressure rooms to meet the community fast.', re: /mixer|network|happy hour|meetup|social|coffee|community/i },
];

export default function TracksSection({ events }: { events: DatedEvent[] }) {
  const [rows, setRows] = useState<any[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const today = startOfToday();
  const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekIso = monday.toISOString().slice(0, 10);

  useEffect(() => {
    supabase.from('track_picks').select('*').eq('week_of', weekIso).then(({ data }) => setRows(data || []));
  }, [weekIso]);

  const tracks: Track[] = useMemo(() => {
    const byId = new Map(events.map((e) => [e.id, e]));
    if (rows.length) return rows.map((r) => ({ id: r.id, name: r.track_name, description: r.track_description || '', follows: r.follows, events: (r.event_ids || []).map((id: string) => byId.get(id)).filter(Boolean) }));
    const end = new Date(today); end.setDate(end.getDate() + 7);
    const week = events.filter((e) => e.d >= today && e.d <= end);
    return AUTO.map((t) => ({
      name: t.name, description: t.description,
      events: week.filter((e) => t.re.test(`${e.title} ${e.format} ${(e.audience || []).join(' ')}`)).slice(0, 4),
    })).filter((t) => t.events.length);
  }, [rows, events]);

  const follow = async (id: string) => {
    setFollowed(new Set([...followed, id]));
    setRows(rows.map((r) => r.id === id ? { ...r, follows: r.follows + 1 } : r));
    try { await callIntel({ action: 'follow_track', id }); } catch (e: any) { toast.error(e.message); }
  };

  return (
    <section>
      <SectionHead id="tracks" eyebrow="02 · Tracks" title="Your Week, Curated" sub={rows.length ? undefined : 'Auto-picked from the next 7 days.'} />
      <div className="flex gap-3 overflow-x-auto snap-x pb-2 -mx-4 px-4">
        {tracks.map((t) => (
          <div key={t.name} className="snap-start shrink-0 w-[82%] sm:w-[300px] rounded-lg border border-border bg-card p-4 flex flex-col">
            <h3 className="font-bold">{t.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t.description}</p>
            <ol className="space-y-2 flex-1">
              {t.events.map((e) => (
                <li key={e.id} className="border-l-2 border-primary pl-2">
                  <p className="text-[11px] text-muted-foreground">{fmtDate(e.d)}</p>
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium leading-snug hover:underline">{e.title}</a>
                  <div><FormatBadge format={e.format} className="mt-1" /></div>
                </li>
              ))}
            </ol>
            {t.id && (
              <Button size="sm" variant={followed.has(t.id) ? 'default' : 'outline'} className="mt-3" disabled={followed.has(t.id)} onClick={() => follow(t.id!)}>
                {followed.has(t.id) ? "You're following" : "I'd follow this track"} · {t.follows}
              </Button>
            )}
          </div>
        ))}
        {!tracks.length && <p className="text-sm text-muted-foreground">No tracks this week yet.</p>}
      </div>
    </section>
  );
}
