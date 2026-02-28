export interface StartupResource {
  title: string;
  description: string;
  source: string;
  url: string;
  sourceNote?: string; // e.g. "paid + free"
}

export interface StartupSubpage {
  label: string;
  subtitle: string;
  resources: StartupResource[];
}

export const STARTUP_SUBPAGES: StartupSubpage[] = [
  {
    label: 'Foundation',
    subtitle: 'Read these before writing a line of code or scheduling a single investor meeting.',
    resources: [
      {
        title: 'YC Startup School — The Complete Curriculum',
        description: '7-week free course taught by the partners behind Airbnb, Stripe, and DoorDash. 45% of recent YC batches went through this first.',
        source: 'startupschool.org',
        url: 'https://www.startupschool.org/',
      },
      {
        title: "YC's Essential Startup Advice",
        description: 'The most condensed piece of YC wisdom: make something people want, do things that don\'t scale, talk to users.',
        source: 'ycombinator.com',
        url: 'https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice',
      },
      {
        title: "Matt Mochary's Open-Source Founder Coaching Course",
        description: 'Free Google Doc used by the CEOs of OpenAI, Coinbase, and Reddit. Covers mindset, OKRs, 1:1s, conflict, and performance reviews.',
        source: 'google docs',
        url: 'https://docs.google.com/document/d/18FiJbYn53fTtPmphfdCKT2TMWH-8Y2L-MLqDk-MFV4s/edit',
      },
      {
        title: 'First Round Review — 100 Best Bits of Advice (10 Years)',
        description: 'Compiled from 600+ articles on hiring, product, fundraising, and culture. If you read one long-form piece this month, make it this.',
        source: 'review.firstround.com',
        url: 'https://review.firstround.com/100-best-bits-of-advice-from-first-round-review/',
      },
      {
        title: 'Early-Stage Lessons — Calvin French-Owen, Segment',
        description: 'Surprisingly simple, ruthlessly practical best practices post-raise. Segment was acquired by Twilio for $3.2B.',
        source: 'calv.info',
        url: 'https://calv.info/early-stage-lessons',
      },
      {
        title: 'Build a Team That Ships — Naval Ravikant',
        description: "AngelList's Naval on the north star for earliest-stage companies. Short. Dense. Timeless.",
        source: 'nav.al',
        url: 'https://nav.al/build-a-team-that-ships',
      },
      {
        title: 'The YC Handshake Deal Protocol',
        description: 'Standardized method for confirming investor commitments. Gets people off the fence before the wire. Use it for every round.',
        source: 'ycombinator.com',
        url: 'https://www.ycombinator.com/handshake/',
      },
      {
        title: '30 Best Company-Building Insights of 2024 — First Round',
        description: 'Annual synthesis of the sharpest advice across the First Round portfolio. 2024 edition focuses on PMF in the AI era.',
        source: 'review.firstround.com',
        url: 'https://review.firstround.com/the-30-best-pieces-of-company-building-advice-we-heard-in-2024/',
      },
    ],
  },
  {
    label: 'Fundraising',
    subtitle: 'The practical how-to of actually closing a round — from structuring your SAFE to creating investor FOMO.',
    resources: [
      {
        title: "How to Raise Millions — Hustle Fund's Ultimate Guide",
        description: 'Written by Elizabeth Yin, who has reviewed 40,000+ companies and invested in 700+. The most tactical, no-fluff fundraising guide that exists. Free.',
        source: 'hustlefund.vc',
        url: 'https://letsgo.hustlefund.vc/raise-millions',
      },
      {
        title: 'Raising Capital: The Advice a16z Gives Their Founders',
        description: 'How to create competition between investors, evaluate term sheets beyond valuation, and think about deal structure.',
        source: 'a16z.com',
        url: 'https://a16z.com/raising-capital-this-is-the-advice-we-give-our-founders/',
      },
      {
        title: 'a16z Capital & Fundraising Library',
        description: '409A valuations, SAFE vs. equity, debt raising, cash management, and the 16 commandments for raising in a down market.',
        source: 'a16z.com',
        url: 'https://a16z.com/category/growth/capital-and-fundraising/',
      },
      {
        title: 'YC SAFE Documents — Free Legal Templates',
        description: 'Download the post-money SAFE, the current standard for 85% of early-stage US rounds. Understand what you\'re signing.',
        source: 'ycombinator.com/documents',
        url: 'https://www.ycombinator.com/documents',
      },
      {
        title: 'The Pre-Seed Round Defined — DocSend Study',
        description: 'DocSend analyzed 174 pre-seed fundraises. Data on deck length, investor time per slide, and what actually separates winners.',
        source: 'docsend.com',
        url: 'https://docsend.com/view/9gh9whg',
      },
      {
        title: "Read the VC's Mind — Erik Torenberg's Tweetstorm",
        description: 'One of the most shared pieces of fundraising content ever written. The exact mental model investors use — and how to reverse-engineer it.',
        source: 'threadreaderapp.com',
        url: 'https://threadreaderapp.com/thread/1244519972845416448.html',
      },
      {
        title: 'How to Get Pre-empted — Rahul Vora, Superhuman',
        description: "A masterclass in manufacturing investor FOMO. How Superhuman's founder ran his Series A to get pre-empted rather than waiting.",
        source: 'threadreaderapp.com',
        url: 'https://threadreaderapp.com/thread/1410390326485782540.html',
      },
      {
        title: 'Finding a Lead Investor for Your Pre-Seed or Seed Round',
        description: 'How to identify, diligence, and close a lead investor — the hardest part of early fundraising that most guides skip.',
        source: 'distill.fyi',
        url: 'https://distill.fyi/articles/fundraising-guide',
      },
      {
        title: 'Sequoia Capital Pitch Deck Template',
        description: 'The legendary Sequoia pitch format. Forces you to articulate why now, why you, why this market. Free on Figma.',
        source: 'figma.com',
        url: 'https://www.figma.com/community/file/1435758990791727529/sequoia-capital-pitch-deck-template',
      },
      {
        title: "Foundational Equity — Carta's Benchmark Data",
        description: 'Data-rich guide to equity splits for founders, early employees, advisors, and investors. Covers vesting schedules and dilution benchmarks by stage.',
        source: 'carta.com',
        url: 'https://docs.google.com/presentation/d/1s7Jy9nReeoo7_pV92QenhplvEnGN5U0-JjtF1ZZs30w/edit',
      },
      {
        title: 'What to Do When Your Fundraise Is Stalling',
        description: "Alex Iskold (2048 Ventures) on diagnosing and fixing a round that isn't closing. If you're 90 days in with no term sheet, start here.",
        source: 'startuphacks.vc',
        url: 'https://www.startuphacks.vc/blog/2016/05/25/what-to-do-when-your-fundraising-is-not-going-well',
      },
      {
        title: 'How to Raise Money Before Launch — Delian Asparouhov',
        description: "Thiel Fellow and Khosla VC shares Opendoor's early deck and breaks down how to tell a compelling story before you have a product.",
        source: 'medium.com',
        url: 'https://medium.com/@zebulgar/how-to-raise-money-before-launch-a3544ef4dba6',
      },
    ],
  },
  {
    label: 'Growth & GTM',
    subtitle: 'How to get your first customers, build a growth engine, and scale beyond founder-led sales.',
    resources: [
      {
        title: 'GTM Nirvana — Caroline Clark (ex-Atlassian)',
        description: 'The most used B2B SaaS go-to-market deck in the startup ecosystem. How to scale from first customer to a repeatable revenue engine.',
        source: 'carolineclark.xyz',
        url: 'https://www.carolineclark.xyz/gtm-nirvana',
      },
      {
        title: 'The 20 Best Essays on Marketplace Startups — Andrew Chen, a16z',
        description: 'The definitive reading list for anyone building a marketplace. Covers liquidity, supply/demand bootstrapping, and defensibility.',
        source: 'andrewchen.co',
        url: 'https://andrewchen.co/marketplace-startups-best-essays/',
      },
      {
        title: 'The Clarity of Your Story = The Clarity of Your Strategy — Andrew Chen',
        description: "Founders who can't tell a clear story usually don't have a clear strategy. Essential before any deck refinement.",
        source: 'a16z',
        url: 'https://x.com/andrewchen/status/1952233142372405534',
      },
      {
        title: 'First Round Review: Starting Up Archive',
        description: 'Tactical articles from founders at Thumbtack, Dropbox, and Mercury on product-market fit, early hiring, and early growth. Free.',
        source: 'review.firstround.com',
        url: 'https://review.firstround.com/articles/starting-up/',
      },
      {
        title: 'Growth Unhinged — Kyle Poyar',
        description: 'Kyle Poyar (ex-OpenView, coined "product-led growth") breaks down GTM and pricing strategies of the fastest-growing SaaS companies. Free weekly.',
        source: 'growthunhinged.com',
        url: 'https://www.growthunhinged.com/',
      },
      {
        title: 'Visible.vc — Fundraising CRM & Investor Updates',
        description: 'The tool most serious founders use to manage their fundraise pipeline and send investor updates. Free tier available.',
        source: 'visible.vc',
        url: 'https://visible.vc/fundraising/',
      },
    ],
  },
  {
    label: 'Substacks',
    subtitle: 'Subscribe to 3–5. Give each a month to prove value. Be ruthless about unsubscribing from anything that doesn\'t deliver.',
    resources: [
      {
        title: "Lenny's Newsletter",
        description: 'The biggest tech-specific Substack. Ex-Airbnb product lead covers PM strategy, growth tactics, and career navigation. 700K+ readers.',
        source: 'lennysnewsletter.com',
        sourceNote: 'paid + free',
        url: 'https://www.lennysnewsletter.com/',
      },
      {
        title: 'Growth Unhinged — Kyle Poyar',
        description: 'Deep case studies on how the fastest-growing SaaS companies build GTM, price their products, and use PLG to reduce CAC. Weekly, free.',
        source: 'growthunhinged.com',
        sourceNote: 'free',
        url: 'https://www.growthunhinged.com/',
      },
      {
        title: 'Not Boring — Packy McCormick',
        description: 'Deep-dive essays on the most ambitious startups. Covers why certain business models win. 250K+ readers.',
        source: 'notboring.co',
        sourceNote: 'paid + free',
        url: 'https://www.notboring.co/',
      },
      {
        title: 'Elizabeth Yin (Hustle Fund)',
        description: 'The most founder-transparent VC on the internet. Her posts on fundraising, metrics, and investor relations are required reading.',
        source: 'elizabethyin.com',
        sourceNote: 'free',
        url: 'https://elizabethyin.com/',
      },
      {
        title: 'Venture Unlocked — Samir Kaji',
        description: 'The definitive guide to the emerging manager and micro-VC landscape. Essential for understanding the institutional investor ecosystem.',
        source: 'substack.com',
        sourceNote: 'free',
        url: 'https://samirbk.substack.com/',
      },
      {
        title: 'Newcomer — Eric Newcomer',
        description: 'Exceptional reporting on Silicon Valley VC. His firm directories and deal flow reporting are some of the most useful paid content for founders seeking institutional capital.',
        source: 'newcomer.co',
        sourceNote: 'paid',
        url: 'https://www.newcomer.co/',
      },
      {
        title: 'Stratechery — Ben Thompson',
        description: 'The original premium tech newsletter. Aggregation Theory and Thompson\'s tech market frameworks have become standard VC vocabulary.',
        source: 'stratechery.com',
        sourceNote: 'paid',
        url: 'https://stratechery.com/',
      },
      {
        title: 'Hustle Fund Blog',
        description: 'BS-free, tactical content for pre-seed founders. How much traction to raise, how to structure cold investor emails, and more.',
        source: 'hustlefund.vc',
        sourceNote: 'free',
        url: 'https://www.hustlefund.vc/blog',
      },
      {
        title: 'YC Blog',
        description: 'Essays from YC partners on company building fundamentals. Paul Graham\'s essays ("Do Things That Don\'t Scale," "Startup = Growth") remain as relevant as ever.',
        source: 'ycombinator.com',
        sourceNote: 'free',
        url: 'https://www.ycombinator.com/blog',
      },
    ],
  },
  {
    label: 'Programs',
    subtitle: 'Structured support with capital, community, and accountability.',
    resources: [
      {
        title: 'YC Startup School — Free Online Curriculum',
        description: 'The free version of YC. 7 weeks self-paced. Co-founder matching platform. 45% of recent YC companies went through this first.',
        source: 'startupschool.org',
        url: 'https://www.startupschool.org/',
      },
      {
        title: 'Y Combinator',
        description: 'The world\'s top accelerator. $500K for 7% equity. Twice yearly. Even if you don\'t get in, the application forces founder clarity.',
        source: 'ycombinator.com',
        url: 'https://www.ycombinator.com/apply',
      },
      {
        title: 'Founder Institute',
        description: 'National accelerator with a newly re-launched Seattle chapter.',
        source: 'fi.com',
        url: 'https://fi.co/join/curriculum',
      },
      {
        title: 'a16z Speedrun',
        description: '12-week intensive from Andreessen Horowitz. Up to $1M + $5M in infrastructure credits. Demo Day with 1,000+ investors. Highly competitive.',
        source: 'a16z.com',
        url: 'https://a16z.com/speedrun/',
      },
      {
        title: 'Allen Institute for AI (Ai2) Incubator — Seattle',
        description: 'Backed by Kleiner, Two Sigma, Sequoia, and Madrona. The best AI engineering incubator in Seattle. If you\'re building AI infrastructure, this is the room.',
        source: 'incubator.allenai.org',
        url: 'https://incubator.allenai.org/',
      },
      {
        title: 'Pioneer Square Labs (PSL) — Seattle',
        description: "Seattle's largest venture studio by capital raised and spinouts. Validates ideas then recruits operators from the target industry to build them.",
        source: 'psl.com',
        url: 'https://www.psl.com/studio',
      },
      {
        title: 'WTIA Founder Cohort',
        description: '6-month program for 30–35 venture-scale seed-stage WA companies. Focused on revenue milestones, investment, and team growth.',
        source: 'washingtontechnology.org',
        url: 'https://www.washingtontechnology.org/startup-program/wtia-founder-cohort-program/',
      },
      {
        title: 'Startup Haven — GroundWork Accelerator',
        description: '$20K stipend + $100K investment. Curriculum focused on building cogent growth plans. Seattle-based.',
        source: 'startuphaven.com',
        url: 'https://startuphaven.com/groundwork',
      },
    ],
  },
  {
    label: 'Legal & Finance',
    subtitle: 'The infrastructure decisions that will cost you significantly if you get wrong in year one.',
    resources: [
      {
        title: 'The Ultimate Back-Office Guide — SignalFire',
        description: 'The most comprehensive free guide to startup operations: banking, payroll, equity, insurance, accounting, compliance. Everything to set up properly from day one.',
        source: 'coda.io',
        url: 'https://coda.io/@elaine-zelby/signalfire-back-office-adulting-guide',
      },
      {
        title: 'YC SAFE Documents — Free Legal Templates',
        description: 'Download the post-money SAFE, the current standard for 85% of US early-stage rounds. The pro-rata side letter is here too.',
        source: 'ycombinator.com/documents',
        url: 'https://www.ycombinator.com/documents',
      },
      {
        title: 'File Your 83(b) Election — Required Reading',
        description: 'File within 30 days of founding or you could owe massive taxes on unvested equity at a future liquidity event. Most lawyers forget to tell first-time founders about this.',
        source: 'gust.com',
        url: 'https://gust.com/launch/blog/startup-founder-83b-election',
      },
      {
        title: 'Mercury Bank — Startup Banking & Investor Network',
        description: 'Mercury Raise connects you directly to early-stage investors. Free banking with useful financial dashboards.',
        source: 'mercury.com',
        url: 'https://mercury.com/raise',
      },
      {
        title: 'Carta — Equity 101 for Founders',
        description: 'The standard cap table management platform. Their Equity 101 content explains option pools, vesting, dilution, and 409A valuations in plain language.',
        source: 'carta.com',
        url: 'https://carta.com/blog/equity-101/',
      },
      {
        title: 'Stripe Atlas — Incorporate in Delaware',
        description: '$500 flat. Delaware C-Corp (the VC-required structure), EIN, Stripe account, and R&D credits guidance. Fastest path from idea to properly structured company.',
        source: 'stripe.com/atlas',
        url: 'https://stripe.com/atlas',
      },
      {
        title: 'Foundational Equity Benchmarks — Carta Data',
        description: 'Data-rich guide to structuring equity splits for founders, early employees, advisors, and investors. Vesting schedules and dilution benchmarks by stage.',
        source: 'carta.com',
        url: 'https://docs.google.com/presentation/d/1s7Jy9nReeoo7_pV92QenhplvEnGN5U0-JjtF1ZZs30w/edit',
      },
      {
        title: 'For Every Founder — Operational Resources Hub',
        description: 'Comprehensive curated list of free tools, templates, and service providers for founders at every stage.',
        source: 'foreveryfounder.com',
        url: 'https://foreveryfounder.com/',
      },
    ],
  },
  {
    label: 'PNW Local',
    subtitle: 'Seattle, Portland, and Vancouver-specific resources — local investors, accelerators, angels, and community.',
    resources: [
      {
        title: 'Ascend.vc Seattle Startup Toolkit',
        description: 'The local bible. 25+ PNW VCs with fund sizes and check sizes, 80+ active angel investors by name, all local accelerators, and a full pre-seed due diligence checklist.',
        source: 'ascend.vc',
        url: 'https://www.ascend.vc/seattle-startup-toolkit',
      },
      {
        title: 'Navigating the Seattle Startup Ecosystem — Nikesh Parekh',
        description: 'An exhaustive guide to the PNW market. Essential for Big Tech refugees (Amazon, Microsoft) going founder — how to leverage that network.',
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/pulse/navigating-seattle-startup-ecosystem-guide-microsoft-amazon-parekh-evgic/',
      },
      {
        title: 'Alliance of Angels',
        description: 'Seattle\'s most active angel group. Invests $250K–$1M in early-stage PNW companies. Strong first port of call before institutional rounds.',
        source: 'allianceofangels.com',
        url: 'https://www.allianceofangels.com/',
      },
      {
        title: 'Seattle Angel Conference',
        description: 'Competitive funding rounds for early-stage startups with 100+ individual angels. Well-structured process for companies seeking $50K–$500K.',
        source: 'seattleangelconference.com',
        url: 'https://www.seattleangelconference.com/',
      },
      {
        title: 'Startup Haven — Seattle Founder Community',
        description: '2,300+ member org exclusively for venture-scale founders and investors. Pre-seed fund, accelerator, programming, and events.',
        source: 'startuphaven.com',
        url: 'https://startuphaven.com/',
      },
      {
        title: "Create33 — Seattle's Startup Hub",
        description: "Madrona Venture Labs' community space and programming hub. Strong event calendar and connection point for founders and investors in the Seattle ecosystem.",
        source: 'create33.co',
        url: 'https://create33.co/',
      },
      {
        title: 'VentureOut Startups',
        description: 'Community for Big Tech employees considering the leap. Programming and launch pad for prospective founders navigating the Amazon/Microsoft-to-founder journey.',
        source: 'ventureoutstartups.com',
        url: 'https://ventureoutstartups.com/',
      },
      {
        title: 'WTIA Founder Cohort',
        description: '6-month Washington state accelerator for venture-scale seed-stage companies. Focused on revenue milestones and investment.',
        source: 'washingtontechnology.org',
        url: 'https://www.washingtontechnology.org/startup-program/wtia-founder-cohort-program/',
      },
      {
        title: 'GeekWire',
        description: "The essential Seattle tech news source. Good for staying current on who's raising, who's hiring, and what's happening in the PNW market.",
        source: 'geekwire.com',
        url: 'https://www.geekwire.com/',
      },
    ],
  },
];
