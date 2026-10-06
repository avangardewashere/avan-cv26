import type { CSSProperties } from "react";

import { pillVariants } from "@/components/ui/button";
import { phoneHref, profile } from "@/content/profile";
import { cn } from "@/lib/utils";

// The global focus ring is accent-ink, which is lime-on-lime inside this card.
const pill = cn(
  pillVariants({ variant: null, size: "lg" }),
  "focus-visible:outline-accent-foreground h-[50px]",
);

const outlinePill = cn(
  pill,
  "border-accent-foreground/30 hover:border-accent-foreground hover:text-accent-foreground border font-medium",
);

export function Contact() {
  return (
    <section
      id="contact"
      className="defer-render scroll-mt-20 pt-(--space-section) pb-12 [--defer-size:470px] min-[480px]:[--defer-size:370px] min-[760px]:[--defer-size:385px] xl:[--defer-size:450px]"
    >
      <div
        data-reveal
        style={{ "--i": 0 } as CSSProperties}
        className="relative"
      >
        <div
          aria-hidden
          className="bg-accent/18 absolute inset-x-7 -bottom-[22px] h-[120px] rounded-[28px]"
        />
        <div
          aria-hidden
          className="bg-accent/45 absolute inset-x-3.5 -bottom-[11px] h-[120px] rounded-[28px]"
        />

        {/* The site-wide selection is lime, which is invisible on this card. */}
        <div className="bg-accent text-accent-foreground shadow-contact selection:bg-accent-foreground selection:text-accent relative overflow-hidden rounded-[28px] p-[clamp(24px,5vw,64px)]">
          <div
            aria-hidden
            className="bg-accent-foreground/8 pointer-events-none absolute -right-[120px] -bottom-[160px] size-[420px] rounded-full"
          />
          <div
            aria-hidden
            className="border-accent-foreground/15 pointer-events-none absolute right-5 -bottom-10 size-[282px] rounded-full border"
          />

          {/* The section eyebrow, recoloured ink-on-lime for this card. */}
          <p className="eyebrow relative [--accent-ink:var(--accent-foreground)]">
            Contact
          </p>
          <h2 className="display mt-3.5 max-w-[18ch] text-[clamp(34px,5vw,72px)] leading-[.98] tracking-[-0.04em] text-balance">
            Got something that has to work the first time?
          </h2>
          <p className="text-accent-foreground/75 mt-5 max-w-[52ch] text-[16px] leading-[1.55] text-pretty">
            Open to remote full-stack roles, contract or full-time. Email is
            fastest; I reply within a day.
          </p>

          <div className="relative mt-7 flex flex-wrap gap-2.5">
            <a
              href={`mailto:${profile.email}`}
              className={cn(
                pill,
                "bg-accent-foreground text-media-chip-fg hover:text-media-chip-fg hover:bg-accent-foreground-hover selection:bg-accent! selection:text-accent-foreground! font-semibold max-[400px]:px-4 max-[400px]:text-[14px]",
              )}
            >
              {profile.email}
            </a>
            <a href={phoneHref} className={outlinePill}>
              {profile.phone}
            </a>
            <a href={profile.resumeHref} download className={outlinePill}>
              Download résumé
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
