"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { experience } from "@/lib/content/experience";

/**
 * Vertical timeline. An accent progress line scrubs down the hairline track as
 * the section scrolls, and nodes pop in as they're reached. Under reduced
 * motion the accent line simply renders full-height with no animation.
 */
export function Timeline() {
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
            duration: 0.4,
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: listRef },
  );

  return (
    <ol ref={listRef} className="relative pl-8">
      <span
        aria-hidden
        className="absolute top-2 bottom-2 left-0 w-px bg-hairline"
      />
      <span
        ref={lineRef}
        aria-hidden
        className="absolute top-2 bottom-2 left-0 w-px bg-accent"
      />
      {experience.map((entry) => (
        <li key={entry.period} className="relative pb-12 pl-8 last:pb-0">
          <span className="tl-node absolute top-1.5 left-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
          <span className="font-mono text-xs text-muted uppercase">
            {entry.period}
          </span>
          <h3 className="mt-1 font-display text-2xl font-medium">
            {entry.role}
          </h3>
          <p className="font-mono text-sm text-accent">{entry.company}</p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            {entry.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
