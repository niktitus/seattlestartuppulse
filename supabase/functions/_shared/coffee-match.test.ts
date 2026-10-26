import { describe, it, expect } from 'bun:test';
import { proposeMatches, needsPersonalFollowUp, isDueForCheckin } from './coffee-match';

const s = (id: string, tags: string[], stage = 'Student') => ({ commitment_id: 'c' + id, person_id: 'p' + id, stage, tags });

describe('Coffee matching rules', () => {
  it('pairs a mentee with a mentor who shares a tag first', () => {
    const r = proposeMatches([s('1', ['Leadership']), s('2', ['Leadership'])], [{ commitment_id: 'm', person_id: 'pm', tags: ['Leadership'], capacity: 1 }]);
    expect(r.proposals[0].reason).toBe('mentor');
    expect(r.proposals[0].members.map((m) => m.person_id)).toEqual(['p1', 'pm']);
  });
  it('respects the mentor coffee count', () => {
    const r = proposeMatches([s('1', ['AI careers']), s('2', ['AI careers']), s('3', ['AI careers'])], [{ commitment_id: 'm', person_id: 'pm', tags: ['AI careers'], capacity: 2 }]);
    expect(r.proposals.filter((p) => p.reason === 'mentor').length).toBe(2);
  });
  it('prefers mixing stages for peers', () => {
    const r = proposeMatches([s('1', ['Job search'], 'Student'), s('2', ['Job search'], 'Student'), s('3', ['Job search'], 'Mid-career')], []);
    const pair = r.proposals[0].members.map((m) => m.person_id);
    expect(pair).toContain('p3');
  });
  it('makes a group of 3 when numbers are odd', () => {
    const r = proposeMatches([s('1', ['Leadership']), s('2', ['Leadership'], 'Founder'), s('3', ['Leadership'])], []);
    expect(r.proposals.length).toBe(1);
    expect(r.proposals[0].members.length).toBe(3);
  });
  it('never pairs people without a shared tag', () => {
    const r = proposeMatches([s('1', ['Leadership']), s('2', ['Job search'])], []);
    expect(r.proposals.length).toBe(0);
    expect(r.unmatched.length).toBe(2);
  });
  it('flags "not yet" for a personal follow-up', () => expect(needsPersonalFollowUp({ response: 'not_yet', sent_at: '2026-11-21', handled_at: null })).toBe(true));
  it('flags silence after 7 days', () => expect(needsPersonalFollowUp({ response: null, sent_at: '2026-11-21T00:00:00Z', handled_at: null }, new Date('2026-11-28T00:00:00Z'))).toBe(true));
  it('does not flag "we met"', () => expect(needsPersonalFollowUp({ response: 'met', sent_at: '2026-11-21', handled_at: null })).toBe(false));
  it('check-in is due 14 days after confirmation', () => {
    expect(isDueForCheckin('2026-11-07T12:00:00Z', new Date('2026-11-20T12:00:00Z'))).toBe(false);
    expect(isDueForCheckin('2026-11-07T12:00:00Z', new Date('2026-11-21T12:00:00Z'))).toBe(true);
  });
});
