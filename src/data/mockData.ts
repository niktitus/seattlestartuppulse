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

export const weekInfo = {
  weekNumber: 'Week of Dec 15-21, 2024',
  totalEvents: 5,
  totalDeadlines: 3,
  lastUpdated: 'Friday, Dec 13 at 5:00 PM',
};
