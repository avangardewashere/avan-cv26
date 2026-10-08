"use client";

// clsx, not cn: keeps tailwind-merge out of the client bundle; nothing here relies on merging.
import { clsx } from "clsx";
import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { PROMO_BANNER_SECONDS, promos, type Promo } from "@/content/profile";
import { afterSplash } from "@/lib/splash";

const REDUCE = "(prefers-reduced-motion: reduce)";

/** Portrait screens get a portrait banner when the promo has one. */
const PORTRAIT = "(max-aspect-ratio: 4/5)";

type Phase = "video" | "banner";

/** play() rejecting with AbortError only means a pause() came first: the visitor moved on. */
const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

/*
 * The dark chip every control on the hero sits on (--media-chip-bg, 70%
 * near-black, blurred), so white type and marks stay legible over the
 * brightest frame of any video or banner.
 */
const chip =
  "bg-media-chip text-media-chip-fg border border-white/12 backdrop-blur-md";
const roundButton = clsx(
  chip,
  "hover:text-accent grid size-11 place-items-center rounded-full transition-colors",
);

/*
 * A landscape banner on a screen of another shape (see Promo.banner.fit).
 * Portrait screens always show a banner whole.
 */
const BANNER_FIT: Record<Promo["banner"]["fit"], string> = {
  left: "object-cover object-left [@media(max-aspect-ratio:4/5)]:object-contain [@media(max-aspect-ratio:4/5)]:object-center [@media(min-aspect-ratio:16/9)]:object-contain [@media(min-aspect-ratio:16/9)]:[mask-image:linear-gradient(to_right,black_110vh,transparent_177vh)]",
  whole:
    "object-contain [@media(min-aspect-ratio:3/2)_and_(max-aspect-ratio:16/9)]:object-cover",
};

/**
 * The first screen: the latest projects as full-screen promos. Each plays
 * its video once, then settles on its banner; after PROMO_BANNER_SECONDS
 * the next promo starts, and the last banner stays (no endless loop).
 *
 * Swipeable: the slides sit in a native scroll-snap track, so touch and
 * trackpad swipes just work; the `|` pagination, keyboard and screen
 * readers use the buttons. A slide already watched shows its banner when
 * you come back to it, with Replay. Once the visitor picks a slide, the
 * hero stops advancing on its own.
 *
 * One Pause button holds both the video and the countdown to the next
 * promo (WCAG 2.2.2). Muted autoplay is the only autoplay browsers allow, so
 * sound is one tap away where a video has a track. Reduced motion starts on
 * the banners and never advances on its own.
 */
export function HeroCarousel() {
  const count = promos.length;
  const track = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const pauseButton = useRef<HTMLButtonElement>(null);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [phases, setPhases] = useState<Phase[]>(() =>
    promos.map(() => "video"),
  );
  const phasesRef = useRef(phases);
  const [held, setHeld] = useState(false);
  // Once the visitor picks a slide (a bar or a swipe), the hero stops moving on its own.
  const [manual, setManual] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [status, setStatus] = useState({ text: "", n: 0 });

  const setPhase = (i: number, phase: Phase) => {
    phasesRef.current = phasesRef.current.map((p, k) => (k === i ? phase : p));
    setPhases(phasesRef.current);
  };

  /**
   * A video that cannot play (no playable source, a decode error, autoplay
   * blocked by data saver or low power) gives way to its banner, so the
   * slide still reaches Replay, About and the countdown.
   */
  const settle = (i: number) => {
    videos.current[i]?.pause();
    setPhase(i, "banner");
  };

  /** Starts slide `i`: its video from the top, unless it was already watched. */
  const start = (i: number, motionReduced: boolean) => {
    videos.current.forEach((video, k) => {
      if (video && k !== i) video.pause();
    });
    // Reduced motion never plays on its own: a slide left mid-replay comes back on its banner.
    if (motionReduced) {
      if (phasesRef.current[i] === "video") settle(i);
      return;
    }
    if (phasesRef.current[i] === "banner") return;
    const video = videos.current[i];
    if (!video) return;
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)
      return settle(i);
    video.currentTime = 0;
    video.muted = muted;
    video.play().catch((error: unknown) => {
      if (!isAbort(error)) settle(i);
    });
  };
  const settleFirst = useEffectEvent(() => settle(0));

  /** Shows slide `i`, from the timer or from a pagination button. */
  const show = (i: number, byUser: boolean) => {
    if (i < 0 || i >= count) return;
    const el = track.current;
    // No `behavior`: the track's motion-safe:scroll-smooth decides, so reduced motion jumps.
    el?.scrollTo({ left: i * el.clientWidth });
    // The bar for the slide already showing: nothing starts over, and the countdown carries on.
    if (i === indexRef.current) return;
    indexRef.current = i;
    setIndex(i);
    start(i, reduced);
    if (byUser) {
      setHeld(false);
      setManual(true);
    }
    if (byUser)
      setStatus(({ n }) => ({
        text: `${promos[i].title}, ${i + 1} of ${count}`,
        n: n + 1,
      }));
  };

  const advance = useEffectEvent(() => show(indexRef.current + 1, false));
  const arrive = useEffectEvent((i: number) => {
    // A swipe landed on another slide: the visitor chose it, so any pause is lifted.
    indexRef.current = i;
    setIndex(i);
    setHeld(false);
    setManual(true);
    start(i, reduced);
    setStatus(({ n }) => ({
      text: `${promos[i].title}, ${i + 1} of ${count}`,
      n: n + 1,
    }));
  });

  useEffect(() => {
    if (window.matchMedia(REDUCE).matches) {
      phasesRef.current = promos.map(() => "banner");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- a media query only the client can read
      setReduced(true);
      setPhases(phasesRef.current);
      return;
    }
    // Under the first-visit splash, AMYGO waits for it (the splash starts it just before it lifts).
    return afterSplash(() => {
      const first = videos.current[0];
      if (!first || indexRef.current !== 0 || phasesRef.current[0] !== "video")
        return;
      // Every source may have failed before hydration attached onError.
      if (first.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)
        return settleFirst();
      first.play().catch((error: unknown) => {
        if (!isAbort(error)) settleFirst();
      });
    });
  }, []);

  const phase = phases[index];

  /*
   * The progress line and the move to the next promo share one clock: the
   * line fills over the video plus PROMO_BANNER_SECONDS, and reaching the
   * end is what advances, so the two can never drift apart. Written to the
   * DOM each frame (no React state per frame). Pause freezes both; a
   * resumed countdown carries on from where it stopped.
   */
  const line = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const bannerElapsed = useRef(0);
  useEffect(() => {
    bannerElapsed.current = 0;
  }, [index, phase]);
  useEffect(() => {
    const running = !reduced && !manual && index < count - 1;
    if (line.current) line.current.style.opacity = running ? "1" : "0";
    if (!running) return;
    const video = videos.current[index];
    const hold = PROMO_BANNER_SECONDS * 1000;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // A banner reached without the video playing (see settle) times only its hold.
      const length =
        video &&
        Number.isFinite(video.duration) &&
        (phase === "video" || video.currentTime > 0)
          ? video.duration * 1000
          : 0;
      // Capped per frame: frames stop in a background tab, and time away should not count.
      if (phase === "banner" && !held)
        bannerElapsed.current += Math.min(now - last, 100);
      last = now;
      if (phase === "banner" && bannerElapsed.current >= hold) {
        advance();
        return;
      }
      const done =
        phase === "video"
          ? (video?.currentTime ?? 0) * 1000
          : length + bannerElapsed.current;
      const progress = length + hold > 0 ? done / (length + hold) : 0;
      if (fill.current)
        fill.current.style.transform = `scaleX(${Math.min(progress, 1)})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, phase, held, reduced, manual, count]);

  // Swipes: whichever slide is mostly in view becomes the current one.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = slides.indexOf(entry.target as HTMLElement);
          if (entry.intersectionRatio >= 0.6 && i !== indexRef.current)
            arrive(i);
        }
      },
      { root: el, threshold: [0.6] },
    );
    slides.forEach((slide) => observer.observe(slide));
    // Keep the current slide aligned when the window changes size.
    const realign = () =>
      el.scrollTo({
        left: indexRef.current * el.clientWidth,
        behavior: "instant",
      });
    window.addEventListener("resize", realign);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", realign);
    };
  }, []);

  const current = promos[index];
  const onBanner = phase === "banner";
  const nextPending = onBanner && index < count - 1 && !reduced && !manual;

  const togglePause = () => {
    const video = videos.current[index];
    if (held) {
      setHeld(false);
      if (!onBanner) video?.play().catch(() => {});
    } else {
      setHeld(true);
      video?.pause();
    }
  };

  const replay = () => {
    setHeld(false);
    setPhase(index, "video");
    const video = videos.current[index];
    if (video) {
      video.currentTime = 0;
      video.muted = muted;
      video.play().catch(() => {});
    }
    // The Replay button is about to go; keep keyboard focus on the hero.
    requestAnimationFrame(() => pauseButton.current?.focus());
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    const video = videos.current[index];
    if (!video) return;
    video.muted = next;
    if (!next && video.paused && !held) video.play().catch(() => {});
  };

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Latest projects"
      className="relative h-svh overflow-hidden"
      style={{ backgroundColor: current.edge }}
    >
      {/* Not a tab stop: the `|` buttons are the keyboard way through the slides. */}
      <div
        ref={track}
        tabIndex={-1}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {promos.map((promo, i) => {
          const showBanner = phases[i] === "banner";
          return (
            <div
              key={promo.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${promo.title}, ${i + 1} of ${count}`}
              inert={i !== index}
              className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden"
              style={{ backgroundColor: promo.edge }}
            >
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                // Fills the screen when it is wide; whole and centred when it is tall.
                className="absolute inset-0 size-full object-contain landscape:object-cover"
                poster={promo.video.poster}
                muted
                playsInline
                preload={i === 0 ? "metadata" : "none"}
                aria-label={promo.label}
                aria-hidden={showBanner}
                onEnded={() => setPhase(i, "banner")}
                onError={() => settle(i)}
              >
                <source
                  src={promo.video.src720}
                  type="video/mp4"
                  media="(max-width: 960px)"
                />
                {/* A failed source reports here, not on the video; the last one failing means none will play. */}
                <source
                  src={promo.video.src1080}
                  type="video/mp4"
                  onError={() => settle(i)}
                />
              </video>

              {/* The banner: in the DOM from the start, so it is decoded before the crossfade. */}
              <div
                className="duration-expand ease-fluid absolute inset-0 transition-opacity"
                style={{
                  opacity: showBanner ? 1 : 0,
                  backgroundColor: promo.edge,
                }}
                aria-hidden={!showBanner}
              >
                {/*
                  Tall screens show the banner whole, clear of the floating
                  header above and the controls below; wide ones bleed.
                */}
                <div className="absolute inset-0 [@media(max-aspect-ratio:4/5)]:top-[76px] [@media(max-aspect-ratio:4/5)]:bottom-[calc(clamp(16px,4vh,40px)+116px)]">
                  <picture>
                    {promo.banner.portrait ? (
                      <source
                        media={PORTRAIT}
                        srcSet={promo.banner.portrait.srcSet}
                        sizes="100vw"
                        width={promo.banner.portrait.width}
                        height={promo.banner.portrait.height}
                      />
                    ) : null}
                    {/* Pre-sized local WebP, art-directed per screen shape: a plain <picture>, no optimizer. */}
                    <img
                      srcSet={promo.banner.landscape.srcSet}
                      sizes="100vw"
                      width={promo.banner.landscape.width}
                      height={promo.banner.landscape.height}
                      alt={promo.banner.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className={clsx(
                        "absolute inset-0 size-full",
                        BANNER_FIT[promo.banner.fit],
                      )}
                    />
                  </picture>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/*
        The controls float over the track, so they stay put while slides
        swipe under them. Tall screens: pagination at the bottom, actions
        above it. Wide screens: pagination left, actions right.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[clamp(16px,4vh,40px)] flex flex-col-reverse items-center gap-3 px-4 landscape:flex-row landscape:items-end landscape:justify-between landscape:px-[clamp(16px,4vw,48px)]">
        {/* Pagination: one `|` per promo, low opacity until current. */}
        <div
          className={clsx(
            chip,
            "pointer-events-auto inline-flex h-11 items-center rounded-full pr-4 pl-1.5",
          )}
        >
          {promos.map((promo, i) => {
            const active = i === index;
            return (
              <button
                key={promo.id}
                type="button"
                onClick={() => show(i, true)}
                aria-label={`Show ${promo.title}, ${i + 1} of ${count}`}
                aria-current={active ? "true" : undefined}
                className="group/bar grid h-11 w-7 place-items-center"
              >
                <span
                  aria-hidden
                  className={clsx(
                    "duration-hover block w-[3px] rounded-full transition-[height,background-color,opacity]",
                    active
                      ? "bg-accent h-6 opacity-100"
                      : "h-3.5 bg-white opacity-45 group-hover/bar:opacity-80",
                  )}
                />
              </button>
            );
          })}
          <span
            aria-hidden
            className="ml-1.5 font-mono text-[11.5px] tracking-[0.12em] uppercase"
          >
            {current.title}
          </span>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2.5">
          {onBanner ? (
            <>
              <button
                type="button"
                onClick={replay}
                className="bg-accent text-accent-foreground hover:bg-accent-hover inline-flex h-11 items-center rounded-full px-5 text-[15px] font-semibold transition-colors motion-safe:active:scale-[0.98]"
              >
                Replay video
                <span className="sr-only">, {current.title}</span>
              </button>
              <Link
                href={current.projectHref}
                className={clsx(
                  chip,
                  "hover:text-accent inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium transition-colors",
                )}
              >
                About the project
                <span className="sr-only">, {current.title}</span>
              </Link>
            </>
          ) : null}

          {/* Pause holds the video and the countdown to the next promo. */}
          {!onBanner || nextPending ? (
            <button
              ref={pauseButton}
              type="button"
              onClick={togglePause}
              aria-label={
                onBanner
                  ? held
                    ? "Resume slideshow"
                    : "Pause slideshow"
                  : held
                    ? "Play video"
                    : "Pause video"
              }
              className={roundButton}
            >
              <svg
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="currentColor"
                aria-hidden
              >
                {held ? (
                  <path d="M4.5 2.5v11l9-5.5z" />
                ) : (
                  <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" />
                )}
              </svg>
            </button>
          ) : null}

          {!onBanner && current.video.audio ? (
            <button
              type="button"
              onClick={toggleSound}
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
              className={roundButton}
            >
              <svg
                viewBox="0 0 16 16"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2.5 6h2.5l3.5-3v10L5 10H2.5z" fill="currentColor" />
                {muted ? (
                  <path d="M11 6l3 4M14 6l-3 4" />
                ) : (
                  <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" />
                )}
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/*
        Time to the next promo: a 2px line along the bottom edge, lime on the
        chip's near-black so it reads over any frame. Hidden when nothing
        comes next (the last promo, after the visitor picks a slide, reduced
        motion). Decorative: Pause and the pagination carry the meaning.
      */}
      <div
        ref={line}
        aria-hidden
        className="duration-hover bg-media-chip pointer-events-none absolute inset-x-0 bottom-0 h-[2px] opacity-0 transition-opacity"
      >
        <div
          ref={fill}
          className="bg-accent h-full origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Announces slide changes the visitor made; the automatic ones stay quiet. */}
      <p role="status" className="sr-only">
        <span key={status.n}>{status.text}</span>
      </p>
    </section>
  );
}
