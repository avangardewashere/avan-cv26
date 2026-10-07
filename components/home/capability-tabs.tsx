"use client";

// clsx, not cn: keeps tailwind-merge (8.9 KB gz) out of the client bundle; nothing here relies on merging.
import { clsx } from "clsx";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

import { Arrow } from "@/components/ui/arrow";
import type { Capability } from "@/content/profile";

/**
 * The About section's proof: the headline's three themes as tabs, each a
 * figure that opens what backs it. All three figures stay visible, so a
 * scan still catches every number; the detail is one click away.
 *
 * WAI-ARIA tabs with automatic activation: one tab stop for the list,
 * arrows/Home/End move between tabs. The panels share one grid cell, the
 * inactive ones `invisible` (out of the accessibility tree and tab order),
 * so the tray is always as tall as the longest panel and switching tabs
 * never moves the page. Every panel's text is in the HTML for search
 * engines; without JavaScript, and in print, all three show (globals.css).
 */
export function CapabilityTabs({ items }: { items: readonly Capability[] }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent) => {
    // Leave browser and screen-reader shortcuts (Alt+Left, Ctrl+Home…) alone.
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    const last = items.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    // The same double-bezel tray as the rest of the page: 26 - 1 border - 6 padding = 19.
    // self-start: as tall as its content, not stretched to the text column beside it.
    <div className="capability-tabs border-foreground/6 bg-foreground/[2.5%] shadow-stat self-start rounded-[26px] border p-1.5">
      <div
        role="tablist"
        aria-label="What I work on"
        onKeyDown={onKeyDown}
        className="grid grid-cols-3 gap-1.5"
      >
        {items.map((item, i) => {
          const active = i === selected;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`cap-${item.id}-tab`}
              aria-selected={active}
              aria-controls={`cap-${item.id}-panel`}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelected(i)}
              className={clsx(
                "duration-hover relative flex flex-col rounded-[19px] border px-3 pt-3.5 pb-3 text-left transition-[background-color,border-color] motion-safe:active:scale-[0.98] max-[351px]:px-2.5 min-[480px]:px-[18px] min-[480px]:pt-[18px] min-[480px]:pb-4",
                // Forced colours drop backgrounds and tints: a thicker system-highlight border marks the selected tab there.
                "forced-colors:aria-selected:border-2 forced-colors:aria-selected:border-[Highlight]",
                active
                  ? "bg-surface border-accent-ink/35 shadow-core"
                  : "hover:bg-surface/60 hover:border-foreground/8 border-transparent",
              )}
            >
              <span
                className={clsx(
                  "text-[12.5px] leading-[1.3] font-medium max-[479px]:min-h-[2lh]",
                  active ? "text-foreground" : "text-muted",
                )}
              >
                {item.name}
              </span>
              <span
                className={clsx(
                  "display mt-2.5 text-[clamp(22px,3.2vw,40px)] leading-none tracking-[-0.04em]",
                  active ? "text-accent-ink" : "text-foreground",
                )}
              >
                {item.value}
              </span>
              <span className="text-subtle mt-2 text-[12.5px] leading-[1.35]">
                {item.label}
              </span>
              {/* The selected cue that doesn't rely on colour alone: a short bar along the bottom edge. */}
              <span
                aria-hidden
                className={clsx(
                  "bg-accent-ink forced-colors:bg-[Highlight] absolute inset-x-4 bottom-0 h-0.5 rounded-full transition-opacity duration-hover",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="grid">
        {items.map((item, i) => {
          const active = i === selected;
          const href = item.link.href;
          const linkClass =
            "group/arrow text-accent-ink mt-5 inline-flex self-start text-[14px] font-medium";
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`cap-${item.id}-panel`}
              aria-labelledby={`cap-${item.id}-tab`}
              className={clsx(
                "flex flex-col px-[18px] pt-5 pb-4 [grid-area:1/1] min-[480px]:px-[22px]",
                active ? "motion-safe:animate-panel-in" : "invisible",
              )}
            >
              {/* One hairline in the accent beside the list; no per-line markers. */}
              <ul className="border-accent-ink/30 text-ink-soft m-0 list-none space-y-3 border-l p-0 pl-4 text-[15px] leading-[1.55]">
                {item.proof.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {href.startsWith("#") ? (
                <a href={href} className={linkClass}>
                  <span>
                    {item.link.label} <Arrow dir="down" />
                  </span>
                </a>
              ) : (
                <Link href={href} className={linkClass}>
                  <span>
                    {item.link.label} <Arrow dir="right" />
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
