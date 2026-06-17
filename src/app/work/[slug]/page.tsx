import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { projects, type Project } from "@/lib/content/projects";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <main
      id="main-content"
      className="px-6 py-28 sm:px-10 sm:py-40 lg:px-16"
    >
      <Reveal>
        <Link
          href="/#work"
          className="text-eyebrow font-semibold text-accent uppercase"
        >
          ← Back to work
        </Link>

        <span className="mt-10 block text-eyebrow text-muted uppercase">
          {project.year} · {project.role}
        </span>
        <h1 className="mt-3 max-w-3xl font-display text-display font-semibold">
          {project.title}
        </h1>

        <ul className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line px-3 py-1 text-sm text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        {project.liveUrl && (
          <Magnetic>
            <a
              href={project.liveUrl}
              className="mt-8 inline-block text-sm font-medium text-accent transition-opacity hover:opacity-70"
            >
              Visit live site ↗
            </a>
          </Magnetic>
        )}
      </Reveal>

      <div className="mt-16 max-w-2xl space-y-12">
        {project.caseStudy ? (
          project.caseStudy.map((section) => (
            <Reveal key={section.heading}>
              <h2 className="font-display text-h3 font-semibold">
                {section.heading}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                {section.body}
              </p>
            </Reveal>
          ))
        ) : (
          <Reveal>
            <p className="text-lg leading-relaxed text-muted">
              {project.summary}
            </p>
          </Reveal>
        )}
      </div>
    </main>
  );
}
