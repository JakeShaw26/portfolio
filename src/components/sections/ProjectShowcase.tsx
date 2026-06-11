"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { projects } from "@/lib/content/projects";

const total = String(projects.length).padStart(2, "0");

/**
 * Selected Work. Default DOM is an accessible vertical list of project panels.
 * When motion is allowed, GSAP re-lays-it-out into a pinned stage whose panels
 * wipe in (clip-path) on scroll, with a ticking index counter. Under
 * reduced-motion / no-JS, the plain list is what renders — no content is hidden.
 */
export function ProjectShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
        const count = panels.length;
        if (count < 2) return;

        // Re-lay-out the plain list into a pinned, stacked stage.
        gsap.set(containerRef.current, { height: `${count * 100}vh` });
        gsap.set(stageRef.current, {
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        });
        gsap.set(panelsRef.current, { position: "relative", height: "62vh" });
        gsap.set(panels, {
          position: "absolute",
          inset: 0,
          clipPath: "inset(100% 0% 0% 0%)",
        });
        gsap.set(panels[0], { clipPath: "inset(0% 0% 0% 0%)" });
        panels.forEach((panel, i) => gsap.set(panel, { zIndex: i }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (count - 1));
              if (counterRef.current) {
                counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} — ${total}`;
              }
            },
          },
        });

        panels.forEach((panel, i) => {
          if (i === 0) return;
          tl.to(
            panel,
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
            i - 1,
          );
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative border-t border-hairline"
    >
      <div
        ref={stageRef}
        className="overflow-hidden px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
      >
        <div className="mb-12 flex items-center justify-between font-mono text-label text-muted uppercase">
          <span>
            <span className="text-accent">03</span> / Selected Work
          </span>
          <span ref={counterRef} className="text-foreground/40">
            01 — {total}
          </span>
        </div>

        <div ref={panelsRef}>
          {projects.map((project) => (
            <article
              key={project.index}
              className="project-panel flex flex-col justify-center border-t border-hairline py-10 first:border-t-0"
            >
              <span className="font-mono text-sm text-accent">
                {project.index} — {project.year}
              </span>
              <div className="mt-4 grid gap-6 md:grid-cols-12 md:items-end">
                <h3 className="font-display text-h2 font-medium md:col-span-7">
                  <a
                    href={project.href}
                    className="transition-opacity hover:opacity-70"
                  >
                    {project.title}
                  </a>
                </h3>
                <p className="text-muted md:col-span-5">{project.summary}</p>
                <p className="font-mono text-xs text-muted uppercase md:col-span-7">
                  {project.role}
                </p>
                <ul className="flex flex-wrap gap-2 md:col-span-5 md:justify-end">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-hairline px-2 py-1 font-mono text-[0.6875rem] text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
