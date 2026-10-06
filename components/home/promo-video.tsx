"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { promo } from "@/content/profile";

const REDUCE = "(prefers-reduced-motion: reduce)";

/** Portrait screens get the portrait poster; everything else the landscape one. */
const PORTRAIT = "(max-aspect-ratio: 4/5)";

const chip =
  "bg-media-chip text-media-chip-fg hover:text-accent grid size-10 place-items-center rounded-full backdrop-blur transition-colors";

/**
 * The first screen: the AMYGO promo, edge to edge, nothing over it (the
 * video carries its own titles). It plays `promo.plays` times, then
 * crossfades to the poster with a Replay button. Muted autoplay is the only
 * autoplay browsers allow, so sound is one tap away; pause is there because
 * it runs past five seconds (WCAG 2.2.2). Reduced motion starts on the poster.
 */
export function PromoVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const pauseButton = useRef<HTMLButtonElement>(null);
  const plays = useRef(0);
  const [phase, setPhase] = useState<"video" | "poster">("video");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (window.matchMedia(REDUCE).matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- a media query only the client can read
      setPhase("poster");
      return;
    }
    // play() rejects when the browser blocks autoplay (data saver, low power); the first frame stays.
    el.play().catch(() => {});
  }, []);

  const onEnded = () => {
    const el = video.current;
    if (!el) return;
    plays.current += 1;
    if (plays.current < promo.plays) {
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      setPhase("poster");
    }
  };

  const replay = () => {
    const el = video.current;
    if (!el) return;
    plays.current = 0;
    el.currentTime = 0;
    setPhase("video");
    el.play().catch(() => {});
    // The Replay button is about to disappear; keep keyboard focus on the screen.
    requestAnimationFrame(() => pauseButton.current?.focus());
  };

  const togglePlay = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  const toggleSound = () => {
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted && el.paused) el.play().catch(() => {});
  };

  const onPoster = phase === "poster";

  return (
    <section
      id="hero"
      aria-label={promo.label}
      // The video's and the posters' own edge colour, so letterboxing is seamless.
      className="relative h-svh overflow-hidden bg-[#0b0c0e]"
    >
      <video
        ref={video}
        // Fills the screen when it is wide; whole and centred when it is tall.
        className="absolute inset-0 size-full object-contain landscape:object-cover"
        poster={promo.videoPoster}
        muted
        playsInline
        preload="metadata"
        aria-label={promo.label}
        aria-hidden={onPoster}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
      >
        <source src={promo.src720} type="video/mp4" media="(max-width: 960px)" />
        <source src={promo.src1080} type="video/mp4" />
      </video>

      {/* The poster: always in the DOM so it is decoded before the crossfade. */}
      <div
        // Opaque: where the poster does not fill the screen, the paused video must not show through.
        className="duration-expand ease-fluid absolute inset-0 bg-[#0b0c0e] transition-opacity"
        style={{ opacity: onPoster ? 1 : 0 }}
        aria-hidden={!onPoster}
        inert={!onPoster}
      >
        {/*
          Portrait shows the poster whole, so it also keeps clear of the
          floating header above and the buttons below; landscape bleeds.
        */}
        <div className="absolute inset-0 [@media(max-aspect-ratio:4/5)]:top-[76px] [@media(max-aspect-ratio:4/5)]:bottom-[calc(clamp(16px,4vh,40px)+64px)]">
          <picture>
            <source
              media={PORTRAIT}
              srcSet={promo.portrait.srcSet}
              sizes="100vw"
              width={promo.portrait.width}
              height={promo.portrait.height}
            />
            {/* Pre-sized local WebP, art-directed per screen shape: a plain <picture>, no optimizer. */}
            <img
              srcSet={promo.landscape.srcSet}
              sizes="100vw"
              width={promo.landscape.width}
              height={promo.landscape.height}
              alt={promo.posterAlt}
              decoding="async"
              /*
               * Landscape: anchored left, where the poster's type is, so a
               * narrower screen trims the photo, never the words; wider than
               * 16:9 shows it whole, the photo's right edge fading into the
               * background instead of stopping. Portrait: always whole.
               */
              className="absolute inset-0 size-full object-cover object-left [@media(max-aspect-ratio:4/5)]:object-contain [@media(max-aspect-ratio:4/5)]:object-center [@media(min-aspect-ratio:16/9)]:object-contain [@media(min-aspect-ratio:16/9)]:[mask-image:linear-gradient(to_right,black_110vh,transparent_177vh)]"
            />
          </picture>
        </div>

        <div className="absolute inset-x-0 bottom-[clamp(16px,4vh,40px)] flex flex-wrap justify-center gap-2.5 px-4 landscape:justify-end landscape:px-[clamp(16px,4vw,48px)]">
          <button
            type="button"
            onClick={replay}
            className="bg-accent text-accent-foreground hover:bg-accent-hover inline-flex h-12 items-center gap-2.5 rounded-full pr-[22px] pl-[18px] text-[15px] font-semibold transition-colors motion-safe:active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M2.8 8a5.2 5.2 0 1 0 1.6-3.8" />
              <path d="M2.5 2.2v2.6h2.6" />
            </svg>
            Replay video
          </button>
          <Link
            href={promo.projectHref}
            className="bg-media-chip text-media-chip-fg hover:text-accent inline-flex h-12 items-center rounded-full border border-white/15 px-[22px] text-[15px] font-medium backdrop-blur transition-colors"
          >
            About the project
          </Link>
        </div>
      </div>

      {onPoster ? null : (
        <div className="absolute right-[clamp(12px,3vw,32px)] bottom-[clamp(12px,3vw,32px)] flex gap-2">
          <button
            ref={pauseButton}
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className={chip}
          >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
              {playing ? (
                <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" />
              ) : (
                <path d="M4.5 2.5v11l9-5.5z" />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className={chip}
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
        </div>
      )}
    </section>
  );
}
