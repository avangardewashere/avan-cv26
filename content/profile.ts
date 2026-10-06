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
 * here appears there.
 */
export const about = {
  headline: "I'm Avel, a full-stack engineer in Metro Manila.",
  headlineAccent: "Payments, online stores and real-time apps.",
  paragraphs: [
    "I started in 2019 with part-time WordPress work: site speed, SEO and custom plugins. Since then I've worked across the whole stack: Node.js services behind ExpressPay's branch system and its PayMaya and GCash payments, real-money gaming inside the GCash app, a Telegram bot with in-chat payments, and real-time lotto products in React over WebSocket.",
    "Today I freelance for clients in Australia and the Philippines, mostly PHP and WooCommerce on live stores. The biggest so far: taking Signal One International live with about 5,100 orders carried across, then fixing its Stripe webhooks in production.",
    "Outside client work I build my own apps to learn something new each time. The latest is AMYGO, the 3D gym above, in React and three.js.",
  ],
  facts: [
    { term: "Based in", detail: "Metro Manila, Philippines · UTC+8" },
    { term: "Looking for", detail: "Remote full-stack work" },
    { term: "Shipping since", detail: "2019, full-time since Feb 2020" },
    { term: "Daily drivers", detail: "React, Next.js, Node.js / Express, PHP / WordPress, TypeScript" },
    { term: "Education", detail: "BS Computer Science, Manuel S. Enverga University" },
  ],
} as const;

/*
 * Every figure traces to the résumé: the Signal One migration, the payment
 * APIs at ExpressPay (GCash, PayMaya), SNSoft (Telegram) and freelance
 * (Stripe), full-time work since Feb 2020, and the Technicare bug count.
 */
export const careerStats = [
  { value: "~5,100", label: "Orders migrated to a live store, none lost" },
  { value: "4", label: "Payment APIs worked on in production: Stripe, GCash, PayMaya, Telegram" },
  { value: "6+", label: "Years shipping, database to UI" },
  { value: "100+", label: "Bugs closed on real-time lotto products" },
] as const;

export type Social = {
  label: string;
  href: string;
};

/**
 * Profile links. Empty on purpose rather than filled with guesses; add an
 * entry and render it where needed.
 */
export const socials: readonly Social[] = [];
