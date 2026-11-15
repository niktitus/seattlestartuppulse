import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DatedEvent, FormatBadge, SectionHead, formatTone, sameDay } from './shared';

export default function MonthSection({ events, myEventIds }: { events: DatedEvent[]; myEventIds: Set<string> }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [mine, setMine] = useState(false);
  const list = mine ? events.filter((e) => myEventIds.has(e.id)) : events;
  const lead = (cursor.getDay() + 6) % 7;
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))];
  const shift = (n: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));

  return (
    <section>
      <SectionHead id="organizer" eyebrow="07 · Organizer" title="The Organizer View" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Button>
          <p className="font-semibold text-sm w-32 text-center">{cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => shift(1)} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="flex rounded-md border border-border text-xs overflow-hidden">
          <button className={cn('px-2.5 py-1', !mine && 'bg-primary text-primary-foreground')} onClick={() => setMine(false)}>All events</button>
          <button className={cn('px-2.5 py-1', mine && 'bg-primary text-primary-foreground')} onClick={() => setMine(true)}>My events</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-lg overflow-hidden text-[10px]">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} className="bg-muted text-center py-1 font-semibold text-muted-foreground">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="bg-background min-h-[64px]" />;
          const evs = list.filter((e) => sameDay(e.d, d));
          const crowd = evs.length >= 5 ? 'ring-2 ring-inset ring-destructive' : evs.length >= 3 ? 'ring-2 ring-inset ring-accent-foreground/40' : '';
          return (
            <Popover key={i}>
              <PopoverTrigger asChild>
                <button className={cn('bg-card min-h-[64px] p-1 text-left align-top relative', crowd)} title={evs.length >= 3 ? 'Crowded night — consider a different date.' : undefined}>
                  <span className="font-semibold">{d.getDate()}</span>
                  {evs.length >= 3 && <span className={cn('absolute top-0.5 right-0.5 rounded-full px-1 font-bold', evs.length >= 5 ? 'bg-destructive text-destructive-foreground' : 'bg-accent text-accent-foreground')}>{evs.length}</span>}
                  <div className="space-y-0.5 mt-0.5">{evs.slice(0, 2).map((e) => <div key={e.id} className={cn('truncate rounded border px-0.5', formatTone(e.format))}>{e.title}</div>)}</div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <p className="font-semibold text-sm mb-2">{d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                {evs.length >= 3 && <p className="text-xs text-destructive mb-2">Crowded night — consider a different date.</p>}
                {!evs.length && <p className="text-xs text-muted-foreground">Nothing scheduled.</p>}
                <ul className="space-y-2 max-h-64 overflow-y-auto">{evs.map((e) => <li key={e.id}><a href={e.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">{e.title}</a><div className="flex gap-1 items-center text-[11px] text-muted-foreground"><FormatBadge format={e.format} />{e.time}</div></li>)}</ul>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">“My events” shows events you're tracking from this browser.</p>
    </section>
  );
}
