/**
 * The homepage's sections. The header links and the scroll-spy observer both
 * read from here, so adding a section is a one-line change.
 */
export type NavItem = {
  /** Matches the `id` on the corresponding <section>. */
  id: string;
  label: string;
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "toolbox", label: "Toolbox" },
  { id: "contact", label: "Contact" },
] as const satisfies readonly NavItem[];

/** Section ids in document order, including the hero, for the scroll spy. */
export const sectionIds = ["hero", ...navItems.map((i) => i.id)];
