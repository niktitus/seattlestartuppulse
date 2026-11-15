import { supabase } from '@/integrations/supabase/client';
import { parseEventDate } from '@/lib/eventUtils';
import type { Event } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

export type DatedEvent = Event & { d: Date };

export function withDates(events: Event[]): DatedEvent[] {
  return events
    .filter((e) => e.is_approved !== false)
    .map((e) => ({ ...e, d: parseEventDate(e.date) as Date }))
    .filter((e) => e.d instanceof Date && !isNaN(e.d.getTime()))
    .sort((a, b) => a.d.getTime() - b.d.getTime());
}

export const startOfToday = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
export const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
export const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export async function callIntel<T = any>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('intelligence', { body });
  if (error) {
    let msg = 'Something went wrong';
    try { const j = await (error as any).context?.json?.(); if (j?.error) msg = j.error; } catch { /* ignore */ }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data as T;
}

const TOKENS_KEY = 'ssp-intel-tokens';
export const getTokens = (): Record<string, string> => { try { return JSON.parse(localStorage.getItem(TOKENS_KEY) || '{}'); } catch { return {}; } };
export const saveToken = (id: string, token: string) => localStorage.setItem(TOKENS_KEY, JSON.stringify({ ...getTokens(), [id]: token }));

const FORMAT_TONES: Record<string, string> = {
  workshop: 'border-primary text-primary',
  panel: 'border-foreground/60 text-foreground',
  mixer: 'border-accent-foreground/50 text-accent-foreground bg-accent',
  networking: 'border-accent-foreground/50 text-accent-foreground bg-accent',
  hackathon: 'border-primary bg-primary text-primary-foreground',
  conference: 'border-foreground/60 text-foreground',
};
export function formatTone(format?: string) {
  const s = (format || '').toLowerCase();
  const k = Object.keys(FORMAT_TONES).find((key) => s.includes(key));
  return k ? FORMAT_TONES[k] : 'border-border text-muted-foreground';
}
export function FormatBadge({ format, className }: { format?: string; className?: string }) {
  if (!format) return null;
  return <span className={cn('inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium', formatTone(format), className)}>{format}</span>;
}

export function SectionHead({ id, eyebrow, title, sub }: { id: string; eyebrow: string; title: string; sub?: string }) {
  return (
    <div id={id} className="scroll-mt-28 mb-5">
      <p className="text-[11px] font-bold tracking-widest text-primary uppercase">{eyebrow}</p>
      <h2 className="text-2xl font-bold tracking-tight mt-1">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground mt-1 italic">{sub}</p>}
    </div>
  );
}
