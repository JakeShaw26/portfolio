import { Section } from "@/components/layout/Section";
import { Magnetic } from "@/components/motion/Magnetic";
import { contactSubject, site } from "@/lib/content/site";

// LinkedIn is promoted to a primary CTA, so it's pulled out of the secondary
// list below rather than rendered twice.
const linkedin = site.socials.find((social) => social.label === "LinkedIn");
const otherSocials = site.socials.filter((social) => social !== linkedin);

const mailto = `mailto:${site.email}?subject=${encodeURIComponent(contactSubject)}`;

export function Contact() {
  return (
    <Section id="contact" index="06" label="Contact">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="font-display text-h2 font-semibold">
            Let’s build something{" "}
            <span className="text-accent italic">together</span>.
          </h2>

          <p className="mt-8 max-w-lg text-lg text-muted">
            Open to new work and interesting problems. Drop me an email or say
            hello on LinkedIn — I read everything.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href={mailto}
                className="inline-block rounded-full bg-accent px-8 py-3 font-display text-lg text-surface transition-opacity hover:opacity-90"
              >
                Send me an email
              </a>
            </Magnetic>

            {linkedin && (
              <Magnetic>
                <a
                  href={linkedin.href}
                  className="inline-block rounded-full border border-line px-8 py-3 font-display text-lg text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Connect on LinkedIn ↗
                </a>
              </Magnetic>
            )}
          </div>

          <p className="mt-6 text-sm text-muted">
            Or copy it directly:{" "}
            <a href={mailto} className="text-accent hover:opacity-70">
              {site.email}
            </a>
          </p>
        </div>

        <ul className="space-y-3 text-lg md:col-span-4 md:col-start-9 md:self-end">
          {otherSocials.map((social) => (
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
