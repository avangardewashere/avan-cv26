export const profile = {
  name: "Avel D. Panaligan",
  shortName: "Avel Panaligan",
  /*
   * The positioning, not a job title: every role in content/experience.ts
   * keeps the title it was actually held under.
   */
  role: "Full-Stack Engineer",
  location: "Metro Manila, Philippines",
  /** The hero's location chip. */
  locationLabel: "Metro Manila · UTC+8",
  availability: "Available for remote work",
  email: "aveldpanaligan@gmail.com",
  phone: "+63 991 029 8335",
  /*
   * Points at the file that is actually in /public. Swap the extension the
   * moment a PDF export exists.
   */
  resumeHref: "/Resume-Panaligan.docx",
} as const;

/** `tel:` form of the phone number. */
export const phoneHref = `tel:${profile.phone.replace(/\s/g, "")}`;

/*
 * The first screen: the AMYGO promo video (public/media), which plays
 * through once and then settles on the poster, art-directed per screen
 * shape. Re-encoded from the 23 MB 1080p60 master to 30 fps H.264 with
 * faststart, so it starts before it has finished downloading; phones get
 * the 720p cut. The figures on the poster are AMYGO's own.
 */
export const promo = {
  label: "AMYGO promo: a whole gym you can walk into, in your browser",
  /** Full plays before the poster takes over. */
  plays: 1,
  src1080: "/media/gym3d-promo-1080.mp4",
  src720: "/media/gym3d-promo-720.mp4",
  /** The video's own first frame, shown while it loads. */
  videoPoster: "/media/gym3d-promo-poster.webp",
  landscape: {
    srcSet:
      "/media/amygo-landscape-1920.webp 1920w, /media/amygo-landscape-2880.webp 2880w",
    width: 1920,
    height: 1080,
  },
  portrait: {
    srcSet:
      "/media/amygo-portrait-1080.webp 1080w, /media/amygo-portrait-1620.webp 1620w",
    width: 1080,
    height: 1920,
  },
  posterAlt:
    "AMYGO, a gym in your browser. Walk in. Pick a machine. Train. A low-poly lifter back-squats at a rack in the free-weights zone. 12 machines, 17 exercises, 28 pieces to rearrange. Built with React, three.js and React Three Fiber.",
  projectHref: "/projects/gym3d",
} as const;

/*
 * The About section, the first thing after the promo. Sourced only from the
 * résumé and content/experience.ts: every employer, number and tool named
 * here appears there. Short on purpose: one summary paragraph shows, the
 * story sits behind "More about me", and the proof lives in the
 * capability tabs below it.
 */
export const about = {
  headline: "I'm Avel, a full-stack engineer.",
  headlineAccent: "Payments, online stores and real-time apps.",
  summary:
    "For six years I've built and maintained production systems, database to UI. Today I freelance for clients in Australia and the Philippines, mostly PHP and WordPress, most recently taking a WooCommerce store live.",
  story: [
    "I started in 2019 with part-time WordPress work: site speed, SEO and custom plugins. Since then I've worked across the stack, from Node.js services behind ExpressPay's branch system to real-money gaming inside the GCash app and a Telegram bot with in-chat payments.",
    "Outside client work I build my own apps to learn something new each time. The latest is AMYGO, the 3D gym at the top of this page, in React and three.js.",
  ],
  facts: [
    { term: "Based in", detail: "Metro Manila, Philippines (UTC+8)" },
    { term: "Looking for", detail: "Remote full-stack work" },
    { term: "Experience", detail: "Since 2019, full-time since Feb 2020" },
    { term: "Education", detail: "BS Computer Science, Manuel S. Enverga University" },
  ],
} as const;

export type Capability = {
  id: string;
  /** The tab's name: the three themes of the About headline, in its order. */
  name: string;
  value: string;
  label: string;
  /** What backs the number, one line each. Every line traces to experience.ts or projects.ts. */
  proof: readonly string[];
  link: { label: string; href: string };
};

/*
 * The About section's proof, as tabs: each figure traces to the résumé (the
 * payment APIs at ExpressPay, SNSoft and freelance; the Signal One
 * migration; the Technicare bug count), and each line to a role or project.
 */
export const capabilities: readonly Capability[] = [
  {
    id: "payments",
    name: "Payments",
    value: "4",
    label: "Payment APIs worked on in production",
    proof: [
      "Stripe at Signal One: traced live webhook failures to a signing-secret mismatch and reconciled the orders paid during the outage.",
      "PayMaya and GCash integrations at ExpressPay, for cross-channel transactions.",
      "Telegram's native in-chat payments in the Casino Plus bot.",
    ],
    link: { label: "Signal One case study", href: "/projects/signal-one" },
  },
  {
    id: "stores",
    name: "Online stores",
    value: "~5,100",
    label: "Orders migrated, none lost",
    proof: [
      "Took Signal One live on WooCommerce, on shared cPanel hosting with no SSH, carrying across 1,156 variations and a 213MB database.",
      "Upgraded its stack from PHP 7 to 8 and fixed page-cache conflicts serving stale HTML.",
      "A personal project: a multi-tenant commerce backend with REST APIs and tenant-scoped auth for more than one storefront.",
    ],
    link: { label: "Multi-store platform", href: "/projects/multi-store-ecommerce" },
  },
  {
    id: "realtime",
    name: "Real-time apps",
    value: "100+",
    label: "Bugs closed on live lotto products",
    proof: [
      "Pick2Win, Grand Sabado and 3D Rush on lottoplay.ph, with live WebSocket feeds for rounds, results and chat.",
      "A chat-moderation platform built from scratch and adopted across multiple game environments.",
      "8+ versioned releases, with UAT sign-offs coordinated with QA and backend teams.",
    ],
    link: { label: "Full history in Experience", href: "#experience" },
  },
];

export type Social = {
  label: string;
  href: string;
};

/**
 * Profile links. Empty on purpose rather than filled with guesses; add an
 * entry and render it where needed.
 */
export const socials: readonly Social[] = [];
