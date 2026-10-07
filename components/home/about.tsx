import { CapabilityTabs } from "@/components/home/capability-tabs";
import { Arrow } from "@/components/ui/arrow";
import { pillVariants } from "@/components/ui/button";
import { about, capabilities, profile } from "@/content/profile";

/**
 * Who built it: the first section after the promo. Short by default: a
 * one-paragraph summary, the story behind "More about me" (a native
 * <details>, so it opens without JavaScript), the proof as tabs on the
 * headline's three themes, and the facts an employer scans for.
 */
export function About() {
  return (
    <section id="about" className="scroll-mt-20 pt-(--space-section)">
      {/* A real availability flag, so the pulsing dot carries meaning. */}
      <p className="border-accent-ink/30 bg-accent-ink/8 text-accent-ink m-0 inline-flex h-[30px] items-center gap-2 rounded-full border px-3 text-[13px]">
        <span aria-hidden className="relative grid size-1.5 place-items-center">
          <span className="bg-accent-ink animate-pulse-dot absolute inset-0 rounded-full" />
          <span className="bg-accent-ink size-1.5 rounded-full" />
        </span>
        {profile.availability}
      </p>

      <h2 className="display mt-5 max-w-[24ch] text-[clamp(32px,4.2vw,58px)] leading-[1.04] tracking-[-0.04em] text-balance">
        {about.headline}{" "}
        <span className="text-accent-ink">{about.headlineAccent}</span>
      </h2>

      <div className="mt-[clamp(28px,4.5vh,44px)] grid gap-x-14 gap-y-10 min-[1024px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="max-w-[60ch]">
          <p className="text-ink-soft m-0 text-[clamp(16px,1.25vw,18px)] leading-[1.6] text-pretty">
            {about.summary}
          </p>

          <details className="disclosure group/more mt-4">
            <summary className="group/arrow text-accent-ink inline-flex cursor-pointer list-none items-center gap-2 text-[14px] font-medium [&::-webkit-details-marker]:hidden">
              <span className="group-open/more:hidden">More about me</span>
              <span className="hidden group-open/more:inline">Show less</span>
              {/* The wrapper turns; the arrow keeps its own hover nudge, which then points the right way when open. */}
              <span className="duration-expand ease-fluid inline-flex transition-[rotate] group-open/more:rotate-180">
                <Arrow dir="down" />
              </span>
            </summary>
            <div className="text-muted flex flex-col gap-4 pt-4 text-[15.5px] leading-[1.65] text-pretty">
              {about.story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </details>

          <a
            href={profile.resumeHref}
            download
            className={`${pillVariants({ variant: "outline", size: "lg" })} mt-7`}
          >
            Download résumé
          </a>
        </div>

        <CapabilityTabs items={capabilities} />
        {/* Without JavaScript the tabs can't switch, so every proof panel shows, stacked. */}
        <noscript>
          <style>
            {
              ".capability-tabs [role=tabpanel]{visibility:visible!important;grid-area:auto!important}"
            }
          </style>
        </noscript>
      </div>

      {/* One hairline above the group, none between items. */}
      <dl className="border-foreground/8 mt-[clamp(36px,6vh,56px)] grid grid-cols-1 gap-x-8 gap-y-5 border-t pt-6 min-[480px]:grid-cols-2 min-[1024px]:grid-cols-4">
        {about.facts.map((fact) => (
          <div key={fact.term}>
            <dt className="text-subtle text-[13px]">{fact.term}</dt>
            <dd className="m-0 mt-1 text-[15px] leading-[1.45]">
              {fact.detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
