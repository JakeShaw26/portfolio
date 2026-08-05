import type { MetadataRoute } from "next";

import { getAllExperience } from "@/lib/cms/experience";
import { getAllProjects } from "@/lib/cms/projects";
import { siteUrl } from "@/lib/content/site";

/**
 * Built from Contentful rather than a hardcoded list, so new work and experience
 * entries appear without anyone remembering to update this file.
 *
 * `lastModified` is build time, not entry-update time: the domain types returned
 * by the CMS mappers intentionally drop Contentful's `sys`, and the site is fully
 * rebuilt whenever content changes, so the two are equivalent in practice.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, experience] = await Promise.all([
    getAllProjects(),
    getAllExperience(),
  ]);

  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Case studies rank above experience entries: they are the pages worth
    // landing on directly.
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...experience.map((entry) => ({
      url: `${siteUrl}/experience/${entry.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
