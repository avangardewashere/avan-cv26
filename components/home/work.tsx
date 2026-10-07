import Link from "next/link";
import type { CSSProperties } from "react";

import { RailControls } from "@/components/home/rail-controls";
import { ProjectCard } from "@/components/project-card";
import { Arrow } from "@/components/ui/arrow";
import { pillVariants } from "@/components/ui/button";
import { countWord, projects } from "@/content/projects";
import { cn } from "@/lib/utils";

const RAIL_ID = "work-rail";

/*
 * Slide widths, so a part of the next card always shows: about 1.15 cards
 * on a phone, cards up to 420px from 480px, 2¼ cards from 760px, 3¼ from 1120px.
 * `sizes` follows the same widths so each banner is fetched at the size it
 * is drawn (a 390px phone gets the 960w file, not the 1600w one).
 */
const SLIDE =
  "basis-[calc(100%-48px)] min-[480px]:basis-[min(420px,calc(100%-64px))] min-[760px]:basis-[calc((100%-24px)/2.25)] min-[1120px]:basis-[calc((100%-36px)/3.25)]";
const SLIDE_SIZES =
  "(min-width: 1120px) 360px, (min-width: 760px) 42vw, (min-width: 480px) 420px, calc(100vw - 88px)";

/**
 * Every project as an image card in one native scroll-snap rail, then one
 * button to the full archive. The rail is a plain scrolling list: swipe,
 * trackpad, Shift+wheel and Tab all move it with no JavaScript, and every
 * card stays in the tab order and the accessibility tree. RailControls only
 * adds prev/next buttons and a counter.
 */
/*
 * --defer-size: the section's content height (clientHeight less padding-top),
 * measured once rendered at 360–1920px on 2026-10-07. Re-measure when cards change.
 */
export function Work() {
  return (
    <section
      id="work"
      className="defer-render scroll-mt-20 pt-(--space-section) [--defer-size:850px] min-[480px]:[--defer-size:765px] min-[760px]:[--defer-size:790px] min-[1120px]:[--defer-size:800px]"
    >
      <div data-reveal className="mb-5">
        {/* The design sets no line-height, so its labels sit at `normal`, not preflight's 1.5. */}
        <p className="eyebrow">Selected work</p>
        <h2 className="display mt-3 max-w-[22ch] text-[clamp(30px,3.6vw,48px)] leading-[1.02] tracking-[-0.035em] text-balance">
          The constraint, what I did, and what it cost.
        </h2>
      </div>

      {/* data-reveal on the wrapper, never on slides: the reveal observer watches the viewport, so clipped slides would stay hidden. */}
      <div data-reveal style={{ "--i": 1 } as CSSProperties}>
        {/*
          Bleeds into the page gutter so a card can peek past the column
          edge, while scroll-padding snaps cards back onto it. role="list":
          Safari drops list semantics from unstyled lists. The few px of
          vertical padding keep the cards' focus ring inside the scroller,
          which clips on both axes. Print shows every card.
        */}
        <ul
          id={RAIL_ID}
          role="list"
          aria-label="Projects"
          className="mx-[calc(var(--gutter)*-1)] flex list-none snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto overscroll-x-contain px-(--gutter) pt-2 pb-4 [scrollbar-width:thin] motion-safe:scroll-smooth print:mx-0 print:flex-wrap print:overflow-visible print:px-0"
        >
          {projects.map((project) => (
            <li
              key={project.slug}
              className={`flex shrink-0 snap-start print:min-w-0 print:basis-[calc((100%-12px)/2)] ${SLIDE}`}
            >
              <ProjectCard
                project={project}
                headingLevel="h3"
                sizes={SLIDE_SIZES}
              />
            </li>
          ))}
        </ul>
      </div>

      <div
        data-reveal
        style={{ "--i": 2 } as CSSProperties}
        className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4"
      >
        <RailControls railId={RAIL_ID} count={projects.length} />
        <Link
          href="/projects"
          className={cn(
            pillVariants({ variant: "outline", size: "lg" }),
            "max-[479px]:w-full",
          )}
        >
          {/* One inline run, so the arrow sits a space away rather than a flex gap. */}
          <span>
            {`All ${countWord(projects.length)} projects`} <Arrow dir="right" />
          </span>
        </Link>
      </div>
    </section>
  );
}
