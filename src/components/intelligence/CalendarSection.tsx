import { useMemo, useState } from 'react';
import { ExternalLink, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SuggestionDialog from '@/components/SuggestionDialog';
import { toast } from 'sonner';
import { DatedEvent, FormatBadge, SectionHead, callIntel, fmtDate, saveToken, startOfToday } from './shared';

interface Props { events: DatedEvent[]; trackedIds: Set<string>; onTracked: () => void }

export default function CalendarSection({ events, trackedIds, onTracked }: Props) {
  const [format, setFormat] = useState('all');
  const [audience, setAudience] = useState('all');
  const [range, setRange] = useState('30');
  const [showPast, setShowPast] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const today = startOfToday();

  const formats = useMemo(() => [...new Set(events.map((e) => e.format).filter(Boolean))].sort(), [events]);
  const audiences = useMemo(() => [...new Set(events.flatMap((e) => e.audience || []))].sort(), [events]);

  const match = (e: DatedEvent) => (format === 'all' || e.format === format) && (audience === 'all' || (e.audience || []).includes(audience));
  const end = new Date(today); end.setDate(end.getDate() + Number(range));
  const upcoming = events.filter((e) => e.d >= today && e.d <= end && match(e));
  const monthAgo = new Date(today); monthAgo.setDate(monthAgo.getDate() - 30);
  const past = events.filter((e) => e.d < today && e.d >= monthAgo && match(e)).reverse();

  const track = async (e: DatedEvent) => {
    setBusy(e.id);
    try {
      const r = await callIntel<{ id: string; token: string }>({ action: 'track', event_id: e.id });
      saveToken(r.id, r.token);
      toast.success('Tracking started', { description: 'Find it under "Operate the room". Only this browser can edit it.' });
      onTracked();
    } catch (err: any) { toast.error(err.message); } finally { setBusy(null); }
  };

  const Card = ({ e }: { e: DatedEvent }) => (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-primary">{fmtDate(e.d)}{e.time ? ` · ${e.time}` : ''}</p>
          <h3 className="font-semibold leading-snug mt-0.5">{e.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{e.organizer}{e.city ? ` · ${e.city}` : ''}</p>
        </div>
        <FormatBadge format={e.format} className="shrink-0" />
      </div>
      {!!e.audience?.length && (
        <div className="flex flex-wrap gap-1 mt-2">
          {e.audience.slice(0, 4).map((a) => <span key={a} className="text-[11px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{a}</span>)}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        {e.url && <Button asChild size="sm" variant="outline" className="h-8"><a href={e.url} target="_blank" rel="noopener noreferrer">RSVP <ExternalLink className="ml-1 h-3 w-3" /></a></Button>}
        {trackedIds.has(e.id)
          ? <span className="text-xs text-primary font-medium self-center">● Tracked</span>
          : <Button size="sm" variant="ghost" className="h-8" disabled={busy === e.id} onClick={() => track(e)}><Radar className="mr-1 h-3.5 w-3.5" />Track this event</Button>}
      </div>
    </div>
  );

  return (
    <section>
      <SectionHead id="calendar" eyebrow="01 · Calendar" title="What's Happening" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        <Select value={format} onValueChange={setFormat}><SelectTrigger className="h-9"><SelectValue placeholder="Format" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All formats</SelectItem>{formats.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
        <Select value={audience} onValueChange={setAudience}><SelectTrigger className="h-9"><SelectValue placeholder="Audience" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All audiences</SelectItem>{audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
        <Select value={range} onValueChange={setRange}><SelectTrigger className="h-9 col-span-2 sm:col-span-1"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="7">Next 7 days</SelectItem><SelectItem value="30">Next 30 days</SelectItem><SelectItem value="90">Next 90 days</SelectItem></SelectContent></Select>
      </div>
      <div className="mb-4"><SuggestionDialog /></div>
      <p className="text-xs text-muted-foreground mb-2">{upcoming.length} upcoming</p>
      <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
        {upcoming.map((e) => <Card key={e.id} e={e} />)}
        {!upcoming.length && <p className="text-sm text-muted-foreground py-6 text-center">No events match these filters.</p>}
      </div>
      {past.length > 0 && (
        <div className="mt-4">
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setShowPast(!showPast)}>
            {showPast ? '▾' : '▸'} Past events ({past.length})
          </button>
          {showPast && <div className="space-y-3 mt-3 opacity-80">{past.map((e) => <Card key={e.id} e={e} />)}</div>}
        </div>
      )}
    </section>
  );
}
