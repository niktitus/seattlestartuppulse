export interface FairCompany {
  order: number;
  name: string;
  website: string;
  description: string;
  founders: string[];
  tags: string[];
}

const FAIR_COMPANIES_RAW: FairCompany[] = [
  {
    order: 1,
    name: 'AIRASecurity',
    website: 'https://airasecurity.ai',
    description:
      'Runtime security for AI agents — monitors behavior, blocks unsafe actions, and enforces policy in real time, including for MCP integrations.',
    founders: ['Mohan Kumar, Co-Founder & CEO', 'Naveen Mahavisnu, Co-Founder & CTO'],
    tags: ['Security'],
  },
  {
    order: 2,
    name: 'Ambiguous AI',
    website: 'https://ambiguous.ai',
    description:
      'Full productivity suite — Docs, Sheets, Mail, Chat, Tasks — rebuilt from the ground up for humans and AI to work as teammates.',
    founders: ['Ryan Waliany, Co-Founder & CEO', 'Philip Lee, Co-Founder & CTO', 'Dan Hsiao, Co-Founder & CPO'],
    tags: ['AI'],
  },
  {
    order: 3,
    name: 'Aria (HeyAria)',
    website: 'https://heyaria.com',
    description:
      'Automation platform for mental health group practices — shows owners where revenue is leaking, then automates the admin work causing it.',
    founders: [
      'Justin Ith, Co-Founder & CEO',
      'Michelle Arendas, Co-Founder & VP of Customer Success',
      'Ronen Reouveni, Co-Founder & Head of AI',
    ],
    tags: ['Healthcare'],
  },
  {
    order: 4,
    name: 'Atlas',
    website: 'https://atlasjoins.ai',
    description:
      'Companies of the future will be self-operating. Atlas turns your startup into one.',
    founders: ['Chandra Bhagavatula, CEO', 'Martín Ramírez, CPO'],
    tags: ['AI'],
  },
  {
    order: 5,
    name: 'Caffree',
    website: 'https://caffree.com',
    description:
      'Enzymatic decaffeination technology producing natural, great-tasting decaf coffee without chemicals.',
    founders: [
      'Eric Quick, CEO',
      'Aryeh Ganz, Chairman & Co-Founder',
      'Justin Siegel, Co-Founder & Chief Science Advisor',
      'Robby Divine, Co-Founder & Science Advisor',
    ],
    tags: ['Food & Bev', 'Biotech'],
  },
  {
    order: 7,
    name: 'Comment.io',
    website: 'https://comment.io',
    description: 'The multiplayer doc editor for people and agents.',
    founders: ['Jon Gordner, CEO', 'Max Winderbaum, CTO'],
    tags: ['AI'],
  },
  {
    order: 8,
    name: 'Desk.Us',
    website: 'https://desk.us',
    description: 'The OS for the US real estate market.',
    founders: ['Gideon Sylvan, Co-Founder & CEO'],
    tags: ['Real Estate'],
  },
  {
    order: 9,
    name: 'DevPlan',
    website: 'https://devplan.com',
    description:
      'Product intelligence layer connecting code, docs, conversations, and meetings to surface risks, project updates, and AI-powered answers.',
    founders: ['Chris Bee, Co-Founder & CEO', 'Anton Savonov, Co-Founder & CTO'],
    tags: ['DevTools'],
  },
  {
    order: 10,
    name: 'Dionysus Healthcare AI',
    website: 'https://dionysushealthcare.ai',
    description:
      'AI-powered biomarkers from standard blood work. myLuma™ is a third-trimester blood test that predicts postpartum depression risk 10 weeks before birth, before symptoms begin.',
    founders: ['Rashmi Raghavendra, CEO, Board Chair & Co-Founder'],
    tags: ['Healthcare'],
  },
  {
    order: 11,
    name: 'Empathium',
    website: 'https://empathium.ai',
    description:
      'AI simulation and assessment platform helping healthcare, education, and behavioral health organizations train people for high-stakes human interactions.',
    founders: ['Andrea Jordan, Founder & CEO'],
    tags: ['Healthcare', 'EdTech'],
  },
  {
    order: 12,
    name: 'Expanso',
    website: 'https://expanso.io',
    description:
      'Distributed-computing data infrastructure that runs compute where data is created — edge, on-prem, or cloud — instead of moving raw data to centralized clouds.',
    founders: ['David Aronchick, CEO & Co-Founder'],
    tags: ['Cloud'],
  },
  {
    order: 13,
    name: 'GateIn AI',
    website: 'https://gatein.ai',
    description:
      'Edge AI — computer vision and OCR at the gate and across the yard — automating container terminals, ports, railyards, and depots without replacing existing YMS, WMS, or TOS.',
    founders: ['Bernardo Mendez, CEO', 'Jordi Goni, COO', 'Paul Miller, CTO'],
    tags: ['IoT'],
  },
  {
    order: 14,
    name: 'Golden Analytics',
    website: 'https://goldenanalytics.com',
    description:
      'AI-native BI platform — the depth of self-service analytics without the rigidity, the accessibility of a modern design tool, and AI that augments how analysts work.',
    founders: ['Francois Ajenstat, Founder & CEO'],
    tags: ['Data & BI'],
  },
  {
    order: 15,
    name: 'GroForma',
    website: 'https://groforma.co',
    description:
      'Platform for locally led real estate development — development guidance, feasibility analysis, capital planning, and project management in one place.',
    founders: [
      'Rachel Wilka, Co-Founder & CEO',
      'Rob Britton, Co-Founder & COO',
      'Debo Aderibigbe, Co-Founder & CPO/CTO',
    ],
    tags: ['Real Estate'],
  },
  {
    order: 16,
    name: 'Haulvana',
    website: 'https://haulvana.com',
    description: 'AI-powered logistics platform connecting shippers, brokers, and carriers.',
    founders: ['Joseph Helmy, CEO', 'Farhan Azam, CTO'],
    tags: ['Supply Chain'],
  },
  {
    order: 17,
    name: 'Köniva',
    website: 'https://koniva.com',
    description: 'Voice AI tools built for hospitality.',
    founders: ['Emily Rapp, Co-Founder & CEO', 'Mikhail Kolesnik, CTO'],
    tags: ['AI'],
  },
  {
    order: 18,
    name: 'LemiLeap',
    website: 'https://lemileap.ai',
    description: 'AI-powered tools to accelerate learning and professional growth.',
    founders: ['Shamila Nadir, CEO', 'Beck Nadir, CTO'],
    tags: ['EdTech'],
  },
  {
    order: 19,
    name: 'Loopr AI',
    website: 'https://loopr.ai',
    description:
      'AI-powered Quality Intelligence System — helps manufacturers digitize inspections, automate visual quality control, and uncover systemic quality risks.',
    founders: ['Priyansha Bagaria, Founder & CEO'],
    tags: ['Manufacturing'],
  },
  {
    order: 20,
    name: 'Makko AI',
    website: 'https://makko.ai',
    description:
      'AI-powered 2D game studio — create every art asset a 2D game needs and prototype playable games by describing what you want. No art skills, no coding.',
    founders: [
      'Jeremy Bird, Co-Founder, CEO & CTO',
      'Tony Valcarcel, Co-Founder, Head of Product & Marketing',
      'Mike Fehlauer Hayes, Co-Founder, Head of Operations & Biz Dev',
    ],
    tags: ['Media & Gaming'],
  },
  {
    order: 21,
    name: 'Metrolla',
    website: 'https://metrolla.com',
    description:
      '3D lidar perception software. Tracks the way the world moves so customers gain every advantage.',
    founders: ['Adam Szablya, Founder & CTO'],
    tags: ['Geospatial', 'Robotics'],
  },
  {
    order: 22,
    name: 'ModernVivo',
    website: 'https://modernvivo.com',
    description:
      'AI platform helping pharmaceutical scientists design more reproducible preclinical experiments, faster and with more data.',
    founders: ['Ian Levine, CEO', 'Colin Small, CTO'],
    tags: ['Biotech'],
  },
  {
    order: 23,
    name: 'Optimly',
    website: 'https://optimly.ai',
    description:
      'AI Brand Reputation Platform helping B2B SaaS companies detect and fix how their brand is misrepresented by AI models like ChatGPT, Claude, and Gemini — auditing crawlability and structured data, fixing gaps via BrandVault and llms.txt generation, plus ongoing monitoring of how models describe the brand over time.',
    founders: ['Arpuva Luty, Founder'],
    tags: ['Retail / Commerce'],
  },
  {
    order: 24,
    name: 'Orbital Robotics',
    website: 'https://orbital-robots.com',
    description: 'On-orbit spacecraft robotics technology; founded by former Blue Origin engineers.',
    founders: [
      'Aaron Borger, Co-Founder & CEO',
      'Riley Mark, Co-Founder & Hardware Lead',
      'Sohil Pokharna, Co-Founder & Software Lead',
    ],
    tags: ['Robotics'],
  },
  {
    order: 25,
    name: 'Prismor',
    website: 'https://prismor.dev',
    description:
      'Control plane for AI agents. Enables enterprises to prevent agents from going rogue, with full traceability of every tool call and custom security guardrails in production.',
    founders: ['Arnav Gupta'],
    tags: ['Security'],
  },
  {
    order: 26,
    name: 'Skillsheet',
    website: 'https://skillsheet.me',
    description:
      'Event intelligence. Every event is 250 RSVPs and 10 that matter. Skillsheet finds your 10.',
    founders: ['Aniket Naravanekar, Co-Founder & CEO', 'Aditi Bendre, Co-Founder & CTO'],
    tags: ['Founder Tools'],
  },
  {
    order: 27,
    name: 'Slipstream',
    website: 'https://strongholdlabs.io',
    description:
      'Sports intelligence platform acting as an AI live sports producer — detects, processes, and distributes the best highlight moments from live sports before fans look away.',
    founders: ['Pete Schwab, Founder & CEO'],
    tags: ['Media & Gaming'],
  },
  {
    order: 28,
    name: 'Spangle',
    website: 'https://spangle.ai',
    description: 'Helps retailers win AI-driven discovery and convert more shoppers.',
    founders: ['Maju Kuruvilla, Founder & CEO'],
    tags: ['Retail / Commerce'],
  },
  {
    order: 30,
    name: 'Strum AI',
    website: 'https://strum-ai.com',
    description:
      'Supply chain decision layer — forecasts demand, manages inventory, and automates decisions using advanced models and workflow agents.',
    founders: ['Kedar Kulkarni, Founder & CEO'],
    tags: ['Supply Chain'],
  },
  {
    order: 31,
    name: 'Talus Bio',
    website: 'https://talus.bio',
    description: "Decoding and drugging the unstructured proteins that AlphaFold can't.",
    founders: ['Alex Federation, Ph.D., Co-Founder & CEO', 'Lindsay Pino, Co-Founder & CTO'],
    tags: ['Biotech'],
  },
  {
    order: 32,
    name: 'Velodex Robotics',
    website: 'https://velodex.ai',
    description: 'General purpose AI robotics for high-mix food manufacturing.',
    founders: ['Parker Owan, PhD, Co-Founder & CEO', 'Jeff Hardy, Co-Founder & President'],
    tags: ['Robotics', 'Food & Bev'],
  },
  {
    order: 33,
    name: 'Wayfinder Biosciences',
    website: 'https://wayfinderbio.com',
    description:
      'Oral medicines that stop key proteins driving cancer and neurodegeneration from being produced.',
    founders: [
      'Jason Fontana, CEO',
      'David Sparkman-Yager, CTO',
      'Chuhern Hwang, Head of Drug Discovery',
      'Rao Talasila, Head of ML',
      'Michelle Kriner, Head of Program Development',
    ],
    tags: ['Biotech'],
  },
  {
    order: 34,
    name: 'ZoneLex',
    website: 'https://zonelex.com',
    description: 'AI-powered zoning and land use intelligence platform.',
    founders: ['Trent Livingston, CEO', 'Vipin Duggal, CRO'],
    tags: ['Real Estate', 'LegalTech'],
  },
  {
    order: 35,
    name: 'SnapMatePhoto',
    website: 'https://snapmatephoto.com',
    description:
      'Event photography partner for Showbox Showcase 2026 — on-site the full day shooting event photos, with edited photos shared within 48 hours.',
    founders: ['Sky Yang, Founder & CEO'],
    tags: ['Event Services'],
  },
];

export const FAIR_COMPANIES: FairCompany[] = [...FAIR_COMPANIES_RAW]
  .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
  .map((c, i) => ({ ...c, order: i + 1 }));

export const FAIR_TAGS = Array.from(new Set(FAIR_COMPANIES.flatMap((c) => c.tags))).sort();
