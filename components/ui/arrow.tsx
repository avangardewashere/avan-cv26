// clsx, not cn: Arrow ships in client bundles (Experience), and none of these classes conflict.
import { clsx } from "clsx";

type Direction = "right" | "left" | "up-right" | "down";

const PATHS: Record<Direction, string> = {
  right: "M3 8h10M9 4l4 4-4 4",
  left: "M13 8H3M7 4 3 8l4 4",
  "up-right": "M5 11 11 5M6 5h5v5",
  down: "M8 3v10M4 9l4 4 4-4",
};

/*
 * Full class strings so Tailwind can see them. The nudge fires on the owning
 * link's hover or keyboard focus: that link carries `group/arrow`.
 */
const NUDGE: Record<Direction, string> = {
  right:
    "motion-safe:group-hover/arrow:translate-x-[3px] motion-safe:group-focus-visible/arrow:translate-x-[3px]",
  left: "motion-safe:group-hover/arrow:-translate-x-[3px] motion-safe:group-focus-visible/arrow:-translate-x-[3px]",
  "up-right":
    "motion-safe:group-hover/arrow:translate-x-[2px] motion-safe:group-hover/arrow:-translate-y-[2px] motion-safe:group-focus-visible/arrow:translate-x-[2px] motion-safe:group-focus-visible/arrow:-translate-y-[2px]",
  down: "motion-safe:group-hover/arrow:translate-y-[3px] motion-safe:group-focus-visible/arrow:translate-y-[3px]",
};

/**
 * A drawn arrow instead of the → ← ↗ characters, which fall outside the
 * site's Latin font subset and rendered in whatever fallback font each
 * visitor's OS supplied. Decorative: the link text carries the meaning.
 */
export function Arrow({
  dir,
  className,
}: {
  dir: Direction;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx(
        "duration-lift ease-fluid inline-block size-[0.8em] shrink-0 align-[-0.08em] transition-[translate]",
        NUDGE[dir],
        className,
      )}
    >
      <path d={PATHS[dir]} />
    </svg>
  );
}

/**
 * The primary-CTA arrow, in its own circle flush with the pill's right
 * padding. The owning pill carries `group/arrow`: the circle swells while the
 * arrow inside keeps its own directional nudge. `bg-current/12` follows each
 * variant's text colour, hover included.
 */
export function ArrowBadge({
  dir,
  small = false,
}: {
  dir: Direction;
  /** 32px for the 44px pill; 36px (default) for the 48px one. */
  small?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={clsx(
        "duration-lift ease-fluid grid shrink-0 place-items-center rounded-full bg-current/12 transition-[scale] motion-safe:group-hover/arrow:scale-105 motion-safe:group-focus-visible/arrow:scale-105",
        small ? "size-8" : "size-9",
      )}
    >
      <Arrow dir={dir} />
    </span>
  );
}
