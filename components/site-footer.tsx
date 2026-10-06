import Link from "next/link";

import { Arrow } from "@/components/ui/arrow";
import { profile } from "@/content/profile";

/**
 * `home` closes the homepage with the colophon; `page` closes /projects and
 * the detail pages with a way back to the contact section instead.
 */
export function SiteFooter({ variant }: { variant: "home" | "page" }) {
  return (
    <footer className="page-shell text-subtle relative z-[2] flex flex-wrap justify-between gap-x-6 gap-y-2 pt-6 pb-10 text-[13px]">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      {variant === "home" ? (
        <span>
          Next.js · Tailwind · CSS scroll timelines. No CMS, no database, on
          purpose.
        </span>
      ) : (
        <Link href="/#contact" className="group/arrow text-foreground">
          Get in touch <Arrow dir="right" />
        </Link>
      )}
    </footer>
  );
}
