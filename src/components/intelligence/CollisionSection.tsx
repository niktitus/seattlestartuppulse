import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { DatedEvent, SectionHead, startOfToday, fmtDate, sameDay } from './shared';

const THEMES: [string, RegExp][] = [
  ['AI', /\b(ai|ml|llm|agent|machine learning|genai)\b/i],
  ['Founders', /founder|startup|pitch|fundrais|investor|vc\b/i],
  ['Women', /women|she|female|swell|rooftop/i],
  ['Builders', /hack|build|dev|engineer|demo/i],
];
const themeOf = (e: DatedEvent) => THEMES.filter(([, r]) => r.test(`${e.title} ${e.description}`)).map(([t]) => t);

export default function CollisionSection({ events }: { events: DatedEvent[] }) {
  const today = startOfToday();
  const days = useMemo(() => Array.from({ length: 28 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; }), [today.getTime()]);
  const [theme, setTheme] = useState<string | null>(null);
  const [sel, setSel] = useState<Date | null>(null);
  const pool = events.filter((e) => !theme || themeOf(e).includes(theme));
  const on = (d: Date) => pool.filter((e) => sameDay(e.d, d));
  const max = Math.max(1, ...days.map((d) => on(d).length));
  const open = days.filter((d) => d.getDay() >= 2 && d.getDay() <= 4 && on(d).length === 0).slice(0, 3);
  const crowded = [...days].sort((a, b) => on(b).length - on(a).length).filter((d) => on(d).length >= 3).slice(0, 3);
  const picked = sel ? on(sel) : [];

  return (
    <section>
      <SectionHead id="collisions" eyebrow="Visibility" title="Before you pick a date" sub="The next four weeks, by how crowded each day already is." />
      <div className="flex flex-wrap gap-1.5 mb-4">
        {[null, ...THEMES.map(([t]) => t)].map((t) => (
          <button key={t ?? 'all'} onClick={() => setTheme(t)} className={cn('rounded-full border px-3 py-1 text-xs', theme === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground')}>{t ?? 'All events'}</button>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((l, i) => <span key={i} className="text-[10px] text-muted-foreground">{l}</span>)}
        {Array.from({ length: days[0].getDay() }).map((_, i) => <span key={`p${i}`} />)}
        {days.map((d) => {
          const n = on(d).length;
          return (
            <button key={d.toISOString()} onClick={() => setSel(d)} aria-label={`${fmtDate(d)}: ${n} events`}
              className={cn('aspect-square rounded-md border text-xs flex flex-col items-center justify-center', sel && sameDay(sel, d) ? 'border-foreground' : 'border-border')}
              style={{ backgroundColor: n ? `hsl(var(--primary) / ${0.12 + 0.75 * (n / max)})` : undefined }}>
              <span className={cn(n / max > 0.5 && 'text-primary-foreground font-semibold')}>{d.getDate()}</span>
              {n > 0 && <span className={cn('text-[9px]', n / max > 0.5 ? 'text-primary-foreground' : 'text-muted-foreground')}>{n}</span>}
            </button>
          );
        })}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        <div className="rounded-lg border border-border p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Open Tue–Thu</p>
          {open.length ? open.map((d) => <p key={+d} className="text-sm mt-1">{fmtDate(d)}</p>) : <p className="text-sm text-muted-foreground mt-1">No open midweek nights.</p>}
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-destructive">Crowded</p>
          {crowded.length ? crowded.map((d) => <p key={+d} className="text-sm mt-1">{fmtDate(d)} · {on(d).length} events</p>) : <p className="text-sm text-muted-foreground mt-1">No collisions ahead.</p>}
        </div>
      </div>
      {sel && (
        <div className="mt-4 rounded-lg border border-border p-3">
          <p className="text-sm font-semibold">{fmtDate(sel)} · {picked.length} {picked.length === 1 ? 'event' : 'events'}</p>
          {picked.map((e) => <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer" className="block text-sm mt-1.5 hover:underline">{e.title} <span className="text-muted-foreground">— {e.organizer}</span></a>)}
        </div>
      )}
    </section>
  );
}
