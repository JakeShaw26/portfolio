import { Section } from "@/components/layout/Section";
import { CtaLink } from "@/components/ui/CtaLink";
import { contactSubject, site } from "@/lib/content/site";

const mailto = `mailto:${site.email}?subject=${encodeURIComponent(contactSubject)}`;

export function Contact() {
  return (
    <Section id="contact" index="06" label="Contact">
      <div className="grid gap-12 md:grid-cols-12 md:items-end">
        <h2 className="font-display text-h2 font-semibold md:col-span-6">
          Let’s build something{" "}
          <span className="text-accent italic">together</span>.
        </h2>

        <div className="md:col-span-5 md:col-start-8">
          <p className="max-w-lg text-lg text-muted">
            Open to new work and interesting problems. Drop me an email, or find
            me on LinkedIn and GitHub — I read everything.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4">
            <CtaLink href={mailto}>Send me an email</CtaLink>

            <div className="flex flex-wrap gap-3">
              {site.socials.map((social) => (
                <CtaLink
                  key={social.label}
                  href={social.href}
                  variant="secondary"
                  size="sm"
                  external
                >
                  {social.label}
                </CtaLink>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted">
            Or copy it directly:{" "}
            <a
              href={mailto}
              className="text-accent underline decoration-accent/30 underline-offset-4 transition hover:decoration-accent focus-visible:decoration-accent"
            >
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}
