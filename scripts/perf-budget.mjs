// Checks the built pages against size budgets. Run after `next build`:
//   npm run perf:budget
// Counts the modern (non-nomodule) scripts and preloaded fonts each page
// references, gzipped at level 9 the way a CDN would serve them. woff2 is
// already compressed, so fonts are counted at their file size.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const NEXT = ".next";
const KB = 1024;

const BUDGETS = {
  "/": { js: 160 * KB, fonts: 135 * KB },
  "/projects": { js: 160 * KB, fonts: 135 * KB },
};

const PAGES = { "/": "index.html", "/projects": "projects.html" };

function assetPath(src) {
  const path = src.split("?")[0].replace(/^\/_next\//, "");
  return join(NEXT, path);
}

function measure(page) {
  const html = readFileSync(join(NEXT, "server", "app", PAGES[page]), "utf8");
  const scripts = [
    ...html.matchAll(/<script(?![^>]*\bnoModule\b)[^>]*\bsrc="([^"]+\.js[^"]*)"/gi),
  ].map((m) => m[1]);
  const fonts = [
    ...html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/gi),
  ].map((m) => /href="([^"]+)"/.exec(m[0])?.[1]).filter(Boolean);

  const unique = (list) => [...new Set(list)];
  // Fail closed: a referenced asset we can't find means the check would be measuring nothing.
  const missing = [];
  let js = 0;
  for (const src of unique(scripts)) {
    const file = assetPath(src);
    if (existsSync(file)) js += gzipSync(readFileSync(file), { level: 9 }).length;
    else missing.push(file);
  }
  let fontBytes = 0;
  for (const href of unique(fonts)) {
    const file = assetPath(href);
    if (existsSync(file)) fontBytes += readFileSync(file).length;
    else missing.push(file);
  }
  return { js, fonts: fontBytes, scriptCount: unique(scripts).length, fontCount: unique(fonts).length, missing };
}

let failed = false;
for (const page of Object.keys(PAGES)) {
  const got = measure(page);
  const budget = BUDGETS[page];
  if (got.missing.length) {
    console.error(`${page}: referenced but missing: ${got.missing.join(", ")}`);
    failed = true;
  }
  if (got.scriptCount === 0 || got.fontCount === 0) {
    console.error(`${page}: no scripts or fonts matched; the parser or paths are stale`);
    failed = true;
  }
  const row = (label, value, limit) => {
    const ok = value <= limit;
    if (!ok) failed = true;
    return `${label} ${(value / KB).toFixed(1)} KB / ${(limit / KB).toFixed(0)} KB ${ok ? "ok" : "OVER"}`;
  };
  console.log(
    `${page.padEnd(10)} ${row("js(gz)", got.js, budget.js)}  (${got.scriptCount} files) · ${row("fonts", got.fonts, budget.fonts)}  (${got.fontCount} files)`,
  );
}
process.exit(failed ? 1 : 0);
