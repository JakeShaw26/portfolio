"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import type { ExperienceEntry } from "@/lib/content/experience";

type TimelineProps = {
  experience: ExperienceEntry[];
};

/**
 * Experience timeline. An accent progress line scrubs down the track as the
 * section scrolls; nodes pop in as reached. Under reduced motion the accent
 * line simply renders full-height with no animation.
 */
export function Timeline({ experience }: TimelineProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(lineRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".tl-node").forEach((node) => {
          gsap.from(node, {
            scale: 0,
            ease: "back.out(2)",
            duration: 0.45,
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: listRef },
  );

  return (
    <ol ref={listRef} className="relative pl-10">
      <span
        aria-hidden
        className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-line"
      />
      <span
        ref={lineRef}
        aria-hidden
        className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-accent"
      />
      {experience.map((entry) => (
        <li key={entry.slug} className="relative pb-16 pl-10 last:pb-0">
          <span className="tl-node absolute top-1 left-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-background bg-accent" />
          <span className="text-eyebrow text-muted uppercase">
            {entry.period}
          </span>
          <h3 className="mt-2 font-display text-3xl font-semibold">
            {entry.role}
          </h3>
          <p className="mt-1 text-lg text-accent">{entry.company}</p>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            {entry.description}
          </p>
          <Link
            href={`/experience/${entry.slug}`}
            className="mt-4 inline-block text-sm font-medium text-accent transition-opacity hover:opacity-70"
          >
            View role →
          </Link>
        </li>
      ))}
    </ol>
  );
}
