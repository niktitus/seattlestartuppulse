import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { DAYS, forecast, toForecastFormat } from '@/lib/forecast';
import { DatedEvent, FormatBadge, SectionHead, callIntel, fmtDate, getTokens, sameDay, startOfToday } from './shared';

export interface Lifecycle {
  id: string; event_id: string; pre_event_notes: string | null; live_pulse: string | null; post_event_summary: string | null;
  rsvps: number | null; attended: number | null; show_rate: number | null; connections_made: number | null;
  top_ask: string | null; top_offer: string | null; lessons: string | null;
}
export interface Pulse { id: string; theme: string; source: string; event_id: string | null; upvotes: number; submitted_at: string }

const phaseOf = (d: Date) => { const t = startOfToday(); return sameDay(d, t) ? 'during' : d < t ? 'after' : 'before'; };

function LifecycleCard({ row, event, events, pulses, siteAvg, onSaved }: { row: Lifecycle; event: DatedEvent; events: DatedEvent[]; pulses: Pulse[]; siteAvg: number | null; onSaved: () => void }) {
  const token = getTokens()[row.id];
  const canEdit = !!token;
  const [f, setF] = useState({ ...row });
  const [saving, setSaving] = useState(false);
  const [fb, setFb] = useState('');
  const phase = phaseOf(event.d);
  const set = (k: keyof Lifecycle, v: any) => setF({ ...f, [k]: v });
  const conflicts = events.filter((e) => e.id !== event.id && sameDay(e.d, event.d));
  const fc = forecast({ format: toForecastFormat(event.format), rsvps: event.spots_available || 60, day: DAYS[(event.d.getDay() + 6) % 7], time: 'After Work', isFree: !event.cost || /free/i.test(event.cost), hasFood: false, hasCohost: false, competing: conflicts.length, weather: 'normal' });
  const evPulses = pulses.filter((p) => p.event_id === event.id);
  const rate = f.rsvps && f.attended != null ? f.attended / f.rsvps : null;

  const save = async () => {
    setSaving(true);
    try { await callIntel({ action: 'update_lifecycle', id: row.id, token, fields: { ...f, phase } }); toast.success('Saved'); onSaved(); }
    catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  const sendFb = async () => {
    try { await callIntel({ action: 'pulse_submit', theme: fb, event_id: event.id, source: 'event_feedback' }); setFb(''); toast.success('Thanks — added to the community pulse'); onSaved(); }
    catch (e: any) { toast.error(e.message); }
  };
  const area = (k: keyof Lifecycle, label: string) => (
    <div><Label className="text-xs">{label}</Label>
      {canEdit ? <Textarea value={(f[k] as string) || ''} onChange={(e) => set(k, e.target.value)} className="mt-1 min-h-[70px]" maxLength={2000} />
        : <p className="text-sm mt-1 text-muted-foreground">{(row[k] as string) || '—'}</p>}</div>
  );
  const num = (k: keyof Lifecycle, label: string) => (
    <div><Label className="text-xs">{label}</Label>
      {canEdit ? <Input type="number" min={0} value={(f[k] as number) ?? ''} onChange={(e) => set(k, e.target.value === '' ? null : Number(e.target.value))} className="h-9 mt-1" />
        : <p className="text-sm mt-1">{(row[k] as number) ?? '—'}</p>}</div>
  );
  const line = (k: keyof Lifecycle, label: string) => (
    <div><Label className="text-xs">{label}</Label>
      {canEdit ? <Input value={(f[k] as string) || ''} onChange={(e) => set(k, e.target.value)} className="h-9 mt-1" maxLength={300} />
        : <p className="text-sm mt-1">{(row[k] as string) || '—'}</p>}</div>
  );

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div><p className="text-xs font-semibold text-primary">{fmtDate(event.d)}{event.time ? ` · ${event.time}` : ''}</p><h3 className="font-semibold leading-snug">{event.title}</h3></div>
        {phase === 'during' && <span className="shrink-0 rounded-full bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5">● Live</span>}
      </div>
      <Tabs defaultValue={phase} className="mt-3">
        <TabsList className="grid grid-cols-3 w-full"><TabsTrigger value="before">Before</TabsTrigger><TabsTrigger value="during">During</TabsTrigger><TabsTrigger value="after">After</TabsTrigger></TabsList>
        <TabsContent value="before" className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><FormatBadge format={event.format} />{event.organizer}{event.city ? ` · ${event.city}` : ''}</div>
          <p className="text-sm">Forecast: <b>{Math.round(fc.showRate * 100)}%</b> show rate{event.spots_available ? <> · ~<b>{fc.attendees}</b> of {event.spots_available} spots</> : null}</p>
          {conflicts.length > 0 && (
            <Tooltip><TooltipTrigger asChild><p className="inline-block text-xs rounded border border-accent-foreground/30 bg-accent text-accent-foreground px-2 py-1 cursor-help">⚠️ {conflicts.length} other event{conflicts.length > 1 ? 's' : ''} on this date</p></TooltipTrigger>
              <TooltipContent className="max-w-xs"><ul className="text-xs space-y-0.5">{conflicts.slice(0, 8).map((c) => <li key={c.id}>{c.title}</li>)}</ul></TooltipContent></Tooltip>
          )}
          {area('pre_event_notes', 'Prep notes')}
        </TabsContent>
        <TabsContent value="during" className="space-y-3 pt-2">
          {area('live_pulse', 'Live pulse — what you see in the room')}
          <p className="text-xs text-muted-foreground">{evPulses.length} pulse note{evPulses.length === 1 ? '' : 's'} from attendees</p>
          <ul className="space-y-1">{evPulses.slice(0, 5).map((p) => <li key={p.id} className="text-sm border-l-2 border-primary pl-2">{p.theme}</li>)}</ul>
        </TabsContent>
        <TabsContent value="after" className="space-y-3 pt-2">
          <div className="grid grid-cols-3 gap-2">{num('rsvps', 'RSVPs')}{num('attended', 'Attended')}{num('connections_made', 'Connections')}</div>
          {rate != null && <p className="text-sm">Show rate <b>{Math.round(rate * 100)}%</b>{siteAvg != null && <span className="text-muted-foreground"> vs. Seattle avg {Math.round(siteAvg * 100)}%</span>}</p>}
          <div className="grid sm:grid-cols-2 gap-2">{line('top_ask', 'Top ask')}{line('top_offer', 'Top offer')}</div>
          {area('lessons', 'Lesson / takeaway')}
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs font-semibold">How was this event? <span className="font-normal text-muted-foreground">(anonymous)</span></p>
            <div className="flex gap-2 mt-2"><Input value={fb} onChange={(e) => setFb(e.target.value)} maxLength={280} className="h-9" placeholder="One line" /><Button size="sm" onClick={sendFb} disabled={fb.trim().length < 3}>Send</Button></div>
          </div>
        </TabsContent>
      </Tabs>
      {canEdit ? <Button size="sm" className="mt-3" onClick={save} disabled={saving}>Save notes</Button>
        : <p className="text-[11px] text-muted-foreground mt-3">Only the person who started tracking can edit.</p>}
    </div>
  );
}

export default function LifecycleSection({ rows, events, pulses, siteAvg, onChange }: { rows: Lifecycle[]; events: DatedEvent[]; pulses: Pulse[]; siteAvg: number | null; onChange: () => void }) {
  const byId = new Map(events.map((e) => [e.id, e]));
  const tokens = getTokens();
  const items = rows.map((r) => ({ r, e: byId.get(r.event_id) })).filter((x): x is { r: Lifecycle; e: DatedEvent } => !!x.e)
    .sort((a, b) => Number(!!tokens[b.r.id]) - Number(!!tokens[a.r.id]) || Math.abs(a.e.d.getTime() - Date.now()) - Math.abs(b.e.d.getTime() - Date.now()));
  return (
    <section>
      <SectionHead id="lifecycle" eyebrow="Lifecycle" title="Before, during, after" sub="Track your event before, during, and after — because the room is your most valuable data source." />
      {!items.length && <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No events tracked yet. Tap “Track this event” on any card in the calendar above.</div>}
      <div className="space-y-3">{items.map(({ r, e }) => <LifecycleCard key={r.id} row={r} event={e} events={events} pulses={pulses} siteAvg={siteAvg} onSaved={onChange} />)}</div>
    </section>
  );
}
