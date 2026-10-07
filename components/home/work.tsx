import type { CSSProperties } from "react";

import { WorkRail, type RailItem } from "@/components/home/work-rail";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";

/*
 * Slide widths, so part of the next card always shows: about 1.2 cards on a
 * phone, cards up to 340px from 480px, 2½ from 760px, 3½ from 1024px and
 * 4¼ from 1280px. `sizes` follows the same widths so each banner is fetched
 * at the size it is drawn (every width here picks the 960w file).
 */
const SLIDE =
  "basis-[calc(100%-64px)] min-[480px]:basis-[min(340px,calc(100%-64px))] min-[760px]:basis-[calc((100%-24px)/2.5)] min-[1024px]:basis-[calc((100%-36px)/3.5)] min-[1280px]:basis-[calc((100%-48px)/4.25)]";
const SLIDE_SIZES =
  "(min-width: 1280px) 272px, (min-width: 1024px) 28vw, (min-width: 760px) 37vw, (min-width: 480px) 340px, calc(100vw - 104px)";

/** The 960w banner, for the wild card's small previews. */
const thumbOf = (media: (typeof projects)[number]["media"]) =>
  media?.kind === "image" ? (media.srcSet?.split(" ")[0] ?? media.src) : null;

/**
 * Five projects dealt at random per visit in one native scroll-snap rail,
 * then a wild card that previews the other four, links to the archive and
 * deals again (components/home/work-rail.tsx). Every card is rendered here,
 * on the server; the rail only chooses which five to show.
 *
 * --defer-size: the section's content height (clientHeight less
 * padding-top), measured once rendered at 360–1920px on 2026-10-07.
 * Re-measure when the cards change.
 */
export function Work() {
  const items: RailItem[] = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    href: `/projects/${project.slug}`,
    thumb: thumbOf(project.media),
    card: (
      <ProjectCard
        project={project}
        compact
        headingLevel="h3"
        sizes={SLIDE_SIZES}
      />
    ),
  }));

  return (
    <section
      id="work"
      className="defer-render scroll-mt-20 pt-(--space-section) [--defer-size:600px] min-[480px]:[--defer-size:635px] min-[760px]:[--defer-size:595px] min-[1024px]:[--defer-size:605px] min-[1280px]:[--defer-size:630px]"
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
        <WorkRail items={items} slideClass={SLIDE} />
      </div>
    </section>
  );
}
