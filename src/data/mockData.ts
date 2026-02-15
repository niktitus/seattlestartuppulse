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
    title: 'Techstars Seattle Summer 2026 Applications',
    dueDate: 'Feb 28, 2026',
    daysLeft: 13,
    type: 'Accelerator',
    description: 'Apply to Techstars Seattle Summer 2026 cohort. $120K investment, 3-month program starting June.',
    url: 'https://www.techstars.com/accelerators/seattle',
  },
  {
    id: '2',
    title: 'Seattle Angel Conference Pitch Applications',
    dueDate: 'Mar 1, 2026',
    daysLeft: 14,
    type: 'Competition',
    description: 'Submit your pitch deck to compete for $100K+ from 100+ angel investors at SAC Spring 2026.',
    url: 'https://www.seattleangelconference.com/',
  },
  {
    id: '3',
    title: 'AWS Activate Credits — Q1 Deadline',
    dueDate: 'Mar 15, 2026',
    daysLeft: 28,
    type: 'Grant',
    description: 'Apply for up to $100K in AWS credits for early-stage startups. Q1 review window closes.',
    url: 'https://aws.amazon.com/activate/',
  },
  {
    id: '4',
    title: 'Y Combinator Fall 2026 Batch',
    dueDate: 'Mar 24, 2026',
    daysLeft: 37,
    type: 'Accelerator',
    description: 'Apply to YC Fall 2026 batch (Sep-Nov in San Francisco). $500K standard deal.',
    url: 'https://www.ycombinator.com/apply',
  },
  {
    id: '5',
    title: 'Microsoft for Startups Founders Hub',
    dueDate: 'Mar 31, 2026',
    daysLeft: 44,
    type: 'Grant',
    description: 'Apply for up to $150K in Azure credits, plus access to OpenAI APIs and mentorship.',
    url: 'https://www.microsoft.com/en-us/startups',
  },
  {
    id: '6',
    title: 'TechCrunch Disrupt 2026 Startup Battlefield',
    dueDate: 'Apr 15, 2026',
    daysLeft: 59,
    type: 'Competition',
    description: 'Apply to pitch at TechCrunch Disrupt 2026 Startup Battlefield. $100K prize.',
    url: 'https://techcrunch.com/events/techcrunch-disrupt-2026/',
  },
  {
    id: '7',
    title: 'gener8tor Seattle Spring Cohort',
    dueDate: 'Apr 30, 2026',
    daysLeft: 74,
    type: 'Accelerator',
    description: 'Apply to gener8tor Seattle 12-week B2B accelerator. $150K investment.',
    url: 'https://www.gener8tor.com/',
  },
  {
    id: '8',
    title: 'Climate Tech Accelerator — Amazon Fund',
    dueDate: 'May 15, 2026',
    daysLeft: 89,
    type: 'Accelerator',
    description: 'Apply for the Amazon Climate Fund-backed 6-month accelerator. $200K investment for cleantech startups.',
    url: 'https://www.amazonclimatefund.com/',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Madrona Ventures closes $900M Fund VIII focused on AI',
    source: 'GeekWire',
    date: 'Feb 12, 2026',
    summary: 'Seattle\'s largest VC firm raises its biggest fund yet, doubling down on enterprise AI and developer tools.',
    url: 'https://www.geekwire.com/',
    category: 'Funding',
  },
  {
    id: '2',
    title: 'Seattle startup Tanium reaches $12B valuation in new round',
    source: 'Bloomberg',
    date: 'Feb 11, 2026',
    summary: 'Endpoint security company Tanium raises $500M, solidifying Seattle\'s cybersecurity ecosystem.',
    url: 'https://www.bloomberg.com/',
    category: 'Funding',
  },
  {
    id: '3',
    title: 'Washington State launches $50M startup innovation fund',
    source: 'Puget Sound Business Journal',
    date: 'Feb 10, 2026',
    summary: 'New state fund targets pre-seed and seed startups in cleantech, biotech, and AI across Washington.',
    url: 'https://www.bizjournals.com/seattle/',
    category: 'Policy',
  },
  {
    id: '4',
    title: 'Pioneer Square Labs spins out 4 new companies in Q1',
    source: 'GeekWire',
    date: 'Feb 7, 2026',
    summary: 'PSL studio launches companies in AI agents, fintech, and healthtech, bringing total spinouts to 50+.',
    url: 'https://www.geekwire.com/',
    category: 'Ecosystem',
  },
  {
    id: '5',
    title: 'AI hiring surges 40% in Seattle metro area',
    source: 'Seattle Times',
    date: 'Feb 5, 2026',
    summary: 'Seattle leads the nation in AI job growth, driven by startups and big tech expansion in the region.',
    url: 'https://www.seattletimes.com/',
    category: 'Talent',
  },
  {
    id: '6',
    title: 'Techstars Seattle Winter 2026 cohort announced',
    source: 'TechCrunch',
    date: 'Feb 3, 2026',
    summary: '12 startups selected for Techstars Seattle Winter 2026, spanning AI, climate, and B2B SaaS.',
    url: 'https://techcrunch.com/',
    category: 'Ecosystem',
  },
  {
    id: '7',
    title: 'Seattle ranks #3 for startup ecosystem in US',
    source: 'Forbes',
    date: 'Jan 30, 2026',
    summary: 'Forbes annual ranking puts Seattle behind only SF and NYC, citing strong AI talent and VC presence.',
    url: 'https://www.forbes.com/',
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

// Helper to get week range - shows both months if week spans two months
function getWeekRange(sunday: Date): string {
  const endOfWeek = new Date(sunday);
  endOfWeek.setDate(sunday.getDate() + 6);
  
  const startMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
  const startDay = sunday.getDate();
  const endDay = endOfWeek.getDate();
  const year = endOfWeek.getFullYear();
  
  // If week spans two months, show both months
  if (startMonth !== endMonth) {
    return `Week of ${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
  
  return `Week of ${startMonth} ${startDay}-${endDay}, ${year}`;
}

const lastSunday = getLastSunday();

export const weekInfo = {
  weekNumber: getWeekRange(lastSunday),
  totalEvents: 10,
  totalDeadlines: 8,
  lastUpdated: formatSundayDate(lastSunday),
};
