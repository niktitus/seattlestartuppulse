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
    title: 'Consensus Hong Kong 2026',
    date: 'Feb 10-12',
    time: '9:00 AM',
    format: 'inperson',
    audience: ['Founders', 'Investors', 'Developers'],
    stage: ['Pre-seed', 'Seed', 'Series A+'],
    type: 'Conference',
    organizer: 'CoinDesk',
    description: 'Web3/blockchain event with 15,000+ attendees from 100+ countries. Bridges East-West startup ecosystems.',
    url: 'https://consensus-hongkong.coindesk.com/',
    featured: true,
  },
  {
    id: '2',
    title: 'STEP Dubai 2026',
    date: 'Feb 11-12',
    time: '9:00 AM',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed', 'Series A+'],
    type: 'Conference',
    organizer: 'STEP Conference',
    description: 'Theme: "Intelligence Everywhere: The AI Economy." 400+ startups, strong investor presence. Connect with Middle East/GCC market.',
    url: 'https://dubai.stepconference.com/',
    featured: true,
  },
  {
    id: '3',
    title: 'Techarena 2026',
    date: 'Feb 11-12',
    time: '9:00 AM',
    format: 'inperson',
    audience: ['Founders', 'Investors', 'Operators'],
    stage: ['Pre-seed', 'Seed', 'Series A+'],
    type: 'Conference',
    organizer: 'Techarena',
    description: 'Scandinavia\'s biggest tech event. Theme: "New Era, Next Mindset." Thousands of business leaders at Stockholm\'s largest stadium.',
    url: 'https://www.techarena.se/events/techarena-2026',
  },
  {
    id: '4',
    title: 'MWC26 Barcelona',
    date: 'Mar 2-5',
    time: '9:00 AM',
    format: 'inperson',
    audience: ['Founders', 'Investors', 'Developers'],
    stage: ['Seed', 'Series A+'],
    type: 'Conference',
    organizer: 'GSMA',
    description: 'Mobile World Congress with 100,000+ attendees. Six themes including intelligent infrastructure and ConnectAI.',
    url: 'https://www.mwcbarcelona.com/',
    featured: true,
  },
  {
    id: '5',
    title: '4YFN Barcelona 2026',
    date: 'Mar 2-5',
    time: '9:00 AM',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Conference',
    organizer: 'GSMA',
    description: 'GSMA\'s startup platform at MWC. 900+ investors, €60B in funding, 1000+ international startups. Topic: Infinite AI.',
    url: 'https://www.4yfn.com/',
  },
  {
    id: '6',
    title: 'START Summit 2026',
    date: 'Mar 19-20',
    time: '9:00 AM',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Conference',
    organizer: 'START Global',
    description: 'Europe\'s leading student-run conference for 7,000+ entrepreneurs. Speakers from OpenAI, Google, NATO Innovation Fund.',
    url: 'https://www.startglobal.org/start-summit',
  },
  {
    id: '7',
    title: 'TechChill 2026',
    date: 'Mar 25-26',
    time: '9:00 AM',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Conference',
    organizer: 'TechChill',
    description: 'Leading Baltic startup event. 300+ startups meet international investors. Fifty Founders Battle pitch competition with €10K prize.',
    url: 'https://www.techchill.co/',
  },
];

export const mockDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'STEP Dubai Early Bird Tickets',
    dueDate: 'Jan 15',
    daysLeft: 18,
    type: 'Conference',
    description: 'Early bird pricing for STEP Dubai 2026. Feb 11-12 in Dubai.',
    url: 'https://dubai.stepconference.com/',
  },
  {
    id: '2',
    title: '4YFN Startup Exhibition',
    dueDate: 'Jan 31',
    daysLeft: 34,
    type: 'Exhibition',
    description: 'Apply to exhibit at 4YFN Barcelona. 1000+ startups showcase to 900+ investors.',
    url: 'https://www.4yfn.com/',
  },
  {
    id: '3',
    title: 'START Summit Startup Tickets',
    dueDate: 'Feb 28',
    daysLeft: 62,
    type: 'Conference',
    description: 'Super early-bird startup tickets for START Summit 2026 in St. Gallen.',
    url: 'https://www.startglobal.org/start-summit',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Convoy shuts down after failing to find buyer',
    source: 'GeekWire',
    date: 'Dec 14',
    summary: 'The Seattle freight startup raised $900M+ but couldn\'t weather the downturn.',
    url: '#',
    category: 'Startup News',
  },
  {
    id: '2',
    title: 'Madrona leads $15M Series A for local AI startup',
    source: 'TechCrunch',
    date: 'Dec 13',
    summary: 'Seattle-based AI company announces funding round with plans to expand team.',
    url: '#',
    category: 'Funding',
  },
  {
    id: '3',
    title: 'Amazon alumni launch new VC fund focused on PNW',
    source: 'GeekWire',
    date: 'Dec 12',
    summary: '$50M fund targeting seed-stage companies in Seattle and Portland.',
    url: '#',
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
  totalEvents: 7,
  totalDeadlines: 3,
  lastUpdated: formatSundayDate(lastSunday),
};
