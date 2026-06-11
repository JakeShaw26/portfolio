import { Reveal } from "@/components/motion/Reveal";
import { projects } from "@/lib/content/projects";

const posterGradients = [
  "linear-gradient(135deg, var(--glow-1), var(--glow-2))",
  "linear-gradient(135deg, var(--glow-2), var(--accent))",
  "linear-gradient(135deg, var(--glow-3), var(--glow-1))",
  "linear-gradient(135deg, var(--glow-1), var(--accent))",
];

/**
 * Selected Work, built as a CSS sticky-stack deck: each card sticks and the
 * next scrolls up over it, so cards naturally overlap with NO absolute
 * positioning (and no overlap bug). Works fully without JS; Phase 2b layers
 * scale/dim on the covered cards via ScrollTrigger.
 */
export function ProjectShowcase() {
  return (
    <section
      id="work"
      className="relative px-6 py-28 sm:px-10 sm:py-40 lg:px-16"
    >
      <Reveal className="mb-12 flex items-center gap-3 text-eyebrow font-semibold text-accent uppercase">
        <span className="tabular-nums">02</span>
        <span className="h-px w-10 bg-accent/40" />
        <span>Selected Work</span>
      </Reveal>

      <div className="space-y-6">
        {projects.map((project, i) => (
          <div
            key={project.index}
            className="project-card sticky"
            style={{ top: `${6 + i * 0.75}rem` }}
          >
            <article className="grid gap-8 rounded-3xl border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(43,32,24,0.45)] sm:p-10 md:grid-cols-2">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  background: posterGradients[i % posterGradients.length],
                }}
              >
                {/* PROJECT VISUAL SLOT — real screenshot drops in here later */}
                <span className="absolute bottom-4 left-6 font-display text-7xl font-semibold text-surface/80">
                  {project.index}
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-eyebrow text-muted uppercase">
                  {project.year} · {project.role}
                </span>
                <h3 className="mt-3 font-display text-h3 font-semibold">
                  {project.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">
                  {project.summary}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <a
                  href={project.href}
                  className="mt-7 text-sm font-medium text-accent transition-opacity hover:opacity-70"
                >
                  View case study →
                </a>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
