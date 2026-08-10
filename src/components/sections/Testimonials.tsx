import { Section } from "@/components/layout/Section";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { getAllTestimonials } from "@/lib/cms/testimonials";

export async function Testimonials() {
  const testimonials = await getAllTestimonials();

  // Empty CMS is a legitimate state, not an error — the section simply doesn't
  // exist until there is something real to put in it.
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials" index="05" label="Kind Words">
      <p className="mb-10 max-w-xl text-sm leading-relaxed text-muted">
        Anonymised to role only. Full attributed references available on
        request.
      </p>
      <TestimonialCarousel testimonials={testimonials} />
    </Section>
  );
}
