// TODO(content): replace with real quotes (get permission before publishing names).

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
};

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
