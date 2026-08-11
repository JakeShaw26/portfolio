import { Section } from "@/components/layout/Section";
import { skills } from "@/lib/content/skills";

export function Skills() {
  return (
    <Section id="skills" index="04" label="Stack">
      {/*
        Column count tracks the number of groups in `skills` so none is orphaned on a
        row of its own. Revisit both together if a group is added or removed.
      */}
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-5">
        {skills.map((group) => (
          <div key={group.label}>
            <h3 className="font-display text-2xl font-semibold">
              {group.label}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="text-muted">
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
