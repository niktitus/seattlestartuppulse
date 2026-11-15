import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BASE_RATES, DAYS, FORMATS, TIMES, forecast, insight, type ForecastInput } from '@/lib/forecast';
import { SectionHead } from './shared';

export default function ForecastSection() {
  const [title, setTitle] = useState('');
  const [f, setF] = useState<ForecastInput>({ format: 'Panel', rsvps: 60, day: 'Tue', time: 'After Work', isFree: true, hasFood: false, hasCohost: false, competing: 0, weather: 'normal' });
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof ForecastInput>(k: K, v: ForecastInput[K]) => { setF({ ...f, [k]: v }); setSaved(false); };
  const r = forecast(f);

  const save = async () => {
    const { error } = await supabase.from('forecast_logs').insert({
      event_title: title.trim().slice(0, 200) || null, format: f.format, expected_rsvps: Math.max(1, Math.round(f.rsvps)),
      day_of_week: f.day, time_of_day: f.time, is_free: f.isFree, has_food: f.hasFood, has_cohost: f.hasCohost,
      competing_events: Math.min(50, Math.max(0, Math.round(f.competing))), weather_factor: f.weather,
      predicted_attendees: r.attendees, predicted_show_rate: Number(r.showRate.toFixed(3)),
    });
    if (error) return toast.error('Could not save that forecast');
    setSaved(true); toast.success('Forecast saved');
  };

  const sel = (label: string, value: string, opts: readonly string[], on: (v: string) => void, labels?: Record<string, string>) => (
    <div><Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={on}><SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
        <SelectContent>{opts.map((o) => <SelectItem key={o} value={o}>{labels?.[o] ?? o}</SelectItem>)}</SelectContent></Select></div>
  );
  const tog = (label: string, v: boolean, on: (v: boolean) => void) => (
    <label className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"><span>{label}</span><Switch checked={v} onCheckedChange={on} /></label>
  );

  return (
    <section>
      <SectionHead id="forecast" eyebrow="Forecast" title="Forecast Your Event" sub="Plug in your event details. Get a realistic attendance estimate based on Seattle patterns." />
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div><Label className="text-xs">Event name (optional)</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 mt-1" maxLength={200} /></div>
        <div className="grid grid-cols-2 gap-3">
          {sel('Format', f.format, FORMATS, (v) => set('format', v as any))}
          <div><Label className="text-xs">Expected RSVPs</Label><Input type="number" min={1} value={f.rsvps} onChange={(e) => set('rsvps', Number(e.target.value) || 0)} className="h-9 mt-1" /></div>
          {sel('Day', f.day, DAYS, (v) => set('day', v as any))}
          {sel('Time', f.time, TIMES, (v) => set('time', v as any))}
          {sel('Seattle weather', f.weather, ['sunny', 'normal', 'rainy'], (v) => set('weather', v as any), { sunny: 'Sunny', normal: 'Normal / overcast', rainy: 'Rainy' })}
          <div><Label className="text-xs">Competing events that night</Label><Input type="number" min={0} value={f.competing} onChange={(e) => set('competing', Number(e.target.value) || 0)} className="h-9 mt-1" /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {tog('Paid ticket', !f.isFree, (v) => set('isFree', !v))}
          {tog('Food / drinks', f.hasFood, (v) => set('hasFood', v))}
          {tog('Co-hosted', f.hasCohost, (v) => set('hasCohost', v))}
        </div>
      </div>
      <div className="mt-3 rounded-lg border-2 border-primary bg-card p-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Predicted attendees</p><p className="text-4xl font-bold text-primary">~{r.attendees} <span className="text-base font-medium text-foreground">people</span></p></div>
          <div className="text-right"><p className="text-xs text-muted-foreground uppercase tracking-wide">Show rate</p><p className="text-2xl font-bold">{Math.round(r.showRate * 100)}%</p></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Seattle average for {f.format}: {Math.round(BASE_RATES[f.format] * 100)}%</p>
        <p className="text-sm mt-2 font-medium">{insight(f)}</p>
        <Button size="sm" className="mt-4" onClick={save} disabled={saved}>{saved ? 'Saved' : 'Save this forecast'}</Button>
      </div>
    </section>
  );
}
