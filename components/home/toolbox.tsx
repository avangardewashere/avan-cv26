import type { CSSProperties } from "react";

import { education } from "@/content/education";
import { skillGroups, type Skill } from "@/content/skills";
import { cn } from "@/lib/utils";

const cardHeading =
  "text-muted mb-3.5 font-mono text-[12px] font-medium tracking-[0.08em] uppercase";

const cardPadding = "px-4 py-5 min-[480px]:px-[22px]";

const revealDelay = (i: number) => ({ "--i": Math.min(i, 5) }) as CSSProperties;

/** The stack, interface down to infrastructure; then what cuts across it. */
const layers = skillGroups.filter((group) => group.layer);
const crossCutting = skillGroups.filter((group) => !group.layer);

function SkillChips({ items }: { items: readonly Skill[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((skill) => (
        <li
          key={skill.name}
          className={cn(
            "inline-flex h-[30px] items-center rounded-full border px-3 text-[13.5px]",
            skill.core
              ? "bg-accent-ink/10 border-accent-ink/35 text-foreground font-medium"
              : "bg-foreground/4 border-foreground/7 text-muted",
          )}
        >
          {skill.name}
          {skill.core ? <span className="sr-only"> (daily driver)</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function Toolbox() {
  return (
    <section
      id="toolbox"
      className="defer-render border-foreground/6 from-foreground/[3.5%] to-foreground/1 relative mt-(--space-section) scroll-mt-20 rounded-[32px] border bg-linear-to-b p-[clamp(20px,4vw,48px)] [--defer-size:1500px] min-[480px]:[--defer-size:1220px] min-[760px]:[--defer-size:980px] xl:[--defer-size:820px]"
    >
      {/* Revealed via a wrapper: a translated anchor target makes nav jumps land short. */}
      <div data-reveal>
        <p className="eyebrow">Toolbox</p>
        <h2 className="display mt-3 mb-7 max-w-[24ch] text-[clamp(30px,3.6vw,48px)] leading-[1.02] tracking-[-0.035em] text-balance">
          Shipped with, not read about.{" "}
          <span className="text-muted">Highlighted ones are daily drivers.</span>
        </h2>
      </div>

      {/*
        One tray, four plates: the layers of the stack in order. Concentric
        radii: 26 - 1 border - 6 padding = 19. The index and the short wire
        between plates are pseudo-elements.
      */}
      <div
        data-reveal
        style={revealDelay(1)}
        className="border-foreground/6 bg-foreground/[2.5%] flex flex-col gap-1.5 rounded-[26px] border p-1.5"
      >
        {layers.map((group) => (
          <div
            key={group.title}
            className={cn(
              "bg-surface border-foreground/8 shadow-core relative rounded-[19px] border min-[720px]:grid min-[720px]:grid-cols-[180px_1fr] min-[720px]:items-baseline min-[720px]:gap-x-6",
              cardPadding,
              "not-first:before:bg-accent-ink/50 not-first:before:absolute not-first:before:-top-[7px] not-first:before:left-[24px] not-first:before:h-1.5 not-first:before:w-px min-[480px]:not-first:before:left-[30px]",
            )}
          >
            {/* The index is generated content with empty alt text, so "01" stays out of the heading's name. */}
            <h3
              data-layer={group.layer}
              className={cn(
                cardHeading,
                "before:text-accent-ink before:mr-2.5 before:content-[attr(data-layer)_/_''] min-[720px]:mb-0",
              )}
            >
              {group.title}
            </h3>
            <SkillChips items={group.items} />
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3">
        {crossCutting.map((group, i) => (
          <div
            key={group.title}
            data-reveal
            style={revealDelay(i + 2)}
            className={cn(
              "bg-surface border-foreground/8 shadow-panel rounded-[20px] border",
              cardPadding,
            )}
          >
            <h3 className={cardHeading}>{group.title}</h3>
            <SkillChips items={group.items} />
          </div>
        ))}

        <div
          data-reveal
          style={revealDelay(crossCutting.length + 2)}
          className={cn(
            "border-foreground/7 col-span-full rounded-[20px] border",
            cardPadding,
          )}
        >
          <h3 className={cardHeading}>Education</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-8 gap-y-3.5">
            {education.map((entry) => (
              <p
                key={entry.credential}
                className="text-[14.5px] leading-[1.55]"
              >
                <span className="font-semibold">{entry.credential}</span>
                <br />
                <span className="text-muted">
                  {entry.school} · {entry.period}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
