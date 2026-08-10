import "server-only";

import type { Testimonial } from "@/lib/content/testimonials";
import { fetchEntries } from "./contentful";

export type TestimonialFields = {
  index: string;
  quote: string;
  role: string;
};

/**
 * No zod here, unlike `projects.ts`: every field is a Symbol/Text, so
 * Contentful's own field types guarantee the shape. Only the untyped Object
 * field over there needs runtime validation.
 */
export function mapTestimonial(fields: TestimonialFields): Testimonial {
  return {
    index: fields.index,
    quote: fields.quote,
    role: fields.role,
  };
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const entries = await fetchEntries<TestimonialFields>("testimonial");
  const sorted = [...entries].sort((a, b) =>
    a.fields.index.localeCompare(b.fields.index),
  );
  const mapped = sorted.map((entry) => mapTestimonial(entry.fields));

  // `index` is the React key in the carousel, so a duplicate would silently
  // drop a card rather than fail. Contentful enforces uniqueness too; this
  // catches the case where that validation is ever relaxed in the UI.
  const indexes = mapped.map((testimonial) => testimonial.index);
  if (new Set(indexes).size !== indexes.length) {
    throw new Error("Duplicate testimonial index returned from Contentful");
  }

  return mapped;
}
