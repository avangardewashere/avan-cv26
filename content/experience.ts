export type Role = {
  /** Stable key for React lists and the open-row state. */
  slug: string;
  title: string;
  company: string;
  place: string;
  period: string;
  /** Shown in the collapsed row. */
  summary: string;
  bullets?: readonly string[];
  tags?: readonly string[];
  current?: boolean;
  /** Behind the "earlier roles" toggle (pre-mid-2021). No bullets or tags. */
  earlier?: boolean;
  /** A public site you can actually click. */
  link?: { label: string; href: string };
};

export const experience: readonly Role[] = [
  {
    slug: "freelance",
    title: "Freelance Full-Stack Developer",
    company: "Independent",
    place: "Remote · AU & PH clients",
    period: "Jun 2026 – Now",
    current: true,
    summary:
      "PHP and WooCommerce under real constraints: no SSH, live Stripe webhooks, paying customers.",
    bullets: [
      "Took Signal One International live on WooCommerce from shared cPanel hosting with no SSH: ~5,100 orders, 1,156 variations and a 213MB database carried across.",
      "Traced live Stripe webhook failures to a signing-secret mismatch, reconciled orders paid during the outage, and found transactional email bypassing the mail service for wp_mail.",
      "Upgraded the production stack from PHP 7 to 8, resolved Elementor and page-cache conflicts serving stale HTML, and wrote the handover notes.",
      "Rebuilt transformingcircle.com's devotional library from one long page into a card-indexed set of pages on WordPress and Jetpack VideoPress.",
    ],
    tags: ["PHP 8", "WordPress", "WooCommerce", "Stripe", "cPanel / WHM"],
    link: {
      label: "transformingcircle.com",
      href: "https://transformingcircle.com",
    },
  },
  {
    slug: "technicare",
    title: "Full-Stack Developer",
    company: "Technicare Software",
    place: "BGC, Taguig",
    period: "Jul 2025 – May 2026",
    summary:
      "Real-time lotto products in React: betting rounds, results and chat driven by WebSocket.",
    bullets: [
      "Built and maintained Pick2Win, Grand Sabado and 3D Rush on lottoplay.ph, with live WebSocket feeds for rounds, results and chat.",
      "Built a chat-moderation platform from scratch (auth, TencentChat Cloud, mute deadlines, roles, Excel export), adopted across multiple game environments.",
      "Shipped shared component packages (Free Ticket, Bullet Comments, Newbie Guide) consumed by three lotto front ends.",
      "Shipped 8+ versioned releases (v1.13–v2.5), closed 100+ bugs across responsiveness, state, animation timing and socket reliability, and coordinated UAT sign-offs with QA and backend teams.",
    ],
    tags: ["React", "WebSocket", "TencentChat Cloud", "Cocos Creator"],
    link: { label: "lottoplay.ph", href: "https://lottoplay.ph" },
  },
  {
    slug: "snsoft",
    title: "Full-Stack Developer",
    company: "SNSoft Technology",
    place: "BGC, Taguig · Contract",
    period: "Feb 2025 – Jul 2025",
    summary:
      "Moved production from Vue 2 to React, and shipped a Telegram bot on Node, Express and MongoDB with in-chat payments.",
    bullets: [
      "Migrated the production codebase from Vue 2 and vanilla HTML to React.",
      "Designed and shipped the Casino Plus Telegram bot on Node.js, Express and MongoDB: secure auto-login, in-chat payments and a real-time admin dashboard.",
      "Built mini programs for Lazada, Maya and GCash; SEO static site with Puppeteer; manual S3 deployments across UAT and production.",
    ],
    tags: ["React", "Node.js / Express", "MongoDB", "Telegram Bot API", "AWS S3"],
  },
  {
    slug: "softify",
    title: "Full-Stack Developer",
    company: "Softify",
    place: "BGC, Taguig",
    period: "May 2024 – Jan 2025",
    summary:
      "Real-money gaming inside the GCash app, coordinated directly with GCash partners.",
    bullets: [
      "Built a mobile-first gaming platform inside the GCash ecosystem and worked directly with GCash partners to unblock releases.",
      "Hardened state management and data integrity for real-money play; ran regular security and credential rotations on the main site.",
    ],
    tags: ["GCash", "State management", "Mobile web"],
  },
  {
    slug: "wbridges",
    title: "Full-Stack Developer",
    company: "WBridges Manpower",
    place: "Kawit, Cavite",
    period: "Nov 2022 – Apr 2024",
    summary:
      "Feiwin's company site and casino gaming site, plus the landing pages and app-download funnels around them.",
    bullets: [
      "Built most of feiwin.net, the company website, and deployed and hosted it.",
      "Built a responsive casino gaming site and dynamic landing pages for acquisition campaigns.",
      "Built Android and iOS download pages with conversion tracking, and ran hosting and deployment workflows on PAGODA and AWS.",
    ],
    tags: ["Landing pages", "Conversion tracking", "AWS"],
    link: { label: "feiwin.net", href: "https://feiwin.net" },
  },
  {
    slug: "expresspay",
    title: "Jr. Backend Developer",
    company: "ExpressPay",
    place: "San Juan City",
    period: "Jun 2021 – Nov 2022",
    summary:
      "Node.js services behind the legacy system in every ExpressPay branch nationwide; PayMaya and GCash integrations.",
    bullets: [
      "Developed and maintained core services for the legacy system running in every ExpressPay branch nationwide.",
      "Integrated PayMaya and GCash payments to enable cross-channel transactions.",
      "Helped build and maintain the company's WordPress franchise website, launched in late 2021.",
      "Ran monthly data archiving, system maintenance and security updates for regulatory compliance, working with cross-functional teams to keep branch downtime low.",
    ],
    tags: ["Node.js", "PayMaya", "GCash", "WordPress"],
  },
  {
    slug: "sumague",
    title: "Jr. Developer, Backend Focus",
    company: "Sumague's Firm",
    place: "Candelaria, Quezon",
    period: "Feb 2020 – Jun 2021",
    earlier: true,
    summary: "Form-driven CRUD over SQL, with the pricing logic behind it.",
  },
  {
    slug: "gleen",
    title: "WordPress Developer",
    company: "Gleen Inc.",
    place: "Lucena · Part-time",
    period: "Apr 2019 – Feb 2020",
    earlier: true,
    summary:
      "Where it started: WordPress speed and SEO, custom shortcodes and plugins, Hostinger deploys.",
  },
];

/** Roles shown immediately. */
export const recentRoles = experience.filter((r) => !r.earlier);
/** Roles behind the "earlier roles" toggle. */
export const earlierRoles = experience.filter((r) => r.earlier);

/**
 * The closed toggle's label. It names what the hidden roles were, so the
 * backend years are visible without a click; keep it true to their titles
 * (Jr. Developer, Backend Focus; WordPress Developer).
 */
export const earlierRolesLabel = "Backend & WordPress";
