import "server-only";
import { z } from "zod";

import type { ExperienceEntry } from "@/lib/content/experience";
import { fetchEntries } from "./contentful";

const sectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

const detailSchema = z.array(sectionSchema);

export type ExperienceEntryFields = {
  slug: string;
  period: string;
  role: string;
  company: string;
  description: string;
  detail?: unknown;
  order: number;
};

/**
 * Contentful's Object field type has no server-side shape enforcement, so
 * `detail` is validated here — every other field is a Symbol/Text and is
 * guaranteed a string by Contentful's own field-type system.
 */
export function mapExperienceEntry(
  fields: ExperienceEntryFields,
): ExperienceEntry {
  const detail =
    fields.detail === undefined ? undefined : detailSchema.parse(fields.detail);

  return {
    slug: fields.slug,
    period: fields.period,
    role: fields.role,
    company: fields.company,
    description: fields.description,
    ...(detail !== undefined ? { detail } : {}),
  };
}

export async function getAllExperience(): Promise<ExperienceEntry[]> {
  const entries = await fetchEntries<ExperienceEntryFields>("experienceEntry");
  const sorted = [...entries].sort((a, b) => a.fields.order - b.fields.order);
  const mapped = sorted.map((entry) => mapExperienceEntry(entry.fields));

  const slugs = mapped.map((entry) => entry.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Duplicate experience slug returned from Contentful");
  }

  return mapped;
}

export async function getExperienceBySlug(
  slug: string,
): Promise<ExperienceEntry | undefined> {
  const entries = await getAllExperience();
  return entries.find((entry) => entry.slug === slug);
}
