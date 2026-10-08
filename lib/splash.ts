/**
 * The first-visit splash (components/splash/splash.tsx). Every time is from
 * the splash's first frame, not from navigation: on a slow phone the page
 * only paints about 3 s in, and the splash cannot show before that. (The
 * screen shows each frame one display refresh later, usually under 70 ms;
 * the script and the CSS share the same clock, so they stay in step.)
 */
export const SPLASH = {
  /** Nothing ends it before this; from here Skip, a key, a tap or the wheel do. */
  minMs: 3000,
  /** It always leaves by this. A CSS animation enforces it even if the main thread is busy. */
  maxMs: 5000,
  /** The fade into the hero. */
  exitMs: 200,
  /** AMYGO starts this long before the end, under the cover, so it is moving when the cover lifts. */
  warmMs: 700,
  /** Set on the first page load of a visit, on any route: later loads skip the splash. */
  storageKey: "avan-cv26:visited",
  /** Dispatched on window once the splash is gone. */
  doneEvent: "splash:done",
} as const;

type SplashState = {
  state: "on" | "lift" | "done" | "off";
  /** The splash's first frame, on the performance.now() clock. */
  t0?: number;
};

declare global {
  interface Window {
    /** Written by the splash's inline script before hydration. */
    __splash?: SplashState;
  }
}

/**
 * Runs `fn` once the splash is gone: straight away when none is showing.
 * Returns a cleanup for an effect. Fails open just after the cap, so the
 * hero still starts should the splash script ever stall.
 */
export function afterSplash(fn: () => void): () => void {
  const splash = window.__splash;
  if (!splash || splash.state === "off" || splash.state === "done") {
    fn();
    return () => {};
  }
  const start = splash.t0 ?? performance.now();
  const wait = start + SPLASH.maxMs + SPLASH.exitMs + 300 - performance.now();
  const run = () => {
    cleanup();
    fn();
  };
  const timer = window.setTimeout(run, Math.max(0, wait));
  const cleanup = () => {
    window.clearTimeout(timer);
    window.removeEventListener(SPLASH.doneEvent, run);
  };
  window.addEventListener(SPLASH.doneEvent, run);
  return cleanup;
}
