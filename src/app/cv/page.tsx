import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/content/site";
import { skills } from "@/lib/content/skills";
import { getAllExperience } from "@/lib/cms/experience";
import { getAllProjects } from "@/lib/cms/projects";

// Experience/work content is fetched from Contentful; refresh hourly so
// edits land without a redeploy (see ARCHITECTURE.md).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CV",
  description: `Experience, projects, and skills for ${site.name}, ${site.role}.`,
};

// A plain document, not a showcase page: no `Reveal`/motion wrappers, since
// those animate in on scroll and would leave content invisible if the page
// is printed before the trigger fires. `@media print` rules for this page
// live in globals.css, scoped to `.cv-page`.
export default async function CvPage() {
  const [experience, projects] = await Promise.all([
    getAllExperience(),
    getAllProjects(),
  ]);

  return (
    <main
      id="main-content"
      className="cv-page mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24"
    >
      <Link
        href="/"
        className="text-eyebrow font-semibold text-accent uppercase print:hidden"
      >
        ← Back home
      </Link>

      <header className="mt-10">
        <h1 className="font-display text-h3 font-semibold">{site.name}</h1>
        <p className="mt-1 text-lg text-accent">{site.role}</p>
        <p className="mt-1 text-muted">{site.location}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-line underline-offset-2 hover:text-accent"
            >
              {site.email}
            </a>
          </li>
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                className="underline decoration-line underline-offset-2 hover:text-accent"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <section className="mt-14">
        <h2 className="font-display text-h3 font-semibold">Experience</h2>
        <div className="mt-6 space-y-8">
          {experience.map((entry) => (
            <article key={entry.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-display text-xl font-semibold">
                  {entry.role} · {entry.company}
                </h3>
                <span className="text-sm text-muted">{entry.period}</span>
              </div>
              <p className="mt-2 leading-relaxed text-muted">
                {entry.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-h3 font-semibold">Work</h2>
        <div className="mt-6 space-y-8">
          {projects.map((project) => (
            <article key={project.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-display text-xl font-semibold">
                  {project.title}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      className="ml-2 text-sm font-normal text-accent underline decoration-line underline-offset-2"
                    >
                      Live site
                    </a>
                  )}
                </h3>
                <span className="text-sm text-muted">
                  {project.year} · {project.role}
                </span>
              </div>
              <p className="mt-2 leading-relaxed text-muted">
                {project.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-h3 font-semibold">Skills</h2>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.label}>
              <h3 className="font-semibold">{group.label}</h3>
              <p className="mt-1 text-muted">{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
