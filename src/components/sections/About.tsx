import { Section } from "@/components/layout/Section";
import { site } from "@/lib/content/site";

export function About() {
  return (
    <Section id="about" index="01" label="About">
      <div className="grid gap-12 md:grid-cols-12">
        <h2 className="font-display text-h2 font-semibold md:col-span-8">
          I build things that <span className="text-accent italic">feel</span>{" "}
          alive — fast, considered interfaces with craft in every detail.
        </h2>

        <p className="text-lg leading-relaxed text-muted md:col-span-7 md:col-start-1">
          {site.intro}
        </p>

        <dl className="space-y-6 text-base text-muted md:col-span-4 md:col-start-9 md:row-start-1 md:self-end">
          <div>
            <dt className="text-eyebrow text-foreground/50 uppercase">Based</dt>
            <dd className="mt-1 text-foreground">{site.location}</dd>
          </div>
          <div>
            <dt className="text-eyebrow text-foreground/50 uppercase">
              Status
            </dt>
            <dd className="mt-1 text-accent">
              {site.available ? "Open to work" : "Currently engaged"}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow text-foreground/50 uppercase">Focus</dt>
            <dd className="mt-1 text-foreground">
              Frontend · Interaction · DX
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
