import { Section } from "@/components/layout/Section";
import { site } from "@/lib/content/site";

export function Contact() {
  return (
    <Section id="contact" index="07" label="Contact">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <h2 className="font-display text-h2 font-medium">
            Let&apos;s build something.
          </h2>
          {/* TODO(Phase 4): replace this mailto with a validated contact form
              (Next.js Route Handler + zod, honeypot + rate limit). */}
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block font-display text-2xl text-accent transition-opacity hover:opacity-70"
          >
            {site.email}
          </a>
        </div>

        <ul className="space-y-3 font-mono text-sm text-muted md:col-span-4">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                className="transition-colors hover:text-foreground"
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
