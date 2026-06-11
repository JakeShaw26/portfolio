"use client";

import { gsap, useGSAP } from "@/lib/motion/gsap";

/**
 * Slowly drifts the amber atmosphere so the page feels alive at rest.
 * Transform-only (scale/translate) to stay on the compositor — never animates
 * the gradient itself. Renders nothing. No-op under reduced motion.
 */
export function AtmosphereDrift() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".atmosphere", {
        scale: 1.15,
        xPercent: -4,
        yPercent: -3,
        duration: 14,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  });

  return null;
}
