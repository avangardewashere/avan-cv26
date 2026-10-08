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
      "Took Signal One International live on WooCommerce on shared cPanel hosting with no SSH, carrying across ~5,100 orders, 1,156 variations and a 213MB database without losing an order.",
      "Traced live Stripe webhook failures to a signing-secret mismatch and reconciled the orders paid during the outage, then debugged a second third-party integration: transactional email bypassing the mail service for wp_mail.",
      "Ran pre-launch QA across checkout, tax and search, surfacing GST calculated without shipping, a missing Australian Terms and Conditions page and SKU prefix collisions in search.",
      "Upgraded the production stack from PHP 7 to 8, resolved Elementor and page-cache conflicts serving stale HTML, and wrote handover documentation for the client's team, including the correct cache-clear sequence.",
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
      "Real-time lotto products in React and TypeScript, plus a chat-moderation platform built from scratch.",
    bullets: [
      "Built and maintained Pick2Win, Grand Sabado and 3D Rush on lottoplay.ph in React and TypeScript, with REST APIs and live WebSocket feeds for rounds, results and chat.",
      "Built a chat-moderation platform from scratch (auth, roles, Tencent Cloud Chat, mute deadlines, Excel export), adopted across multiple game environments.",
      "Shipped shared, reusable component packages (Free Ticket, Bullet Comments, Newbie Guide) consumed by three lotto front ends, cutting duplicated code across products.",
      "Shipped 8+ versioned releases (v1.13–v2.5) in Agile sprints with code review, fixing 100+ bugs across responsiveness, state, animation timing and socket reliability.",
      "Ran self-testing and coordinated UAT sign-offs with QA and backend teams, and wrote project documentation and bilingual English and Tagalog game rules for five titles.",
    ],
    tags: [
      "React",
      "TypeScript",
      "WebSocket",
      "REST APIs",
      "Tencent Cloud Chat",
      "Cocos Creator",
    ],
    link: { label: "lottoplay.ph", href: "https://lottoplay.ph" },
  },
  {
    // One company: Softify rebranded as SNSoft Technology in early 2025.
    slug: "snsoft",
    title: "Full-Stack Developer",
    company: "SNSoft Technology (formerly Softify)",
    place: "BGC, Taguig",
    period: "May 2024 – Jul 2025",
    summary:
      "Real-money gaming in the GCash app, a Vue 2 to React migration, a Telegram bot with in-chat payments, and the in-house project system on ServiceNow.",
    bullets: [
      "Built a mobile-first, real-money gaming platform inside the GCash ecosystem, optimized its state management and enforced data integrity, and coordinated directly with GCash partners to unblock releases.",
      "Migrated the production codebase from Vue 2 and vanilla HTML to React, improving performance and scalability.",
      "Designed and shipped the Casino Plus Telegram bot on Node.js, Express and MongoDB: auto-login with Telegram Login Widget token verification, in-chat payments and a real-time admin dashboard backed by REST APIs.",
      "Built mini programs for Lazada, Maya and GCash, and an SEO static site with Puppeteer; ran manual AWS S3 deployments across UAT and production.",
      "Helped manage the in-house project system on ServiceNow through the rename to SNSoft: Business Rules and Script Includes in JavaScript, and the forms, tables and fields that capture its data.",
      "Built and maintained service-request workflows (requests, request items and tasks) and their automation; configured UI Policies, UI Actions and Client Scripts, and the Service Catalog and Service Portal.",
    ],
    tags: [
      "React",
      "TypeScript",
      "Node.js / Express",
      "MongoDB",
      "GraphQL",
      "GCash",
      "ServiceNow",
      "AWS S3",
    ],
  },
  {
    slug: "wbridges",
    // Front-End Developer, the title held: the work here was front end, mostly Next.js.
    title: "Front-End Developer",
    company: "WBridges Manpower",
    place: "Kawit, Cavite",
    period: "Nov 2022 – Apr 2024",
    summary:
      "Next.js front ends for a casino gaming site and its landing and app-download pages, plus Feiwin's company site.",
    bullets: [
      "Built most of feiwin.net, the company website, and deployed and hosted it.",
      "Built a responsive, performance-focused casino gaming site and dynamic landing pages for acquisition campaigns in Next.js, on GraphQL APIs.",
      "Built Android and iOS download pages in Next.js with conversion tracking, and ran hosting and deployment workflows on PAGODA and AWS.",
    ],
    tags: ["Next.js", "GraphQL", "Landing pages", "Conversion tracking", "AWS"],
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
      "Developed and maintained core Node.js services, with REST and GraphQL APIs, for the legacy system running in every ExpressPay branch nationwide.",
      "Integrated the PayMaya and GCash payment APIs to enable cross-channel transactions.",
      "Helped build and maintain the company's WordPress franchise website, launched in late 2021.",
      "Ran monthly data archiving, system maintenance and security updates for regulatory compliance, working with cross-functional teams to keep branch downtime low.",
    ],
    tags: ["Node.js", "REST APIs", "GraphQL", "PayMaya", "GCash", "WordPress"],
  },
  {
    // Two employers, one row: the start of the career, both in Quezon
    // province. Each bullet names its employer, title and dates, so nothing
    // is attributed to the wrong one.
    slug: "early",
    // Not a title held: the real titles and dates are in the bullets.
    title: "Early career",
    company: "Sumague's Firm, Gleen Inc.",
    place: "Candelaria and Lucena, Quezon",
    period: "Apr 2019 – Jun 2021",
    summary:
      "Where it started: WordPress, then backend work in C, C++ and SQL, with IT support between coding tasks at both.",
    bullets: [
      "Sumague's Firm, Jr. Developer, Backend Focus (Feb 2020 – Jun 2021): backend code in C and C++, and form-driven CRUD over SQL with the pricing logic behind it.",
      "Gleen Inc., WordPress Developer, part-time (Apr 2019 – Feb 2020): optimized WordPress site speed and SEO, built custom shortcodes and plugins, and deployed on Hostinger.",
      "IT support whenever there was no coding task: troubleshooting staff hardware at Sumague's; installing applications and setting up new hires at Gleen.",
    ],
    tags: ["C", "C++", "SQL", "WordPress", "PHP", "IT support"],
  },
];
