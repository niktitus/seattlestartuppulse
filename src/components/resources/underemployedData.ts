export interface UnderemployedResource {
  title: string;
  description: string;
  source: string;
  sourceNote?: string;
  url: string;
}

export interface UnderemployedSubpage {
  label: string;
  subtitle: string;
  resources: UnderemployedResource[];
}

export const UNDEREMPLOYED_SUBPAGES: UnderemployedSubpage[] = [
  {
    label: 'Find Your People',
    subtitle: 'The most underrated career move is finding other people in the same situation. Start here.',
    resources: [
      {
        title: 'Tech Workers Coalition — Seattle Chapter',
        description: 'Peer community for tech workers navigating layoffs, workplace issues, and career transitions. Join the #local-seattle channel in their Slack.',
        source: 'techworkerscoalition.org',
        url: 'https://techworkerscoalition.org/seattle/',
      },
      {
        title: 'New Tech Northwest — Monthly Meetups',
        description: "The PNW's largest monthly tech community event — open to job seekers, founders, and anyone in tech. Good for low-pressure networking.",
        source: 'newtechnorthwest.com',
        url: 'https://www.newtechnorthwest.com/',
      },
      {
        title: "Create33 — Seattle's Tech Community Hub",
        description: "Coworking, events, and a community of operators and professionals. A good place to plug into Seattle's tech scene if you've lost your work community.",
        source: 'create33.com',
        url: 'https://create33.com/',
      },
      {
        title: 'Startup Haven — GroundWork Program',
        description: "Peer cohorts for professionals at inflection points — whether transitioning, building, or figuring out what's next.",
        source: 'startuphaven.com',
        url: 'https://www.startuphaven.com/',
      },
      {
        title: 'Workforce Development Council — Seattle-King County',
        description: 'Hosts events, job fairs, and community connections for workers in transition across King County.',
        source: 'seakingwdc.org',
        url: 'https://www.seakingwdc.org/',
      },
      {
        title: 'GeekWire Events Calendar',
        description: 'Local tech events, summits, and networking opportunities. Good for staying visible in the Seattle ecosystem.',
        source: 'geekwire.com',
        url: 'https://www.geekwire.com/events/',
      },
      {
        title: 'LinkedIn — Seattle Tech Layoffs & Job Search Group',
        description: 'Search for active Seattle-area career transition and job seeker groups directly on LinkedIn. Filter by "Seattle" + your function.',
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/groups/',
      },
      {
        title: 'Layoffs.fyi — Layoff Tracker',
        description: "Real-time tracker of tech layoffs globally. Useful for understanding market conditions — and realizing you're far from alone.",
        source: 'layoffs.fyi',
        url: 'https://layoffs.fyi/',
      },
    ],
  },
  {
    label: 'Immediate Support',
    subtitle: "If you were just laid off, this is what to do in the first two weeks. Don't skip the financial stuff.",
    resources: [
      {
        title: 'Washington State Unemployment Benefits (ESD)',
        description: "Apply immediately after your last day — benefits can replace a portion of lost wages while you search. Don't wait; retroactive claims are limited.",
        source: 'esd.wa.gov',
        url: 'https://esd.wa.gov/unemployment',
      },
      {
        title: 'WorkSource Seattle-King County',
        description: 'Free in-person and virtual career services: resume help, job referrals, workshops, and skills assessments. Funded by the state.',
        source: 'worksourceskc.org',
        url: 'https://www.worksourceskc.org/',
      },
      {
        title: 'WDC Rapid Response Program',
        description: 'If 50+ people were laid off at your company, Rapid Response coordinators will contact affected workers to provide immediate job search and retraining help.',
        source: 'seakingwdc.org',
        url: 'https://www.seakingwdc.org/help-during-layoffs',
      },
      {
        title: 'WA Dislocated Worker Program',
        description: "If you're unlikely to return to your prior role, this program funds retraining for a new career in a high-demand field — while you collect unemployment.",
        source: 'esd.wa.gov',
        url: 'https://esd.wa.gov/jobs-and-training/find-job/services-laid-workers',
      },
      {
        title: 'WARN Notice Database — WA State',
        description: "See which companies have filed mass layoff notices in Washington. Useful context if you're in the middle of a layoff wave.",
        source: 'esd.wa.gov',
        url: 'https://esd.wa.gov/about-us/media/WARN',
      },
      {
        title: 'COBRA & Health Insurance Guide (Healthcare.gov)',
        description: 'Losing employer coverage triggers a Special Enrollment Period. Review your options before the 60-day window closes.',
        source: 'healthcare.gov',
        url: 'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/',
      },
    ],
  },
  {
    label: 'Level Up Your Skills',
    subtitle: 'AI fluency is the new baseline. These are the most practical ways to build it without spending a lot.',
    resources: [
      {
        title: 'Google Career Certificates',
        description: 'Fully online, under 6 months, and widely recognized. Tracks include Project Management, Data Analytics, UX Design, and IT Support. Free on Coursera with financial aid.',
        source: 'grow.google',
        url: 'https://grow.google/certificates/',
      },
      {
        title: 'Microsoft AI Skills for All',
        description: 'Free AI learning paths from Microsoft covering fundamentals through applied tools. Paired with LinkedIn certifications upon completion.',
        source: 'microsoft.com',
        url: 'https://www.microsoft.com/en-us/ai/ai-skills',
      },
      {
        title: 'LinkedIn Learning — Free with King County Library Card',
        description: 'Full access to 16,000+ LinkedIn Learning courses — including AI, project management, and design — with a free King County Library card.',
        source: 'kcls.org',
        url: 'https://www.kcls.org/resources/linkedin-learning/',
      },
      {
        title: 'Coursera — Financial Aid Available',
        description: 'Access thousands of courses and professional certificates from Google, IBM, Meta, and top universities. Apply for financial aid to get full courses free.',
        source: 'coursera.org',
        url: 'https://www.coursera.org/courseraplus/financial-aid',
      },
      {
        title: 'edX — Audit Free, Pay for Certificate',
        description: 'Audit most edX courses at no cost. Pay only if you want the certificate. Strong catalog for AI, data science, and business skills.',
        source: 'edx.org',
        url: 'https://www.edx.org/',
      },
      {
        title: 'Washington State Community and Technical Colleges — WorkFirst Retraining',
        description: "Eligible dislocated workers can attend WA community/technical colleges at low or no cost through WorkSource's retraining programs.",
        source: 'sbctc.edu',
        url: 'https://www.sbctc.edu/',
      },
      {
        title: 'Anthropic Prompt Engineering Guide',
        description: 'Free and surprisingly practical. Understanding how to work with AI tools is becoming a baseline expectation across most professional roles.',
        source: 'docs.anthropic.com',
        url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
      },
      {
        title: 'DeepLearning.AI Short Courses',
        description: 'Free, 1-hour practical AI courses built for non-engineers. Topics range from prompt design to AI agents to LLMs. No coding background needed.',
        source: 'deeplearning.ai',
        url: 'https://www.deeplearning.ai/short-courses/',
      },
    ],
  },
  {
    label: 'Go Fractional',
    subtitle: "If you're overqualified for what's hiring full-time, fractional work lets you stay sharp, earn income, and build leverage while you search.",
    resources: [
      {
        title: "What Fractional Work Actually Is (and Isn't)",
        description: 'A plain-English breakdown of the difference between consulting, contracting, and fractional roles — and how to decide which model fits your situation.',
        source: 'hbr.org',
        url: 'https://hbr.org/2022/09/the-rise-of-the-fractional-executive',
      },
      {
        title: 'Toptal — Vetted Freelance Marketplace',
        description: 'High-end marketplace for fractional executives, finance, and engineering talent. Accepts fewer than 3% of applicants. Worth pursuing if you have 10+ years of strong credentials.',
        source: 'toptal.com',
        url: 'https://www.toptal.com/',
      },
      {
        title: 'Catalant — Senior Talent for Strategy Work',
        description: 'Matches senior professionals (ex-Big 4, Fortune 500) with consulting projects at large companies. Good for ex-Amazon/Microsoft ops and strategy profiles.',
        source: 'gocatalant.com',
        url: 'https://gocatalant.com/',
      },
      {
        title: 'Wellfound (AngelList) — Startup Roles & Contracts',
        description: 'The dominant platform for startup jobs. Useful both for full-time search and finding contract projects with early-stage companies.',
        source: 'wellfound.com',
        url: 'https://wellfound.com/',
      },
      {
        title: 'Pallet — Community-Curated Job Boards',
        description: 'Many operator and operator-adjacent communities run job boards on Pallet. Search by function or community to find niche opportunities.',
        source: 'pallet.com',
        url: 'https://pallet.com/',
      },
      {
        title: 'Chief of Staff Network — Job Board & Community',
        description: 'Dedicated community for CoS and strategic operations professionals. Job board, Slack, and peer groups. Useful for ops-heavy profiles from Big Tech.',
        source: 'chiefofstaff.network',
        url: 'https://www.chiefofstaff.network/',
      },
      {
        title: 'How to Package Your Big Tech Experience for Startups',
        description: 'First Round Review essay on translating corporate credentials into startup-legible value — one of the most commonly cited articles for Big Tech-to-startup transitions.',
        source: 'review.firstround.com',
        url: 'https://review.firstround.com/been-there-done-that-how-to-translate-your-big-company-experience-into-startup-gold',
      },
      {
        title: 'OperatorHub — Track Your Achievements, Connect With Recruiters',
        description: 'Built for operators and Chiefs of Staff. Log your accomplishments with metrics, connect with recruiters who understand operational roles.',
        source: 'operatorhub.io',
        url: 'https://www.operatorhub.io/',
      },
    ],
  },
  {
    label: 'Job Search Tools',
    subtitle: 'The job market is hard right now. These are the most signal-dense tools for navigating it in 2025–2026.',
    resources: [
      {
        title: 'Levels.fyi — Compensation Benchmarking',
        description: "Crowd-sourced compensation data for tech roles across companies and levels. Essential for knowing whether an offer is fair — or whether you're currently underpaid.",
        source: 'levels.fyi',
        url: 'https://www.levels.fyi/',
      },
      {
        title: 'LinkedIn — Turn Notifications On',
        description: 'Enable "Open to Work" (visible to recruiters only), turn on job alerts by role + company size, and set your profile to "actively looking." Obvious but often misconfigured.',
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/jobs/',
      },
      {
        title: 'Wellfound — Startup Jobs (No Recruiter Layer)',
        description: 'Apply directly to founders and hiring managers at startups. Roles are often unadvertised elsewhere, and competition is lower than LinkedIn.',
        source: 'wellfound.com',
        url: 'https://wellfound.com/',
      },
      {
        title: 'WTIA Job Board — Washington Tech Industry',
        description: "Washington Technology Industry Association's job board. PNW-focused, tech-heavy, often includes companies not on mainstream boards.",
        source: 'wtia.org',
        url: 'https://wtia.org/jobs/',
      },
      {
        title: 'GeekWire Job Board',
        description: 'Seattle-specific tech job listings, curated by GeekWire. Skews toward local companies, startups, and mid-size firms.',
        source: 'geekwire.com',
        url: 'https://www.geekwire.com/jobs/',
      },
      {
        title: 'Austin Belcak — Job Search Without Applying Blind',
        description: 'Practical guides on breaking through ATS filters, building referral pipelines, and using outreach instead of cold applications. One of the most tactical job search resources available.',
        source: 'cultivatedculture.com',
        url: 'https://cultivatedculture.com/',
      },
      {
        title: 'Teal — AI Resume Builder & Job Tracker',
        description: "Free tool for tracking applications, tailoring resumes to job descriptions, and analyzing how your resume performs. Especially useful if you're applying at volume.",
        source: 'tealhq.com',
        url: 'https://www.tealhq.com/',
      },
      {
        title: 'WorkSource Seattle Job Listings & Hiring Events',
        description: 'In-person job fairs and listings managed by WorkSource. Useful for connecting with local employers outside the typical job board ecosystem.',
        source: 'worksourceskc.org',
        url: 'https://www.worksourceskc.org/job-seekers/',
      },
    ],
  },
  {
    label: 'For Recent Grads',
    subtitle: "Entry-level roles in tech have dropped 13% in WA since 2022. Here's how to get in anyway.",
    resources: [
      {
        title: 'UW Career Center — Alumni Access',
        description: 'UW alumni retain career center access after graduation. Resume reviews, job boards, and employer connections — use it.',
        source: 'careers.uw.edu',
        url: 'https://careers.uw.edu/',
      },
      {
        title: 'Handshake — Campus Recruiting Platform',
        description: "Dominant platform for entry-level hiring. Create a profile even if you've graduated — many employers actively recruit recent grads year-round.",
        source: 'joinhandshake.com',
        url: 'https://joinhandshake.com/',
      },
      {
        title: 'WTIA Apprenticeship Program',
        description: "Paid apprenticeships in tech for people without traditional credentials. Designed for career changers and recent grads who don't have the \"right\" resume.",
        source: 'wtia.org',
        url: 'https://wtia.org/programs/tech-apprenticeship/',
      },
      {
        title: 'Year Up — Tech Pathways for Young Adults',
        description: 'Free training and paid internship program for 18-29 year olds. Connects participants to Microsoft, Amazon, and other major employers.',
        source: 'yearup.org',
        url: 'https://www.yearup.org/',
      },
      {
        title: 'Pallet Entry-Level Job Boards',
        description: 'Many community job boards on Pallet target early-career candidates. Search by "entry level" or browse by community type.',
        source: 'pallet.com',
        url: 'https://pallet.com/',
      },
      {
        title: 'LinkedIn — How to Build Your Network as a New Grad',
        description: "LinkedIn's own guide on cold outreach, informational interviews, and building a visible presence before you have work history to show.",
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/pulse/how-new-grads-can-build-professional-network-linkedin-news/',
      },
      {
        title: 'Hackathons — DevPost Seattle',
        description: 'Building something at a hackathon creates portfolio work, community connections, and signals initiative to employers. DevPost lists active events.',
        source: 'devpost.com',
        url: 'https://devpost.com/hackathons?search=seattle',
      },
      {
        title: 'Create33 — New Member Events',
        description: "Create33 runs regular events open to early-career people in tech. Low-cost, low-pressure entry point into Seattle's professional community.",
        source: 'create33.com',
        url: 'https://create33.com/',
      },
    ],
  },
];
