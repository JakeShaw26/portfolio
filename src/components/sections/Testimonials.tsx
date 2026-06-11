import { Section } from "@/components/layout/Section";
import { testimonials } from "@/lib/content/testimonials";

export function Testimonials() {
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
