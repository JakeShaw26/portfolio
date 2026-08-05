import { Section } from "@/components/layout/Section";
import { hasRealTestimonials, testimonials } from "@/lib/content/testimonials";

export function Testimonials() {
  // The placeholder quotes name people who don't exist, so shipping them would be
  // fabricated endorsements. Section stays built and ready; it just doesn't render
  // until the content behind it is real.
  if (!hasRealTestimonials) return null;

  return (
    <Section id="testimonials" index="05" label="Kind Words">
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.author}
            className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-8"
          >
            <blockquote className="font-display text-xl leading-relaxed italic">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-8 text-sm text-muted">
              <span className="block font-medium text-foreground">
                {testimonial.author}
              </span>
              {testimonial.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
