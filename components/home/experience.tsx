"use client";

import { useState, type CSSProperties } from "react";

import { Arrow } from "@/components/ui/arrow";
import { experience, type Role } from "@/content/experience";
// clsx, not cn: keeps tailwind-merge out of the client bundle; nothing here relies on merging.
import { clsx } from "clsx";

const panelId = (role: Role) => `role-${role.slug}-details`;

const glyph = "duration-lift ease-fluid transition-[rotate,opacity]";

/** Both glyphs stay mounted and stacked, so opening turns one into the other. */
function ToggleGlyphs({ open }: { open: boolean }) {
  return (
    <>
      <span className={clsx(glyph, open && "rotate-90 opacity-0")}>+</span>
      <span className={clsx(glyph, !open && "-rotate-90 opacity-0")}>−</span>
    </>
  );
}

export function Experience() {
  const [openSlug, setOpenSlug] = useState<string | null>(
    experience[0]?.slug ?? null,
  );

  return (
    <section
      id="experience"
      className="defer-render scroll-mt-20 pt-(--space-section) [--defer-size:2150px] min-[480px]:[--defer-size:1650px] min-[760px]:[--defer-size:1360px] min-[1024px]:[--defer-size:1250px] xl:[--defer-size:1225px]"
    >
      <div data-reveal>
        <p className="eyebrow">Experience</p>
        <h2 className="display mt-3 mb-7 max-w-[24ch] text-[clamp(30px,3.6vw,48px)] leading-[1.02] tracking-[-0.035em] text-balance">
          WordPress and back end first, then front end, now both.
        </h2>
      </div>

      <ol
        data-reveal
        className="@container flex flex-col gap-2"
        style={{ "--i": 1 } as CSSProperties}
      >
        {experience.map((role) => {
          const open = openSlug === role.slug;
          return (
            <li
              key={role.slug}
              className={clsx(
                "relative rounded-[20px] border [transition:background-color_250ms_var(--ease-soft),border-color_250ms_var(--ease-soft),box-shadow_250ms_var(--ease-soft)]",
                open
                  ? "bg-surface-raised border-foreground/16 shadow-open z-[2]"
                  : "border-foreground/7 hover:border-foreground/18 z-[1]",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenSlug((current) =>
                    current === role.slug ? null : role.slug,
                  )
                }
                aria-expanded={open}
                aria-controls={open ? panelId(role) : undefined}
                className="group/row flex w-full flex-wrap items-baseline gap-x-7 gap-y-2 rounded-[20px] px-[22px] py-5 text-left @max-[860px]:pr-16"
              >
                <span className="text-muted inline-flex flex-[0_0_150px] items-center gap-2 font-mono text-[12.5px] whitespace-nowrap">
                  {role.current ? (
                    <span
                      aria-hidden
                      className="bg-accent-ink size-[7px] rounded-full"
                    />
                  ) : null}
                  {role.period}
                </span>
                <span className="min-w-0 flex-[1_1_220px]">
                  <span className="block text-[16.5px] font-semibold">
                    {role.title}
                  </span>
                  <span className="text-muted mt-0.5 block text-[14px]">
                    {role.company} · {role.place}
                  </span>
                </span>
                <span className="text-muted flex-[2_1_300px] text-[14.5px] leading-[1.5]">
                  {role.summary}
                </span>
                {/* Pinned top-right once the row wraps, so it never drops onto a line of its own. */}
                <span
                  aria-hidden
                  className="border-foreground/12 text-muted group-hover/row:border-foreground/30 group-hover/row:text-foreground duration-hover ml-auto grid size-[30px] flex-none place-items-center rounded-full border text-[15px] transition-colors *:[grid-area:1/1] @max-[860px]:absolute @max-[860px]:top-4 @max-[860px]:right-[22px]"
                >
                  <ToggleGlyphs open={open} />
                </span>
              </button>

              {open ? (
                <div
                  id={panelId(role)}
                  className="duration-expand ease-fluid flex flex-wrap gap-x-7 gap-y-3 px-[22px] pb-6 transition-[opacity,translate] starting:opacity-0 motion-safe:starting:-translate-y-1.5"
                >
                  <span className="flex-[0_0_150px]" />
                  <div className="min-w-0 flex-[1_1_520px]">
                    {role.bullets?.length ? (
                      <ul className="mb-4 flex max-w-[32rem] flex-col gap-2.5">
                        {role.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-ink-soft flex gap-3 text-[14.5px] leading-[1.55]"
                          >
                            <span
                              aria-hidden
                              className="bg-accent-ink mt-[9px] size-[5px] shrink-0 rounded-full"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(role.tags ?? []).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                      {role.link ? (
                        <a
                          href={role.link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group/arrow text-accent-ink ml-2 text-[13px] font-medium"
                        >
                          {role.link.label} <Arrow dir="up-right" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
