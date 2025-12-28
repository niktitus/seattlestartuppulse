export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  format: 'virtual' | 'inperson' | 'hybrid';
  audience: string[];
  stage: string[];
  type: string;
  organizer: string;
  description: string;
  url: string;
  featured?: boolean;
}

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  daysLeft: number;
  type: string;
  description: string;
  url: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category: string;
}

export interface Community {
  id: string;
  name: string;
  type: 'slack' | 'meetup' | 'dinner' | 'discord';
  members: string;
  description: string;
  url: string;
}

export interface VC {
  id: string;
  name: string;
  focus: string[];
  stages: string[];
  checkSize: string;
  description: string;
  url: string;
  upcomingEvent?: string;
}

export interface Accelerator {
  id: string;
  name: string;
  focus: string[];
  duration: string;
  investment: string;
  description: string;
  url: string;
  upcomingEvent?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'tool' | 'guide' | 'template' | 'service';
  category: string;
  description: string;
  url: string;
}

export interface KeySupport {
  id: string;
  name: string;
  role: 'operator' | 'marketer' | 'finance' | 'legal' | 'hr';
  specialty: string;
  description: string;
  url: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'New Tech Seattle: January Meetup',
    date: 'Jan 14',
    time: '5:30 PM PST',
    format: 'inperson',
    audience: ['Founders', 'Developers'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Meetup',
    organizer: 'New Tech Northwest',
    description: 'Connect with PNW tech community - developers, founders, recruiters, investors, and community leaders at this monthly meetup.',
    url: 'https://lu.ma/1qbdq93r',
    featured: true,
  },
  {
    id: '2',
    title: 'Founders Live Seattle',
    date: 'Jan 16',
    time: '6:00 PM PST',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Pitch Event',
    organizer: 'Founders Live',
    description: 'Happy-hour pitch competition: 5 founders, 99-second pitches, 4 minutes Q&A. Your votes decide the winner! At Startup Hall.',
    url: 'https://www.founderslive.com/events-list/seattle-2025-01',
    featured: true,
  },
  {
    id: '3',
    title: 'Seattle Startup Competition 2025',
    date: 'Feb 22',
    time: '9:00 AM PST',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Competition',
    organizer: 'UW Foster School',
    description: 'The largest startup competition in Greater Seattle. 300+ attendees, life sciences panel, early-stage tech focus.',
    url: 'https://lifesciencewa.org/events/2025-seattle-startup-competition/',
    featured: true,
  },
  {
    id: '4',
    title: 'Seattle Data, AI & Security Meetup',
    date: 'Feb 25',
    time: '5:30 PM PST',
    format: 'hybrid',
    audience: ['Founders', 'Developers'],
    stage: ['Pre-seed', 'Seed', 'Series A+'],
    type: 'Meetup',
    organizer: 'Microsoft Reactor',
    description: 'AI industry perspectives with demos and networking at Microsoft Reactor Seattle.',
    url: 'https://developer.microsoft.com/reactor/events/24851/',
  },
  {
    id: '5',
    title: 'Investor Connect: Pitch & Network Night',
    date: 'Mar 6',
    time: '7:00 PM PST',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Networking',
    organizer: 'Startup Valley',
    description: 'Pitch and network with Seattle-area investors at Tapster. Connect with local VCs and angels.',
    url: 'https://www.eventbrite.com/e/investor-connect-pitch-network-night-seattle-tickets-1102527502439',
  },
  {
    id: '6',
    title: 'Madrona AI Founders Breakfast',
    date: 'Mar 12',
    time: '8:00 AM PST',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Seed', 'Series A+'],
    type: 'Networking',
    organizer: 'Madrona Ventures',
    description: 'Invite-only breakfast for AI founders. Connect with Seattle\'s largest VC firm focused on enterprise AI.',
    url: 'https://www.madrona.com/',
  },
  {
    id: '7',
    title: 'Seattle Startup Week 2025',
    date: 'Mar 17-21',
    time: '9:00 AM PST',
    format: 'hybrid',
    audience: ['Founders', 'Investors', 'Operators'],
    stage: ['Pre-seed', 'Seed', 'Series A+'],
    type: 'Conference',
    organizer: 'Seattle Startup Week',
    description: 'Week-long celebration of Seattle startups with workshops, panels, pitch events, and networking across the city.',
    url: 'https://seattlestartupweek.com/',
    featured: true,
  },
  {
    id: '8',
    title: 'Pioneer Square Labs Demo Day',
    date: 'Mar 27',
    time: '4:00 PM PST',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Demo Day',
    organizer: 'Pioneer Square Labs',
    description: 'PSL startup studio showcases latest batch of companies to Seattle investor community.',
    url: 'https://www.psl.com/',
  },
  {
    id: '9',
    title: 'Techstars Seattle Demo Day',
    date: 'Apr 10',
    time: '5:00 PM PST',
    format: 'hybrid',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Demo Day',
    organizer: 'Techstars',
    description: 'Winter 2025 cohort demo day. Meet the latest Techstars Seattle companies and founders.',
    url: 'https://www.techstars.com/accelerators/seattle',
    featured: true,
  },
  {
    id: '10',
    title: 'Founder Institute Showcase (Virtual)',
    date: 'Jan 15',
    time: '9:00 AM PST',
    format: 'virtual',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed'],
    type: 'Pitch Event',
    organizer: 'Founder Institute',
    description: 'Silicon Valley\'s leading international pre-seed pitch event. Watch pitches, learn from VCs, and network globally.',
    url: 'https://www.foundershowcase.com/',
  },
];

export const mockDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'Y Combinator Spring 2026 Batch',
    dueDate: 'Jan 17, 2025',
    daysLeft: 20,
    type: 'Accelerator',
    description: 'Apply to YC Spring 2026 batch (Apr-Jun in San Francisco). $500K standard deal.',
    url: 'https://www.ycombinator.com/apply',
  },
  {
    id: '2',
    title: 'STEP Dubai Early Bird Tickets',
    dueDate: 'Jan 31, 2025',
    daysLeft: 34,
    type: 'Conference',
    description: 'Early bird pricing ends for STEP Dubai 2026. Feb 11-12 in Dubai.',
    url: 'https://dubai.stepconference.com/',
  },
  {
    id: '3',
    title: '4YFN Barcelona Startup Exhibition',
    dueDate: 'Feb 7, 2025',
    daysLeft: 41,
    type: 'Exhibition',
    description: 'Apply to exhibit at 4YFN Barcelona. 1000+ startups showcase to 900+ investors.',
    url: 'https://www.4yfn.com/',
  },
  {
    id: '4',
    title: 'Startup Mania Miami Applications',
    dueDate: 'Feb 28, 2025',
    daysLeft: 62,
    type: 'Competition',
    description: 'Apply to compete in March Madness-style pitch competition. Cash prize for winner.',
    url: 'https://about.startupgrind.com/startup-mania-march-2025/',
  },
  {
    id: '5',
    title: 'START Summit Startup Tickets',
    dueDate: 'Mar 1, 2025',
    daysLeft: 63,
    type: 'Conference',
    description: 'Early-bird startup tickets for START Summit 2026 in St. Gallen, Switzerland.',
    url: 'https://www.startglobal.org/start-summit',
  },
  {
    id: '6',
    title: 'TechCrunch Sessions: AI Speaker Apps',
    dueDate: 'Mar 7, 2025',
    daysLeft: 69,
    type: 'Speaking',
    description: 'Apply to speak at TechCrunch Sessions: AI on June 5, 2025.',
    url: 'https://techcrunch.com/events/tc-sessions-ai/',
  },
  {
    id: '7',
    title: 'MIT Fintech Startup Competition',
    dueDate: 'Mar 15, 2025',
    daysLeft: 77,
    type: 'Competition',
    description: 'Apply to compete at MIT Fintech Conference startup competition.',
    url: 'https://www.mitfintech.com/startup-competition',
  },
  {
    id: '8',
    title: 'TechCrunch All Stage 2025 Tickets',
    dueDate: 'Apr 15, 2025',
    daysLeft: 108,
    type: 'Conference',
    description: 'Early pricing for TechCrunch All Stage 2025 with 1,200+ founders and investors.',
    url: 'https://techcrunch.com/events/techcrunch-all-stage-2025/',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Databricks hits $62B valuation in record VC round',
    source: 'Reuters',
    date: 'Dec 17',
    summary: 'AI startup Databricks closes the largest VC round ever at $10B, reaching $62 billion valuation.',
    url: 'https://www.reuters.com/technology/databricks-secures-62-bln-valuation-ai-focused-funding-round-2024-12-17/',
    category: 'Funding',
  },
  {
    id: '2',
    title: 'Perplexity AI closes funding at $9B valuation',
    source: 'Bloomberg',
    date: 'Dec 18',
    summary: 'AI search startup Perplexity raises new round, now valued at $9 billion.',
    url: 'https://www.bloomberg.com/news/articles/2024-12-18/ai-startup-perplexity-closes-funding-round-at-9-billion-value',
    category: 'Funding',
  },
  {
    id: '3',
    title: '49 US AI startups raised $100M+ in 2024',
    source: 'TechCrunch',
    date: 'Dec 20',
    summary: 'TechCrunch compiles full list of AI startups that raised mega-rounds this year.',
    url: 'https://techcrunch.com/2024/12/20/heres-the-full-list-of-49-us-ai-startups-that-have-raised-100m-or-more-in-2024/',
    category: 'Funding',
  },
  {
    id: '4',
    title: 'Liquid AI raises $250M for efficient AI models',
    source: 'TechCrunch',
    date: 'Dec 13',
    summary: 'MIT spinout Liquid AI closes early-stage round led by AMD for new AI architecture.',
    url: 'https://techcrunch.com/2024/12/13/liquid-ai-just-raised-250m-to-develop-a-more-efficient-type-of-ai-model/',
    category: 'Funding',
  },
  {
    id: '5',
    title: 'AI infrastructure startups dominate December VC',
    source: 'CRN',
    date: 'Dec 23',
    summary: '10 cool tech companies raised funding in December, with AI infrastructure leading.',
    url: 'https://www.crn.com/news/ai/2025/10-cool-tech-companies-that-raised-funding-in-december-2024',
    category: 'Ecosystem',
  },
];

export const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Seattle Founders Slack',
    type: 'slack',
    members: '2,400+',
    description: 'Active community for Seattle startup founders. Daily discussions, job posts, intros.',
    url: '#',
  },
  {
    id: '2',
    name: 'Seattle Tech Meetup',
    type: 'meetup',
    members: '8,000+',
    description: 'Monthly gatherings with speakers, demos, and networking.',
    url: '#',
  },
  {
    id: '3',
    name: 'First Round Founder Dinners',
    type: 'dinner',
    members: 'Invite-only',
    description: 'Quarterly dinners for portfolio founders and select guests.',
    url: '#',
  },
  {
    id: '4',
    name: 'PNW Tech Discord',
    type: 'discord',
    members: '1,200+',
    description: 'Real-time chat for developers, designers, and founders.',
    url: '#',
  },
];

export const mockVCs: VC[] = [
  {
    id: '1',
    name: 'Madrona Ventures',
    focus: ['Enterprise', 'AI/ML', 'Cloud'],
    stages: ['Seed', 'Series A', 'Series B'],
    checkSize: '$1M - $15M',
    description: 'Seattle\'s largest VC firm. Focus on technical founders building enterprise software.',
    url: '#',
    upcomingEvent: 'AI Founders Breakfast',
  },
  {
    id: '2',
    name: 'Pioneer Square Labs',
    focus: ['Consumer', 'Enterprise', 'Fintech'],
    stages: ['Pre-seed', 'Seed'],
    checkSize: '$500K - $3M',
    description: 'Startup studio + venture fund. Hands-on support for earliest stages.',
    url: '#',
  },
  {
    id: '3',
    name: 'Flying Fish Partners',
    focus: ['B2B SaaS', 'Developer Tools'],
    stages: ['Seed', 'Series A'],
    checkSize: '$500K - $5M',
    description: 'Former operators investing in technical B2B companies.',
    url: '#',
  },
  {
    id: '4',
    name: 'Founders\' Co-op',
    focus: ['Consumer', 'SMB', 'Marketplaces'],
    stages: ['Pre-seed', 'Seed'],
    checkSize: '$250K - $1M',
    description: 'Pre-seed fund focused on Pacific Northwest founders.',
    url: '#',
  },
];

export const mockAccelerators: Accelerator[] = [
  {
    id: '1',
    name: 'Techstars Seattle',
    focus: ['All sectors'],
    duration: '3 months',
    investment: '$120K',
    description: 'Premier accelerator program with global network. Two cohorts per year.',
    url: '#',
    upcomingEvent: 'Demo Day Winter 2024',
  },
  {
    id: '2',
    name: 'Seattle Angel Conference',
    focus: ['All sectors'],
    duration: '4 months',
    investment: '$100K+',
    description: 'Pitch competition with education track. Win investment from 100+ angels.',
    url: '#',
  },
  {
    id: '3',
    name: 'gener8tor Seattle',
    focus: ['B2B', 'Enterprise'],
    duration: '12 weeks',
    investment: '$150K',
    description: 'Midwest-based accelerator with Seattle presence. Strong corporate partnerships.',
    url: '#',
  },
  {
    id: '4',
    name: 'Climate Tech Accelerator',
    focus: ['Climate', 'Cleantech'],
    duration: '6 months',
    investment: '$200K',
    description: 'Backed by Amazon Climate Fund. Focus on climate solutions.',
    url: '#',
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Seattle Startup Legal Guide',
    type: 'guide',
    category: 'Legal',
    description: 'Free guide to incorporation, IP, and founder agreements in WA state.',
    url: '#',
  },
  {
    id: '2',
    name: 'PNW Fundraising Tracker',
    type: 'template',
    category: 'Fundraising',
    description: 'Notion template for tracking investor outreach and pipeline.',
    url: '#',
  },
  {
    id: '3',
    name: 'AWS Activate',
    type: 'service',
    category: 'Cloud Credits',
    description: 'Up to $100K in AWS credits for early-stage startups.',
    url: '#',
  },
  {
    id: '4',
    name: 'Startup WA Tax Benefits',
    type: 'guide',
    category: 'Finance',
    description: 'Guide to R&D tax credits and WA state incentives.',
    url: '#',
  },
];

export const mockKeySupport: KeySupport[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'operator',
    specialty: 'GTM & Sales',
    description: 'Ex-Amazon, 3x startup operator. Helps with early sales motion.',
    url: '#',
  },
  {
    id: '2',
    name: 'Marcus Williams',
    role: 'marketer',
    specialty: 'Brand & Content',
    description: 'Built marketing at 2 Seattle unicorns. Focus on B2B storytelling.',
    url: '#',
  },
  {
    id: '3',
    name: 'Jennifer Park',
    role: 'finance',
    specialty: 'CFO Services',
    description: 'Fractional CFO for Series A-B companies. Financial modeling expert.',
    url: '#',
  },
  {
    id: '4',
    name: 'David Nguyen',
    role: 'legal',
    specialty: 'Startup Law',
    description: 'Partner at local firm. Specializes in VC financings and M&A.',
    url: '#',
  },
];

// Helper to get the most recent Sunday
function getLastSunday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 0 : dayOfWeek; // If Sunday, diff is 0
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - diff);
  return lastSunday;
}

// Helper to format date as "Sunday, Dec 15"
function formatSundayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

// Helper to get week range
function getWeekRange(sunday: Date): string {
  const endOfWeek = new Date(sunday);
  endOfWeek.setDate(sunday.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const year = sunday.getFullYear();
  return `Week of ${sunday.toLocaleDateString('en-US', options)}-${endOfWeek.getDate()}, ${year}`;
}

const lastSunday = getLastSunday();

export const weekInfo = {
  weekNumber: getWeekRange(lastSunday),
  totalEvents: 10,
  totalDeadlines: 8,
  lastUpdated: formatSundayDate(lastSunday),
};
