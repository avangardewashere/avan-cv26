import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { profile } from "@/content/profile";
import {
  getNextProject,
  getProject,
  getProjectStats,
  projects,
  type Line,
} from "@/content/projects";
import { ProjectMedia, RequestPath } from "@/components/project-media";
import { SiteFooter } from "@/components/site-footer";
import { Arrow, ArrowBadge } from "@/components/ui/arrow";
import { pillVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chip =
  "inline-flex h-[30px] items-center rounded-full border px-3 font-mono text-[11.5px] tracking-[0.06em] uppercase";

const monoLabel =
  "text-subtle font-mono text-[11px] tracking-[0.08em] uppercase";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const socialTitle = `${project.title} · ${profile.name}`;
  // Page-level openGraph/twitter replace the layout's outright, so type and locale are restated.
  return {
    title: project.title,
    description: project.lede,
    openGraph: {
      type: "article",
      locale: "en_PH",
      title: socialTitle,
      description: project.lede,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: project.lede,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;
  const next = getNextProject(project.slug);
  const stats = getProjectStats(project);
  const hasStatsRow = stats.length > 1;
  // A lone stat tile read as a stray card, so it heads the aside instead.
  const leadStat = stats.length === 1 ? stats[0] : undefined;
  const status =
    caseStudy?.status ?? project.status ?? (project.href ? "Live" : undefined);
  // Type and Year already sit in the chips.
  const facts = caseStudy?.facts ?? [];
  const askHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    `About ${project.shortTitle ?? project.title}`,
  )}`;

  return (
    <>
      <main
        id="main"
        className="page-shell relative z-[1] pt-[clamp(120px,16vh,170px)] pb-[60px]"
      >
        <Link href="/projects" className="group/arrow text-muted text-[14px]">
          <Arrow dir="left" /> All projects
        </Link>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <span className={cn(chip, "border-foreground/20 text-foreground")}>
            {project.discipline}
          </span>
          <span className={cn(chip, "border-foreground/10 text-muted")}>
            {project.kind}
          </span>
          <span className={cn(chip, "border-foreground/10 text-muted")}>
            {project.year}
          </span>
          {status ? (
            <span
              className={cn(
                chip,
                "border-accent-ink/30 bg-accent-ink/8 text-accent-ink gap-2",
              )}
            >
              {status}
            </span>
          ) : null}
        </div>

        <h1 className="display mt-5 max-w-[16ch] text-[clamp(40px,6vw,88px)] leading-[.98] tracking-[-0.04em] text-balance">
          {project.title}
        </h1>
        <p className="text-muted mt-5 max-w-[64ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-pretty">
          {project.lede}
        </p>

        {/*
          One tray for the evidence: the media and the stat plates. Concentric
          radii: 28 - 1 border - 6 padding = 21. The core's hairline is an inset
          outline so it paints above a screenshot.
        */}
        <div className="border-foreground/7 bg-foreground/[2.5%] shadow-core mt-10 rounded-[28px] border p-1.5">
          <div className="bg-surface-well outline-foreground/8 relative isolate aspect-video overflow-hidden rounded-[21px] outline -outline-offset-1">
            <ProjectMedia
              media={project.media}
              title={project.title}
              sizes="(min-width: 1280px) 1188px, 100vw"
              caption
            />
          </div>

          {hasStatsRow ? (
            // 148px keeps four stats 2×2 inside the tray on a 375px phone.
            <ul className="mt-1.5 grid grid-cols-[repeat(auto-fit,minmax(148px,1fr))] gap-1.5">
              {stats.map((stat) => (
                <li
                  key={stat.label}
                  className="bg-surface border-foreground/7 shadow-core rounded-[21px] border px-[22px] py-5"
                >
                  <p
                    className={cn(
                      "display text-[34px] leading-none tracking-[-0.04em]",
                      stat.accent && "text-accent-ink",
                    )}
                  >
                    {stat.value}
                  </p>
                  <p className="text-muted mt-2 text-[13px]">{stat.label}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className={cn(
            "@container flex flex-wrap items-start gap-x-12 gap-y-8",
            hasStatsRow ? "mt-14" : "mt-10",
          )}
        >
          {/* Sticky only while aside and article share a row; stacked, it would slide over the article. */}
          <aside className="bg-surface border-foreground/7 top-[84px] min-w-[240px] flex-[0_1_346px] rounded-[20px] border p-[22px] @max-[914px]:flex-[1_1_100%] @min-[914px]:sticky">
            {leadStat ? (
              <>
                <p className="display text-accent-ink text-[34px] leading-none tracking-[-0.04em]">
                  {leadStat.value}
                </p>
                <p className="text-muted mt-2 text-[13px]">{leadStat.label}</p>
                <div className="border-foreground/7 my-[18px] border-t" />
              </>
            ) : null}
            <dl className="flex flex-col gap-3.5 text-[14px] @max-[914px]:grid @max-[914px]:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] @max-[914px]:gap-x-6">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt className={monoLabel}>{fact.term}</dt>
                  <dd className="mt-1">{fact.detail}</dd>
                </div>
              ))}
              {project.requestPath ? (
                <div className="col-span-full">
                  <dt className={monoLabel}>Request path</dt>
                  <dd className="mt-2">
                    <RequestPath path={project.requestPath} />
                  </dd>
                </div>
              ) : null}
              <div className="col-span-full">
                <dt className={monoLabel}>Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-[22px] flex flex-wrap gap-2.5">
              <a
                href={askHref}
                className={cn(
                  pillVariants({ variant: "solid" }),
                  "h-11 flex-[1_1_220px] justify-between gap-3 pr-1.5 pl-5 font-semibold",
                )}
              >
                Ask me about this one <ArrowBadge dir="right" small />
              </a>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(
                    pillVariants({ variant: "outline" }),
                    "h-11 flex-[1_1_220px]",
                  )}
                >
                  {project.hrefLabel
                    ? `Open the ${project.hrefLabel.toLowerCase()}`
                    : "Open the live app"}{" "}
                  <Arrow dir="up-right" />
                </a>
              ) : null}
            </div>
          </aside>

          <article className="flex max-w-[720px] min-w-0 flex-[1_1_520px] flex-col gap-11">
            {caseStudy ? (
              <>
                <Block label="01 · The constraint">
                  <p className="text-ink-soft mt-3 max-w-[50ch] text-[17px] leading-[1.6] text-pretty">
                    {caseStudy.constraint}
                  </p>
                </Block>
                <Block label="02 · What I did">
                  <NumberedList items={caseStudy.steps} />
                </Block>
                <Block label="03 · What it cost">
                  <p className="text-ink-soft mt-3 max-w-[50ch] text-[17px] leading-[1.6] text-pretty">
                    {caseStudy.cost}
                  </p>
                </Block>
              </>
            ) : (
              <Block label="01 · What shipped">
                <NumberedList items={project.highlights} />
              </Block>
            )}
          </article>
        </div>

        <nav
          aria-label="Next project"
          className="bg-surface border-foreground/7 mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-3xl border px-[26px] py-6"
        >
          <div>
            <h2 className={monoLabel}>Next project</h2>
            <Link
              href={`/projects/${next.slug}`}
              className="group/arrow display mt-1.5 block text-[clamp(22px,2.4vw,32px)] tracking-[-0.03em]"
            >
              {next.title} <Arrow dir="right" />
            </Link>
          </div>
          {/* The prototype gives this pill the plain link hover, not the outline-pill one. */}
          <Link
            href="/projects"
            className={cn(
              pillVariants({ variant: "outline", size: "md" }),
              "hover:border-foreground/14 hover:text-accent-ink",
            )}
          >
            All projects
          </Link>
        </nav>
      </main>
      <SiteFooter variant="page" />
    </>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow">{label}</h2>
      {children}
    </div>
  );
}

/**
 * Steps and highlights. A tagged line opens with its layer (Server, API,
 * Data, UI, QA) as an inline pill, so it wraps with the text at 320px; the
 * pill is generated content with empty alt text, so it is not read out.
 */
function NumberedList({ items }: { items: readonly Line[] }) {
  return (
    <ol className="mt-3 flex flex-col gap-2">
      {items.map((item, index) => {
        const { text, tag } =
          typeof item === "string" ? { text: item, tag: undefined } : item;
        return (
          <li
            key={text}
            className="text-ink-soft border-foreground/7 flex gap-4 rounded-2xl border px-[18px] py-4 text-[15.5px] leading-[1.55]"
          >
            <span className="bg-foreground/6 text-muted grid h-[26px] flex-[0_0_26px] place-items-center rounded-full font-mono text-[11px]">
              {index + 1}
            </span>
            <span
              data-tag={tag}
              className={cn(
                tag &&
                  "before:border-accent-ink/30 before:text-accent-ink before:mr-2 before:inline-flex before:h-5 before:items-center before:rounded-full before:border before:px-2 before:align-[1px] before:font-mono before:text-[10.5px] before:tracking-[0.06em] before:uppercase before:content-[attr(data-tag)_/_'']",
              )}
            >
              {text}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
