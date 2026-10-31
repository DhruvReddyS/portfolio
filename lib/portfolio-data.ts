/**
 * Single source of truth for every piece of portfolio content.
 * Sections render from these arrays, so copy edits happen in one place.
 */

export type Metric = { value: string; label: string };

export type LogEntry = {
  id: string;
  company: string;
  org?: string;
  role: string;
  period: string;
  year: string;
  location: string;
  status: "current" | "complete";
  /** One-line thesis, used as the entry headline. */
  headline: string;
  /** The phrase inside the headline that gets the hand-drawn mark. */
  mark?: string;
  summary: string;
  work: string[];
  metrics: Metric[];
  stack: string[];
  highlight: string;
  /** Drop a file at /assets/log/<id>.png and set it here. */
  image?: string;
  /** Shown while there is no image. */
  monogram: string;
};

export const logEntries: LogEntry[] = [
  {
    id: "simplehire",
    monogram: "SH",
    company: "SimpleHire.ai",
    org: "Task Consulting",
    role: "Full Stack Developer Intern",
    period: "Oct 2026 to now",
    year: "2026",
    location: "Remote",
    status: "current",
    headline: "Teaching a recruiter to read every résumé, not just the first ten.",
    mark: "every résumé",
    summary:
      "AI-powered recruitment and candidate screening. Résumé analysis, evaluation and ranking, candidate matching against job requirements, and campaign management, with AI interview and voice-calling integrations on top.",
    work: [
      "Résumé analysis, evaluation and ranking",
      "Candidate matching against job requirements",
      "Recruitment campaign management",
      "AI interview and voice-calling integrations",
      "Automated interview invitations",
      "Backend and frontend development",
      "Security hardening and automated testing",
      "Deployment and production-readiness testing",
    ],
    metrics: [
      { value: "3,997", label: "backend tests passing" },
      { value: "2,305", label: "frontend tests passing" },
      { value: "20", label: "screening tasks shipped" },
      { value: "4", label: "migration rehearsals" },
    ],
    stack: ["Full Stack", "Applied AI", "Testing", "Deployment"],
    highlight:
      "Reworked screening to evaluate and rank candidates across the whole applicant pool, instead of stopping at the first qualifying applicants.",
  },
  {
    id: "axon",
    monogram: "AX",
    company: "Axon Development",
    role: "Full Stack Developer Intern",
    period: "Dec 2025 to Feb 2026",
    year: "2025",
    location: "United States · Remote",
    status: "complete",
    headline: "Prototype to production, and every step in between.",
    mark: "every step",
    summary:
      "Built WestBrookHomes, a production-oriented real estate web platform, taking it from first prototypes and responsive UI design through PHP backend integration and live deployment on DreamHost.",
    work: [
      "Developed multiple website prototypes",
      "Designed responsive interfaces",
      "Implemented frontend and backend functionality",
      "Drove UI/UX improvements",
      "Integrated the PHP backend",
      "Handled deployment on DreamHost",
      "Delivered client-requested modifications",
      "Managed project milestones",
    ],
    metrics: [
      { value: "WestBrookHomes", label: "production platform" },
      { value: "Full cycle", label: "prototype → deploy" },
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "PHP", "DreamHost"],
    highlight:
      "Contributed across the full development lifecycle: initial prototypes, UI design, backend integration and live deployment.",
  },
  {
    id: "paper",
    monogram: "PF",
    company: "Paper Foundation India",
    role: "Full Stack Developer Intern · Team Lead",
    period: "Jun to Aug 2026",
    year: "2026",
    location: "India",
    status: "complete",
    headline: "Led four developers and shipped the CMS they still run on.",
    mark: "four developers",
    summary:
      "Led a four-member team building the organisation's website, an interactive Paper Journey, and a custom content management system with its own content APIs.",
    work: [
      "Led a four-member development team",
      "Developed the organisation's website",
      "Built an interactive Paper Journey",
      "Implemented a custom content management system",
      "Developed content-management APIs",
      "Built educational and interactive components",
      "Optimised SEO and loading performance",
      "Managed development through launch",
    ],
    metrics: [
      { value: "4", label: "developers led" },
      { value: "2–3s", label: "reported load time" },
      { value: "Custom CMS", label: "built and delivered" },
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    highlight:
      "Delivered both the public website and the custom CMS behind it, with reported load times of roughly 2–3 seconds.",
  },
  {
    id: "sai",
    monogram: "SE",
    company: "Sai Enterprises",
    role: "Full Stack & AI Developer Intern",
    period: "Apr to May 2026",
    year: "2026",
    location: "Hyderabad",
    status: "complete",
    headline: "Automated the busywork out of a business.",
    mark: "busywork",
    summary:
      "Built the company portfolio site, a statistical analysis tool, lead-generation automation and a customised AI chatbot, then tuned performance and SEO around them.",
    work: [
      "Developed the company portfolio website",
      "Built a statistical analysis tool",
      "Developed lead-generation automation",
      "Integrated a customised AI chatbot",
      "Improved website performance",
      "Implemented SEO improvements",
      "Automated business workflows",
    ],
    metrics: [
      { value: "~60%", label: "less manual lead handling" },
      { value: "4", label: "systems delivered" },
    ],
    stack: ["Full Stack", "AI Chatbot", "Automation", "SEO"],
    highlight:
      "Lead-generation automation reportedly cut manual lead handling by around 60%.",
  },
  {
    id: "otbi",
    monogram: "OT",
    company: "Osmania Technology Business Incubator",
    org: "OTBI",
    role: "AI Research Intern · Team Lead",
    period: "Jun 2025",
    year: "2025",
    location: "Hyderabad",
    status: "complete",
    headline: "Predicted groundwater from ten thousand field readings.",
    mark: "ten thousand",
    summary:
      "AI-based groundwater prediction and mapping, turning field data from PQWT GT500 detection equipment into interpolated, smoothed prediction maps.",
    work: [
      "Analysed groundwater data",
      "Processed more than 10,000 readings",
      "Worked with PQWT GT500 detection equipment",
      "Developed groundwater mapping and prediction methods",
      "Led a three-member research team",
    ],
    metrics: [
      { value: "~85%", label: "reported accuracy" },
      { value: "10,000+", label: "field readings analysed" },
      { value: "3", label: "researchers led" },
    ],
    stack: ["Python", "Pandas", "NumPy", "Interpolation", "Gaussian Smoothing"],
    highlight:
      "Reached roughly 85% reported prediction accuracy across 10,000+ analysed field readings.",
  },
];

export type CaseFile = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  domain: string;
  kind: string;
  /** Short line shown on the card. */
  thesis: string;
  mark?: string;
  overview: string;
  stack: string[];
  /** Grouped feature lists for the deep dive. */
  features: { title: string; items: string[] }[];
  metrics: Metric[];
  awards?: string[];
  note?: string;
  link?: { label: string; href: string };
  status?: string;
  visual: string;
  /** Drop a file at /assets/work/<id>.png and it is picked up. */
  image?: string;
};

export const caseFiles: CaseFile[] = [
  {
    id: "corpusil",
    index: "01",
    name: "Corpusil",
    tagline: "Multi-Agent Legal RAG Platform",
    domain: "Legal AI · Generative AI · RAG",
    kind: "Major academic project",
    thesis:
      "Legal answers that cite their sources, or don't get given at all.",
    mark: "cite their sources",
    overview:
      "An AI legal intelligence platform for Indian legal research, case analysis, document drafting and decision support, built on a multi-agent RAG architecture with hybrid retrieval and source verification, so reasoning stays grounded in real documents.",
    stack: [
      "Next.js",
      "React",
      "Python",
      "FastAPI",
      "LangGraph",
      "Ollama",
      "Qwen3",
      "GPT-OSS",
      "PostgreSQL",
      "Qdrant",
      "Neo4j",
      "pgvector",
      "Tauri",
    ],
    features: [
      {
        title: "Retrieval core",
        items: [
          "Multi-agent RAG architecture",
          "Hybrid legal document retrieval",
          "Legal research with citations",
          "Source verification",
        ],
      },
      {
        title: "Case workflows",
        items: [
          "Case-specific document analysis",
          "FIR and legal-document drafting",
          "Case workspaces",
          "Bail assessment",
        ],
      },
      {
        title: "Reasoning & access",
        items: [
          "Defence strategy analysis",
          "Virtual legal debate",
          "Role-based access for citizens, police, advocates and administrators",
        ],
      },
    ],
    metrics: [
      { value: "49,684", label: "indexed passages" },
      { value: "419", label: "legal PDFs in corpus V1" },
      { value: "993", label: "backend tests passing" },
    ],
    note: "Grounded legal reasoning with retrieval and verification, to cut unsupported AI-generated legal claims.",
    visual: "legal",
    image: "/assets/rag-3d.png",
  },
  {
    id: "codesync",
    index: "02",
    name: "CodeSync",
    tagline: "Unified Competitive Programming Platform",
    domain: "EdTech · Competitive Programming · Careers",
    kind: "Award-winning build",
    thesis:
      "One score that finally compares students fairly across every platform.",
    mark: "fairly",
    overview:
      "A smart-campus platform that aggregates competitive programming performance across multiple judges and normalises scores so students, classes and colleges can actually be compared, wrapped in a full learning and career suite.",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Node.js",
      "Express",
      "Firebase",
      "Vercel",
      "Render",
    ],
    features: [
      {
        title: "CP analytics",
        items: [
          "Multi-platform performance aggregation",
          "Unified scoring and normalisation",
          "Student performance dashboards",
          "Leaderboards",
          "Comparisons across branches, classes, colleges and years",
        ],
      },
      {
        title: "Learning tools",
        items: [
          "Contest calendar",
          "CodePad",
          "Learning resources hub",
          "CS.ai doubt assistant",
        ],
      },
      {
        title: "Career suite",
        items: [
          "ATS résumé analyser",
          "Résumé builder",
          "Job and internship suggestions",
        ],
      },
      {
        title: "Faculty dashboard",
        items: [
          "Student performance tracking",
          "Academic comparisons",
          "Placement-focused analytics",
        ],
      },
    ],
    metrics: [
      { value: "2×", label: "competitions won" },
      { value: "65+", label: "teams in its track" },
      { value: "600+", label: "participants at the event" },
    ],
    awards: [
      "Winner, Data Dynamo 2.0 National Hackathon",
      "Winner, MVSR Project Expo 2026",
    ],
    link: { label: "Open CodeSync", href: "https://codesync.byus4u.in/" },
    visual: "codesync",
    image: "/assets/data-dynamo-win.png",
  },
  {
    id: "trinetra",
    index: "03",
    name: "TRINETRA",
    tagline: "Offline Emergency Communication System",
    domain: "Crisis Tech · PWA · Peer-to-Peer",
    kind: "Hackathon prototype",
    thesis: "A messaging network for the moment the network dies.",
    mark: "the network dies",
    overview:
      "An offline-first emergency communication PWA that runs with no internet, no cloud and no accounts. Built for Mahindra University AEON 2026, it replaces server-based WebRTC signalling with QR codes, compressing connection data into a scannable image so two devices can pair face to face.",
    stack: [
      "JavaScript",
      "Progressive Web Apps",
      "WebRTC",
      "QR Codes",
      "Browser APIs",
      "Peer-to-peer",
    ],
    features: [
      {
        title: "Crisis feed",
        items: [
          "Offline emergency feed",
          "Expiring crisis messages",
          "SOS broadcasting",
          "Offline shelter and hazard maps",
        ],
      },
      {
        title: "Serverless mesh",
        items: [
          "QR-based message sharing",
          "WebRTC peer-to-peer messaging",
          "Mesh-relay functionality",
          "Serverless connection establishment",
        ],
      },
    ],
    metrics: [
      { value: "0", label: "servers required" },
      { value: "QR", label: "replaces signalling" },
    ],
    note: "Rebuilt from scratch after an unreliable first version. QR scan reliability, WebRTC handshake failures, offline data and mobile SOS all had to be solved a second time.",
    status: "Hackathon prototype",
    visual: "trinetra",
  },
  {
    id: "ascend",
    index: "04",
    name: "Ascend",
    tagline: "Learning Management System",
    domain: "EdTech · Full Stack",
    kind: "Product build",
    thesis: "Course structure that survives contact with real content.",
    mark: "real content",
    overview:
      "A modular LMS for organising and delivering educational content: courses, modules and topics with media handling built in, designed to stay maintainable as the catalogue grows.",
    stack: ["Flask", "MongoDB", "Cloudinary"],
    features: [
      {
        title: "Content model",
        items: [
          "Course management",
          "Module organisation",
          "Topic management",
          "Structured learning resources",
        ],
      },
      {
        title: "Delivery",
        items: [
          "Educational content workflows",
          "Media uploads and management",
          "Administrative content management",
        ],
      },
    ],
    metrics: [
      { value: "~70%", label: "fewer form errors" },
      { value: "<2s", label: "asset load time" },
    ],
    link: { label: "Open Ascend", href: "https://ascend.byus4u.in/" },
    visual: "ascend",
    image: "/assets/healthcare-3d.png",
  },
  {
    id: "hms",
    index: "05",
    name: "HMS",
    tagline: "Hospital Management System",
    domain: "Healthcare · Full Stack",
    kind: "IIT Madras BS, Data Science",
    thesis: "Three roles, one hospital, no stepping on each other.",
    mark: "no stepping on each other",
    overview:
      "A hospital management application covering administration and patient workflows, split cleanly across administrator, doctor and patient roles with database-backed operations behind each.",
    stack: ["Vue.js", "Role-based workflows", "State management", "SQL"],
    features: [
      {
        title: "Administrator",
        items: [
          "Hospital administration",
          "Doctor management",
          "Patient management",
          "Appointment oversight",
        ],
      },
      {
        title: "Doctor",
        items: [
          "Appointment management",
          "Patient information",
          "Consultation workflows",
        ],
      },
      {
        title: "Patient",
        items: [
          "Registration and login",
          "Doctor discovery",
          "Appointment booking",
          "Appointment history",
        ],
      },
    ],
    metrics: [
      { value: "3", label: "distinct role surfaces" },
      { value: "V2", label: "current iteration" },
    ],
    link: { label: "Open HMS", href: "https://hms.byus4u.in/" },
    visual: "healthcare",
  },
  {
    id: "quizmaster",
    index: "06",
    name: "QuizMaster",
    tagline: "Online Quiz Management Platform",
    domain: "EdTech · Full Stack",
    kind: "IIT Madras BS, Data Science",
    thesis: "Assessment that grades itself and tells you what it means.",
    mark: "tells you what it means",
    overview:
      "A quiz platform for administration, assessment and performance tracking: subjects, chapters, quizzes and questions on the admin side, participation and analytics on the student side.",
    stack: ["Python", "Flask", "SQLAlchemy", "SQLite", "HTML", "CSS"],
    features: [
      {
        title: "Administrator",
        items: [
          "Subject management",
          "Chapter management",
          "Quiz creation",
          "Question management",
          "User management",
        ],
      },
      {
        title: "Student",
        items: [
          "Registration and authentication",
          "Quiz participation",
          "Answer submission",
          "Score viewing",
          "Performance history",
        ],
      },
    ],
    metrics: [
      { value: "Auto", label: "quiz evaluation" },
      { value: "Full", label: "results analytics" },
    ],
    visual: "quiz",
  },
];

export type Award = {
  id: string;
  kind: string;
  title: string;
  org: string;
  place: string;
  year: string;
  headline: string;
  mark?: string;
  body: string;
  facts: string[];
  metrics: Metric[];
  image?: string;
  monogram: string;
};

export const awards: Award[] = [
  {
    id: "data-dynamo",
    monogram: "01",
    kind: "National hackathon",
    title: "Data Dynamo 2.0",
    org: "Anurag University",
    place: "First Prize · Web/App Development",
    year: "Team Error404",
    headline: "24 hours. 65+ teams in the track. One winning build.",
    mark: "One winning build",
    body: "Took first prize in Web/App Development with CodeSync, a unified competitive programming analytics and career-development platform, built inside a 24-hour national hackathon.",
    facts: [
      "24-hour national hackathon",
      "200+ teams across all tracks",
      "30+ participating colleges",
      "600+ participants",
      "~65 teams in the Web/App track",
    ],
    metrics: [
      { value: "01", label: "first prize" },
      { value: "600+", label: "participants" },
      { value: "30+", label: "colleges" },
    ],
    image: "/assets/data-dynamo-win.png",
  },
  {
    id: "astra",
    monogram: "02",
    kind: "Leadership",
    title: "President of ASTRA Tech Club",
    org: "MVSR Engineering College",
    place: "President",
    year: "25+ members",
    headline: "Twenty-five members, and a room that kept filling up.",
    mark: "their first lines",
    body: "Led the technical club: coordinating student teams, organising technical events and coding competitions, running development workshops and mentoring members, including spearheading the DEVloop web-development bootcamp.",
    facts: [
      "Led 25+ club members",
      "Organised technical events and coding competitions",
      "Ran development workshops",
      "Mentored students across the club",
    ],
    metrics: [
      { value: "25+", label: "members led" },
      { value: "President", label: "ASTRA Tech Club" },
    ],
  },
  {
    id: "devloop",
    monogram: "03",
    kind: "Community",
    title: "DEVloop Bootcamp",
    org: "ASTRA Tech Club · MVSR",
    place: "Organiser & mentor",
    year: "50+ students",
    headline: "Fifty students, one weekend, their first shipped website.",
    mark: "first shipped website",
    body: "Planned and ran a student web-development bootcamp end to end for 50+ participants: sessions, technical content, hands-on build support and event execution.",
    facts: [
      "Planned the bootcamp end to end",
      "Coordinated sessions and technical content",
      "Supported hands-on development",
      "Managed event execution",
    ],
    metrics: [
      { value: "50+", label: "students taught" },
      { value: "1", label: "bootcamp built from zero" },
    ],
  },
  {
    id: "project-expo",
    monogram: "04",
    kind: "Competition",
    title: "Project Expo 2026 Winner",
    org: "RDC-Cell (M-MARTIC) · MVSR",
    place: "Winning project: CodeSync",
    year: "2026",
    headline: "The same build won twice. This time it was judged on the engineering.",
    mark: "won twice",
    body: "Won Project Expo 2026 by presenting CodeSync to faculty and students, walking through its technical architecture, its scoring and normalisation system, and its practical use for students and institutions.",
    facts: [
      "Demonstrated the project to faculty and students",
      "Presented the technical architecture",
      "Explained the scoring and normalisation system",
      "Showcased institutional applications",
    ],
    metrics: [
      { value: "01", label: "winning project" },
      { value: "2026", label: "MVSR Project Expo" },
    ],
  },
];

export type SideQuest = {
  id: string;
  name: string;
  blurb: string;
  stack: string[];
  context: string;
};

export const sideQuests: SideQuest[] = [
  {
    id: "reconai",
    name: "ReconAI",
    blurb:
      "GST reconciliation and fraud intelligence. Graph analysis over vendor networks, with risk scores you can actually interrogate.",
    stack: ["Neo4j", "NetworkX", "FastAPI", "React", "XGBoost", "SHAP"],
    context: "HackWithAI",
  },
  {
    id: "snapfix",
    name: "SnapFix",
    blurb:
      "Civic issue resolution using multimodal AI, priority scoring, GeoHash deduplication, clustering and automated department routing.",
    stack: ["Multimodal AI", "GeoHash", "Clustering", "Routing"],
    context: "Built for SIH · submission not completed",
  },
  {
    id: "vendor-pipeline",
    name: "Vendor Verification Pipeline",
    blurb:
      "Local AI pipeline validating official websites across 26,777 vendor records, with specialist audit agents checking each other's work.",
    stack: ["Qwen3", "GPT-OSS", "Automation", "Audit agents"],
    context: "26,777 records processed",
  },
];

export type School = {
  id: string;
  school: string;
  short: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  status: string;
  /** Headline figure for the school. */
  mark: { value: string; label: string };
  highlights: string[];
  /** Drop a file at /assets/edu/<id>.png and set it here. */
  image?: string;
  monogram: string;
  certificates?: { label: string; href: string }[];
};

export const education: School[] = [
  {
    id: "mvsr",
    school: "MVSR Engineering College",
    short: "MVSR",
    degree: "B.E.",
    field: "Computer Science & Information Technology",
    period: "Ongoing",
    location: "Hyderabad",
    status: "In progress",
    monogram: "M",
    mark: { value: "9.34", label: "CGPA" },
    highlights: [
      "President of the ASTRA technical club",
      "Winner, MVSR Project Expo 2026",
      "Ran the DEVloop web development bootcamp",
    ],
  },
  {
    id: "iitm",
    school: "Indian Institute of Technology Madras",
    short: "IIT Madras",
    degree: "BS",
    field: "Data Science & Applications",
    period: "Ongoing",
    location: "Online degree",
    status: "Diploma stage",
    monogram: "IITM",
    mark: { value: "2", label: "diplomas complete" },
    highlights: [
      "Foundation stage complete",
      "Programming Diploma complete",
      "Data Science Diploma in progress",
    ],
    certificates: [
      { label: "Foundation certificate", href: "/assets/iitm-foundation-certificate.pdf" },
      { label: "Programming certificate", href: "/assets/iitm-programming-certificate.pdf" },
    ],
  },
];


/**
 * The independent studio. Everything here is taken from the studio's own site
 * at freelance.byus4u.in, so the claims are the ones it already makes.
 */
export const studio = {
  name: "ByUsForU",
  initials: "BFU",
  tagline: "Digital Experiences. Built With Intent.",
  role: "Founder & Lead Engineer",
  summary:
    "An independent digital studio building modern, purposeful websites for brands that care how they are seen. Every build is custom: clean structure, crafted layouts, no templates.",
  site: "https://freelance.byus4u.in/",
  email: "team.byusforu@gmail.com",
  logo: "/assets/byusforu-logo.png",
  marks: [
    { value: "100%", label: "custom builds" },
    { value: "24h", label: "response time" },
    { value: "1 yr", label: "support included" },
  ],
  services: [
    "Digital design & development",
    "Brand-aligned UI and UX",
    "Technical setup & deployment",
    "Launch and go-live support",
  ],
  process: [
    { step: "01", title: "Understand the brand", note: "Vision, audience and goals, clarified early." },
    { step: "02", title: "Define scope", note: "Pages, features, timelines and milestones locked in." },
    { step: "03", title: "Technical foundation", note: "Setup and structure, prepared to scale cleanly." },
    { step: "04", title: "Design & build", note: "Developed in full, tested for responsiveness and speed." },
    { step: "05", title: "Review & launch", note: "Final refinements, then it goes live." },
    { step: "06", title: "Ongoing support", note: "A full year of it, after launch." },
  ],
  clients: [
    { name: "WestBrook Homes", note: "A refined presence for a brand built on trust", status: "Delivered" },
    { name: "Zyca Café & Kitchen", note: "Lively and expressive, built on social energy", status: "Delivered" },
    { name: "Ukasa Café", note: "A calm, earthy identity built on balance", status: "Delivered" },
    { name: "Ember & Oak Café", note: "Warm and immersive, built around mood", status: "Delivered" },
    { name: "WestBrook Luxury Homes", note: "Bespoke homes, premium finishes, cost clarity", status: "In build" },
    { name: "Sai Enterprises", note: "Graphic machinery suppliers across two continents", status: "In build" },
    { name: "Axon Development", note: "Future-ready digital infrastructure", status: "In build" },
  ],
};

export const sections = [
  { id: "log", label: "The Log", act: "I", note: "where it happened" },
  { id: "work", label: "Case Files", act: "II", note: "what got built" },
  { id: "education", label: "Study", act: "III", note: "two at once" },
  { id: "stack", label: "The Stack", act: "IV", note: "what it's built with" },
  { id: "wins", label: "The Wins", act: "V", note: "what it won" },
  { id: "studio", label: "The Studio", act: "VI", note: "the one he runs" },
  { id: "contact", label: "Contact", act: "VII", note: "what's next" },
];

export const profile = {
  name: "S. Dhruv Reddy",
  full: "S. Dhruv Reddy",
  role: "Full-stack Engineer · Applied AI",
  location: "Hyderabad, India",
  coords: "17.3850° N / 78.4867° E",
  email: "dhruvreddysripathi2006@gmail.com",
  github: "https://github.com/DhruvReddyS",
  githubHandle: "@DhruvReddyS",
  linkedin: "https://www.linkedin.com/in/sripathi-dhruv-reddy",
  linkedinHandle: "in/sripathi-dhruv-reddy",
  studio: "https://freelance.byus4u.in/",
  resume: "/assets/dhruv-reddy-resume.pdf",
  portrait: "/assets/dhruv-hero.png",
  tagline: "I build systems that hold up after the demo.",
  totals: {
    internships: logEntries.length,
    projects: caseFiles.length,
    awards: awards.length,
  },
};
