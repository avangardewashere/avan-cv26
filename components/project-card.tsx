import Link from "next/link";

import type { Project } from "@/content/projects";
import { ProjectMedia } from "@/components/project-media";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  /**
   * `featured`: homepage "Selected work" — stack tags, heavier shadow,
   * lifts on hover. `archive`: the /projects grid — flatter, no tags.
   */
  variant: "featured" | "archive";
  /** The homepage's first card: banner beside the text from 960px up. */
  lead?: boolean;
  className?: string;
};

/**
 * One card for every project. An `<article>`, not a link: it holds two real
 * destinations (the case study and, when present, the live site), and anchors
 * cannot nest. The title link's ::after covers the card; the footer links sit above it.
 */
export function ProjectCard({
  project,
  variant,
  lead = false,
  className,
}: ProjectCardProps) {
  const href = `/projects/${project.slug}`;
  const featured = variant === "featured";
  const Heading = featured ? "h3" : "h2";

  return (
    <article
      className={cn(
        // No overflow-hidden here: it would clip the focus ring drawn outside the card.
        "group/card bg-surface relative flex flex-1 flex-col rounded-3xl border",
        lead &&
          "min-[960px]:grid min-[960px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]",
        featured
          ? // `translate`, not `transform`: Tailwind v4's translate utilities set the standalone property.
            "border-foreground/8 shadow-card hover:border-foreground/20 has-[:focus-visible]:border-foreground/20 [transition:border-color_300ms_var(--ease-soft),translate_450ms_var(--ease-fluid)] motion-safe:hover:-translate-y-1 motion-safe:has-[:focus-visible]:-translate-y-1"
          : "border-foreground/7 hover:border-foreground/18 has-[:focus-visible]:border-foreground/18 transition-[border-color] duration-300",
        className,
      )}
    >
      {/* 16:9, the banners' own shape, so nothing is cropped. Nothing overlays it: the banners carry their own logos. */}
      <div
        className={cn(
          // 23px: the card's 24px radius less its 1px border. `isolate`: Safari keeps the rounded clip while the media zooms.
          "bg-surface-well border-foreground/6 relative isolate aspect-video overflow-hidden rounded-t-[23px] border-b",
          lead &&
            "min-[960px]:self-start min-[960px]:rounded-tr-none min-[960px]:rounded-bl-[23px] min-[960px]:border-r min-[960px]:border-b-0",
        )}
      >
        <ProjectMedia
          media={project.media}
          title={project.title}
          sizes={lead ? "(min-width: 960px) 58vw, 100vw" : "(min-width: 760px) 50vw, 100vw"}
          className="ease-fluid transition-[scale] duration-[900ms] motion-safe:group-hover/card:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3.5 px-[22px] pt-[20px] pb-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="border-accent-ink/30 bg-accent-ink/8 text-accent-ink inline-flex h-[26px] items-center rounded-full border px-2.5 font-mono text-[11px] tracking-[0.06em] uppercase">
            {project.discipline}
          </span>
          <span className="text-subtle font-mono text-[11px] tracking-[0.06em] uppercase">
            {project.group} · {project.year}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <Heading
            className={cn(
              "display m-0 tracking-[-0.03em]",
              featured ? "text-[clamp(22px,2vw,28px)]" : "text-[24px]",
              // After the size: tailwind-merge drops a leading-* that precedes a font-size.
              "leading-[1.1]",
            )}
          >
            <Link
              href={href}
              className="after:absolute after:-inset-px after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent-ink"
            >
              {project.title}
            </Link>
          </Heading>
          <p className="m-0 shrink-0 text-right">
            <span
              className={cn(
                "display text-accent-ink block tracking-[-0.04em]",
                featured ? "text-[26px]" : "text-[24px]",
                "leading-none",
              )}
            >
              {project.metric}
            </span>
            <span className="text-subtle mt-1 block max-w-[14ch] text-[11.5px]">
              {project.metricLabel}
            </span>
          </p>
        </div>

        <p
          className={cn(
            "text-muted m-0 text-pretty",
            featured ? "text-[15px]" : "text-[14.5px]",
            "leading-[1.55]",
            lead && "max-w-[52ch]",
          )}
        >
          {featured ? project.summary : project.archiveSummary}
        </p>

        {featured ? (
          <ul className="mt-auto flex list-none flex-wrap gap-1.5 p-0">
            {project.stack.slice(0, 4).map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className={cn(
            "flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[14px] font-medium",
            !featured && "mt-auto",
          )}
        >
          <Link href={href} className="group/arrow relative z-[1]">
            {project.caseStudy ? "Case study" : "Details"}{" "}
            {/* The whole card is the link, so the arrow answers wherever the pointer is. */}
            <Arrow
              dir="right"
              className="motion-safe:group-hover/card:translate-x-[3px] motion-safe:group-has-[:focus-visible]/card:translate-x-[3px]"
            />
          </Link>
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
