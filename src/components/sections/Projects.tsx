import { Section } from "@/components/layout/Section";
import { projects } from "@/lib/content/projects";

export function Projects() {
  return (
    <Section id="work" index="03" label="Selected Work">
      <ul className="divide-y divide-hairline border-y border-hairline">
        {projects.map((project) => (
          <li key={project.index}>
            <a
              href={project.href}
              className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline"
            >
              <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent md:col-span-1">
                {project.index}
              </span>

              <div className="md:col-span-5">
                <h3 className="font-display text-2xl font-medium">
                  {project.title}
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted">
                  {project.summary}
                </p>
              </div>

              <div className="font-mono text-xs text-muted uppercase md:col-span-2">
                {project.role}
              </div>

              <div className="font-mono text-xs text-muted md:col-span-1">
                {project.year}
              </div>

              <ul className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-hairline px-2 py-1 font-mono text-[0.6875rem] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
