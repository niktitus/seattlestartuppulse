// Seattle Room Guide data. Last checked: 2026-10-22.
// To add or edit a group, change this array; the page updates automatically.

export type Access = "open" | "apply" | "invite";
export type Area = "Seattle" | "Eastside" | "Online";
export type Persona =
  | "newcomer" | "aspiring" | "founder" | "women" | "technical" | "black" | "latino"
  | "investor" | "early" | "operator" | "student";

export interface Group {
  name: string;
  kind: string;
  runBy: string;
  forWho: string;
  mightNotFitIf?: string;
  outcome: string;
  cost: string;
  access: Access;
  when: string;
  where: string;
  area: Area;
  tags: Persona[];
  newLabel?: string;
  nikInvolved?: boolean;
  url?: string;
  links?: { label: string; url: string }[];
}

export const LAST_CHECKED = "October 22, 2026";

export const PERSONAS: { value: Persona | "all"; label: string }[] = [
  { value: "all", label: "Just browsing" },
  { value: "newcomer", label: "New to the scene" },
  { value: "aspiring", label: "Exploring an idea" },
  { value: "founder", label: "A founder" },
  { value: "women", label: "Women, non-binary or gender-expansive" },
  { value: "technical", label: "Technical / AI builder" },
  { value: "black", label: "Black founders and allies" },
  { value: "latino", label: "Latino, Latina or Latine in tech" },
  { value: "investor", label: "An investor or angel" },
  { value: "early", label: "Early in my career or switching careers" },
  { value: "operator", label: "An operator (ops, GTM, CoS)" },
  { value: "student", label: "A student" },
];

export const GROUPS: Group[] = [
  {
    name: "Rooftop",
    kind: "Women's community",
    runBy: "Lana Zumbrunn (founder; LevelUp Economy)",
    forWho: "Women in tech and emerging tech, including women learning to invest",
    mightNotFitIf: "you want a mixed-gender room; Rooftop centers women (New Tech Seattle is open to everyone)",
    outcome: "Workshops, accountability, peer meetups and a path into angel investing; Founder:Funder lunches pair raising founders with women investors",
    cost: "Cohort-based; check site",
    access: "apply",
    when: "Seattle cohort plus events",
    where: "Seattle",
    area: "Seattle",
    tags: [
      "women",
      "founder",
      "investor",
      "technical"
    ],
    url: "https://www.rooftop.global/seattle"
  },
  {
    name: "The SWELL",
    kind: "Women founders' hub",
    runBy: "Sally Revell (ex-Google, AWS); hosted at SURF Incubator",
    forWho: "Women and non-binary founders, many leaving corporate roles and bootstrapping",
    mightNotFitIf: "you mainly want pitch practice for investors (try AI House's Pitch Please or Startup Friends)",
    outcome: "Daytime workspace, peer circles, advisor hours and masterclasses; evenings left free for caregiving",
    cost: "Thursday drop-in free. Membership $100/mo on its site (press reported $200)",
    access: "open",
    when: "Thursdays 9:30 am drop-in; weekdays for members",
    where: "999 3rd Ave, Fl 7, downtown",
    area: "Seattle",
    tags: [
      "women",
      "founder",
      "aspiring",
      "newcomer"
    ],
    newLabel: "Opened Jul 2026",
    url: "https://swellincubator.com"
  },
  {
    name: "SURF Incubator",
    kind: "Coworking & founder space",
    runBy: "Seaton Gras (founded 2009)",
    forWho: "Founders at any stage, first-timers very welcome",
    mightNotFitIf: "you'd rather have a small, curated room (try Startup Friends)",
    outcome: "Weekly Startups in Action: guest speakers and optional idea sharing. You never have to present",
    cost: "Socials free; desks and offices paid",
    access: "open",
    when: "Weekly, Wednesdays",
    where: "999 3rd Ave, Fl 7, downtown",
    area: "Seattle",
    tags: [
      "founder",
      "aspiring",
      "newcomer"
    ],
    url: "https://luma.com/alvd2el6"
  },
  {
    name: "Foundations",
    kind: "Founder community & cowork",
    runBy: "Aviel Ginzburg with Tyler Brown, Ryan Dao, Art Litvinau",
    forWho: "Technical founders and builders, about 300 in the community",
    mightNotFitIf: "you don't have an intro yet. Ask a member or meet people at AI Tinkerers, which often meets here",
    outcome: "High-trust founder-to-founder help, a founder-in-residence program, and now paid build work through its new contracting service",
    cost: "No equity or fees for the community",
    access: "invite",
    when: "Daily space; private and public events",
    where: "1605 Boylston Ave, Capitol Hill (also SF)",
    area: "Seattle",
    tags: [
      "founder",
      "technical"
    ],
    url: "https://fndtns.org"
  },
  {
    name: "AI House",
    kind: "AI hub & incubator",
    runBy: "AI House team (formerly AI2 Incubator): Yifan Zhang and Colker (managing directors); community by Taylor Soper",
    forWho: "AI builders, founders, researchers, operators and investors",
    mightNotFitIf: "you're an investor or banker hoping to join Pitch Please, which is founder-only; the other events welcome you",
    outcome: "Pitch Please feedback sessions, Founder Showcases, drop-in cowork days with demos and lunch, Resident Experts group",
    cost: "Most events free",
    access: "apply",
    when: "Several events a week; Pitch Please monthly",
    where: "Pier 70, 2801 Alaskan Way",
    area: "Seattle",
    tags: [
      "technical",
      "founder",
      "investor",
      "student",
      "operator",
      "newcomer"
    ],
    url: "https://ai2incubator.com/ai-house"
  },
  {
    name: "AI Tinkerers Seattle",
    kind: "Builder meetup",
    runBy: "Joe Heitzeberg and organizer team",
    forWho: "People building with AI: engineers, ML practitioners, technical founders",
    mightNotFitIf: "you're not building with AI yet (AI House cowork days are a gentler start)",
    outcome: "Live code demos, a science-fair floor, technical Q&A. Tracks for dev tools, GTM engineering and a Women in AI builders track",
    cost: "Free",
    access: "apply",
    when: "Monthly-ish, 6–9 pm",
    where: "Often at Foundations, Capitol Hill",
    area: "Seattle",
    tags: [
      "technical",
      "women"
    ],
    url: "https://seattle.aitinkerers.org"
  },
  {
    name: "Founder Institute Seattle",
    kind: "Pre-seed accelerator",
    runBy: "Volunteer leadership team (Nik is Operations Lead)",
    forWho: "Idea- and pre-seed founders, especially first-timers",
    mightNotFitIf: "your team is past seed (Alliance of Angels or Plug and Play fit better)",
    outcome: "Free virtual mini-workshops on paths, GTM and founder basics; structured accelerator with partner pitch slots",
    cost: "Workshops free; accelerator has a fee",
    access: "apply",
    when: "Workshop series through the year",
    where: "Virtual and in person",
    area: "Online",
    tags: [
      "aspiring",
      "founder"
    ],
    nikInvolved: true,
    url: "https://fi.co"
  },
  {
    name: "Startup425",
    kind: "City-backed accelerator",
    runBy: "Cities of Bellevue, Kirkland, Issaquah, Redmond, Renton, Bothell",
    forWho: "Eastside small-business owners and early tech founders",
    mightNotFitIf: "you're based in Seattle proper; the city-backed programs serve Eastside cities (try SURF or FI Seattle)",
    outcome: "14-week cohort accelerator, an AI intensive, and the annual Eastside Summit with policymakers",
    cost: "Free",
    access: "apply",
    when: "Cohorts; summit during Tech Week",
    where: "Bellevue City Hall and partner cities",
    area: "Eastside",
    tags: [
      "aspiring",
      "founder"
    ],
    url: "https://startup425.org"
  },
  {
    name: "Startup Friends",
    kind: "Founder meetup chapters",
    runBy: "Venture Mechanics; volunteer chapter leads",
    forWho: "Aspiring and early founders aiming for venture scale",
    mightNotFitIf: "you're there to sell services; vendors can join as sponsors",
    outcome: "Small-group feedback on your idea before you commit, with serial founders dropping in",
    cost: "Free",
    access: "open",
    when: "Bellevue: 1st Thursday, 5–7 pm",
    where: "Bellevue and Fremont chapters",
    area: "Eastside",
    tags: [
      "aspiring",
      "founder",
      "newcomer"
    ],
    url: "https://lu.ma/7jrqg1yy"
  },
  {
    name: "Startup Haven",
    kind: "Members network",
    runBy: "Bob Crimmins (founder)",
    forWho: "Venture-scale founders, C-level execs and investors",
    mightNotFitIf: "you want to pitch. Breakfasts are conversation only, and guests come by intro (membership@startuphaven.com)",
    outcome: "Monthly founders dinner, poker night, Venture Breakfast, plus investor matching and office hours",
    cost: "Free membership by application",
    access: "invite",
    when: "Monthly",
    where: "Seattle (address on approval)",
    area: "Seattle",
    tags: [
      "founder",
      "investor"
    ],
    url: "https://startuphaven.com"
  },
  {
    name: "Venture Black",
    kind: "Nonprofit founder & investor network",
    runBy: "Evan Poncelet (executive director; Dreamward Ventures)",
    forWho: "Black and ally founders, investors and service providers",
    mightNotFitIf: "you're building a small business rather than a venture-scale one (Startup425 serves both)",
    outcome: "Investor speed-dating, an Angel Investor Accelerator and year-round programming; about 1,500 people reached a year",
    cost: "Check each event",
    access: "open",
    when: "Year-round; newsletter",
    where: "Seattle region",
    area: "Seattle",
    tags: [
      "black",
      "founder",
      "investor"
    ],
    url: "https://venture-black.org"
  },
  {
    name: "SEA619",
    kind: "Black founders' pathway",
    runBy: "Arif Gürsel; powered by PACE",
    forWho: "Black founders of AI-native startups and creator-owned brands",
    mightNotFitIf: "you're already ready for a standard equity accelerator (Plug and Play may fit)",
    outcome: "Structured mentorship and VC-readiness before giving up equity",
    cost: "Nonprofit program",
    access: "apply",
    when: "Cohort from Oct 2025",
    where: "Seattle",
    area: "Seattle",
    tags: [
      "black",
      "founder",
      "aspiring"
    ],
    url: "https://www.geekwire.com/2025/we-lift-as-we-climb-seattle-nonprofit-sea619-offers-a-new-pathway-for-black-startup-founders/"
  },
  {
    name: "Latino Founders",
    kind: "Nonprofit accelerator",
    runBy: "Latino Founders, co-hosting with ALPFA Seattle and SOMOS.tech",
    forWho: "Latino, Latina and Latine entrepreneurs scaling a business",
    outcome: "Pitch Latino, an accelerator, capital access and mentors",
    cost: "Free events",
    access: "apply",
    when: "Programs plus Tech Week panel",
    where: "Seattle and Bellevue",
    area: "Eastside",
    tags: [
      "latino",
      "founder"
    ],
    url: "https://luma.com/8o1la5w1"
  },
  {
    name: "Latinas in Tech Seattle",
    kind: "Professional chapter",
    runBy: "Local chapter leaders",
    forWho: "Latinas working in tech",
    outcome: "Peer networking, career conversations and community events",
    cost: "Free",
    access: "open",
    when: "Periodic",
    where: "Seattle",
    area: "Seattle",
    tags: [
      "latino",
      "women",
      "early"
    ],
    url: "https://latinasintech.org/chapter/seattle"
  },
  {
    name: "Plug and Play Seattle",
    kind: "Corporate accelerator",
    runBy: "Jack Callaghan (director); with UW CoMotion and SNBL",
    forWho: "Startups seeking corporate partners and a 12-week program",
    mightNotFitIf: "you're still at the idea stage (start with Startup Friends or FI workshops)",
    outcome: "Accelerator cohort, free Everett office space, corporate intros; public run clubs and expo days",
    cost: "Program by selection",
    access: "apply",
    when: "Cohorts; social events",
    where: "UW and Everett",
    area: "Seattle",
    tags: [
      "founder",
      "investor"
    ],
    url: "https://luma.com/dj6f33ya"
  },
  {
    name: "Buerk Center for Entrepreneurship",
    kind: "UW entrepreneurship hub",
    runBy: "UW Foster School of Business",
    forWho: "UW students from any major who are curious about starting something",
    mightNotFitIf: "you have no UW connection; start with its Dempsey competition, which takes students from across the region",
    outcome: "Courses, startup competitions, a startup career and internship fair, and an events calendar on Luma",
    cost: "No tuition for the co-curricular programs",
    access: "open",
    when: "Academic year",
    where: "Founders Hall, UW campus",
    area: "Seattle",
    tags: [
      "student",
      "aspiring",
      "founder",
      "early"
    ],
    url: "https://foster.uw.edu/centers/buerk-ctr-entrepreneurship/"
  },
  {
    name: "Dempsey Startup Competition",
    kind: "Student startup competition",
    runBy: "UW Buerk Center; program manager Yuko Oaku",
    forWho: "Student teams at any accredited college in Washington, Oregon, Idaho, British Columbia or Alaska, not just UW",
    mightNotFitIf: "your team has no current student, or earns more than $250k a year",
    outcome: "Judge feedback across five rounds, a coaching round, and prize money; the 2026 grand prize was $25,000. The final round is open to the public",
    cost: "No entry fee listed",
    access: "apply",
    when: "Applications open late Feb; 2027 summary due Apr 5; finals May 27",
    where: "UW campus",
    area: "Seattle",
    tags: [
      "student",
      "aspiring",
      "founder"
    ],
    url: "https://foster.uw.edu/centers/buerk-ctr-entrepreneurship/entrepreneurship-competitions/dempsey-startup-competition"
  },
  {
    name: "Buerk Accelerator",
    kind: "Student founder accelerator",
    runBy: "UW Buerk Center",
    forWho: "Washington-based teams led by students or recent grads (summer 2024 or later), working full-time on the company",
    mightNotFitIf: "you're still exploring an idea part-time (try WE Lead or Dempsey first)",
    outcome: "Six months with a 4–5 mentor committee, milestone coaching, coworking at Startup Hall, AWS credits, up to $1,000 for expenses, and a Demo Day",
    cost: "Takes no equity; seed funding was paused for the 2025 cohort",
    access: "apply",
    when: "About July/Aug through Jan; 2026–27 interest list open",
    where: "Startup Hall, U District",
    area: "Seattle",
    tags: [
      "student",
      "founder",
      "early"
    ],
    url: "https://foster.uw.edu/centers/buerk-ctr-entrepreneurship/buerk-accelerator-program/"
  },
  {
    name: "WE Lead",
    kind: "Women's entrepreneurial leadership",
    runBy: "UW Buerk Center; program manager Winona Kantamaneni, with a student board",
    forWho: "UW students of any major centering women and non-binary experiences; students of every gender are welcome",
    mightNotFitIf: "you're not a current UW student; mentors come from the community, so offer to mentor instead",
    outcome: "A 12-week mentoring program with women leaders, quarterly workshops, panels, an allyship series and Women's Entrepreneurship Day",
    cost: "No fees listed",
    access: "open",
    when: "Quarterly through the academic year",
    where: "UW campus",
    area: "Seattle",
    tags: [
      "student",
      "women",
      "aspiring"
    ],
    url: "https://foster.uw.edu/centers/buerk-ctr-entrepreneurship/womens-entrepreneurial-leadership-program/"
  },
  {
    name: "Lavin Entrepreneurship Program",
    kind: "Multi-year undergrad program",
    runBy: "UW Buerk Center",
    forWho: "UW undergraduates of any major with at least three years left, including incoming first-years",
    mightNotFitIf: "you want a casual club; it's a signed multi-year commitment",
    outcome: "Three to four years of mentoring, paid startup internships with a matching scholarship, competitions, and trips to Seattle startups and investors",
    cost: "No fee listed; ask the Buerk Center",
    access: "apply",
    when: "Applies each fall; the 2026–27 deadline was Oct 11",
    where: "UW campus",
    area: "Seattle",
    tags: [
      "student",
      "aspiring",
      "early"
    ],
    url: "https://foster.uw.edu/centers/buerk-ctr-entrepreneurship/undergraduate-entrepreneurship/lavin-entrepreneurship-program/"
  },
  {
    name: "CoMotion Labs Climate Tech Incubator",
    kind: "Climate incubator",
    runBy: "UW CoMotion, with the City of Seattle, 9Zero and VertueLab",
    forWho: "Pre-seed to seed climate startups with a product ready to pilot. No UW affiliation required",
    mightNotFitIf: "you're still at the idea stage",
    outcome: "A commercialization curriculum, mentors, UW lab access, a downtown office, and a Demo Day with investors and corporate partners. The 2027 cohort focuses on data centers, with Microsoft and E8",
    cost: "No fee listed",
    access: "apply",
    when: "Apply by Nov 15, 2026; kickoff Feb 4, 2027",
    where: "Seattle Climate Innovation Hub, downtown",
    area: "Seattle",
    tags: [
      "founder",
      "technical"
    ],
    newLabel: "Apply by Nov 15",
    url: "https://comotion.uw.edu/?p=22652"
  },
  {
    name: "AGENT",
    kind: "Grad student startup club",
    runBy: "Student leadership in UW CSE",
    forWho: "UW computer science graduate students, especially PhD students, thinking about startups",
    mightNotFitIf: "you're outside UW CSE grad programs",
    outcome: "Startup events and workshops, mentoring from founders and VCs, and a peer group of grad-student founders",
    cost: "Free",
    access: "apply",
    when: "Through the academic year",
    where: "Allen School, UW campus",
    area: "Seattle",
    tags: [
      "student",
      "technical",
      "aspiring"
    ],
    url: "https://agent.cs.washington.edu/"
  },
  {
    name: "DubHacks",
    kind: "Student hackathon",
    runBy: "DubHacks organizers at UW",
    forWho: "Students who want to build something over a weekend with a team",
    outcome: "A weekend of building with teammates, billed as the Pacific Northwest's largest hackathon",
    cost: "Free",
    access: "apply",
    when: "Annually in October; 2026 ran Oct 17–18",
    where: "HUB North Ballroom, UW campus",
    area: "Seattle",
    tags: [
      "student",
      "technical",
      "early"
    ],
    url: "https://www.dubhacks.co"
  },
  {
    name: "Alliance of Angels",
    kind: "Angel group",
    runBy: "Angie Parker (executive director)",
    forWho: "Founders raising seed; accredited investors who want to learn",
    mightNotFitIf: "you're still pre-product (Seattle Angel Conference and FI workshops come earlier)",
    outcome: "A shot at a funding round from the region's largest angel group, active since 1997",
    cost: "Angel membership; founder application on its site",
    access: "apply",
    when: "Check site for pitch dates",
    where: "Seattle",
    area: "Seattle",
    tags: [
      "investor",
      "founder"
    ],
    url: "https://www.geekwire.com/2025/new-head-of-alliance-of-angels-excited-to-hit-refresh-on-longtime-startup-investment-group/"
  },
  {
    name: "Seattle Angel Conference",
    kind: "Angel education program",
    runBy: "Founded by John Sechrest; run with Mossy Ventures",
    forWho: "New angels learning by doing; pre-seed founders pitching",
    mightNotFitIf: "you're raising a later-stage round",
    outcome: "A cohort that pools money and invests in one winner",
    cost: "Investor buy-in per cohort",
    access: "apply",
    when: "Cohort-based",
    where: "Seattle",
    area: "Seattle",
    tags: [
      "investor",
      "founder"
    ],
    url: "https://www.builtinseattle.com/articles/seattle-angel-investors"
  },
  {
    name: "New Tech Seattle",
    kind: "Monthly meetup",
    runBy: "New Tech Northwest",
    forWho: "Everyone: developers, founders, job seekers, recruiters, career changers and people new to town",
    mightNotFitIf: "you want a small, quiet room; it's a big, lively crowd",
    outcome: "Community shoutouts, short presentations, an afterparty. The best first stop for someone new",
    cost: "About $20",
    access: "open",
    when: "Monthly, evenings",
    where: "The Collective, South Lake Union",
    area: "Seattle",
    tags: [
      "aspiring",
      "early",
      "operator",
      "founder",
      "newcomer"
    ],
    url: "https://luma.com/kdsplr2m"
  },
  {
    name: "YoungTech Seattle",
    kind: "Early-career community",
    runBy: "Jake (founder) with a volunteer team",
    forWho: "The next wave of founders, VCs and tech workers, 600+ members",
    outcome: "Fireside chats, coffee chats, run clubs and a newsletter with jobs and startup perks",
    cost: "Free",
    access: "open",
    when: "Several events a month",
    where: "Seattle",
    area: "Seattle",
    tags: [
      "early",
      "founder",
      "investor",
      "newcomer"
    ],
    url: "https://youngtech.super.site"
  },
  {
    name: "Seattle Tech Week",
    kind: "Citywide week",
    runBy: "Madrona Venture Group, with hundreds of community hosts",
    forWho: "Anyone curious about Seattle tech, whatever your role or background",
    outcome: "Many events in five days. The easiest way to sample groups before committing to one",
    cost: "Mostly free",
    access: "open",
    when: "Annually; 2026 ran Jul 27–31",
    where: "Citywide",
    area: "Seattle",
    tags: [
      "founder",
      "investor",
      "technical",
      "early",
      "operator",
      "women",
      "black",
      "latino",
      "aspiring",
      "newcomer"
    ],
    url: "https://www.seattletechweek.com"
  },
  {
    name: "Seattle Women's Network",
    kind: "Women's business network",
    runBy: "Gurneet Chaabra (founded 2022)",
    forWho: "Women business owners and women-owned brands",
    mightNotFitIf: "you want a venture-scale tech focus (try Rooftop or The SWELL)",
    outcome: "Socials, panels, workshops and vendor pop-ups that showcase members",
    cost: "Varies by event",
    access: "open",
    when: "Regular",
    where: "Greater Seattle",
    area: "Seattle",
    tags: [
      "women",
      "founder",
      "operator"
    ],
    url: "https://ocr.seattle.gov/celebrating-women-owned-businesses-and-non-profits-in-seattle-for-international-womens-month/"
  },
  {
    name: "CEO Society",
    kind: "Women founders' group",
    runBy: "CEO Society chapter leads",
    forWho: "Women founders focused on growth, 100+ across Seattle and Tacoma",
    outcome: "Monthly workshop and networking",
    cost: "Membership",
    access: "apply",
    when: "Monthly",
    where: "Mercer Island",
    area: "Eastside",
    tags: [
      "women",
      "founder"
    ],
    url: "https://www.eventbrite.com/e/1983118075548/"
  },
  {
    name: "Ada Developers Academy",
    kind: "Tuition-free coding school",
    runBy: "Ada Developers Academy",
    forWho: "Women and gender-expansive adults moving into software",
    outcome: "A full developer program plus open community events and graduations at AI House",
    cost: "Tuition-free",
    access: "apply",
    when: "Cohorts; community events",
    where: "AI House, Pier 70",
    area: "Seattle",
    tags: [
      "women",
      "early",
      "technical",
      "student"
    ],
    url: "https://adadevelopersacademy.org"
  },
  {
    name: "Bili House",
    kind: "Hacker house",
    runBy: "Shawn Yang, Sylviane Zhao, Tehani Cabour, Jatin Kumar",
    forWho: "Early-stage founders who want to live and build together on the Eastside",
    outcome: "Live-in community plus events to jump-start Bellevue's early scene",
    cost: "Residency fee",
    access: "apply",
    when: "Ongoing",
    where: "Bellevue",
    area: "Eastside",
    tags: [
      "early",
      "founder",
      "technical"
    ],
    newLabel: "Launched Feb 2026",
    url: "https://www.geekwire.com/2026/new-hacker-house-in-seattle-area-brings-startup-founders-together-under-one-creative-roof/"
  },
  {
    name: "Pretty Operational",
    kind: "Women operators' community",
    runBy: "Nik Titus",
    forWho: "Women in operations roles",
    outcome: "Peers who do the same job, in a city with few rooms for operators",
    cost: "Free",
    access: "open",
    when: "Ongoing",
    where: "Seattle",
    area: "Seattle",
    tags: [
      "operator",
      "women"
    ],
    nikInvolved: true,
    links: [
      { label: "Connect with Nicole on LinkedIn", url: "https://www.linkedin.com/in/niktitus" },
      { label: "Visit prettyoperational.com", url: "https://www.prettyoperational.com/" }
    ]
  }
];

export const GAPS: { title: string; body: string; emphasis: string }[] = [
  { title: "Some rooms have hidden doors", body: "Foundations, Startup Haven and Plug and Play run on intros or membership, and AI House and AI Tinkerers approve RSVPs. A published \"here's how to join us\" line per group would open most of them.", emphasis: "People new to the scene can't see the path in." },
  { title: "Operators have almost nowhere to go", body: "Rooms are built for technical founders, investors, or women founders, even though operators are who startups hire next.", emphasis: "Chiefs of staff, ops, GTM and early hires rarely get a room of their own." },
  { title: "Evening-only schedules leave people out", body: "Nearly everything runs 5–9 pm, which is hard for caregivers, shift workers and long commutes. The SWELL's daytime schedule is the exception.", emphasis: "Daytime, lunch and virtual formats are wide open." },
  { title: "Accessibility details are missing", body: "Few listings say whether a venue is step-free, whether talks are captioned, or whether cost help exists.", emphasis: "Hosts who publish this make the room usable for far more people." },
  { title: "Outcomes go unstated", body: "Few groups say what you'll walk away with. The ones that do (AI Tinkerers' \"demos, not decks\", the SWELL's \"no pitch, no prep\") are the easiest to choose.", emphasis: "Ask every host for one sentence." },
  { title: "UW opens more doors than it advertises", body: "The Dempsey competition takes students from any college in the Pacific Northwest, and CoMotion's climate incubator needs no UW tie.", emphasis: "Most people outside campus assume UW is closed to them." },
  { title: "Seattle and the Eastside rarely mix", body: "Startup425, Startup Friends Bellevue and Bili House run their own circuit.", emphasis: "Shared calendars and cross-river co-hosting would double both audiences." },
  { title: "Community-led groups carry the bridge work", body: "Venture Black, SEA619, Latino Founders and Rooftop do welcoming and onboarding the big hubs skip, and their co-hosted Tech Week events drew strong turnout.", emphasis: "Pair them with venues, not just sponsorships." },
];

export const VENUES: { venue: string; neighborhood: string; goodFor: string; howToAsk: string }[] = [
  { venue: "AI House, Pier 70", neighborhood: "Waterfront", goodFor: "AI-adjacent events up to large groups; daytime cowork days", howToAsk: "Email events@aihouse.vc" },
  { venue: "SURF Incubator", neighborhood: "Downtown, 999 3rd Ave Fl 7", goodFor: "Weekly founder socials, workshops, drop-ins", howToAsk: "Through SURF's founder, Seaton Gras" },
  { venue: "The Collective", neighborhood: "South Lake Union", goodFor: "Evening meetups around 100+ people", howToAsk: "Venue booking (New Tech NW's monthly home)" },
  { venue: "Venture Mechanics", neighborhood: "Bellevue", goodFor: "Small founder circles, expos", howToAsk: "Startup Friends chapter leads, via Discord" },
  { venue: "Bellevue City Hall", neighborhood: "Bellevue", goodFor: "Free civic-backed panels and socials", howToAsk: "Through Startup425" },
  { venue: "Seattle Climate Innovation Hub", neighborhood: "Downtown", goodFor: "Climate-focused gatherings", howToAsk: "Through 9Zero or UW CoMotion" },
];
