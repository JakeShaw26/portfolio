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
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          autoAlpha: 0,
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
