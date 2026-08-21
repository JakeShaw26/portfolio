"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds, useful for staggering sibling Reveals. */
  delay?: number;
};

/**
 * Fades + lifts its content into view on scroll. Wraps server-rendered markup,
 * so sections stay server components. Animation is gated behind
 * prefers-reduced-motion via gsap.matchMedia (auto-reverts on cleanup).
 *
 * `opacity`, not `autoAlpha` — autoAlpha also toggles `visibility: hidden`
 * before the ScrollTrigger fires, which pulls everything below the fold
 * (headings included) out of the accessibility tree until an actual scroll
 * event crosses the trigger. That's not just a missed animation: it's why
 * axe's heading-order check flagged the first work-card h3 as skipping a
 * level — About's h2 sits inside this same wrapper and was genuinely
 * invisible to the scanner at page-load, since About starts below Hero's
 * full-viewport height. `opacity` alone keeps content readable by
 * assistive tech from first paint while still fading in visually.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: "expo.out",
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
