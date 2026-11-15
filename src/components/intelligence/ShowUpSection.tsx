import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SectionHead } from './shared';

export interface Snapshot { id: string; snapshot_date: string; total_events_tracked: number; avg_show_rate: number; top_format: string | null; top_day: string | null; notes: string | null }

function Ring({ value }: { value: number }) {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
      <circle cx="28" cy="28" r={r} className="stroke-muted" strokeWidth="6" fill="none" />
      <circle cx="28" cy="28" r={r} className="stroke-primary" strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round" />
    </svg>
  );
}

export default function ShowUpSection({ snapshots }: { snapshots: Snapshot[] }) {
  const latest = snapshots[snapshots.length - 1];
  const data = snapshots.map((s) => ({ date: new Date(s.snapshot_date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), rate: Math.round(Number(s.avg_show_rate) * 100) }));
  const stat = (label: string, value: React.ReactNode) => (
    <div className="rounded-lg border border-border bg-card p-3"><p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p><div className="text-xl font-bold mt-1">{value}</div></div>
  );
  return (
    <section>
      <SectionHead id="showing-up" eyebrow="04 · Dashboard" title="The State of Showing Up" sub="Attendance patterns across Seattle's startup events — updated periodically." />
      {!latest ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          The first attendance snapshot is coming soon. Organizers who track their events below feed this dashboard.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
              <Ring value={Number(latest.avg_show_rate)} />
              <div><p className="text-[11px] text-muted-foreground uppercase tracking-wide">Avg show rate</p><p className="text-xl font-bold">{Math.round(Number(latest.avg_show_rate) * 100)}%</p></div>
            </div>
            {stat('Events tracked', latest.total_events_tracked)}
            {stat('Top format', latest.top_format || '—')}
            {stat('Best day', latest.top_day || '—')}
          </div>
          {data.length > 1 && (
            <div className="h-56 mt-4 rounded-lg border border-border bg-card p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {latest.notes && (
            <blockquote className="mt-4 border-l-4 border-primary bg-muted/40 rounded-r-lg p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">What we're seeing</p>
              <p className="text-sm mt-1">{latest.notes}</p>
              <p className="text-[11px] text-muted-foreground mt-2">{latest.snapshot_date}</p>
            </blockquote>
          )}
        </>
      )}
      <p className="text-[11px] text-muted-foreground mt-3">Data sourced from organizer-reported numbers across Seattle startup events. Not every event is tracked — this is a living snapshot.</p>
    </section>
  );
}
