import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { Arrow } from "@/components/ui/arrow";
import { pillVariants } from "@/components/ui/button";

/**
 * Not in the v2 handoff. Built from the subpage template (back link, display
 * h1, lede) so an unknown URL or slug still looks like the site and themes.
 */
export default function NotFound() {
  return (
    <>
      <main
        id="main"
        className="page-shell relative z-[1] pt-[clamp(120px,16vh,170px)] pb-[60px]"
      >
        <Link href="/" className="group/arrow text-muted text-[14px]">
          <Arrow dir="left" /> Home
        </Link>
        <h1 className="display mt-5 max-w-[14ch] text-[clamp(40px,6vw,88px)] leading-[.98] tracking-[-0.04em] text-balance">
          Nothing lives <span className="text-accent-ink">here.</span>
        </h1>
        <p className="text-muted mt-5 max-w-[44ch] text-[16px] leading-[1.55]">
          The page you asked for doesn&apos;t exist, or it moved. The work is
          all in one place.
        </p>
        <Link
          href="/projects"
          className={pillVariants({ variant: "outline", size: "md", className: "mt-8" })}
        >
          All projects <Arrow dir="right" />
        </Link>
      </main>
      <SiteFooter variant="page" />
    </>
  );
}
