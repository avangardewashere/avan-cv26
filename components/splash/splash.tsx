import type { CSSProperties } from "react";

import { profile, promos } from "@/content/profile";
import { projects } from "@/content/projects";
import { SPLASH } from "@/lib/splash";

/*
 * A sneak peek of the work: the projects the hero does not promote (it shows
 * the `promos` next), as their 960w banners. Photos, not video: the
 * splash is there to give the hero's video time to load, and a preview video
 * would compete with it for the same bandwidth. The Work rail reuses the same
 * files from cache.
 */
const PEEKS = projects
  .filter(
    (p) => !promos.some((promo) => promo.projectHref === `/projects/${p.slug}`),
  )
  .slice(0, 5);

/**
 * The gate and the controller, run inline while the HTML is still parsing
 * (stringified, so it must not reference anything outside itself).
 *
 * Gate: on only for the first page load of a visit, on `/` with no hash, for
 * a person (not a crawler, a link preview or our own automation), with
 * motion allowed and Save-Data off. `?splash=on|off` overrides. The visit
 * flag is written on every route, so arriving on a project page and then
 * going home skips it too.
 *
 * Controller: times everything from the splash's first frame (its own CSS
 * animation's start). Nothing ends it before minMs; from there Skip, Enter,
 * Escape, Space, a scroll key, the wheel or a tap do; at maxMs it leaves on
 * its own (and the CSS cap hides it even if this script is held up). Until
 * then it keeps every key and tap to itself: the page behind never scrolls
 * or takes focus (Tab waits for Skip), and React, which may be hydrating,
 * never sees them (a tap would make it hydrate synchronously, a slow first
 * input). AMYGO starts under the cover warmMs before the end and is rewound
 * to 0:00 as the cover fades, so the hero opens on a moving first frame.
 */
function splashScript(c: typeof SPLASH) {
  const w = window;
  const d = document;
  const root = d.documentElement;
  const splash: NonNullable<Window["__splash"]> = { state: "off" };
  w.__splash = splash;
  let teardown = () => {};
  try {
    const flag = new URLSearchParams(location.search).get("splash");
    let seen = true;
    try {
      seen = sessionStorage.getItem(c.storageKey) === "1";
      sessionStorage.setItem(c.storageKey, "1");
    } catch {}
    const media = (query: string) => w.matchMedia(query).matches;
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          effectiveType?: string;
        };
      }
    ).connection;
    const prerendering = (d as Document & { prerendering?: boolean })
      .prerendering;
    const on =
      flag === "on" ||
      (flag !== "off" &&
        location.pathname === "/" &&
        !location.hash &&
        !seen &&
        !navigator.webdriver &&
        !connection?.saveData &&
        !prerendering &&
        d.visibilityState === "visible" &&
        !media("(prefers-reduced-motion: reduce)") &&
        !media("(forced-colors: active)") &&
        !/bot|crawl|spider|slurp|facebookexternalhit|embedly|preview/i.test(
          navigator.userAgent,
        ));
    const el = d.getElementById("splash");
    if (!on || !el) return;

    splash.state = "on";
    root.setAttribute("data-splash", "on");

    /*
     * A slow connection (2G/3G) gets one peek: the other four would arrive
     * too late to be seen. Not `downlink`: Chrome starts a fresh profile at
     * a 1.55 Mbps guess, which would cut the peek short on fast links too.
     */
    if (/2g|3g/.test(connection?.effectiveType ?? ""))
      root.setAttribute("data-peeks", "one");

    let t0 = Infinity;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) =>
      timers.push(w.setTimeout(fn, Math.max(0, t0 + ms - performance.now())));

    /*
     * The peeks wait for the first banner to decode, then fade in. One that
     * popped in mid-fade would become the desktop LCP, late; one fading in
     * from nothing is not reported.
     */
    const peek = () => root.setAttribute("data-peek", "");
    el.querySelector("img")?.decode().then(peek, peek);
    timers.push(w.setTimeout(peek, 1500));

    const video = () => d.querySelector<HTMLVideoElement>("#hero video");
    const rewind = () => {
      const v = video();
      if (v && v.currentTime > 0.05) v.currentTime = 0;
    };
    const play = () => {
      const v = video();
      // A rejection (autoplay blocked) is the hero's to handle: it falls back to the banner.
      if (v && v.paused) v.play().catch(() => {});
    };
    const skipButton = el.querySelector("button");
    const presses = [
      "pointerdown",
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click",
    ];

    const finish = () => {
      if (splash.state === "done") return;
      splash.state = "done";
      root.removeAttribute("data-splash");
      root.removeAttribute("data-peek");
      root.removeAttribute("data-peeks");
      timers.forEach((t) => w.clearTimeout(t));
      w.removeEventListener("keydown", onKey, true);
      w.removeEventListener("wheel", onWheel);
      presses.forEach((type) => w.removeEventListener(type, onPress, true));
      d.removeEventListener("visibilitychange", onHidden);
      w.removeEventListener("pageshow", onRestore);
      w.removeEventListener("beforeprint", finish);
      w.dispatchEvent(new Event(c.doneEvent));
    };
    const exit = () => {
      if (splash.state !== "on") return;
      splash.state = "lift";
      root.setAttribute("data-splash", "lift");
      rewind();
      play();
      timers.push(w.setTimeout(finish, c.exitMs));
    };
    const ready = () => performance.now() - t0 >= c.minMs;
    const skip = () => {
      if (ready()) exit();
    };

    const skips = /^( |Spacebar|Enter|Escape|Arrow\w+|Page\w+|Home|End)$/;
    // With a modifier these still scroll; Alt/Cmd+Left/Right (history) and Alt+Home stay the browser's.
    const scrolls = /^( |Spacebar|Arrow(Up|Down)|Page(Up|Down)|End)$/;
    const onKey = (e: KeyboardEvent) => {
      const modified = e.altKey || e.ctrlKey || e.metaKey;
      if (e.key === "Tab") {
        e.preventDefault();
        if (ready()) skipButton?.focus();
      } else if (!modified && skips.test(e.key)) {
        e.preventDefault();
        skip();
      } else if (scrolls.test(e.key) || (e.key === "Home" && !e.altKey)) {
        e.preventDefault();
      } else return;
      e.stopImmediatePropagation();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      skip();
    };
    // Taps on the cover: Skip, or anywhere once it can end. Screen readers click with no pointer event.
    const onPress = (e: Event) => {
      if (!el.contains(e.target as Node)) return;
      e.stopImmediatePropagation();
      if (e.type === "pointerdown" || e.type === "click") skip();
    };
    // A hidden tab, a back/forward-cache restore or printing: no splash to come back to.
    const onHidden = () => {
      if (d.visibilityState !== "hidden") return;
      rewind();
      finish();
    };
    // pageshow also fires on every ordinary load: only a restore counts.
    const onRestore = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      rewind();
      finish();
    };

    // Before any listener, so nothing that runs after them can throw.
    const cap = el.getAnimations?.()[0];
    w.addEventListener("keydown", onKey, true);
    w.addEventListener("wheel", onWheel, { passive: false });
    presses.forEach((type) => w.addEventListener(type, onPress, true));
    d.addEventListener("visibilitychange", onHidden);
    w.addEventListener("pageshow", onRestore);
    w.addEventListener("beforeprint", finish);
    teardown = finish;

    const begin = (start: number) => {
      t0 = start;
      splash.t0 = start;
      later(c.maxMs - c.warmMs, play);
      later(c.maxMs, exit);
    };
    // The first frame: when the cap animation (app/globals.css) actually starts.
    if (cap)
      cap.ready.then(
        (a) =>
          begin(
            typeof a.startTime === "number" ? a.startTime : performance.now(),
          ),
        () => begin(performance.now()),
      );
    else begin(performance.now());
  } catch {
    teardown();
    splash.state = "off";
    root.removeAttribute("data-splash");
  }
}

const script = `(${splashScript.toString()})(${JSON.stringify(SPLASH)})`;

/**
 * The first-visit splash: the AP mark, name and role, a sneak peek of five
 * projects, and a lime line timing the run to the hero. It covers the page,
 * never hides it, so the hero's poster still paints underneath (phone LCP).
 *
 * Hidden by default (app/globals.css): it shows only once the inline script
 * marks `<html data-splash>`, so visitors without JavaScript, crawlers, other
 * routes and repeat loads never see it. Rendered first in <body>, before any
 * page content, so its script runs before the hero is parsed.
 */
export function Splash() {
  return (
    <>
      <div id="splash" className="dark">
        <div className="splash-inner">
          <div aria-hidden className="splash-brand">
            <span className="splash-mark">AP</span>
            <p className="splash-name display">{profile.shortName}</p>
            <p className="splash-role">{profile.role}</p>
          </div>

          <div aria-hidden className="splash-deck">
            {PEEKS.map((project, i) => (
              <figure
                key={project.slug}
                className="splash-peek"
                style={{ "--i": i } as CSSProperties}
              >
                {/*
                  A plain pre-sized WebP, no optimizer. Lazy: inside the
                  hidden splash nothing loads, so visits without it pay nothing.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/projects/${project.slug}-banner-960.webp`}
                  alt=""
                  width={960}
                  height={540}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span className="truncate">{project.title}</span>
                  <span>{project.year}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div aria-hidden className="splash-line">
            <span />
          </div>

          <button type="button" className="splash-skip">
            Skip intro
          </button>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
