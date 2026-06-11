import { Section } from "@/components/layout/Section";
import { experience } from "@/lib/content/experience";

export function Experience() {
  return (
    <Section id="experience" index="04" label="Experience">
      <ol className="border-l border-hairline">
        {experience.map((entry) => (
          <li key={entry.period} className="relative pb-12 pl-8 last:pb-0">
            <span className="absolute top-1.5 left-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
            <span className="font-mono text-xs text-muted uppercase">
              {entry.period}
            </span>
            <h3 className="mt-1 font-display text-2xl font-medium">
              {entry.role}
            </h3>
            <p className="font-mono text-sm text-accent">{entry.company}</p>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              {entry.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
