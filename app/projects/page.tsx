import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { ArchiveGrid } from "@/components/projects/archive-grid";
import { SiteFooter } from "@/components/site-footer";
import { Arrow } from "@/components/ui/arrow";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

const description =
  "A client store migration, company websites, a Node/Express Telegram bot, a multi-tenant REST API and the apps I built on my own.";
const socialTitle = `Projects · ${profile.name}`;

// Page-level openGraph/twitter replace the layout's outright, so type and locale are restated.
export const metadata: Metadata = {
  title: "Projects",
  description,
  openGraph: {
    type: "website",
    locale: "en_PH",
    title: socialTitle,
    description,
  },
  twitter: { card: "summary_large_image", title: socialTitle, description },
};

export default function ProjectsPage() {
  const items = projects.map((project) => ({
    slug: project.slug,
    group: project.group,
    card: <ProjectCard project={project} />,
  }));

  return (
    <>
      <main
        id="main"
        className="page-shell relative z-[1] pt-[clamp(120px,16vh,170px)] pb-[60px]"
      >
        <Link href="/" className="group/arrow text-muted text-[14px]">
          <Arrow dir="left" /> Home
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <h1 className="display m-0 max-w-[14ch] text-[clamp(40px,6vw,88px)] leading-[.98] tracking-[-0.04em] text-balance">
            All the work, <span className="text-accent-ink">one place.</span>
          </h1>
          <p className="text-muted m-0 max-w-[44ch] text-[16px] leading-[1.55]">
            A client store migration, company websites, payment and API work,
            and the apps I built on my own: what shipped on each, and the full
            write-up where there is one.
          </p>
        </div>

        <ArchiveGrid items={items} />
      </main>
      <SiteFooter variant="page" />
    </>
  );
}
