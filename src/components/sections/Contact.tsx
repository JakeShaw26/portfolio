import { Section } from "@/components/layout/Section";
import { site } from "@/lib/content/site";

export function Contact() {
  return (
    <Section id="contact" index="06" label="Contact">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <h2 className="font-display text-h2 font-semibold">
            Let’s build something{" "}
            <span className="text-accent italic">together</span>.
          </h2>
          {/* TODO(Phase 4): replace this mailto with a validated contact form
              (Next.js Route Handler + zod, honeypot + rate limit). */}
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block font-display text-3xl text-accent transition-opacity hover:opacity-70"
          >
            {site.email}
          </a>
        </div>

        <ul className="space-y-3 text-lg md:col-span-4 md:self-end">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                className="text-muted transition-colors hover:text-foreground"
              >
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
