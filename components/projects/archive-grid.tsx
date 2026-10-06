"use client";

import { useState, type ReactNode } from "react";

import { projectGroups, type ProjectGroup } from "@/content/projects";
// clsx, not cn: keeps tailwind-merge out of the client bundle; nothing here relies on merging.
import { clsx } from "clsx";

type Filter = (typeof projectGroups)[number];

/** A card rendered on the server, so the projects data stays out of the client bundle. */
export type ArchiveItem = {
  slug: string;
  group: ProjectGroup;
  card: ReactNode;
};

export function ArchiveGrid({ items }: { items: readonly ArchiveItem[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const rows =
    filter === "All" ? items : items.filter((item) => item.group === filter);

  return (
    <>
      <div
        role="group"
        aria-label="Filter projects"
        className="mt-10 flex flex-wrap items-center gap-2"
      >
        {projectGroups.map((group) => {
          const active = group === filter;
          return (
            <button
              key={group}
              type="button"
              onClick={() => setFilter(group)}
              aria-pressed={active}
              className={clsx(
                "duration-hover h-9 rounded-full border px-4 text-[13.5px] font-medium transition-[background-color,border-color,color,scale] motion-safe:active:scale-[0.96]",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/12 text-muted hover:text-foreground bg-transparent",
              )}
            >
              {group}
            </button>
          );
        })}
        <span
          role="status"
          className="text-subtle ml-auto font-mono text-[12px]"
        >
          {`${rows.length} / ${items.length}`}
          <span className="sr-only"> projects shown</span>
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-3">
        {rows.map((item) => (
          // "batch": the observer staggers cards by their order within each row that enters together.
          <div key={item.slug} data-reveal="batch" className="flex">
            {item.card}
          </div>
        ))}
      </div>
    </>
  );
}
