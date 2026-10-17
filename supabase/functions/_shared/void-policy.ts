export const THEMES = ['Posturing / performative networking', 'Gatekeeping / same people in charge', 'Hiring is broken', 'Layoffs & job insecurity', 'Fundraising & thin capital', 'Big Tech gravity / golden handcuffs', 'Bad management', 'AI hype vs. reality', 'Burnout & workload', 'Comp & equity', "Can't find what's happening", 'Culture / Seattle Freeze', 'Other'] as const;
export const ROLES = ['Founder', 'Employee at a startup', 'Employee at a big company', 'Between roles', 'Investor', 'Other'] as const;
export const TENURES = ['Under 2', '2–5', '5–10', '10+'] as const;
export const LOUDNESS = ['Whisper', 'Grumble', 'Rant', 'Yell', 'Primal scream'] as const;
export const MAX_SHOUTS = 5;
export const MAX_LENGTH = 1500;
export const MIN_COHORT = 5;

export function cleanShout(text: string) {
  return text.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[removed]')
    .replace(/(?:https?:\/\/|www\.)[^\s]+/gi, '[removed]')
    .replace(/\b(?:[a-z0-9-]+\.)+(?:com|org|net|io|ai|dev|co|us|edu|gov)\b(?:\/[^\s]*)?/gi, '[removed]')
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, '[removed]')
    .replace(/@[\w.-]+/g, '[removed]').trim();
}

export type Shout = { id: string; created_on: string; arena: string; text: string; loudness: number; role: string | null; seattle_tenure: string | null; quote_ok: boolean; themes: string[]; status: string; needs_review: boolean };
export type ThemeStat = { theme: string; month: string; count: number; average: number };
export function safeStats(rows: Shout[]): ThemeStat[] {
  const grouped = new Map<string, { theme: string; month: string; ids: Set<string>; total: number }>();
  for (const row of rows) {
    if (row.status === 'hidden' || row.needs_review) continue;
    for (const theme of new Set(row.themes)) {
      const month = row.created_on.slice(0, 7);
      const key = `${month}|${theme}`;
      const group = grouped.get(key) ?? { theme, month, ids: new Set<string>(), total: 0 };
      if (!group.ids.has(row.id)) { group.ids.add(row.id); group.total += row.loudness; }
      grouped.set(key, group);
    }
  }
  return [...grouped.values()].filter(g => g.ids.size >= MIN_COHORT).map(g => ({ theme: g.theme, month: g.month, count: g.ids.size, average: Math.round(g.total / g.ids.size * 10) / 10 }));
}
export function canQuote(row: Shout, cohort: Shout[]) {
  if (!row.quote_ok || row.status !== 'reviewed' || row.needs_review) return false;
  return row.themes.some(theme => cohort.filter(s => s.status !== 'hidden' && !s.needs_review && s.arena === row.arena && s.created_on.slice(0, 7) === row.created_on.slice(0, 7) && s.themes.includes(theme)).length >= MIN_COHORT);
}
export function dailyCount(storage: Pick<Storage, 'getItem'>, date: string) {
  try { const value = JSON.parse(storage.getItem('void_daily_limit') ?? '{}'); return value.date === date && Number.isInteger(value.count) && value.count >= 0 ? value.count as number : 0; } catch { return 0; }
}
export function recordShout(storage: Pick<Storage, 'getItem' | 'setItem'>, date: string) {
  const count = dailyCount(storage, date) + 1;
  try { storage.setItem('void_daily_limit', JSON.stringify({ date, count })); } catch { /* No identifier fallback. */ }
  return count;
}
export const CITIES = ['Seattle', 'San Francisco', 'San Jose', 'New York', 'Austin', 'Boston', 'Los Angeles', 'Denver', 'Chicago', 'Atlanta', 'Washington, DC'] as const;
