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
 * ("like dust"). `mask: "lines"` clips at the line level (not per-char — a
 * tight per-glyph clip box crops swashes/descenders/rotation overshoot on
 * glyphs like "&") so each line rises from behind one shared mask while
 * individual chars still animate in with stagger. `aria: "auto"` keeps the
 * original text in the accessibility tree. No-op under reduced motion.
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
        const el = ref.current;
        if (!el) return;

        // The line mask's clip box height comes from the inherited line-height,
        // which is tighter than the glyphs' rendered height — loosen it only
        // while the mask exists, then restore the design's tight line-height
        // once revert() hands the plain text back.
        const originalLineHeight = el.style.lineHeight;
        el.style.lineHeight = "1.3";

        const split = SplitText.create(el, {
          type: "lines,words,chars",
          mask: "lines",
          aria: "auto",
        });

        const restore = () => {
          split.revert();
          el.style.lineHeight = originalLineHeight;
        };

        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 7,
          opacity: 0,
          ease: "back.out(1.4)",
          stagger: 0.022,
          duration: 0.9,
          delay: 0.15,
        });

        return restore;
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
