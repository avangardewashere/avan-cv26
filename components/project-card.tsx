import Link from "next/link";

import type { Project } from "@/content/projects";
import { ProjectMedia } from "@/components/project-media";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  /** `h3` inside a section that has its own `h2` (the homepage); `h2` on /projects. */
  headingLevel?: "h2" | "h3";
  /** The card's rendered width, for picking a banner from the srcset. */
  sizes?: string;
  /**
   * The homepage carousel's card: the one-line summary instead of the
   * paragraph, the metric on one line under the title, tighter spacing.
   */
  compact?: boolean;
  className?: string;
};

/**
 * One card for every project: `compact` in the homepage carousel, full on
 * the /projects archive. An `<article>`, not a link: it can hold two real destinations
 * (the case study and, when present, the live site), and anchors cannot
 * nest. The title link's ::after covers the card, so the whole card opens
 * the case study; the live-site link sits above it.
 */
export function ProjectCard({
  project,
  headingLevel: Heading = "h2",
  sizes = "(min-width: 760px) 50vw, 100vw",
  compact = false,
  className,
}: ProjectCardProps) {
  const href = `/projects/${project.slug}`;
  const cueId = `${project.slug}-cue`;

  return (
    <article
      className={cn(
        // No overflow-hidden here: it would clip the focus ring drawn outside the card.
        "group/card bg-surface border-foreground/7 hover:border-foreground/18 has-[:focus-visible]:border-foreground/18 @container relative flex flex-1 flex-col rounded-3xl border transition-[border-color] duration-300",
        className,
      )}
    >
      {/* 16:9, the banners' own shape, so nothing is cropped. Nothing overlays it: the banners carry their own logos. */}
      {/* 23px: the card's 24px radius less its 1px border. `isolate`: Safari keeps the rounded clip while the media zooms. */}
      <div className="bg-surface-well border-foreground/6 relative isolate aspect-video overflow-hidden rounded-t-[23px] border-b">
        <ProjectMedia
          media={project.media}
          title={project.title}
          sizes={sizes}
          className="ease-fluid transition-[scale] duration-[900ms] motion-safe:group-hover/card:scale-[1.03]"
        />
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          compact
            ? "gap-2.5 px-[18px] pt-4 pb-4"
            : "gap-3.5 px-[22px] pt-[20px] pb-5",
        )}
      >
        {/*
          The compact card fits this on one line by naming only what kind of
          work it was (Client, Employment, Personal) and the year.
        */}
        <div
          className={cn(
            "flex items-center gap-x-3 gap-y-2",
            compact ? "flex-nowrap" : "flex-wrap",
          )}
        >
          <span
            className={cn(
              "border-accent-ink/30 bg-accent-ink/8 text-accent-ink inline-flex items-center rounded-full border px-2.5 font-mono tracking-[0.06em] uppercase",
              compact ? "h-6 text-[10.5px]" : "h-[26px] text-[11px]",
            )}
          >
            {compact ? project.group : project.discipline}
          </span>
          <span className="text-subtle font-mono text-[11px] tracking-[0.06em] whitespace-nowrap uppercase">
            {compact ? project.year : `${project.group} · ${project.year}`}
          </span>
        </div>

        {/*
          Title and metric side by side; a very narrow card (a 360px phone)
          stacks them, every card alike, instead of letting the metric spill.
          The compact card always stacks, and holds every block to a fixed
          number of lines (title 2, metric 1, summary 3), so all compact
          cards are one height and a new deal in the carousel never moves it.
        */}
        <div
          className={cn(
            "flex items-start justify-between gap-x-4 gap-y-2",
            compact ? "flex-col gap-y-1.5" : "@max-[290px]:flex-col",
          )}
        >
          <Heading
            className={cn(
              "display m-0 tracking-[-0.03em]",
              compact
                ? "line-clamp-2 min-h-[2lh] text-[20px] leading-[1.15]"
                : "text-[24px] leading-[1.1]",
            )}
          >
            <Link
              href={href}
              aria-describedby={cueId}
              className="after:absolute after:-inset-px after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent-ink"
            >
              {project.title}
            </Link>
          </Heading>
          {compact ? (
            <p className="m-0 flex w-full min-w-0 items-baseline gap-x-2">
              <span className="display text-accent-ink shrink-0 text-[18px] leading-none tracking-[-0.04em]">
                {project.metric}
              </span>
              {/* One line; the full label is on the project page (and here on hover, and for screen readers). */}
              <span
                title={project.metricLabel}
                className="text-subtle min-w-0 truncate text-[12px]"
              >
                {project.metricLabel}
              </span>
            </p>
          ) : (
            <p className="m-0 shrink-0 text-right @max-[290px]:text-left">
              <span className="display text-accent-ink block text-[24px] leading-none tracking-[-0.04em]">
                {project.metric}
              </span>
              <span className="text-subtle mt-1 block max-w-[14ch] text-[11.5px]">
                {project.metricLabel}
              </span>
            </p>
          )}
        </div>

        <p
          className={cn(
            "text-muted m-0 text-pretty",
            compact
              ? "line-clamp-3 min-h-[3lh] text-[14px] leading-[1.5]"
              : "text-[14.5px] leading-[1.55]",
          )}
        >
          {compact ? project.oneLiner : project.archiveSummary}
        </p>

        <div
          className={cn(
            "mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-1 font-medium",
            compact ? "text-[13.5px]" : "text-[14px]",
          )}
        >
          {/*
            Not a second link: the title's overlay already opens the case
            study, so this is the visible cue for it and clicks fall through
            to the overlay. One tab stop per card instead of two. Screen
            readers still hear it, as the title link's description.
          */}
          <span id={cueId} aria-hidden className="group/arrow">
            {project.caseStudy ? "Case study" : "Details"}{" "}
            {/* The whole card is the link, so the arrow answers wherever the pointer is. */}
            <Arrow
              dir="right"
              className="motion-safe:group-hover/card:translate-x-[3px] motion-safe:group-has-[:focus-visible]/card:translate-x-[3px]"
            />
          </span>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent-ink group/arrow relative z-[1]"
            >
              {project.hrefLabel ?? "Live app"} <Arrow dir="up-right" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
