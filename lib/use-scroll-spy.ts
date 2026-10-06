"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently occupying the reading position.
 *
 * IntersectionObserver rather than a scroll listener: it fires only on
 * threshold crossings instead of on every frame of a scroll, and it does not
 * force layout. The negative top margin pushes the observation band below the
 * sticky header so a section only counts as "active" once it clears it.
 */
export function useScrollSpy(
  ids: readonly string[],
  headerOffset = 96,
  /**
   * Re-observes when this changes. The header lives in the root layout and
   * never remounts, so without it the observer keeps watching the sections of
   * whichever homepage render it first saw.
   */
  resetKey?: string,
) {
  // The key rides along with the id so a stale id from a previous route reads as the default.
  const [spied, setSpied] = useState<{ key?: string; id: string } | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Tracks visibility per id so the winner is chosen from full state, not
    // just from whichever entry happened to fire last.
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(
            entry.target.id,
            // Not intersectionRatio: an entry touching the band's edge reports 0 while intersecting.
            entry.isIntersecting ? 1 : 0,
          );
        }

        // The last intersecting section in document order: the one being read into.
        let best: string | null = null;
        for (const id of ids) {
          if ((visible.get(id) ?? 0) > 0) best = id;
        }

        // Same id and route: return the same object so the header doesn't re-render.
        if (best)
          setSpied((prev) =>
            prev && prev.id === best && prev.key === resetKey
              ? prev
              : { key: resetKey, id: best },
          );
      },
      {
        rootMargin: `-${headerOffset}px 0px -45% 0px`,
        // Only entering/leaving the reading band matters, not how much of it.
        threshold: 0,
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids, headerOffset, resetKey]);

  return spied && spied.key === resetKey ? spied.id : (ids[0] ?? null);
}
