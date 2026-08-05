import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/motion/Reveal";
import type { Project } from "@/lib/content/projects";
import { getAllProjects, getProjectBySlug } from "@/lib/cms/projects";

const PLACEHOLDER_IMAGE = "/work/placeholder.svg";

export const revalidate = 3600;

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project: Project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main id="main-content" className="px-6 py-28 sm:px-10 sm:py-40 lg:px-16">
      <Reveal>
        <Link
          href="/#work"
          className="text-eyebrow font-semibold text-accent uppercase"
        >
          ← Back to work
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <span className="block text-eyebrow text-muted uppercase">
            {project.year} · {project.role}
          </span>
          <h1 className="mt-3 font-display text-h2 font-semibold">
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
            <div className="mt-8">
              <CtaLink
                href={project.liveUrl}
                variant="secondary"
                size="sm"
                external
              >
                Visit live site
              </CtaLink>
            </div>
          )}
        </Reveal>

        <Reveal className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-[0_30px_80px_-40px_rgba(43,32,24,0.45)] lg:mx-0">
          <Image
            src={project.image ?? PLACEHOLDER_IMAGE}
            alt={project.imageAlt ?? `${project.title} screenshot`}
            fill
            className="object-contain p-8"
            sizes="(min-width: 1024px) 28rem, 100vw"
          />
        </Reveal>
      </div>

      <div className="mt-16 max-w-2xl space-y-12">
        {project.caseStudy ? (
          project.caseStudy.map((section) => (
            <Reveal key={section.heading}>
              <h2 className="font-display text-h3 font-semibold">
                {section.heading}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{section.body}</p>
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
