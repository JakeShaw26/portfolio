import "server-only";
import { z } from "zod";

import type { Project } from "@/lib/content/projects";
import { fetchEntries } from "./contentful";

const sectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

const caseStudySchema = z.array(sectionSchema);

export type WorkProjectFields = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  image?: string;
  imageAlt?: string;
  liveUrl?: string;
  caseStudy?: unknown;
};

/**
 * Contentful's Object field type has no server-side shape enforcement, so
 * `caseStudy` is validated here — every other field is a Symbol/Text/Array
 * and is guaranteed its shape by Contentful's own field-type system.
 */
export function mapProject(fields: WorkProjectFields): Project {
  const caseStudy =
    fields.caseStudy === undefined
      ? undefined
      : caseStudySchema.parse(fields.caseStudy);

  return {
    slug: fields.slug,
    index: fields.index,
    title: fields.title,
    summary: fields.summary,
    role: fields.role,
    year: fields.year,
    stack: fields.stack,
    ...(fields.image !== undefined ? { image: fields.image } : {}),
    ...(fields.imageAlt !== undefined ? { imageAlt: fields.imageAlt } : {}),
    ...(fields.liveUrl !== undefined ? { liveUrl: fields.liveUrl } : {}),
    ...(caseStudy !== undefined ? { caseStudy } : {}),
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const entries = await fetchEntries<WorkProjectFields>("workProject");
  const sorted = [...entries].sort((a, b) =>
    a.fields.index.localeCompare(b.fields.index),
  );
  const mapped = sorted.map((entry) => mapProject(entry.fields));

  const slugs = mapped.map((project) => project.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Duplicate project slug returned from Contentful");
  }

  return mapped;
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug);
}
