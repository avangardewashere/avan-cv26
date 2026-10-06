import Link from "next/link";
import type { CSSProperties } from "react";

import { ProjectCard } from "@/components/project-card";
import { Arrow } from "@/components/ui/arrow";
import { pillVariants } from "@/components/ui/button";
import { FEATURED_COUNT, countWord, projects } from "@/content/projects";

export function Work() {
  const [lead, ...others] = projects.slice(0, FEATURED_COUNT);
  const rest = projects.slice(FEATURED_COUNT);

  return (
    <section
      id="work"
      className="defer-render scroll-mt-20 pt-(--space-section) [--defer-size:2700px] min-[480px]:[--defer-size:2740px] min-[760px]:[--defer-size:1700px] min-[960px]:[--defer-size:1440px] xl:[--defer-size:1510px]"
    >
      <div
        data-reveal
        className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-3"
      >
        <div>
          {/* The design sets no line-height, so its labels sit at `normal`, not preflight's 1.5. */}
          <p className="eyebrow">Selected work</p>
          <h2 className="display mt-3 max-w-[22ch] text-[clamp(30px,3.6vw,48px)] leading-[1.02] tracking-[-0.035em] text-balance">
            The constraint, what I did, and what it cost.
          </h2>
        </div>
        <Link
          href="/projects"
          className={pillVariants({ variant: "outline", size: "md" })}
        >
          {/* One inline run, so the arrow sits a space away rather than a flex gap. */}
          <span>
            {`All ${countWord(projects.length)} projects`} <Arrow dir="right" />
          </span>
        </Link>
      </div>

      {lead ? (
        <div
          data-reveal
          className="group/deck relative flex"
          style={{ "--i": 1 } as CSSProperties}
        >
          {/* The plates fan out a few px as the card lifts; they never take the pointer themselves. */}
          <div
            aria-hidden
            className="bg-deck-2 border-foreground/5 pointer-events-none absolute inset-x-7 -bottom-[22px] h-[calc(60%+2px)] rounded-3xl border [transition:translate_450ms_var(--ease-fluid)] motion-safe:group-hover/deck:translate-y-[6px] motion-safe:group-has-[:focus-visible]/deck:translate-y-[6px]"
          />
          <div
            aria-hidden
            className="bg-deck-1 border-foreground/6 pointer-events-none absolute inset-x-3.5 -bottom-[11px] h-[calc(60%+2px)] rounded-3xl border [transition:translate_450ms_var(--ease-fluid)] motion-safe:group-hover/deck:translate-y-[3px] motion-safe:group-has-[:focus-visible]/deck:translate-y-[3px]"
          />
          <ProjectCard project={lead} variant="featured" lead />
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-3">
          {others.map((project, i) => (
            <div
              key={project.slug}
              data-reveal
              className="flex"
              style={{ "--i": Math.min(2 + i, 5) } as CSSProperties}
            >
              <ProjectCard project={project} variant="featured" />
            </div>
          ))}
        </div>
      ) : null}

      {rest.length > 0 ? (
        <ul
          data-reveal
          className="mt-9 grid list-none grid-cols-1 gap-3 p-0 min-[760px]:grid-cols-3"
        >
          {rest.map((project) => (
            <li
              key={project.slug}
              className="border-foreground/7 hover:border-foreground/18 flex flex-col gap-2 rounded-[18px] border px-5 py-[18px] transition-[border-color] duration-300"
            >
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-[16px] font-semibold"
                >
                  {project.title}
                </Link>
                <span className="text-subtle font-mono text-[11px]">
                  {project.year}
                </span>
              </div>
              <p className="text-muted text-sm leading-[1.5]">
                {project.oneLiner}
              </p>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/arrow text-accent-ink self-start text-[13px] font-medium"
                >
                  {project.hrefLabel ?? "Live app"} <Arrow dir="up-right" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
