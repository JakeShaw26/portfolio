"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type AnimatedHeadlineProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Splits its headline into characters and settles them in from below on mount
 * ("like dust"). `mask: "chars"` clips each glyph so it rises from behind its
 * own line. `aria: "auto"` keeps the original text in the accessibility tree.
 * No-op under reduced motion.
 */
export function AnimatedHeadline({
  children,
  className,
}: AnimatedHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(ref.current, {
          type: "words,chars",
          mask: "chars",
          aria: "auto",
        });

        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 7,
          opacity: 0,
          ease: "back.out(1.4)",
          stagger: 0.022,
          duration: 0.9,
          delay: 0.15,
        });

        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}
