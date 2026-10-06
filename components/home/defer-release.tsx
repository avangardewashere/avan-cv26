"use client";

import { useEffect } from "react";

/**
 * Lifts content-visibility: auto from the homepage sections (.defer-render in
 * globals.css) once the page is idle. By then it has kept the first layout to
 * the hero; rendered for good from here on, the sections measure, clip and
 * take anchor jumps exactly as they would without it.
 */
export function DeferRelease() {
  useEffect(() => {
    const release = () =>
      document.documentElement.setAttribute("data-rendered", "");
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(release, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    // Without requestIdleCallback, a second after hydration stands in for idle.
    const id = globalThis.setTimeout(release, 1000);
    return () => globalThis.clearTimeout(id);
  }, []);

  return null;
}
