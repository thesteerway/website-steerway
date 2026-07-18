/**
 * Content for the internal pages. Each page is a distinct "mapped technical
 * room" (V3 rule: internal pages must NOT feel like smaller homepages or like
 * each other):
 *   What We Build  ->  The Rooms      (blueprint, glass modules, index rail)
 *   Process        ->  The Descent    (vertical flight plan, needle rides down)
 *   Studio         ->  The Manifesto  (dark editorial room + proof reel)
 *   Contact        ->  The Console    (instrument that files your brief)
 * Never the homepage cinema. No public pricing.
 * Rule: no em dashes anywhere on the site.
 */

export interface CapabilityFamily {
  id: string;
  index: string;
  title: string;
  meaning: string;
  /** the capability as a transformation: start -> process -> landing */
  route: [string, string, string];
  services: string[];
  /** the full catalogue: every service in the family, with what it is for.
   *  This is the exhaustive inventory the /what-we-build atlas renders. */
  catalog: { name: string; use: string }[];
}

export const NAV_ROUTES = [
  { label: "What We Build", href: "/what-we-build" },
  { label: "Process", href: "/process" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
] as const;

/** Studio locale, expressed only as coordinates (no city name on the site). */
export const LOCALE = {
  coordinates: "19.0760° N, 72.8777° E",
  lat: 19.076,
  lon: 72.8777,
  email: "build@thesteerway.com",
} as const;

/* ------------------------------------------------------------------ */
/* What We Build: The Rooms                                            */
/* ------------------------------------------------------------------ */

export const WHAT_WE_BUILD = {
  eyebrow: "What we build",
  headline: "Websites, software, AI, and everything that connects them.",
  subcopy:
    "We build the websites, software, automations and infrastructure a business runs on, and we make them *work together*. Eight capabilities, every service named, every service explained. The full atlas is below.",
  ctaLead: "Not sure which one you need?",
  ctaTitle: "Send us the problem, not the spec.",
  ctaSub:
    "Tell us what should happen in your business. We will send the right next step: a capability deck, an audit or a build plan.",
} as const;

export const FAMILIES: CapabilityFamily[] = [
  {
    id: "websites",
    index: "01",
    title: "Websites & Landing Pages",
    meaning:
      "Fast, search-friendly websites and landing pages that turn visitors into enquiries and sales.",
    route: ["VISITOR", "CTA", "LEAD"],
    services: [
      "Business websites",
      "High-conversion landing pages",
      "SEO-friendly builds",
      "E-commerce and booking",
      "Portfolio and sector sites",
      "Speed and Core Web Vitals",
    ],
    catalog: [
      { name: "Business websites", use: "Your company's home on the web, built to turn visitors into enquiries" },
      { name: "High-conversion landing pages", use: "Single pages engineered around one action, for ads and campaigns" },
      { name: "E-commerce websites", use: "Product catalogues, carts and checkouts that do not leak sales" },
      { name: "Booking and appointment flows", use: "Visitors pick a slot, pay if needed, and get reminded automatically" },
      { name: "Portfolio and sector sites", use: "Healthcare, real estate, education, restaurants: sites shaped to the sector's buyers" },
      { name: "Website maintenance", use: "Updates, fixes and content changes handled for you, on call" },
      { name: "Speed and Core Web Vitals", use: "Faster loads that lift both conversion and Google ranking" },
    ],
  },
  {
    id: "saas",
    index: "02",
    title: "SaaS & Custom Software",
    meaning:
      "Custom web apps, portals and internal tools, from the first idea to a product people use every day.",
    route: ["IDEA", "ARCHITECTURE", "PRODUCT"],
    services: [
      "SaaS MVP development",
      "Admin dashboards and client portals",
      "Booking and inventory systems",
      "Marketplace MVPs",
      "Role-based systems",
      "API and payment integrations",
    ],
    catalog: [
      { name: "SaaS MVP development", use: "Your product idea taken to a working first version people can pay for" },
      { name: "Client portals", use: "A logged-in space where your customers see their own orders, files and status" },
      { name: "Admin dashboards", use: "The control room for your team: manage records, users and operations" },
      { name: "Booking and inventory systems", use: "Track slots, stock and availability without spreadsheets" },
      { name: "Internal tools and workflow software", use: "Purpose-built apps that replace manual processes your team repeats" },
      { name: "Marketplace and subscription platforms", use: "Multi-vendor listings or recurring-billing products, built to scale" },
      { name: "Role-based systems", use: "Different teams see different screens, with permissions done properly" },
      { name: "API and payment integrations", use: "Your software talking to the tools and gateways you already use" },
    ],
  },
  {
    id: "ai-automation",
    index: "03",
    title: "AI Automation & Agents",
    meaning:
      "AI assistants and automations that handle repetitive work: answering, qualifying, processing and routing, on their own.",
    route: ["INPUT", "DECISION", "OUTPUT"],
    services: [
      "AI chatbots and support bots",
      "WhatsApp AI assistants",
      "Lead qualification bots",
      "Document processing and report generation",
      "RAG knowledge systems",
      "Human-in-the-loop automation",
    ],
    catalog: [
      { name: "AI chatbots and support bots", use: "Answer customer questions on your site instantly, day and night" },
      { name: "WhatsApp AI assistants", use: "Reply to enquiries, share catalogues and book calls inside WhatsApp" },
      { name: "Lead qualification bots", use: "Ask the right questions and pass only serious buyers to your team" },
      { name: "AI document processing", use: "Invoices, forms and PDFs read and filed without human typing" },
      { name: "Report and proposal generation", use: "First drafts of recurring documents produced automatically" },
      { name: "Sales and email assistant workflows", use: "Follow-ups, summaries and replies drafted before you ask" },
      { name: "RAG knowledge systems", use: "An assistant that answers from YOUR documents, not the open internet" },
      { name: "Human-in-the-loop automation", use: "AI does the repetitive part; a person approves the judgement calls" },
    ],
  },
  {
    id: "crm-growth",
    index: "04",
    title: "CRM & Growth Technology",
    meaning:
      "The systems that capture leads, follow up automatically, and track where every sale actually comes from.",
    route: ["CAPTURE", "PIPELINE", "FOLLOW-UP"],
    services: [
      "CRM setup and integration",
      "Lead capture systems",
      "WhatsApp and email automation",
      "Meta Pixel, GTM and Conversion API",
      "Server-side tracking",
      "Attribution dashboards",
    ],
    catalog: [
      { name: "CRM setup and integration", use: "Every lead in one pipeline, with history, owners and next steps" },
      { name: "Lead capture systems", use: "Forms, calls and chats flowing into the CRM the moment they happen" },
      { name: "WhatsApp and email automation", use: "Instant follow-up sequences so no enquiry goes cold overnight" },
      { name: "Meta Pixel, GTM and GA4 setup", use: "Your ad platforms finally fed clean, complete conversion data" },
      { name: "Conversion API and server-side tracking", use: "Tracking that survives ad blockers and iOS privacy changes" },
      { name: "Call, form and event tracking", use: "Know which ad, page or keyword produced every single enquiry" },
      { name: "Attribution dashboards", use: "One screen that says which channel actually makes you money" },
    ],
  },
  {
    id: "technical-seo",
    index: "05",
    title: "Technical SEO & Web Performance",
    meaning:
      "The technical work that makes a site fast, crawlable and ranked: speed, structure, schema and indexing.",
    route: ["CRAWL", "INDEX", "RANK"],
    services: [
      "Site speed and Core Web Vitals",
      "Schema and structured data",
      "Indexability, sitemaps and robots",
      "Redirects and canonical hygiene",
      "Website architecture",
      "Programmatic SEO",
    ],
    catalog: [
      { name: "Site speed and Core Web Vitals", use: "Pass Google's speed bar; rank better and lose fewer impatient visitors" },
      { name: "Schema and structured data", use: "Rich results: stars, FAQs and prices showing directly in search" },
      { name: "Indexability, sitemaps and robots", use: "Make sure Google can find and crawl every page that matters" },
      { name: "Redirects and canonical hygiene", use: "Kill duplicate-content leaks and broken links that bleed ranking" },
      { name: "Website architecture", use: "URLs and internal links structured the way search engines reward" },
      { name: "Image and asset optimization", use: "Heavy media compressed and served right, without visible quality loss" },
      { name: "Programmatic SEO", use: "Hundreds of targeted pages generated from your data, one template" },
    ],
  },
  {
    id: "data-dashboards",
    index: "06",
    title: "Data & Dashboards",
    meaning:
      "Dashboards that pull sales, marketing, leads and operations into one screen you can actually act on.",
    route: ["DATA", "PIPELINE", "REPORTING"],
    services: [
      "Sales and marketing dashboards",
      "Lead and ops dashboards",
      "Client reporting dashboards",
      "Looker Studio builds",
      "CRM analytics",
      "Custom KPI dashboards",
    ],
    catalog: [
      { name: "Sales and marketing dashboards", use: "Revenue, pipeline and campaign performance on one live screen" },
      { name: "Lead and ops dashboards", use: "Where every lead stands and where operations are stalling, today" },
      { name: "Client reporting dashboards", use: "Reports your clients read themselves instead of asking you monthly" },
      { name: "Ad performance dashboards", use: "Spend against results across channels, without logging into five tools" },
      { name: "Looker Studio builds", use: "Google's free reporting layer wired to all your data sources" },
      { name: "CRM analytics", use: "Conversion rates, response times and deal velocity out of your CRM" },
      { name: "Custom KPI dashboards", use: "The handful of numbers your business actually runs on, agreed and automated" },
    ],
  },
  {
    id: "cloud-devops",
    index: "07",
    title: "Cloud, DevOps & Maintenance",
    meaning:
      "Hosting, security, backups and monitoring that keep everything running, plus someone to call when it does not.",
    route: ["DEPLOY", "MONITOR", "MAINTAIN"],
    services: [
      "Hosting, domain and DNS setup",
      "Vercel, AWS and GCP",
      "Database setup and backups",
      "Security basics and monitoring",
      "Bug fixes and version updates",
      "SLA support",
    ],
    catalog: [
      { name: "Hosting, domain and DNS setup", use: "Everything pointed, secured and renewing without surprises" },
      { name: "Vercel, AWS and GCP", use: "The right cloud for your size, set up so bills stay predictable" },
      { name: "Database setup and backups", use: "Your data structured properly and copied somewhere safe, always" },
      { name: "Security basics", use: "SSL, access control and the unglamorous work that prevents bad days" },
      { name: "Monitoring and alerts", use: "We know something broke before your customers tell you" },
      { name: "Bug fixes and version updates", use: "Small problems fixed while they are still small" },
      { name: "SLA support", use: "A guaranteed response time and a person to call when it matters" },
    ],
  },
  {
    id: "growth-infra",
    index: "08",
    title: "Growth Infrastructure",
    meaning:
      "The connected layer that ties your websites, automation, software and tracking into one system that works as a whole.",
    route: ["DEMAND", "SYSTEMS", "GROWTH"],
    services: [
      "Ad funnel infrastructure",
      "Landing page and form tracking",
      "Call and event tracking",
      "Email and WhatsApp infrastructure",
      "Internal knowledge assistants",
      "The operating layer as a whole",
    ],
    catalog: [
      { name: "Ad funnel infrastructure", use: "Landing pages, tracking and follow-up built as one funnel, not parts" },
      { name: "Email and WhatsApp infrastructure", use: "Deliverability, templates and sending domains set up to land in inboxes" },
      { name: "Internal knowledge assistants", use: "Your SOPs and documents made searchable and answerable for the team" },
      { name: "Cross-system integration", use: "Website, CRM, automation and reporting wired to move data on their own" },
      { name: "The operating layer as a whole", use: "All of the above as one connected system, owned by you, run by one team" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Process: The Descent                                                */
/* ------------------------------------------------------------------ */

export const PROCESS = {
  eyebrow: "How we work",
  headline: "Brief in. Proof out.",
  subcopy:
    "Five checkpoints, one straight route between them. You see *working software early* and progress every week, never a single reveal at the end.",
  stages: [
    {
      index: "01",
      title: "Diagnose",
      body: "We start with what is actually happening: where your leads come from, where they leak, and what is done by hand that should not be. No proposal before we understand the problem.",
      deliverable: "A written diagnosis and a recommended plan",
    },
    {
      index: "02",
      title: "Map",
      body: "We design the whole system on paper first: pages, automations, data flows, integrations and the numbers that will measure success. Scope is agreed here, not discovered later.",
      deliverable: "A build plan with stages and owners",
    },
    {
      index: "03",
      title: "Build",
      body: "We build in short, visible cycles. You review real screens and workflows as they are made. Copy, tracking and edge cases are built in, not bolted on at the end.",
      deliverable: "Working software, reviewed as it grows",
    },
    {
      index: "04",
      title: "Launch",
      body: "We connect everything: domains, analytics, CRM, automations and alerts, all tested against real traffic before launch day.",
      deliverable: "A live system with tracking verified",
    },
    {
      index: "05",
      title: "Measure",
      body: "After launch we track the numbers with you: what converts, what stalls and what to build next. If it is not measured, it does not count.",
      deliverable: "Reporting and a prioritised next-step list",
    },
  ],
  /** The discipline behind the five stages: the working principles, moved
   *  here from the Studio page. This is where trust is earned: right after
   *  the reader has seen HOW we work, they read WHY it holds. */
  principlesLabel: "What holds it together",
  principlesLead:
    "The five stages only work because of the rules underneath them. These are non-negotiable on every build.",
  principles: [
    {
      index: "01",
      statement: "A website that does not convert is just a brochure.",
      title: "Systems over pages",
      note: "Everything we ship connects to what happens next: CRM, automation, follow-up, reporting.",
    },
    {
      index: "02",
      statement: "If it cannot be measured, we say so before building it.",
      title: "Measured by default",
      note: "Tracking is designed with the system, never bolted on after launch as an apology.",
    },
    {
      index: "03",
      statement: "Manual work that repeats is work waiting to be removed.",
      title: "Automation over effort",
      note: "We take the input, make the decision, return the output. Your team keeps the judgement calls.",
    },
    {
      index: "04",
      statement: "The best infrastructure is the kind nobody thinks about.",
      title: "Boring reliability",
      note: "Backups, monitoring, DNS, uptime and security basics are table stakes, not line items.",
    },
    {
      index: "05",
      statement: "One connected system beats five disconnected vendors.",
      title: "One operating layer",
      note: "Websites, automation, CRM, dashboards and infrastructure, built by one team to work together.",
    },
    {
      index: "06",
      statement: "You own all of it, from day one.",
      title: "No hostages",
      note: "Code, accounts and data are yours. No lock-in, no black boxes, no surprises at handover.",
    },
  ],
  ctaLead: "Want to see this run on your business?",
  ctaTitle: "Start with a diagnosis.",
  ctaSub:
    "Tell us what should happen and what happens instead today. We will come back with a plan: an audit, a roadmap or a call.",
} as const;

/* ------------------------------------------------------------------ */
/* Studio: The Manifesto Room + The Proof                              */
/* ------------------------------------------------------------------ */

export const STUDIO = {
  eyebrow: LOCALE.coordinates,
  headline: "A systems studio, not an agency.",
  subcopy:
    "We are the team between marketing and engineering. We build the websites, software and automations that turn promises into things that *actually work*, and can be *measured*.",
  /** The Orbit: the six fields of work as satellites around one hub. Hovering
   *  a field pauses the orbit and plays its motion clip large in the centre.
   *  Each item carries a motion-graphics clip; the living vignette for the
   *  matching family covers buffering. */
  orbitLabel: "In orbit / hover a field",
  proof: [
    {
      family: "websites",
      title: "Websites that convert",
      meta: "CONVERSION SURFACES / NEXT.JS / CORE WEB VITALS",
      video: "/proof/websites.mp4",
    },
    {
      family: "saas",
      title: "Software people actually use",
      meta: "PORTALS + DASHBOARDS / ROLE-BASED / MVP TO PRODUCT",
      video: "/proof/saas.mp4",
    },
    {
      family: "ai-automation",
      title: "AI agents that answer 24/7",
      meta: "AI ASSISTANTS / WHATSAPP / RAG SYSTEMS",
      video: "/proof/ai-automation.mp4",
    },
    {
      family: "crm-growth",
      title: "CRM follow-up on autopilot",
      meta: "CRM + AUTOMATION / ATTRIBUTION / SERVER-SIDE TRACKING",
      video: "/proof/crm-growth.mp4",
    },
    {
      family: "data-dashboards",
      title: "Dashboards that agree",
      meta: "KPI DASHBOARDS / LOOKER STUDIO / BUSINESS INTELLIGENCE",
      video: "/proof/data-dashboards.mp4",
    },
    {
      family: "growth-infra",
      title: "The layer that connects it all",
      meta: "FUNNEL INFRASTRUCTURE / TRACKING / ONE OPERATING LAYER",
      video: "/proof/growth-infra.mp4",
    },
  ],
  /** The Signatures: the most-demanded builds, one full-frame card at a time.
   *  Stills are art-directed images supplied later; `still` stays empty until
   *  then and the designed placeholder frame renders in its place. */
  signaturesLabel: "The signatures",
  signaturesLead:
    "The builds we are asked for most, each one a system, not a deliverable.",
  signatures: [
    {
      id: "document-processing",
      title: "AI Document Processing",
      line: "Invoices, forms and PDFs read, structured and filed. No typing involved.",
      meta: "OCR + LLM PARSING / VALIDATION / AUTO-FILING",
      still: "/signatures/document-processing.svg",
    },
    {
      id: "technical-seo",
      title: "Technical SEO & Speed",
      line: "The quiet engineering that makes a site fast, found and ranked.",
      meta: "CORE WEB VITALS / SCHEMA / INDEXING",
      still: "/signatures/technical-seo.svg",
    },
    {
      id: "knowledge-assistant",
      title: "Internal Knowledge Assistant",
      line: "Your SOPs and documents, answering the team's questions with citations.",
      meta: "RAG / YOUR DOCUMENTS / CITED ANSWERS",
      still: "/signatures/knowledge-assistant.svg",
    },
    {
      id: "checkout-flow",
      title: "E-commerce Checkout",
      line: "Cart to paid with nothing leaking along the way.",
      meta: "CHECKOUT FLOWS / PAYMENTS / RECOVERY",
      still: "/signatures/checkout-flow.svg",
    },
    {
      id: "sla-monitoring",
      title: "Uptime & SLA Monitoring",
      line: "We see it break before your customers do. Fixed by morning.",
      meta: "MONITORING / ALERTS / SLA RESPONSE",
      still: "/signatures/sla-monitoring.svg",
    },
  ],
  ctaLead: "Sounds like your kind of team?",
  ctaTitle: "Bring us the problem.",
  ctaSub:
    "Not the spec, the problem. We will come back with a plan, build it, and show you it works. Start with a capability deck or a call.",
} as const;

/* ------------------------------------------------------------------ */
/* Contact: The Console                                                */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  eyebrow: "Answered within one working day",
  headline: "Tell us where you're headed.",
  subcopy:
    "Describe what should happen in your business: what to build, automate or measure. We reply with the *right next step*, not a sales script.",
  /** the signature sign-off engraved low on the harbour wall */
  wallType: "let's move together.",
  route: [
    { label: "Brief", note: "You describe the problem" },
    { label: "Review", note: "We map the route" },
    { label: "Next step", note: "Deck, audit, roadmap or call" },
  ],
  form: {
    name: "your name",
    email: "your email",
    company: "company (optional)",
    brief: "the brief, in your words",
    submit: "Send the brief",
  },
  /** Structured selects so nobody faces a blank form. */
  need: {
    label: "what you need most",
    placeholder: "choose a starting point",
    options: [
      "A website or landing page",
      "A web app or SaaS product",
      "AI automation or an assistant",
      "CRM and growth tracking",
      "Technical SEO and performance",
      "Dashboards and reporting",
      "Cloud, hosting and maintenance",
      "A mix, or not sure yet",
    ],
  },
  timeline: {
    label: "timeline",
    placeholder: "when should this happen",
    options: [
      "Just exploring",
      "This quarter",
      "This month",
      "As soon as possible",
    ],
  },
  budget: {
    label: "rough budget",
    min: 0,
    max: 50000,
    step: 1000,
    note: "Optional, and never binding. It just helps us scope the right first step.",
  },
  /** Rotating example briefs, cycled in the textarea so the blank never stares back. */
  examples: [
    "Leads come in from ads but nobody follows up fast enough, and our reporting is three spreadsheets.",
    "We need a booking system that texts reminders and syncs to the team calendar.",
    "Our site is slow and invisible on Google. We want it fast, and found.",
    "We want an AI assistant that answers WhatsApp enquiries and books calls on its own.",
    "Five ad channels, no idea which one actually works. We need one screen that agrees.",
    "We have an idea for an internal tool but no one to design and build it.",
  ],
  status: {
    idle: "awaiting brief...",
    typing: "brief in progress",
    ready: "ready to send",
    sent: "brief filed. expect a reply within one working day.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Contact: FAQs                                                       */
/* ------------------------------------------------------------------ */

/** Buyer questions the rest of the site does not answer. No pricing (site
 *  rule), no repeats of what the pages already cover. The first
 *  FAQ_VISIBLE render open-listed; the rest sit behind "view all". */
export const FAQ_VISIBLE = 5;
export const FAQS = [
  {
    q: "Who owns the code, accounts and data after delivery?",
    a: "You do, from day one. Repositories, hosting, domains, analytics and ad accounts are created in your name or transferred to it. If we disappeared tomorrow, everything would keep running and any competent team could pick it up.",
  },
  {
    q: "What happens after launch?",
    a: "Launch is a checkpoint, not the finish. The Measure stage follows: we track what converts and what stalls, and hand you a prioritised next-step list. If you want us to stay on, maintenance and SLA support keep the system monitored, patched and improving.",
  },
  {
    q: "How long does a build take?",
    a: "It depends on scope, and we will not pretend otherwise. A focused landing system is measured in weeks; larger software is staged so something useful ships early. You get a concrete timeline in the build plan after the diagnosis, and you see working software every week from then on.",
  },
  {
    q: "What do we need to prepare before starting?",
    a: "Just the problem, in your own words. If it exists, access to your current site, CRM or ad accounts helps the diagnosis. You do not need a spec, a brief template or a technical contact; that is what we are for.",
  },
  {
    q: "Can you work with our existing website, CRM or ad accounts?",
    a: "Yes. We diagnose what you have first, keep what works and replace only what leaks. Most engagements start on top of existing systems, not from a blank page.",
  },
  {
    q: "How do revisions and feedback work?",
    a: "You review real screens and workflows as they are built, in short cycles. Feedback goes into the next cycle, so nothing piles up for a big reveal at the end. Scope changes are agreed in the open before they happen.",
  },
  {
    q: "Who writes the content and copy?",
    a: "We draft it as part of the build, informed by what the tracking says converts. You approve everything before it ships. If you have brand voice rules, we work inside them.",
  },
  {
    q: "Do you sign NDAs, and how is our data handled?",
    a: "Yes, we sign NDAs. Your data lives in your own accounts, not ours, and is never shared or reused. Access is removed at handover unless you keep us on for support.",
  },
  {
    q: "Do you work with teams outside your timezone?",
    a: "Yes. The work is remote-first and asynchronous by default: written updates, recorded walkthroughs and scheduled overlap windows for calls. Distance has never been the bottleneck.",
  },
  {
    q: "What if we do not know exactly what we need?",
    a: "That is the normal case. Send the problem, not a spec: the diagnosis exists precisely to turn 'leads go cold' or 'reporting is three spreadsheets' into the right first build. The reply is a concrete next step, never a generic pitch.",
  },
] as const;
