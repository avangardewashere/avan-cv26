import { ArrowBadge } from "@/components/ui/arrow";
import { pillVariants } from "@/components/ui/button";
import { about, careerStats, profile } from "@/content/profile";
import { cn } from "@/lib/utils";

/**
 * Who built it: the first section after the promo. The promo is the hero,
 * so this one introduces me: a short story on the left, the facts an
 * employer scans for on the right, then the career figures as proof.
 */
export function About() {
  return (
    <section id="about" className="scroll-mt-20 pt-(--space-section)">
      <div className="flex flex-wrap items-center gap-2.5">
        <p className="eyebrow">About me</p>
        <span className="border-accent-ink/30 bg-accent-ink/8 text-accent-ink inline-flex h-[26px] items-center gap-2 rounded-full border px-2.5 text-[12.5px]">
          <span aria-hidden className="relative grid size-1.5 place-items-center">
            <span className="bg-accent-ink animate-pulse-dot absolute inset-0 rounded-full" />
            <span className="bg-accent-ink size-1.5 rounded-full" />
          </span>
          {profile.availability}
        </span>
      </div>

      <h2 className="display mt-5 max-w-[20ch] text-[clamp(34px,4.6vw,64px)] leading-[1.02] tracking-[-0.04em] text-balance">
        {about.headline}{" "}
        <span className="text-accent-ink">{about.headlineAccent}</span>
      </h2>

      <div className="mt-[clamp(32px,5vh,48px)] grid gap-x-16 gap-y-10 min-[960px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="text-ink-soft max-w-[62ch] space-y-5 text-[clamp(16px,1.25vw,18px)] leading-[1.65] text-pretty">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}

          <div className="flex flex-wrap gap-2.5 pt-3">
            {/* Plain anchor: next/link ignores a second click once the URL is already #work. */}
            <a
              href="#work"
              className={cn(
                pillVariants({ variant: "accent", size: "lg" }),
                "gap-3 pr-1.5",
              )}
            >
              See the work <ArrowBadge dir="down" />
            </a>
            <a
              href={profile.resumeHref}
              download
              className={pillVariants({ variant: "outline", size: "lg" })}
            >
              Résumé
            </a>
          </div>
        </div>

        {/* One tray, one plate: the same double bezel as the figures below. */}
        <div className="border-foreground/6 bg-foreground/[2.5%] shadow-stat self-start rounded-[26px] border p-1.5">
          <dl className="bg-surface border-foreground/8 shadow-core divide-foreground/8 divide-y rounded-[19px] border px-[22px]">
            {about.facts.map((fact) => (
              <div key={fact.term} className="py-4">
                <dt className="text-subtle font-mono text-[11.5px] tracking-[0.08em] uppercase">
                  {fact.term}
                </dt>
                <dd className="mt-1.5 text-[15px] leading-[1.45]">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/*
        One tray holding four plates: a single soft shadow on the tray, an
        inset highlight on each plate. Concentric radii: 26 - 1 border - 6 padding = 19.
      */}
      <ul className="border-foreground/6 bg-foreground/[2.5%] shadow-stat mt-[clamp(40px,6vh,64px)] grid grid-cols-1 gap-1.5 rounded-[26px] border p-1.5 min-[448px]:grid-cols-2 min-[900px]:grid-cols-4">
        {careerStats.map((stat) => (
          <li
            key={stat.label}
            className="bg-surface border-foreground/8 shadow-core rounded-[19px] border px-[22px] pt-[22px] pb-5"
          >
            <p className="display text-[40px] leading-none tracking-[-0.04em]">
              {stat.value}
            </p>
            <p className="text-muted mt-2.5 text-[13.5px] leading-[1.4]">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
