"use client";

import Link from "next/link";
import { flushSync } from "react-dom";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";

import { RailControls } from "@/components/home/rail-controls";
import { Arrow } from "@/components/ui/arrow";
import { pillVariants } from "@/components/ui/button";

/** One project, its card already rendered on the server (so no project data ships beyond this). */
export type RailItem = {
  slug: string;
  title: string;
  href: string;
  /** A small banner for the wild card's preview of the projects not dealt. */
  thumb: string | null;
  card: ReactNode;
};

const RAIL_ID = "work-rail";

/** How many project cards are dealt; the wild card makes one more slide. */
export const DEAL = 5;

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];
const word = (n: number) => NUMBER_WORDS[n] ?? String(n);

/*
 * The current deal, kept for as long as this page load lives: going back to
 * the homepage (Back, the logo, the header's Work link) shows the same five,
 * so the project just opened is still there. A reload starts a new deal.
 */
let remembered: string[] | null = null;

/** `count` slugs at random, kept in the list's own order (server-side work first when dealt). */
function deal(
  items: readonly RailItem[],
  count: number,
  not?: string,
): string[] {
  // Nothing to choose between: show them all (and never loop looking for a different five).
  if (items.length <= count) return items.map((item) => item.slug);
  const order = items.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const picked = order
    .slice(0, count)
    .sort((a, b) => a - b)
    .map((i) => items[i].slug);
  // A shuffle that deals the same five again would look like a dead button; deal again.
  return not && picked.join() === not ? deal(items, count, not) : picked;
}

const subscribe = () => () => {};

/**
 * The Work carousel: five projects dealt at random per page load, then a
 * wild card that previews the rest, links to the archive and deals again.
 *
 * The page is prebuilt, so the server renders the first five in list order
 * and the browser deals its own five after hydration, unless the rail is
 * already on screen (a /#work link, a reload mid-page), where swapping cards
 * in view would be jarring. Every compact card is the same height
 * (project-card.tsx), so a new deal never moves the page.
 */
export function WorkRail({
  items,
  slideClass,
}: {
  items: readonly RailItem[];
  slideClass: string;
}) {
  const [dealt, setDealt] = useState(
    () => remembered ?? items.slice(0, DEAL).map((item) => item.slug),
  );
  const [status, setStatus] = useState({ text: "", n: 0 });
  // True once hydrated: Shuffle only shows when it can work.
  const interactive = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (remembered) return;
    const rail = document.getElementById(RAIL_ID);
    if (rail && rail.getBoundingClientRect().top < window.innerHeight) {
      remembered = items.slice(0, DEAL).map((item) => item.slug);
      return;
    }
    remembered = deal(items, DEAL);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a random deal only the browser may make, after hydration
    setDealt(remembered);
  }, [items]);

  const shown = items.filter((item) => dealt.includes(item.slug));
  const rest = items.filter((item) => !dealt.includes(item.slug));

  const shuffle = (event: MouseEvent) => {
    const next = deal(items, DEAL, dealt.join());
    remembered = next;
    // Commit the new cards first, so the jump below lands on them: scrolling
    // before the swap left the browser re-snapping to the old cards.
    flushSync(() => setDealt(next));
    const titles = items
      .filter((item) => next.includes(item.slug))
      .map((item) => item.title);
    setStatus(({ n }) => ({
      text: `Dealt five projects: ${titles.join(", ")}.`,
      n: n + 1,
    }));
    // A pointer user sees the new cards; a keyboard user keeps focus here, on screen.
    if (event.detail > 0)
      document
        .getElementById(RAIL_ID)
        ?.scrollTo({ left: 0, behavior: "instant" });
  };

  return (
    <>
      {/*
        Bleeds into the page gutter so a card can peek past the column edge,
        while scroll-padding snaps cards back onto it. role="list": Safari
        drops list semantics from unstyled lists. No visible scrollbar: the
        peeking card, the buttons and the counter show it scrolls (without
        JavaScript, the noscript style below brings it back). The few px of
        vertical padding keep focus rings inside the scroller, which clips
        on both axes.
      */}
      <ul
        id={RAIL_ID}
        role="list"
        aria-label="Projects"
        className="mx-[calc(var(--gutter)*-1)] flex list-none snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto overscroll-x-contain px-(--gutter) pt-2 pb-3 [scrollbar-width:none] motion-safe:scroll-smooth print:mx-0 print:flex-wrap print:overflow-visible print:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((item) => (
          <li
            key={item.slug}
            className={`flex shrink-0 snap-start print:min-w-0 print:basis-[calc((100%-12px)/2)] ${slideClass}`}
          >
            {item.card}
          </li>
        ))}

        <li className={`flex shrink-0 snap-start print:hidden ${slideClass}`}>
          <article className="border-accent-ink/25 bg-accent-ink/[4%] flex min-w-0 flex-1 flex-col rounded-3xl border p-[18px]">
            <h3 className="display m-0 text-[20px] leading-[1.15] tracking-[-0.03em]">
              {`${word(rest.length)} more projects`}
            </h3>

            {/* The projects not dealt this time: up to four banners, small and cropped flat so this card stays no taller than a project card. Decorative; the titles below are the links. */}
            <div aria-hidden className="mt-3 grid grid-cols-2 gap-1.5">
              {rest.slice(0, 4).map((item) =>
                item.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={item.slug}
                    src={item.thumb}
                    alt=""
                    width={960}
                    height={540}
                    loading="lazy"
                    decoding="async"
                    className="border-foreground/8 bg-surface-well aspect-[5/2] w-full rounded-[10px] border object-cover"
                  />
                ) : (
                  <span
                    key={item.slug}
                    className="bg-surface-well aspect-[5/2] rounded-[10px]"
                  />
                ),
              )}
            </div>

            {/* One line per title, so this card's height doesn't depend on which four are listed. */}
            <ul className="m-0 mt-3 list-none space-y-1 p-0 text-[13.5px] leading-[1.35]">
              {rest.map((item) => (
                <li key={item.slug} className="truncate">
                  <Link href={item.href} className="text-ink-soft">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <Link
                href="/projects"
                className={`${pillVariants({ variant: "accent", size: "sm" })} gap-1.5`}
              >
                {`All ${word(items.length).toLowerCase()} projects`}{" "}
                <Arrow dir="right" />
              </Link>
              {/* Space kept from the first paint (invisible, so not focusable) and shown once it can work, so hydrating doesn't move the page. */}
              <button
                type="button"
                onClick={shuffle}
                className={`${pillVariants({ variant: "outline", size: "sm" })} ${interactive ? "" : "invisible"}`}
              >
                Shuffle
              </button>
            </div>
          </article>
        </li>

        {/* Print only: the four not dealt, so a printed page still shows every project. */}
        {rest.map((item) => (
          <li
            key={item.slug}
            className="hidden print:flex print:min-w-0 print:basis-[calc((100%-12px)/2)]"
          >
            {item.card}
          </li>
        ))}
      </ul>
      <noscript>
        <style>{`#${RAIL_ID}{scrollbar-width:thin!important}`}</style>
      </noscript>

      <div className="mt-4 print:hidden">
        <RailControls
          railId={RAIL_ID}
          count={shown.length + 1}
          version={dealt.join()}
        />
      </div>

      <p role="status" className="sr-only">
        <span key={status.n}>{status.text}</span>
      </p>
    </>
  );
}
