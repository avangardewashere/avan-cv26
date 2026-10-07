"use client";

// clsx, not cn: keeps tailwind-merge (8.9 KB gz) out of the client bundle; nothing here relies on merging.
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

import { Arrow } from "@/components/ui/arrow";

/** A slide counts as in view once this much of it shows; the peeking neighbours never do. */
const IN_VIEW = 0.9;

/**
 * Which slides are in view, from their geometry. Measured rather than read
 * off IntersectionObserver ratios: Chrome reports a slide sitting exactly at
 * the threshold as 0.8999999761 (float32), which a `>=` check misses.
 */
function measure(rail: HTMLElement): Range | null {
  const box = rail.getBoundingClientRect();
  let first = -1;
  let last = -1;
  Array.from(rail.children).forEach((slide, i) => {
    const r = slide.getBoundingClientRect();
    const shown = Math.min(r.right, box.right) - Math.max(r.left, box.left);
    if (r.width > 0 && shown / r.width >= IN_VIEW - 0.001) {
      if (first < 0) first = i;
      last = i;
    }
  });
  return first < 0 ? null : { first, last };
}

type Range = { first: number; last: number };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Prev/next, a position counter and a screen-reader status for a native
 * scroll-snap rail (the Work carousel). The rail scrolls on its own (swipe,
 * trackpad, Shift+wheel, Tab); this only adds buttons for one screenful at a
 * time. It reads the rail from the DOM by id rather than taking the projects
 * as props or imports, so no project data ships to the client.
 *
 * Scrolling passes no `behavior`: the rail's `motion-safe:scroll-smooth`
 * decides, so reduced motion jumps instead of gliding.
 */
export function RailControls({
  railId,
  count,
  version,
}: {
  railId: string;
  count: number;
  /** Changes when the rail's slides are swapped (a new deal), so the listeners rebind to the new ones. */
  version?: string;
}) {
  const [range, setRange] = useState<Range | null>(null);
  // `n` keys the status text, so a press that repeats the last message still changes the DOM and is announced.
  const [status, setStatus] = useState({ text: "", n: 0 });
  // Where an in-flight smooth scroll is headed, so quick repeated clicks build on it, not on a stale range.
  const pending = useRef<Range | null>(null);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const slides = Array.from(rail.children) as HTMLElement[];
    // New slides: any in-flight target refers to the old ones.
    pending.current = null;

    const update = () => {
      // Mid-swipe there can be a moment with nothing fully in view; keep the last range.
      const next = measure(rail);
      if (!next) return;
      setRange((r) =>
        r && r.first === next.first && r.last === next.last ? r : next,
      );
    };
    // The observer only says when to look again; `measure` decides what is in view.
    const observer = new IntersectionObserver(update, {
      root: rail,
      threshold: [0, IN_VIEW, 1],
    });
    slides.forEach((slide) => observer.observe(slide));

    const settle = () => {
      pending.current = null;
      update();
    };

    // Tab onto a half-shown card and the browser leaves it where it is; bring
    // the whole card into view. No `behavior`, so reduced motion jumps.
    const reveal = (event: FocusEvent) => {
      const slide = slides.find((s) => s.contains(event.target as Node));
      if (!slide) return;
      const box = rail.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
      const r = slide.getBoundingClientRect();
      if (r.left >= box.left + pad - 1 && r.right <= box.right - pad + 1)
        return;
      rail.scrollTo({
        left: Math.min(
          slide.offsetLeft - slides[0].offsetLeft,
          rail.scrollWidth - rail.clientWidth,
        ),
      });
    };

    rail.addEventListener("scrollend", settle);
    rail.addEventListener("focusin", reveal);
    return () => {
      observer.disconnect();
      rail.removeEventListener("scrollend", settle);
      rail.removeEventListener("focusin", reveal);
    };
    // `version` is read only to re-run this when the slides change; the last range stays shown meanwhile.
  }, [railId, version]);

  const go = (dir: 1 | -1) => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const from = pending.current ?? measure(rail) ?? range;
    if (!from) return;
    const perView = from.last - from.first + 1;
    if (dir === 1 ? from.last >= count - 1 : from.first <= 0) return;

    // One screenful forward or back, landing on whole slides; the end clamps to a full last view.
    const first =
      dir === 1
        ? Math.min(from.last + 1, Math.max(count - perView, 0))
        : Math.max(from.first - perView, 0);
    const target = { first, last: Math.min(first + perView - 1, count - 1) };
    pending.current = target;
    // Browsers without `scrollend` (older Safari) settle on a timer instead.
    window.setTimeout(() => {
      if (pending.current === target) pending.current = null;
    }, 900);

    const slides = rail.children as HTMLCollectionOf<HTMLElement>;
    // The gap between two slides doesn't depend on the current scroll position; snap absorbs sub-pixels.
    rail.scrollTo({
      left: slides[target.first].offsetLeft - slides[0].offsetLeft,
    });

    const title = slides[target.first].querySelector("h3")?.textContent;
    setStatus(({ n }) => ({
      text:
        perView === 1
          ? `Card ${target.first + 1} of ${count}${title ? `: ${title}` : ""}`
          : `Cards ${target.first + 1} to ${target.last + 1} of ${count}`,
      n: n + 1,
    }));
  };

  const atStart = !range || range.first <= 0;
  const atEnd = !range || range.last >= count - 1;
  const button = clsx(
    "group/arrow border-foreground/14 grid size-11 place-items-center rounded-full border transition-[border-color,opacity] duration-hover",
    "hover:border-foreground/40 aria-disabled:hover:border-foreground/14 aria-disabled:cursor-default aria-disabled:opacity-35",
  );

  return (
    <>
      {/* Hidden (space kept) until the observer has measured, so nobody meets buttons that don't work yet. */}
      <div
        className={clsx(
          "flex items-center gap-2.5 print:hidden",
          !range && "invisible",
        )}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-controls={railId}
          aria-label="Previous projects"
          aria-disabled={atStart}
          className={button}
        >
          <Arrow dir="left" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-controls={railId}
          aria-label="Next projects"
          aria-disabled={atEnd}
          className={button}
        >
          <Arrow dir="right" />
        </button>
        <p
          aria-hidden
          className="text-subtle m-0 ml-1.5 font-mono text-[12px] tabular-nums"
        >
          {range
            ? `${pad(range.first + 1)}${range.last > range.first ? `–${pad(range.last + 1)}` : ""} / ${pad(count)}`
            : null}
        </p>
      </div>
      {/*
        Outside the hidden wrapper (visibility:hidden would hide it from
        screen readers too), and present from the first render so the first
        announcement is not missed. Set only by the buttons, never by swiping.
      */}
      <p role="status" className="sr-only">
        <span key={status.n}>{status.text}</span>
      </p>
    </>
  );
}
