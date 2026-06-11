"use client";

import { gsap, useGSAP } from "@/lib/motion/gsap";

/**
 * Enhances the sticky-stack project deck: as each card is covered by the next,
 * its inner panel scales down and dims, creating cinematic depth. Layout is
 * handled by CSS sticky, so this only adds transform/opacity — no overlap risk.
 * Renders nothing. No-op under reduced motion.
 */
export function StackMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("#work .project-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const panel = card.querySelector("article");
        gsap.to(panel, {
          scale: 0.93,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    });
  });

  return null;
}
