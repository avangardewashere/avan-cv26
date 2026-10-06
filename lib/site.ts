/**
 * The site's public origin, for metadataBase, robots.txt and the sitemap.
 * NEXT_PUBLIC_SITE_URL wins (set it once a custom domain exists); otherwise
 * Vercel's production URL, which Vercel exposes at build time; otherwise
 * localhost for local builds.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
