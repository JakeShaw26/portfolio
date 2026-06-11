import { Section } from "@/components/layout/Section";
import { site } from "@/lib/content/site";

export function About() {
  return (
    <Section id="about" index="02" label="About">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="max-w-3xl font-display text-h2 font-medium md:col-span-8">
          {site.intro}
        </p>
        <dl className="space-y-6 font-mono text-xs text-muted uppercase md:col-span-4">
          <div>
            <dt className="text-foreground/40">Based</dt>
            <dd className="mt-1 text-foreground">{site.location}</dd>
          </div>
          <div>
            <dt className="text-foreground/40">Status</dt>
            <dd className="mt-1 text-accent">
              {site.available ? "Open to work" : "Currently engaged"}
            </dd>
          </div>
          <div>
            <dt className="text-foreground/40">Focus</dt>
            <dd className="mt-1 text-foreground">
              Frontend · Interaction · DX
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
