import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import type { ExperienceEntry } from "@/lib/content/experience";
import { getAllExperience, getExperienceBySlug } from "@/lib/cms/experience";

export const revalidate = 3600;

type ExperiencePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const entries = await getAllExperience();
  return entries.map((entry: ExperienceEntry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getExperienceBySlug(slug);
  if (!entry) return {};

  return {
    title: `${entry.role} at ${entry.company}`,
    description: entry.description,
  };
}

export default async function ExperiencePage({
  params,
}: ExperiencePageProps) {
  const { slug } = await params;
  const entry = await getExperienceBySlug(slug);

  if (!entry) notFound();

  return (
    <main
      id="main-content"
      className="px-6 py-28 sm:px-10 sm:py-40 lg:px-16"
    >
      <Reveal>
        <Link
          href="/#experience"
          className="text-eyebrow font-semibold text-accent uppercase"
        >
          ← Back to experience
        </Link>

        <span className="mt-10 block text-eyebrow text-muted uppercase">
          {entry.period}
        </span>
        <h1 className="mt-3 font-display text-h2 font-semibold">
          {entry.role}
        </h1>
        <p className="mt-3 text-lg text-accent">{entry.company}</p>
      </Reveal>

      <div className="mt-16 max-w-2xl space-y-12">
        {entry.detail ? (
          entry.detail.map((section) => (
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
              {entry.description}
            </p>
          </Reveal>
        )}
      </div>
    </main>
  );
}
