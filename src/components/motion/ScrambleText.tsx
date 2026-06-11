"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

type ScrambleTextProps = {
  text: string;
  className?: string;
};

/**
 * Renders `text` (server-visible for SEO/a11y) and, on scroll into view,
 * resolves it from random uppercase glyphs. No-op under reduced motion.
 */
export function ScrambleText({ text, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(ref.current, {
          duration: 1.4,
          ease: "none",
          scrambleText: {
            text,
            chars: "upperCase",
            speed: 0.5,
            revealDelay: 0.3,
          },
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
      });
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
