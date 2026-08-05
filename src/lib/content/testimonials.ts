// TODO(content): THESE THREE QUOTES ARE FABRICATED PLACEHOLDERS — the people and
// companies named below do not exist. They must not reach a public deploy.
//
// Plan: move testimonials to Contentful (a `testimonial` content type alongside
// `experienceEntry` / `workProject`, fetched in `src/lib/cms/`) and populate with
// real quotes. Get written permission before publishing anyone's name and title.
//
// Until real quotes exist, `Testimonials` is not rendered — see the guard in
// `src/components/sections/Testimonials.tsx`. Delete that guard, and this comment,
// once the section is reading real content.

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
};

/** Flip to `true` once every quote below is real and permission-cleared. */
export const hasRealTestimonials = false;

export const testimonials: Testimonial[] = [
  {
    quote:
      "One of the rare engineers who cares as much about the pixel as the architecture behind it. The work always ships, and it always feels right.",
    author: "Priya Nadeem",
    title: "VP Engineering, Nova Labs",
  },
  {
    quote:
      "Took our most ambiguous problem and turned it into a shipping product in weeks. Calm, fast, and relentlessly user-focused.",
    author: "Marcus Hale",
    title: "Founder, Cartograph",
  },
  {
    quote:
      "Raised the bar for the whole frontend team. Our design system exists because they made the case and then built it.",
    author: "Lena Ortiz",
    title: "Principal Designer, Meridian",
  },
];
