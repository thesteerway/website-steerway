/**
 * V3 source of truth: geometry, section copy, ticker inventory, cinema nodes.
 * Locked homepage order:
 *   NeedleLoader -> Header -> HeroTypographicField -> ServiceTickerBridge
 *   -> CinemaSequence -> ConversionBridge -> FooterPayoff
 *
 * The S-path is extracted verbatim from the sanitized primary seal SVG; it is
 * the stroke masked out of the ivory disc (the seal's own negative space).
 * Rule: no em dashes anywhere on the site.
 */

export const MARK = {
  viewBox: "0 0 120 120",
  circle: { cx: 58, cy: 60, r: 44 },
  sPath:
    "M30,74 C46.67,78.88 57.81,73.10 63.43,56.67 C69.04,40.24 80.18,34.46 96.85,39.34",
  square: { x: 99, y: 33, size: 12 },
  center: { x: 60, y: 60 },
} as const;

/** Secondary needle geometry (from the sanitized needle SVG, 0..120 space). */
export const NEEDLE = {
  viewBox: "0 0 120 120",
  ivory: "60,20 46,96 60,80",
  champagne: "60,20 74,96 60,80",
  base: { x1: 42, y1: 105, x2: 78, y2: 105 },
} as const;

/** Cinema camera + phase config (master progress 0..1, scrubbed, no timers). */
export const TL = {
  enter: [0.0, 0.16] as const, // seal enlarges, camera passes the S-cut
  entryLine: [0.17, 0.27] as const, // journey-start line, gone before node 1
  travel: [0.24, 0.78] as const, // square rides the route
  exit: [0.78, 0.86] as const, // gentle push further in over the lit route
  finale: [0.85, 1.0] as const, // world dissolves at zoom, the title takes over
  underline: [0.93, 0.99] as const, // square rides the title underline AFTER the world is gone and the copy is in
  restZoom: 0.44, // matches the ticker seal's size: continuous handoff
  travelZoom: 4.3, // close, but wide enough that node type sits fully in frame
  payoffZoom: 5.4, // exit: keep pushing IN; the world dissolves zoomed, never shrinks
  travelerLerp: 0.15, // square inertia (tighter: nodes track the scroll)
  cameraLerp: 0.06, // camera trails the square, so the square leads
  nodeWindow: 0.082, // reveal falloff in path-t: nodes dwell longer on the journey
  focus: { x: 0.5, y: 0.52 },
} as const;

export const HERO = {
  // [HERO_HEADLINE_TBD]
  headlineA: "Systems that",
  headlineB: "steer growth.",
  // [HERO_SUBCOPY_TBD]
  subcopy:
    "The Steerway builds the operating layer behind modern growth - websites, automations, software, CRM, dashboards and infrastructure that turn demand into action and performance into something measurable.",
  // [HERO_PRIMARY_CTA_TBD]
  ctaPrimary: "Build with us",
  // [HERO_SECONDARY_CTA_TBD]
  ctaSecondary: "See what we build",
  // [HERO_SCROLL_CUE_TBD]
  scrollCue: "Scroll to steer the way",
} as const;

export const LOADER = {
  prompt: "Scroll to begin",
  label: "Calibrating direction",
} as const;

/**
 * The one whisper under every "Build with us" CTA: two fixed lines, no
 * rotation, so hover never reflows layout. "{time}" is replaced with the
 * visitor's current local time at render.
 */
export const CTA_WHISPER_TIME = "{time} is a good time to start.";
export const CTA_WHISPER_TAIL = "what are you waiting for?";

export const CINEMA = {
  entryLine: "The route between demand and growth.",
  conversion: {
    lead: "The route completes",
    titlePre: "Ready to ",
    titleWord: "steer",
    titlePost: " your system?",
    sub: "Tell us what to build, automate or measure. We will send the right next step.",
    ctaPrimary: "Build with us",
    ctaSecondary: "See our process",
  },
} as const;

export const FOOTER = {
  micro: "Build the systems that move the business.",
  ctaPrimary: "Build with us",
  ctaSecondary: "See our process",
  links: [
    "What We Build",
    "AI Automation",
    "Websites",
    "SaaS",
    "CRM and Dashboards",
    "Process",
    "Work",
    "Contact",
  ],
} as const;

/** The systems index: the sanitised, high-demand belt. The full catalogue
 *  lives on /what-we-build; this strip only carries what grabs attention. */
export const TICKER_ITEMS = [
  "AI chatbots",
  "WhatsApp AI assistants",
  "High-conversion landing pages",
  "Business websites",
  "E-commerce websites",
  "SaaS MVP development",
  "Booking systems",
  "Client portals",
  "Admin dashboards",
  "CRM and lead automation",
  "WhatsApp and email automation",
  "Lead qualification bots",
  "AI document processing",
  "Custom KPI dashboards",
  "Client reporting dashboards",
  "Technical SEO",
  "Speed and Core Web Vitals",
  "Server-side tracking",
  "Attribution dashboards",
  "Cloud and maintenance",
] as const;

export const TICKER_CUE = "Enter the route";

export interface CinemaNode {
  id: string;
  /** trigger point as path-t (square travels t: 1 -> 0) */
  t: number;
  capability: string; // Fraunces headline
  meaning: string; // supporting line
  family: string; // matching FAMILIES id on /what-we-build (anchor target)
  cta: string; // creative invite into that family's room
}

/** 8 strategic capability families, uncovered by the traveller. Data-driven:
 *  add, remove or reorder freely; t values just need to stay in (0,1).
 *  Placement is computed at runtime: every node is anchored into the ivory
 *  (light) field of the seal, never over the carved dark channel, so all
 *  node typography is dark ink. */
export const NODES: CinemaNode[] = [
  {
    id: "convert-demand",
    t: 0.92,
    capability: "Websites & Landing Pages",
    meaning: "Websites, landing pages, funnels, forms and conversion surfaces.",
    family: "websites",
    cta: "Step into the websites room",
  },
  {
    id: "build-products",
    t: 0.8,
    capability: "SaaS & Custom Software",
    meaning:
      "Portals, dashboards, booking systems, internal tools, MVPs and role-based systems.",
    family: "saas",
    cta: "Tour the software room",
  },
  {
    id: "automate-work",
    t: 0.68,
    capability: "AI Automation & Agents",
    meaning:
      "AI chatbots, assistants, document processing, proposal generation, RAG systems and workflow automation.",
    family: "ai-automation",
    cta: "Meet the agents",
  },
  {
    id: "route-leads",
    t: 0.56,
    capability: "CRM & Growth Technology",
    meaning:
      "CRM setup, lead capture, WhatsApp and email automation, attribution and campaign tracking.",
    family: "crm-growth",
    cta: "Follow a lead through",
  },
  {
    id: "technical-seo",
    t: 0.44,
    capability: "Technical SEO & Web Performance",
    meaning:
      "Site speed, schema, indexability, Core Web Vitals, redirects, architecture and programmatic SEO.",
    family: "technical-seo",
    cta: "Look under the hood",
  },
  {
    id: "measure-performance",
    t: 0.32,
    capability: "Data & Dashboards",
    meaning:
      "Sales, marketing, lead and ops dashboards, KPI reporting and business intelligence.",
    family: "data-dashboards",
    cta: "See the numbers agree",
  },
  {
    id: "keep-systems-live",
    t: 0.2,
    capability: "Cloud, DevOps & Maintenance",
    meaning:
      "Hosting, DNS, Vercel, AWS and GCP, databases, backups, security, monitoring and SLA support.",
    family: "cloud-devops",
    cta: "Check the engine room",
  },
  {
    id: "growth-infrastructure",
    t: 0.08,
    capability: "Growth Infrastructure",
    meaning:
      "The connected layer that ties demand, automation, software, tracking and reporting together.",
    family: "growth-infra",
    cta: "See the whole layer",
  },
];

export const NAV_LINKS = [
  "What We Build",
  "Process",
  "Work",
  "About",
  "Contact",
] as const;
