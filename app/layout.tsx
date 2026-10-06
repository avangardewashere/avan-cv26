import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { RevealObserver } from "@/components/reveal-observer";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/*
 * Self-hosted latin cuts of the three Google families, instanced with
 * fontTools (scripts/instance-fonts.py, app/fonts/README.md) to what the site
 * actually sets. Glyphs, kerning and line metrics are unchanged; only the
 * unused weight range is gone (129 KB -> 76 KB). A weight outside a cut
 * renders at the nearest kept weight, so widen the cut before using one.
 * `adjustFontFallback: false` + `fallback`: the exact fallback metrics
 * next/font/google generated, declared in globals.css.
 */
const geistSans = localFont({
  src: "./fonts/geist-latin-wght-400-600.woff2",
  weight: "400 600",
  variable: "--font-geist-sans",
  adjustFontFallback: false,
  fallback: ["Geist Fallback"],
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin-wght-400-500.woff2",
  weight: "400 500",
  variable: "--font-geist-mono",
  adjustFontFallback: false,
  fallback: ["Geist Mono Fallback"],
});

/*
 * The display face. Weight pinned at 700, the only one `.display` uses; `opsz`
 * stays a live 12–96 axis so automatic optical sizing still picks the tighter
 * large-size cut for the headline and the looser one for 22px card titles.
 */
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin-wght-700.woff2",
  weight: "700",
  variable: "--font-bricolage",
  adjustFontFallback: false,
  fallback: ["Bricolage Grotesque Fallback"],
});

const description = `${profile.role} in ${profile.location}. React and Next.js on the front, Node.js, PHP and SQL behind it, for real-time gaming, fintech and e-commerce.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    "Full-Stack Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "PHP",
    "WordPress",
    "WooCommerce",
    "REST API",
    "MongoDB",
    "SQL",
    "TypeScript",
    "Philippines",
    "Remote",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    title: `${profile.name} · ${profile.role}`,
    description,
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description,
  },
};

/* Structured data, so search and job tools read the role without parsing the page. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "PHP",
    "WordPress",
    "WooCommerce",
    "REST APIs",
    "Stripe",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
     * `suppressHydrationWarning` is required: next-themes writes the theme
     * class onto <html> before React hydrates, so server and client markup
     * differ by design on exactly this element.
     */
    <html
      lang="en"
      suppressHydrationWarning
      // Smooth for in-page anchors; Next 16 only drops it during route changes when this is set.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      {/*
        `overflow-x-clip`, not `overflow-hidden`: hidden would make the body a
        scroll container and silently break the sticky aside on detail pages.
      */}
      <body className="relative min-h-full overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/*
          Dark is the design; light is the alternate. `enableSystem` is off so
          a first visit always lands on the design as drawn, whatever the OS.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="skip-link bg-accent text-accent-foreground inline-flex h-11 items-center rounded-full px-5 text-sm font-medium"
          >
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <RevealObserver />
        </ThemeProvider>
        {/*
          Real-visitor Core Web Vitals for the Vercel dashboard. In production
          its script comes from /_vercel/speed-insights, which only Vercel
          serves; in dev a debug build logs to the console instead of sending.
        */}
        <SpeedInsights />
      </body>
    </html>
  );
}
