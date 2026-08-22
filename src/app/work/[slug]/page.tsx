import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/motion/Reveal";
import {
  projectImageViewTransitionName,
  projectTitleViewTransitionName,
  type Project,
} from "@/lib/content/projects";
import { getAllProjects } from "@/lib/cms/projects";

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
  const projects = await getAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const projects = await getAllProjects();
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projectIndex === -1 ? undefined : projects[projectIndex];

  if (!project) notFound();

  // Pager wraps around: the last case study's "next" is the first, and vice versa.
  const prevProject =
    projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const showPager = projects.length > 1;

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
        <div>
          {/*
            The h1 sits between two Reveal instances rather than inside one
            shared wrapper (as the eyebrow/pills/CTA block used to be). It's
            now driven by the ViewTransition morph from the project card
            instead of Reveal's GSAP fade+lift: Reveal tweens opacity/y on its
            wrapping div via a ScrollTrigger that fires on mount (the hero is
            above the fold), which would race the browser's view-transition
            snapshot and get captured mid-fade or invisible, undermining the
            morph. Splitting keeps the eyebrow and pills/CTA fading in as
            before, just as two adjacent blocks instead of one.
          */}
          <Reveal>
            <span className="block text-eyebrow text-muted uppercase">
              {project.year} · {project.role}
            </span>
          </Reveal>

          <ViewTransition name={projectTitleViewTransitionName(project.slug)}>
            <h1 className="mt-3 font-display text-h2 font-semibold">
              {project.title}
            </h1>
          </ViewTransition>

          <Reveal>
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
                <p className="mt-2 text-xs text-muted">
                  Hosted on the client&apos;s site, not one I control.
                </p>
              </div>
            )}
          </Reveal>
        </div>

        {/*
          Plain div, not Reveal, for the same reason as the h1 above: this
          image is the other half of the morph pair, so its entrance is the
          ViewTransition, not a GSAP fade+lift racing the snapshot.
        */}
        <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-[0_30px_80px_-40px_rgba(43,32,24,0.45)] lg:mx-0">
          <ViewTransition name={projectImageViewTransitionName(project.slug)}>
            <Image
              src={project.image ?? PLACEHOLDER_IMAGE}
              alt={project.imageAlt ?? `${project.title} screenshot`}
              fill
              className="object-contain p-8"
              sizes="(min-width: 1024px) 28rem, 100vw"
            />
          </ViewTransition>
        </div>
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

      {showPager && (
        <Reveal>
          <nav
            aria-label="Case study pager"
            className="mt-16 flex max-w-2xl items-center justify-between gap-6 border-t border-line pt-8"
          >
            <Link
              href={`/work/${prevProject.slug}`}
              className="text-eyebrow font-semibold text-accent uppercase"
            >
              ← {prevProject.title}
            </Link>
            <Link
              href={`/work/${nextProject.slug}`}
              className="text-right text-eyebrow font-semibold text-accent uppercase"
            >
              {nextProject.title} →
            </Link>
          </nav>
        </Reveal>
      )}
    </main>
  );
}
