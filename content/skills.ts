export type Skill = {
  name: string;
  /** Daily drivers — rendered highlighted. */
  core?: boolean;
};

export type SkillGroup = {
  title: string;
  /**
   * "01"–"04" for a layer of the stack, rendered as one framed column from
   * interface down to infrastructure. Omitted for cross-cutting groups.
   */
  layer?: string;
  items: readonly Skill[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    title: "Interface",
    layer: "01",
    items: [
      { name: "React", core: true },
      { name: "Next.js", core: true },
      { name: "Tailwind", core: true },
      { name: "WebSocket", core: true },
      { name: "Vue" },
      { name: "Bootstrap" },
      { name: "Elementor" },
      { name: "Figma" },
      { name: "Cocos Creator" },
      { name: "React Native / Expo" },
      { name: "three.js" },
    ],
  },
  {
    title: "Server & API",
    layer: "02",
    items: [
      { name: "Node.js / Express", core: true },
      { name: "WordPress", core: true },
      { name: "WooCommerce", core: true },
      { name: "REST APIs", core: true },
      { name: "Webhooks" },
      { name: "GraphQL" },
      { name: "Laravel" },
      { name: "CodeIgniter" },
      { name: "tRPC" },
      { name: "ServiceNow" },
      { name: "Postman" },
    ],
  },
  {
    title: "Data",
    layer: "03",
    items: [
      { name: "SQL" },
      { name: "MySQL" },
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "SQLite" },
    ],
  },
  {
    title: "Infra & ops",
    layer: "04",
    items: [
      { name: "Git", core: true },
      { name: "AWS / S3" },
      { name: "Vercel" },
      { name: "Docker" },
      { name: "GitHub Actions CI" },
      { name: "cPanel / WHM" },
      { name: "DNS" },
    ],
  },
  {
    title: "Languages",
    items: [
      { name: "TypeScript", core: true },
      { name: "JavaScript", core: true },
      { name: "PHP", core: true },
      { name: "HTML / CSS", core: true },
      { name: "C#" },
      { name: "C++" },
      { name: "C" },
      { name: "Python" },
    ],
  },
  {
    title: "Process & testing",
    items: [
      { name: "Agile / Scrum" },
      { name: "Code review" },
      { name: "UAT sign-off" },
      { name: "Jest" },
      { name: "Vitest" },
    ],
  },
  {
    title: "Payments & integrations",
    items: [
      { name: "Stripe", core: true },
      { name: "GCash", core: true },
      { name: "Telegram Bot API", core: true },
      { name: "PayMaya" },
      { name: "WooPayments" },
      { name: "Tencent Cloud Chat" },
      { name: "Jetpack VideoPress" },
    ],
  },
  {
    title: "Domains",
    items: [
      { name: "Fintech", core: true },
      { name: "E-commerce", core: true },
      { name: "Real-time gaming", core: true },
      { name: "Mini programs" },
    ],
  },
];
