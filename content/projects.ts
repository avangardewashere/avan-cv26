/**
 * Card and detail-page media: the project's 16:9 banner (in /public/projects,
 * 960 and 1600px WebP), or a placeholder poster when there is none.
 */
export type ProjectMedia =
  | { kind: "placeholder" }
  | {
      kind: "image";
      src: string;
      srcSet?: string;
      alt: string;
      /** A chip on the image on detail pages, e.g. which version of a site it shows. */
      caption?: string;
    };

/**
 * Server-side work drawn as its request path on the detail page, with the
 * part I built or fixed in the middle. Every node comes from the project's
 * own stack or highlights.
 */
export type RequestPath = {
  nodes: readonly [string, string, string];
  caption: string;
};

/** A project banner: public/projects/<slug>-banner-{960,1600}.webp. */
const banner = (slug: string, alt: string): ProjectMedia => ({
  kind: "image",
  src: `/projects/${slug}-banner-1600.webp`,
  srcSet: `/projects/${slug}-banner-960.webp 960w, /projects/${slug}-banner-1600.webp 1600w`,
  alt,
});

/**
 * The card chip beside the group, and the first chip on a detail page. Keep
 * it under 16 characters: it shares a 278px row with the group chip at 320px.
 */
export type Discipline =
  | "Full stack"
  | "Backend / API"
  | "WordPress / PHP"
  | "Front end"
  | "Mobile";

/** Where a piece of work sat in the stack. Detail pages only. */
export type StepTag = "UI" | "API" | "Data" | "Server" | "QA";

/** A step or highlight, optionally tagged with its layer. */
export type Line = string | { tag: StepTag; text: string };

export type ProjectGroup = "Client" | "Employment" | "Personal";

export type ProjectStat = {
  value: string;
  label: string;
  /** Renders the value in the accent colour. */
  accent?: boolean;
};

/**
 * The full case-study layout on a detail page. Optional: a project without
 * one still gets a detail page, built from its lede and highlights.
 */
export type CaseStudy = {
  /** Status chip beside the kind and year, e.g. "Live · private". */
  status?: string;
  facts: readonly { term: string; detail: string }[];
  stats: readonly ProjectStat[];
  constraint: string;
  steps: readonly Line[];
  cost: string;
};

export type Project = {
  slug: string;
  title: string;
  /** How the project is referred to in running text, e.g. an email subject. */
  shortTitle?: string;
  /** Archive filter and the chip on every card. */
  group: ProjectGroup;
  discipline: Discipline;
  /** Longer label for the detail page's first chip. */
  kind: string;
  year: string;
  /** The headline number on cards, e.g. "~5,100". */
  metric: string;
  metricLabel: string;
  /**
   * The longer card summary. Not rendered since the homepage moved to the
   * carousel (which uses `archiveSummary`); kept as written copy.
   */
  summary: string;
  /** The /projects archive card. */
  archiveSummary: string;
  /** One line: the homepage carousel's compact card. */
  oneLiner: string;
  /** Detail page lede. */
  lede: string;
  /** Detail page "What shipped" list when there is no case study. */
  highlights: readonly Line[];
  /** Full stack, listed on the detail page. */
  stack: readonly string[];
  /** The live, visitable site. Omitted when the work is private or client-owned. */
  href?: string;
  /** Link text for `href`; "Live app" by default. Say so when it is an archived copy. */
  hrefLabel?: string;
  /** Detail-page status chip when there is no case study; "Live" whenever `href` is set. */
  status?: string;
  /** Defaults to a placeholder when omitted. */
  media?: ProjectMedia;
  requestPath?: RequestPath;
  caseStudy?: CaseStudy;
};

/**
 * Order matters: the homepage carousel, the /projects archive and "Next
 * project" on detail pages all walk it (the last wrapping to the first).
 * The server-side work leads, since that is the full-stack positioning, and
 * fills the carousel's first desktop view; AMYGO, which the hero promotes,
 * comes straight after it.
 */
export const projects: readonly Project[] = [
  {
    slug: "signal-one",
    title: "Signal One International",
    shortTitle: "Signal One",
    group: "Client",
    discipline: "WordPress / PHP",
    kind: "Client · PHP / WooCommerce",
    year: "2026",
    metric: "~5,100",
    metricLabel: "orders moved, none lost",
    summary:
      "An Australian tactical-gear retailer moved from staging to a live store on shared cPanel hosting with no SSH: PHP 7 to 8, a 213MB database imported through the migration plugin's JavaScript API, then Stripe webhooks fixed in production.",
    archiveSummary:
      "An Australian tactical-gear retailer moved from staging to a live store on shared cPanel hosting with no SSH. ~5,100 orders, 1,156 variations and a 213MB database carried across; Stripe webhook failures traced and the orders paid during the outage reconciled.",
    oneLiner:
      "WooCommerce store taken live without SSH; Stripe webhooks fixed in production.",
    lede: "An Australian tactical-gear retailer moved from staging to a live store on shared cPanel hosting with no SSH access — then Stripe webhooks fixed in production, with paying customers on the other side.",
    highlights: [
      "293 products, 1,156 variations, ~5,100 orders and 55 active plugins carried across intact",
      "Traced live Stripe webhook failures to a signing-secret mismatch and reconciled the orders paid during the outage window",
      "Pre-launch QA caught GST calculated without shipping, a missing AU Terms and Conditions page, and SKU prefix collisions in search",
      "Upgraded PHP 7 to PHP 8 and raised MultiPHP INI limits for upload size, POST size, and memory",
    ],
    stack: ["PHP 8", "WooCommerce", "Stripe", "cPanel / WHM", "Elementor"],
    media: banner(
      "signal-one",
      "Signal One banner: the store's homepage on a laptop and a phone, beside the headline Australia's #1 supplier of security uniforms and tactical equipment.",
    ),
    requestPath: {
      nodes: ["Stripe", "Webhook", "WooCommerce"],
      caption: "Webhook failures traced to a signing-secret mismatch",
    },
    caseStudy: {
      status: "Live · private",
      facts: [
        { term: "Client", detail: "Tactical & law-enforcement retailer, Australia" },
        { term: "Role", detail: "Sole developer, freelance" },
        { term: "When", detail: "Jun – Jul 2026" },
      ],
      stats: [
        { value: "~5,100", label: "orders carried", accent: true },
        { value: "213MB", label: "database, moved without SSH" },
        { value: "55", label: "plugins, all active" },
        { value: "0", label: "orders lost" },
      ],
      constraint:
        "Shared cPanel hosting, no SSH, and a live store with paying customers on the other side of the cut-over. The paid restore path for the migration plugin was unavailable, so the whole import had to run through the All-in-One WP Migration JavaScript API — chunked uploads, in the browser, against a host with default PHP limits.",
      steps: [
        {
          tag: "Server",
          text: "Upgraded PHP 7 → 8 and raised MultiPHP INI limits for upload size, POST size and memory so the chunked import could complete.",
        },
        {
          tag: "Data",
          text: "Carried 293 products, 1,156 variations, ~5,100 orders, 55 active plugins and a 213MB database across intact, then verified counts on both sides.",
        },
        {
          tag: "API",
          text: "Traced live Stripe webhook failures to a signing-secret mismatch between environments, fixed it, and reconciled the orders paid during the outage window.",
        },
        {
          tag: "Server",
          text: "Diagnosed WooCommerce transactional email bypassing the mail service for the default wp_mail handler.",
        },
        {
          tag: "QA",
          text: "Pre-launch QA caught GST calculated without shipping, a missing AU Terms & Conditions page, and SKU-prefix collisions in search — all fixed before customers saw them.",
        },
      ],
      cost: "Roughly two weeks, one outage window during which orders still landed in Stripe but not in WooCommerce, and a handover document the client's team can follow without me: the correct cache-clear sequence, where the limits live, and what to check first when a webhook goes quiet.",
    },
  },
  {
    slug: "casino-plus-telegram",
    title: "Casino Plus: Telegram Bot",
    group: "Employment",
    discipline: "Full stack",
    kind: "Employment · Node / Express",
    year: "2025",
    metric: "3",
    metricLabel: "login, payments and an admin dashboard",
    summary:
      "A Node and Express service behind a Telegram bot: auto-login via verified Login Widget tokens, Telegram's native payments, MongoDB underneath, and an admin dashboard for the people running promotions.",
    archiveSummary:
      "Node.js, Express and MongoDB behind a Telegram bot: auto-login via the Login Widget with token verification, native payments for purchases, and a real-time admin dashboard for users, promotions and content.",
    oneLiner: "Login, payments and admin dashboard, all inside Telegram.",
    lede: "A Telegram-native front door for an existing gaming platform, built at SNSoft on Node.js, Express and MongoDB: sign in with Telegram, pay with Telegram's native payments, and an admin dashboard behind it for the people running promotions.",
    highlights: [
      {
        tag: "API",
        text: "Auto-login via the Telegram Login Widget with secure token verification",
      },
      {
        tag: "API",
        text: "Telegram's native payment API wired up for in-app purchases",
      },
      {
        tag: "Server",
        text: "Node.js and Express on MongoDB, with Telegram webhooks feeding the bot",
      },
      {
        tag: "UI",
        text: "Admin dashboard for users, promotions, game content, and real-time analytics",
      },
    ],
    stack: ["Node.js", "Express", "Telegram Bot API", "MongoDB", "Webhooks"],
    media: banner(
      "casino-plus-telegram",
      "CasinoPlus Telegram bot banner: a robot mascot holding the Telegram logo, beside phone screens of the CasinoPlus Telegram channel.",
    ),
    requestPath: {
      nodes: ["Telegram", "Express", "MongoDB"],
      caption: "Token-verified login · payments inside the chat",
    },
  },
  {
    slug: "multi-store-ecommerce",
    title: "Multi-Store E-commerce Platform",
    group: "Personal",
    discipline: "Backend / API",
    kind: "Personal · Multi-tenant API",
    year: "2025",
    metric: "1 → N",
    metricLabel: "one backend, many storefronts",
    summary:
      "One commerce backend, several storefronts: REST APIs, MongoDB schemas for multi-store relationships, and role-based auth scoped per tenant so one store's data doesn't leak into another's.",
    archiveSummary:
      "A multi-tenant commerce backend consumed by more than one storefront: REST APIs, tenant-scoped role-based auth, full product and inventory CRUD.",
    oneLiner: "Multi-tenant commerce API; tenant-scoped auth and inventory.",
    lede: "A multi-tenant commerce backend built to be consumed by more than one storefront. The interesting part was modelling store relationships in MongoDB without letting one tenant's data leak into another's.",
    highlights: [
      {
        tag: "API",
        text: "REST APIs designed for multiple independent storefronts against one backend",
      },
      {
        tag: "Data",
        text: "Product and store management with full CRUD and inventory control",
      },
      {
        tag: "API",
        text: "Role-based authentication scoped per tenant, plus API documentation",
      },
    ],
    stack: ["REST APIs", "MongoDB", "Next.js"],
    media: banner(
      "multi-store-ecommerce",
      "E-commerce admin panel banner: a dashboard of revenue, orders, customers and top-selling products on a laptop and a phone.",
    ),
    requestPath: {
      nodes: ["Storefronts", "REST API", "MongoDB"],
      caption: "Role-based auth scoped per tenant",
    },
  },
  {
    slug: "gym3d",
    discipline: "Front end",
    title: "AMYGO",
    group: "Personal",
    kind: "Personal · 3D web app",
    year: "2026",
    metric: "17",
    metricLabel: "exercises on 12 machines",
    summary:
      "A whole gym you can walk into, in the browser. Walk in, pick a machine and the person trains; switch to build mode and rearrange the floor.",
    archiveSummary:
      "A walkable 3D gym: 17 animated exercises on 12 machines, 28 pieces to rearrange in build mode, and phone controls.",
    oneLiner: "Walkable 3D gym: 17 exercises, 12 machines, a build mode.",
    lede: "AMYGO (MYG is GYM, backwards) is a whole gym you can walk into, in the browser. Walk in, pick a machine and the person performs the exercise, with hands and feet that follow the handles, pedals and bars; switch to build mode and drag the equipment into a new layout.",
    highlights: [
      "17 exercises on 12 machines, from bicep curls and treadmill sprints to back squats, rows and pull-ups",
      "Hands and feet solved to the machine every frame (arm and leg IK), checked by tests that fail when they drift apart",
      "Build mode: drag, snap and turn any of 28 pieces on a zoned floor, solid to walk into, layout remembered in the browser",
      "Painted walls, a mirror and zone names, so the floor reads as a real gym",
      "Phone-ready: an on-screen joystick, and quality that steps down on its own when frames slow",
    ],
    stack: ["React", "Three.js", "React Three Fiber", "TypeScript", "Vite", "Vitest"],
    media: banner(
      "gym3d",
      "AMYGO poster: a low-poly lifter back-squats in the free-weights zone, beside the line Walk in. Pick a machine. Train. and the figures 12 machines, 17 exercises, 28 pieces to rearrange.",
    ),
  },
  {
    slug: "buildos",
    discipline: "Mobile",
    title: "BuildOS",
    group: "Personal",
    kind: "Personal · Android app",
    year: "2026",
    href: "https://buildos-ochre-zeta.vercel.app",
    hrefLabel: "Project site",
    // Not on the Play Store yet, so not "Live" (the default when there is a link).
    status: "In development",
    metric: "8",
    metricLabel: "levels, project to single step",
    summary:
      "An offline Android app for planning projects as a tree. A project breaks down through up to eight levels, from version to single step, and progress rolls up automatically as the smallest pieces get done.",
    archiveSummary:
      "An offline Android project manager: every project is a tree up to eight levels deep, and progress rolls up on its own as the smallest steps get done.",
    oneLiner:
      "Offline Android project manager: break any project into steps; progress rolls up itself.",
    lede: "An Android project manager built around one idea: any project can be broken into smaller pieces until each piece is a single step you can finish. Every project is a tree, and progress is never typed in by hand: it is calculated from the steps underneath, so a project's progress bar moves the moment a step anywhere inside it is ticked off. Everything runs on the device, with no account, no server and no sync; data lives in a local SQLite database.",
    highlights: [
      "Nested breakdown with a customizable level chain per project: Project, Version, Update, Feature, Phase, Cycle, Task and Step by default, renamed, recolored or extended per project",
      "Automatic progress roll-up: a blocked step flags its whole branch, and a branch counts as done only when every step in it is done",
      "Drag to reorder, move a whole branch to a new parent, and reuse templates saved from any branch at any depth",
      "Archive for finished projects, a trash that keeps deleted work restorable for 30 days, search across the whole tree with each result's path, and JSON export and import",
      { tag: "Data", text: "MVVM with a repository layer: screens never touch storage, which let the app move from AsyncStorage to SQLite with a one-time migration and no data loss" },
      { tag: "Data", text: "Guarded schema migrations, with a test that reads the SQL source and fails if a new column ships without one; it would have caught a real bug that crashed the templates screen on older installs" },
      { tag: "Data", text: "Stats from an append-only event log, counted once per item per day, so ticking a step on and off doesn't inflate them" },
      { tag: "QA", text: "160 Jest unit tests across the tree logic, the trash lifecycle and the stats" },
    ],
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Zustand",
      "SQLite",
      "Expo Router",
      "Reanimated",
      "Jest",
    ],
    media: banner(
      "buildos",
      "BuildOS banner: a project tree eight levels deep, from Indie app launch down to Validate input, every level at 100%, beside the line Break it down. Watch it roll up.",
    ),
  },
  {
    slug: "feiwin",
    title: "Feiwin Company Website",
    shortTitle: "Feiwin",
    group: "Employment",
    discipline: "Front end",
    kind: "Employment · Company website",
    year: "2023",
    href: "https://feiwin.net",
    hrefLabel: "Live site",
    metric: "3",
    metricLabel: "languages on one page",
    summary:
      "The company website for Feiwin, a game studio in Cavite, built during my WBridges placement: one page in English, Chinese and Filipino, with a game carousel and careers forms that post to a backend API. I built most of it, then deployed and hosted it.",
    archiveSummary:
      "Feiwin's company website, from my WBridges placement: one page on a Bootstrap template in English, Chinese and Filipino, a carousel of the studio's games, job listings with detail modals and an application form. I built most of it and handled deployment and hosting.",
    oneLiner:
      "A game studio's three-language company and careers site; built most of it, deployed it.",
    lede: "The company website of Feiwin, which describes itself as a mobile and web game-development studio in Cavite. I built most of it during my placement through WBridges, on a Bootstrap template: one scrolling page in English, Chinese and Filipino with the studio's services, its game art and a careers section that takes applications. Then I deployed and hosted it. It went up in 2023 and is still live.",
    highlights: [
      {
        tag: "UI",
        text: "English, Chinese and Filipino from a flag menu in the header: the page's text switches in place, and the choice is remembered on the next visit",
      },
      {
        tag: "UI",
        text: "A coverflow carousel of the studio's game art, built with Swiper",
      },
      {
        tag: "UI",
        text: "Careers section with three job listings, a details modal for each, and an application form with a résumé upload",
      },
      {
        tag: "API",
        text: "The application and contact forms send their fields to a separate backend API with jQuery, then redirect to a thank-you page",
      },
      {
        tag: "Server",
        text: "Deployed and hosted it; at WBridges I managed hosting and deployment workflows on Pagoda and AWS",
      },
    ],
    stack: ["HTML / CSS / JS", "Bootstrap 5", "jQuery", "Swiper", "Pagoda / AWS"],
    media: banner(
      "feiwin",
      "Feiwin banner: the company website's homepage on a laptop, beside the Feiwin logo and its four services.",
    ),
  },
  {
    slug: "expresspay",
    title: "ExpressPay Franchise Website",
    shortTitle: "ExpressPay",
    group: "Employment",
    discipline: "WordPress / PHP",
    kind: "Employment · Company website",
    year: "2021–22",
    // Today's expresspayinc.ph is a 2026 rebuild by others; this is the site as it was.
    href: "https://web.archive.org/web/20221010/https://www.expresspayinc.ph/",
    hrefLabel: "Archived site",
    status: "Archived · 2022",
    metric: "1,022",
    metricLabel: "franchisees, per the site's footer (Oct 2021)",
    summary:
      "The franchise website for ExpressPay, a bills-payment, e-load and remittance network, which I helped build and maintain on WordPress alongside my backend work there: franchise packages, partner services, a branch gallery and the inquiry form.",
    archiveSummary:
      "ExpressPay's franchise website, which I helped build and maintain on WordPress in 2021–22 alongside my backend work: franchise packages, partner services, a branch photo gallery and an inquiry form. It has since been rebuilt by others; the 2022 version is archived.",
    oneLiner:
      "WordPress franchise site for a bills-payment network; helped build and maintain it.",
    lede: "ExpressPay sells franchises for neighbourhood bills-payment, e-load and remittance counters. Alongside my backend work there, I helped build and maintain its franchise website on WordPress, launched in late 2021: the franchise packages, partner services, a branch photo gallery and the inquiry form for would-be franchisees. Today's site is a later rebuild by others; the 2022 version is on the Wayback Machine.",
    highlights: [
      {
        tag: "UI",
        text: "Franchise packages, partner services and a branch photo gallery, built on WordPress with the Salient theme and WPBakery",
      },
      {
        tag: "UI",
        text: "An inquiry form for would-be franchisees, on Contact Form 7",
      },
      {
        tag: "Server",
        text: "Maintained it through 2022 as the company added packages, partners and a WooCommerce shop",
      },
    ],
    stack: ["WordPress", "Salient / WPBakery", "Contact Form 7"],
    media: banner(
      "expresspay",
      "ExpressPay banner: a company website on a laptop, headlined Your Business. Your Future. Starts Here.",
    ),
  },
  {
    slug: "sipat",
    discipline: "Front end",
    title: "Sipat",
    group: "Personal",
    kind: "Personal · Focus timer",
    year: "2026",
    href: "https://sipat-jade.vercel.app",
    metric: "25:00",
    metricLabel: "focus, logged honestly",
    summary:
      "A Pomodoro-style timer that answers one question after a work session: did I actually focus? Configurable lengths, a weekly chart by day, and a session log.",
    archiveSummary:
      "A Pomodoro-style timer with configurable focus and break lengths, a weekly chart of focus time by day, and a session log.",
    oneLiner: "Pomodoro timer with a weekly focus chart and session log.",
    lede: "A Pomodoro-style focus timer with configurable focus and break lengths, a weekly chart of focus time by day, and a session log — built to answer one question after a work session: did I actually focus, or did it just feel like it.",
    highlights: [
      "Configurable focus, short-break, and long-break durations, with a long-break-after-N-sessions rule",
      "Weekly focus-time chart by day, with a plain-table view as an alternative to the bars",
      "Session log and per-week navigation, so a full week is never more than one click away",
      "Sound, vibration, and system-notification toggles for when a session ends",
    ],
    stack: ["Next.js", "Tailwind CSS"],
    media: banner(
      "sipat",
      "Sipat banner: the focus timer at 25:00 with its session log and timer settings, on a laptop and a phone.",
    ),
  },
  {
    slug: "tallytappy",
    discipline: "Front end",
    title: "TallyTappy",
    group: "Personal",
    kind: "Personal · Counter app",
    year: "2026",
    href: "https://tally-tappy.vercel.app",
    metric: "1",
    metricLabel: "running total for today",
    summary:
      "Named counters for anything you'd otherwise lose track of during the day, each tagged by category, with a single running total across every counter.",
    archiveSummary:
      "Named counters for anything you'd lose track of during the day, tagged by category, with one running total across every counter.",
    oneLiner: "Named, categorised counters with one running total for the day.",
    lede: "Named counters for anything you'd otherwise lose track of during the day — glasses of water, reps, cigarettes avoided — each tagged by category, with one running total for today across every counter at once.",
    highlights: [
      "Each tally has its own name, description, and category: Health, Fitness, Habits, Work, or Other",
      'A single "Total today" figure aggregates every active counter, not just one',
      "Guest mode ships today; accounts are the next thing to land",
      "History and profile views alongside the live counter list",
    ],
    stack: ["Next.js", "Tailwind CSS"],
    media: banner(
      "tallytappy",
      "TallyTappy banner: named counters for water, coffee and workouts with a weekly chart, on a laptop and a phone.",
    ),
  },
  {
    slug: "habibit",
    discipline: "Front end",
    title: "Habibit",
    group: "Personal",
    kind: "Personal · Habit tracker",
    year: "2026",
    href: "https://habibit.vercel.app",
    metric: "7",
    metricLabel: "day streak row, per habit",
    summary:
      "A small daily habit and task tracker that keeps the two apart on purpose: habits reset every morning and carry a streak; one-off tasks stay done.",
    archiveSummary:
      "A daily habit and task tracker that keeps the two apart on purpose: habits reset every morning and carry a streak; one-off tasks stay done.",
    oneLiner: "Habits with streaks, tasks without; light and dark, persisted.",
    lede: "A small daily habit and task tracker that keeps the two kinds of things separate on purpose: habits reset every morning and carry a streak, one-off tasks stay checked once they're done.",
    highlights: [
      "Per-habit weekly streak row, each day independently toggleable, with a running streak count",
      'Tasks live in their own list, separate from habits, since "done once" and "done today" are different things',
      "Light, dark, and system theme, with the current choice persisted",
    ],
    stack: ["Next.js", "Tailwind CSS"],
    media: banner(
      "habibit",
      "Habibit banner: today's habits with a weekly streak row and a task list, on a laptop and a phone.",
    ),
  },
];

export const projectGroups = ["All", "Client", "Employment", "Personal"] as const;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** The project after this one, wrapping to the first. */
export function getNextProject(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}

/** Stats for a detail page: the case study's, or the card metric alone. */
export function getProjectStats(project: Project): readonly ProjectStat[] {
  return (
    project.caseStudy?.stats ?? [
      { value: project.metric, label: project.metricLabel, accent: true },
    ]
  );
}

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

/** "six" for 6, "11" for 11 — for "All six projects". */
export function countWord(n: number) {
  return NUMBER_WORDS[n] ?? String(n);
}
