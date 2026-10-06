"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Arms the one-shot reveals marked with `data-reveal` (styles in
 * globals.css). On the first observation, anything already on screen is
 * marked shown and never animates; only what is still below the fold gets
 * `data-armed` and rises in when it arrives. Until this runs — or if it never
 * does — everything is visible. Re-runs per route, since it lives in the
 * root layout.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches)
      return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"),
    );
    if (targets.length === 0) return;

    const show = (el: HTMLElement) => {
      el.dataset.in = "";
      observer.unobserve(el);
    };

    let first = true;
    const observer = new IntersectionObserver(
      (entries) => {
        // Read once, before any data-* write: reading innerHeight after a write
        // forces a style + layout pass per entry (about 30 on the first callback).
        const fold = first ? window.innerHeight : 0;
        // Inside a section the browser has not rendered yet (content-visibility:
        // auto, .defer-render) an entry's rect is all zeros; the section's own
        // box still sits where it will be. Read them here too, before any write.
        const sectionTops = new Map<Element, number>();
        if (first)
          for (const section of document.querySelectorAll(".defer-render"))
            sectionTops.set(section, section.getBoundingClientRect().top);
        // Stagger counts within this batch, so a second row doesn't inherit the first row's delays.
        let batch = 0;
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (el.dataset.reveal === "batch")
              el.style.setProperty("--i", String(Math.min(batch++, 5)));
            show(el);
            // An anchor jump skips past blocks without them ever intersecting;
            // everything earlier in the page counts as seen.
            for (const earlier of targets.slice(0, targets.indexOf(el))) {
              if (!("in" in earlier.dataset)) show(earlier);
            }
          } else if (first) {
            // Anything already painted — on screen or scrolled past — stays; only what is below the fold arms.
            const section = el.closest(".defer-render");
            const top =
              entry.boundingClientRect.height > 0 || !section
                ? entry.boundingClientRect.top
                : (sectionTops.get(section) ?? entry.boundingClientRect.top);
            if (top < fold) show(el);
            else el.dataset.armed = "";
          }
        }
        first = false;
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
