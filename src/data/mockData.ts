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
    title: 'Seattle Angel Conference Demo Day',
    date: 'Dec 17',
    time: '5:00 PM',
    format: 'inperson',
    audience: ['Founders', 'Investors'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Demo Day',
    organizer: 'Seattle Angel Conference',
    description: '12 startups pitch to 100+ angel investors. Networking reception follows.',
    url: '#',
    featured: true,
  },
  {
    id: '2',
    title: 'Founder Coffee: AI Edition',
    date: 'Dec 18',
    time: '8:30 AM',
    format: 'inperson',
    audience: ['Founders'],
    stage: ['Pre-seed', 'Seed', 'Series A+'],
    type: 'Networking',
    organizer: 'Pioneer Square Labs',
    description: 'Casual morning coffee with AI/ML founders. Limited to 20 attendees.',
    url: '#',
    featured: true,
  },
  {
    id: '3',
    title: 'How to Pitch VCs Workshop',
    date: 'Dec 19',
    time: '12:00 PM',
    format: 'virtual',
    audience: ['Founders'],
    stage: ['Pre-seed', 'Seed'],
    type: 'Workshop',
    organizer: 'Techstars Seattle',
    description: 'Learn pitch deck structure, storytelling, and handling tough questions.',
    url: '#',
    featured: true,
  },
  {
    id: '4',
    title: 'Seattle Startup Week Kickoff',
    date: 'Dec 20',
    time: '6:00 PM',
    format: 'hybrid',
    audience: ['Founders', 'Investors', 'Developers', 'Operators'],
    stage: ['All Stages'],
    type: 'Networking',
    organizer: 'Seattle Startup Week',
    description: 'Annual kickoff party with 500+ attendees. Keynote by local unicorn founder.',
    url: '#',
  },
  {
    id: '5',
    title: 'Climate Tech Founders Dinner',
    date: 'Dec 21',
    time: '7:00 PM',
    format: 'inperson',
    audience: ['Founders'],
    stage: ['Seed', 'Series A+'],
    type: 'Networking',
    organizer: 'Congruent Ventures',
    description: 'Intimate dinner for climate tech founders. Application required.',
    url: '#',
  },
];

export const mockDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'Techstars Seattle Applications',
    dueDate: 'Dec 20',
    daysLeft: 5,
    type: 'Accelerator',
    description: 'Spring 2024 cohort. $120K investment, 3-month program.',
    url: '#',
  },
  {
    id: '2',
    title: 'Seattle Angel Conference Pitch',
    dueDate: 'Dec 22',
    daysLeft: 7,
    type: 'Pitch Competition',
    description: 'Apply to pitch at the February conference. $100K+ investment pool.',
    url: '#',
  },
  {
    id: '3',
    title: 'AWS Startup Credits',
    dueDate: 'Dec 31',
    daysLeft: 16,
    type: 'Grant',
    description: 'Up to $100K in AWS credits for early-stage startups.',
    url: '#',
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

export const weekInfo = {
  weekNumber: 'Week of Dec 15-21, 2024',
  totalEvents: 5,
  totalDeadlines: 3,
  lastUpdated: 'Friday, Dec 13 at 5:00 PM',
};
