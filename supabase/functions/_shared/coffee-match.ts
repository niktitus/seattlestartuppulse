// Pure matching rules for Coffee Commitments. Shared by coffee-admin and tests.
export interface Seeker { commitment_id: string; person_id: string; stage: string | null; tags: string[]; wants?: 'mentor' | 'companion' }
export interface MentorOffer { commitment_id: string; person_id: string; tags: string[]; capacity: number }
export interface Proposal {
  members: { person_id: string; commitment_id: string }[];
  shared_tags: string[];
  reason: 'mentor' | 'peer' | 'group';
}

const shared = (a: string[], b: string[]) => a.filter((t) => b.includes(t));

/**
 * Priority inside each pool: 1) mentee + approved mentor sharing a tag (respecting coffee count),
 * 2) peers sharing a tag, preferring different stages, 3) odd one out joins a group of 3.
 * Mentor seekers and coffee-companion seekers are matched in separate pools, so someone
 * asking for a peer is never paired with an approved mentor, and vice versa.
 */
export function proposeMatches(seekers: Seeker[], mentors: MentorOffer[]): { proposals: Proposal[]; unmatched: Seeker[] } {
  const capacity = new Map(mentors.map((m) => [m.commitment_id, Math.min(3, Math.max(1, m.capacity))]));
  const mentorIds = new Set(mentors.map((m) => m.person_id));
  const available = seekers.filter((s) => !mentorIds.has(s.person_id));
  const mentorRun = matchPool(available.filter((s) => s.wants !== 'companion'), mentors, capacity);
  const companionRun = matchPool(available.filter((s) => s.wants === 'companion'), [], capacity);
  return {
    proposals: [...mentorRun.proposals, ...companionRun.proposals],
    unmatched: [...mentorRun.unmatched, ...companionRun.unmatched],
  };
}

function matchPool(pool: Seeker[], mentors: MentorOffer[], capacity: Map<string, number>): { proposals: Proposal[]; unmatched: Seeker[] } {
  const proposals: Proposal[] = [];

  // 1. Mentors
  const left: Seeker[] = [];
  for (const s of pool) {
    let best: MentorOffer | null = null;
    let bestTags: string[] = [];
    for (const m of mentors) {
      if ((capacity.get(m.commitment_id) ?? 0) <= 0 || m.person_id === s.person_id) continue;
      const t = shared(s.tags, m.tags);
      if (t.length > bestTags.length) { best = m; bestTags = t; }
    }
    if (best) {
      capacity.set(best.commitment_id, capacity.get(best.commitment_id)! - 1);
      proposals.push({ members: [{ person_id: s.person_id, commitment_id: s.commitment_id }, { person_id: best.person_id, commitment_id: best.commitment_id }], shared_tags: bestTags, reason: 'mentor' });
    } else left.push(s);
  }

  // 2. Peers
  const peers: Proposal[] = [];
  const used = new Set<string>();
  for (const a of left) {
    if (used.has(a.commitment_id)) continue;
    let best: Seeker | null = null;
    let score = -1;
    let bestTags: string[] = [];
    for (const b of left) {
      if (b === a || used.has(b.commitment_id) || b.person_id === a.person_id) continue;
      const t = shared(a.tags, b.tags);
      if (!t.length) continue;
      const sc = t.length * 2 + (a.stage && b.stage && a.stage !== b.stage ? 1 : 0);
      if (sc > score) { best = b; score = sc; bestTags = t; }
    }
    if (best) {
      used.add(a.commitment_id); used.add(best.commitment_id);
      peers.push({ members: [{ person_id: a.person_id, commitment_id: a.commitment_id }, { person_id: best.person_id, commitment_id: best.commitment_id }], shared_tags: bestTags, reason: 'peer' });
    }
  }

  // 3. Odd ones join a pair that shares a tag (group of 3)
  const unmatched: Seeker[] = [];
  for (const s of left.filter((p) => !used.has(p.commitment_id))) {
    const group = peers.find((p) => p.members.length === 2 && p.shared_tags.some((t) => s.tags.includes(t)) && !p.members.some((m) => m.person_id === s.person_id));
    if (group) {
      group.members.push({ person_id: s.person_id, commitment_id: s.commitment_id });
      group.shared_tags = group.shared_tags.filter((t) => s.tags.includes(t));
      group.reason = 'group';
    } else unmatched.push(s);
  }
  return { proposals: [...proposals, ...peers], unmatched };
}

export const CHECKIN_DAYS = 14;
export const NO_ANSWER_FLAG_DAYS = 7;

/** A 2-week check-in lands in Nik's personal follow-up queue on "not yet" or silence. */
export function needsPersonalFollowUp(c: { response: string | null; sent_at: string | null; handled_at: string | null }, now = new Date()): boolean {
  if (c.handled_at) return false;
  if (c.response === 'not_yet') return true;
  if (!c.response && c.sent_at) return now.getTime() - new Date(c.sent_at).getTime() >= NO_ANSWER_FLAG_DAYS * 86400000;
  return false;
}

export function isDueForCheckin(sentAt: string, now = new Date()): boolean {
  return now.getTime() - new Date(sentAt).getTime() >= CHECKIN_DAYS * 86400000;
}
