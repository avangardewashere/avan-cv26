import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/projects", ...projects.map((p) => `/projects/${p.slug}`)].map(
    (path) => ({ url: `${siteUrl}${path}` }),
  );
}
