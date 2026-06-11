import { Section } from "@/components/layout/Section";
import { testimonials } from "@/lib/content/testimonials";

export function Testimonials() {
  return (
    <Section id="testimonials" index="06" label="Signal">
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.author}
            className="flex flex-col justify-between border border-hairline p-6"
          >
            <blockquote className="text-sm leading-relaxed text-foreground/90">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 font-mono text-xs text-muted">
              <span className="block text-foreground">
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
