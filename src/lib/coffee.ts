export const TAG_GROUPS: { theme: 'Women supporting women' | 'Work + AI'; tags: string[] }[] = [
  {
    theme: 'Women supporting women',
    tags: ['Mentorship', 'Funding for women founders', 'Peer community', 'Returning to work', 'Career switching', 'Negotiation & pay', 'Leadership', 'Parents & families', 'Safety & belonging', 'Students & early career'],
  },
  {
    theme: 'Work + AI',
    tags: ['AI upskilling', 'Building with AI', 'AI careers', 'Job search', 'Pitching & storytelling', 'Writing & editing', 'Systems thinking', 'Creativity & design', 'Founding a company'],
  },
];

export const ALL_TAGS = TAG_GROUPS.flatMap((g) => g.tags);

export const STAGES = ['Student', 'Early career', 'Mid-career', 'Career switcher', 'Returning to work', 'Founder', 'Leader'] as const;

export const AVAILABILITY = ['weekday mornings', 'lunch', 'after work', 'weekends'] as const;

export interface FairIdentity {
  first_name: string;
  email: string;
  stage: string;
  linkedin_url?: string;
  show_badge_card?: boolean;
}

const IDENTITY_KEY = 'coffee-identity-v1';
const MY_FAIR_KEY = 'coffee-my-fair-v1';

export function getIdentity(): FairIdentity | null {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    return raw ? (JSON.parse(raw) as FairIdentity) : null;
  } catch {
    return null;
  }
}

export function saveIdentity(identity: FairIdentity) {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  } catch {
    // private browsing etc. — identity just won't persist
  }
}

export interface MyFairItem {
  slug: string;
  name: string;
  url: string;
  action_today: string;
  tags: string[];
}

export function getMyFair(): MyFairItem[] {
  try {
    const raw = localStorage.getItem(MY_FAIR_KEY);
    return raw ? (JSON.parse(raw) as MyFairItem[]) : [];
  } catch {
    return [];
  }
}

export function addToMyFair(item: MyFairItem) {
  try {
    const list = getMyFair().filter((i) => i.slug !== item.slug);
    list.push(item);
    localStorage.setItem(MY_FAIR_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Tags collected from fair taps, used to pre-fill the Coffee Commitment. */
export function getMyFairTags(): string[] {
  const tags = getMyFair().flatMap((i) => i.tags);
  return [...new Set(tags)].slice(0, 2);
}
