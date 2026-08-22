import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { StackMotion } from "@/components/motion/StackMotion";
import { getAllProjects } from "@/lib/cms/projects";
import {
  projectImageViewTransitionName,
  projectTitleViewTransitionName,
} from "@/lib/content/projects";

const PLACEHOLDER_IMAGE = "/work/placeholder.svg";

/**
 * Selected Work, built as a CSS sticky-stack deck: each card sticks and the
 * next scrolls up over it, so cards naturally overlap with NO absolute
 * positioning (and no overlap bug). Works fully without JS; Phase 2b layers
 * scale/dim on the covered cards via ScrollTrigger.
 */
export async function ProjectShowcase() {
  const projects = await getAllProjects();

  return (
    <section
      id="work"
      className="relative px-6 py-24 sm:px-10 sm:py-36 lg:px-16"
    >
      <StackMotion />
      <Reveal className="mb-12 flex items-center gap-3 text-base leading-none font-semibold tracking-[0.12em] text-accent uppercase">
        <span className="tabular-nums">02</span>
        <span className="h-px w-10 bg-accent/40" />
        <span>Selected Work</span>
      </Reveal>

      <div className="mx-auto max-w-5xl space-y-6">
        {projects.map((project, i) => (
          <div
            key={project.slug}
            className="project-card sticky"
            style={{ top: `${6 + i * 0.75}rem` }}
          >
            <article className="grid gap-6 rounded-3xl border border-line bg-surface p-5 shadow-[0_30px_80px_-40px_rgba(43,32,24,0.45)] sm:p-8 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-background">
                <ViewTransition
                  name={projectImageViewTransitionName(project.slug)}
                >
                  <Image
                    src={project.image ?? PLACEHOLDER_IMAGE}
                    alt={project.imageAlt ?? `${project.title} screenshot`}
                    fill
                    className="object-contain p-10"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </ViewTransition>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-eyebrow text-muted uppercase">
                  {project.year} · {project.role}
                </span>
                <ViewTransition
                  name={projectTitleViewTransitionName(project.slug)}
                >
                  <h3 className="mt-3 font-display text-h3 font-semibold">
                    {project.title}
                  </h3>
                </ViewTransition>
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
                <Link
                  href={`/work/${project.slug}`}
                  className="mt-7 text-sm font-medium text-accent transition-opacity hover:opacity-70"
                >
                  View case study →
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
