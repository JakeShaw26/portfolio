import { Section } from "@/components/layout/Section";
import { skills } from "@/lib/content/skills";

export function Skills() {
  return (
    <Section id="skills" index="05" label="Stack">
      {/* gap-px over a hairline background paints crisp 1px grid rules between cells */}
      <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <div key={group.label} className="bg-background p-6">
            <h3 className="font-mono text-label text-accent uppercase">
              {group.label}
            </h3>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
