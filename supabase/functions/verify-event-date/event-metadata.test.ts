import { describe, expect, test } from 'bun:test';
import { extractEventMetadata } from './event-metadata';

const event = {
  '@type': 'Event', name: 'Celebration of GHC: Live in Seattle',
  startDate: '2026-11-06T15:30:00.000-08:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: { '@type': 'Place', address: { addressLocality: 'Seattle' } },
  organizer: [{ name: 'Nicole Titus' }, { name: 'Nicole Titus' }, { name: 'Ada Developers Academy' }],
  offers: [{ price: 0 }], description: 'An afternoon for women in tech.',
};
const html = (value: unknown) => `<script type="application/ld+json">${JSON.stringify(value)}</script>`;

describe('event submission metadata regression', () => {
  test('finds Luma details beyond the old 20,000-character cutoff', () => {
    expect(extractEventMetadata(' '.repeat(25000) + html(event))).toMatchObject({
      title: 'Celebration of GHC: Live in Seattle', date: 'Nov 6, 2026', time: '3:30 PM',
      organizer: 'Nicole Titus, Ada Developers Academy', city: 'Seattle', cost: 'Free',
    });
  });
  test('preserves the event local day when UTC is the following day', () => {
    expect(extractEventMetadata(html({ ...event, startDate: '2026-11-06T23:30:00-08:00' }))).toMatchObject({ date: 'Nov 6, 2026', time: '11:30 PM' });
  });
  test('supports graph metadata and skips malformed earlier scripts', () => {
    expect(extractEventMetadata('<script type="application/ld+json">broken</script>' + html({ '@graph': [event] }))?.title).toBe(event.name);
  });
  test('falls back for pages without valid event data', () => {
    expect(extractEventMetadata(html({ '@type': 'WebSite', name: 'Luma' }))).toBeUndefined();
    expect(extractEventMetadata(html({ ...event, startDate: 'invalid' }))).toBeUndefined();
  });
});