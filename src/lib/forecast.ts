export const FORMATS = ['Panel','Workshop','Mixer','Fireside','Demo Day','Hackathon','Meetup','Dinner'] as const;
export const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;
export const TIMES = ['Morning','Lunch','After Work','Evening'] as const;
export const WEATHER = ['sunny','normal','rainy'] as const;
export type Format = typeof FORMATS[number];
export type Day = typeof DAYS[number];
export type TimeOfDay = typeof TIMES[number];
export type Weather = typeof WEATHER[number];

export const BASE_RATES: Record<Format, number> = {
  Panel: 0.55, Workshop: 0.65, Mixer: 0.45, Fireside: 0.6,
  'Demo Day': 0.7, Hackathon: 0.75, Meetup: 0.5, Dinner: 0.8,
};
const DAY_MOD: Record<Day, number> = { Mon: 0.9, Tue: 1, Wed: 1, Thu: 1, Fri: 0.85, Sat: 0.8, Sun: 0.75 };
const TIME_MOD: Record<TimeOfDay, number> = { 'After Work': 1, Evening: 0.95, Lunch: 0.9, Morning: 0.85 };
const WEATHER_MOD: Record<Weather, number> = { rainy: 0.9, sunny: 1.05, normal: 1 };

export interface ForecastInput {
  format: Format; rsvps: number; day: Day; time: TimeOfDay;
  isFree: boolean; hasFood: boolean; hasCohost: boolean; competing: number; weather: Weather;
}

export function forecast(i: ForecastInput) {
  let rate = BASE_RATES[i.format] * DAY_MOD[i.day] * TIME_MOD[i.time] * WEATHER_MOD[i.weather];
  if (!i.isFree) rate *= 1.15;
  if (i.hasFood) rate *= 1.08;
  if (i.hasCohost) rate *= 1.05;
  rate *= Math.pow(0.95, Math.min(3, Math.max(0, Math.floor(i.competing))));
  rate = Math.min(0.95, Math.max(0.25, rate));
  return { showRate: rate, attendees: Math.round(Math.max(0, i.rsvps) * rate) };
}

export function insight(i: ForecastInput): string {
  const down: string[] = []; const up: string[] = [];
  if (i.weather === 'rainy') down.push('Rain');
  if (['Fri','Sat','Sun'].includes(i.day)) down.push(i.day === 'Fri' ? 'Friday' : 'a weekend');
  if (i.competing >= 2) down.push(`${i.competing} competing events`);
  if (i.time === 'Morning') down.push('a morning slot');
  if (i.hasFood) up.push('Food helps');
  if (!i.isFree) up.push('paid tickets mean committed people');
  if (i.hasCohost) up.push('a co-host widens your reach');
  if (i.weather === 'sunny') up.push('sun gets Seattle out');
  const a = down.length ? `${down.join(' + ')} = expect a lighter room.` : 'Solid setup — this is a strong slot.';
  return up.length ? `${a} ${up[0][0].toUpperCase()}${up[0].slice(1)}.` : a;
}

/** Map a site event format string to a calculator format. */
export function toForecastFormat(f: string | null | undefined): Format {
  const s = (f || '').toLowerCase();
  if (s.includes('hack')) return 'Hackathon';
  if (s.includes('demo') || s.includes('pitch')) return 'Demo Day';
  if (s.includes('workshop') || s.includes('class')) return 'Workshop';
  if (s.includes('panel') || s.includes('conference')) return 'Panel';
  if (s.includes('fireside') || s.includes('talk')) return 'Fireside';
  if (s.includes('dinner') || s.includes('brunch') || s.includes('breakfast')) return 'Dinner';
  if (s.includes('mixer') || s.includes('network') || s.includes('happy')) return 'Mixer';
  return 'Meetup';
}
