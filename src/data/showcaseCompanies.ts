export type ShowcaseSegment = 'Early Stage Demos' | 'Recently Raised' | 'Later Stage Demos';

export interface ShowcaseCompany {
  order: number;
  name: string;
  segment: ShowcaseSegment;
  website: string;
  description: string;
  founders: string[];
  presenting: string;
  tags: string[];
}

export const SHOWCASE_COMPANIES: ShowcaseCompany[] = [
  {
    order: 1,
    name: 'Lev',
    segment: 'Early Stage Demos',
    website: 'https://getlev.co',
    description:
      'An AI co-founder for early-stage entrepreneurs — it scores your startup, gives you a prioritized to-do list, and helps you move from idea to fundraising-ready.',
    founders: ['T.A. McCann, Founder & CEO'],
    presenting: 'T.A. McCann, Founder & CEO',
    tags: ['AI', 'Founder Tools'],
  },
  {
    order: 2,
    name: 'Finpilot',
    segment: 'Early Stage Demos',
    website: 'https://finpilot.ai',
    description:
      'An AI copilot for institutional investors, fund managers, and private equity firms — automating research across SEC filings and earnings transcripts, generating reports, and running due diligence workflows.',
    founders: ['Lakshay Chauhan, Co-Founder & CEO', 'John Alberg, Co-Founder & Chairman'],
    presenting: 'Lakshay Chauhan, Co-Founder & CEO',
    tags: ['AI', 'FinTech'],
  },
  {
    order: 3,
    name: 'Neuramill',
    segment: 'Early Stage Demos',
    website: 'https://neuramill.co',
    description:
      'Physical AI for precision CNC manufacturing — encoding the tacit knowledge of expert machinists into AI for aerospace and defense.',
    founders: ['Nistha Mitra, CEO & Co-Founder', 'Nick Khormaei, COO & Co-Founder'],
    presenting: 'Nistha Mitra, CEO & Co-Founder',
    tags: ['AI', 'Manufacturing', 'Hardware'],
  },
  {
    order: 4,
    name: 'Terrabyte',
    segment: 'Early Stage Demos',
    website: 'https://terrabyte.ai',
    description:
      'The Earth Search Engine — applies foundation models to real-time satellite imagery, letting you query the physical world in plain language.',
    founders: ['Rishi Madhok, CEO & Co-Founder', 'Fuxun Yu, Co-Founder'],
    presenting: 'Rishi Madhok, CEO & Co-Founder',
    tags: ['AI', 'Geospatial'],
  },
  {
    order: 5,
    name: 'Stitcher (StitcherAI)',
    segment: 'Early Stage Demos',
    website: 'https://stitcher.ai',
    description:
      'IT/cloud finance intelligence that shows up where decisions are actually made — co-creator of the FOCUS billing standard now used by AWS, Microsoft, and Google.',
    founders: ['Udam Dewaraja, Founder & CEO'],
    presenting: 'Udam Dewaraja, Founder & CEO',
    tags: ['Cloud', 'FinOps'],
  },
  {
    order: 6,
    name: 'Actual AI',
    segment: 'Early Stage Demos',
    website: 'https://actual.ai',
    description:
      'Autonomous AI agents for engineering managers — triaging issues, generating sprint summaries, and enforcing architectural consistency.',
    founders: ['John Kennedy, Founder & CEO'],
    presenting: 'John Kennedy, Founder & CEO',
    tags: ['AI', 'DevTools'],
  },
  {
    order: 7,
    name: 'Pauling.AI',
    segment: 'Early Stage Demos',
    website: 'https://pauling.ai',
    description:
      'Automates the early steps of drug discovery — "scientist-as-a-service" that turns a 3–6 month process into days.',
    founders: ['Javier Tordable, Founder'],
    presenting: 'Javier Tordable, Founder',
    tags: ['AI', 'Biotech'],
  },
  {
    order: 8,
    name: 'Certivo',
    segment: 'Recently Raised',
    website: 'https://certivo.com',
    description:
      'The AI Evidence Engine for regulated supply chains — automates evidence collection from suppliers, validates documents against 130+ regulatory frameworks, and generates audit-ready compliance packages.',
    founders: ['Kunal Chopra, CEO & Founder'],
    presenting: 'Kunal Chopra, CEO & Founder',
    tags: ['AI', 'Compliance', 'Supply Chain'],
  },
  {
    order: 9,
    name: 'SageOx',
    segment: 'Recently Raised',
    website: 'https://sageox.ai',
    description:
      'The hivemind for human-agent teams — a shared-memory layer that keeps humans and AI agents aligned as software development goes fully agentic.',
    founders: ['Ajit Banerjee, Founder & CEO'],
    presenting: 'Ajit Banerjee, Founder & CEO',
    tags: ['AI', 'DevTools'],
  },
  {
    order: 10,
    name: 'Golden Analytics',
    segment: 'Recently Raised',
    website: 'https://goldenanalytics.com',
    description:
      'An AI-native BI platform built for data teams tired of the tradeoffs in today\u2019s tools — the depth of self-service analytics without the rigidity, the accessibility of a modern design tool, and AI that augments how analysts work rather than getting in the way.',
    founders: ['Francois Ajenstat, Founder & CEO'],
    presenting: 'Francois Ajenstat, Founder & CEO',
    tags: ['AI', 'Data & BI'],
  },
  {
    order: 11,
    name: 'Casium',
    segment: 'Recently Raised',
    website: 'https://casium.com',
    description:
      'An AI-native business immigration platform — licensed attorneys file visas (H-1B, O-1, EB-1A, green cards, 90+ countries) while AI tracks cases and compliance.',
    founders: ['Priyanka Kulkarni, Founder & CEO'],
    presenting: 'Phil Gousman, Head of Product Operations',
    tags: ['AI', 'LegalTech'],
  },
  {
    order: 12,
    name: 'Edge Delta',
    segment: 'Later Stage Demos',
    website: 'https://edgedelta.com',
    description:
      'An AI-native observability platform that processes telemetry and other signals for real-time production visibility, with "AI Teammates" that act autonomously within observability, guardrails, and rollback.',
    founders: ['Ozan Unlu, Founder & CEO', 'Fatih Yildiz, Co-Founder & CTO'],
    presenting: 'Matt Miller, Field CTO (stepping in for Ozan Unlu)',
    tags: ['AI', 'DevTools', 'Observability'],
  },
  {
    order: 13,
    name: 'Yoodli',
    segment: 'Later Stage Demos',
    website: 'https://yoodli.ai',
    description:
      'An AI-powered experiential learning platform that helps organizations build confident, prepared teams through realistic roleplay practice — used by Google, Snowflake, RingCentral, Sandler Sales, and Databricks.',
    founders: ['Varun Puri, Co-Founder & CEO', 'Esha Joshi, Co-Founder'],
    presenting: 'Jaimin Gandhi, Product Leader (stepping in for Varun Puri)',
    tags: ['AI', 'EdTech'],
  },
  {
    order: 14,
    name: 'Spangle',
    segment: 'Later Stage Demos',
    website: 'https://spangle.ai',
    description:
      'Helps retailers win AI-driven product discovery and convert more shoppers, using a proprietary "ProductGPT" model to generate personalized landing pages from real-time behavioral signals.',
    founders: ['Maju Kuruvilla, Founder & CEO', 'Fei Wang, Co-Founder'],
    presenting: 'Maju Kuruvilla, Founder & CEO',
    tags: ['AI', 'Retail / Commerce'],
  },
  {
    order: 15,
    name: 'Teal Communications',
    segment: 'Later Stage Demos',
    website: 'https://teal.io',
    description:
      'An eSIM connectivity and credentialing platform linking IoT devices to 2,000+ networks across 195 countries — the first US-based eSIM platform certified by the GSMA.',
    founders: ['Robert "Robby" Hamblet, Co-Founder & CEO', 'Michael Johnston Jr., Co-Founder & Chief Business Officer'],
    presenting: 'Robert "Robby" Hamblet, Co-Founder & CEO',
    tags: ['IoT', 'Connectivity'],
  },
];

export const SHOWCASE_SEGMENTS: ShowcaseSegment[] = [
  'Early Stage Demos',
  'Recently Raised',
  'Later Stage Demos',
];

export const SHOWCASE_TAGS = Array.from(
  new Set(SHOWCASE_COMPANIES.flatMap((c) => c.tags)),
).sort();