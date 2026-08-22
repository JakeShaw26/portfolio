"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

/**
 * Accent dot that trails the pointer and grows over interactive elements.
 * Rendered only for fine pointers without reduced-motion; the native cursor
 * is intentionally left visible for usability.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = dotRef.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    const move = (event: MouseEvent) => {
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const grow = () => gsap.to(el, { scale: 2.6, duration: 0.3 });
    const shrink = () => gsap.to(el, { scale: 1, duration: 0.3 });

    const interactive = document.querySelectorAll("a, button, [data-cursor]");
    window.addEventListener("mousemove", move);
    interactive.forEach((node) => {
      node.addEventListener("mouseenter", grow);
      node.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      interactive.forEach((node) => {
        node.removeEventListener("mouseenter", grow);
        node.removeEventListener("mouseleave", shrink);
      });
    };
  });

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] h-3 w-3 rounded-full bg-accent mix-blend-difference print:hidden"
      // Same reasoning as Nav's header and the atmosphere layer (see
      // globals.css): this persists across the root layout, but the
      // browser's view-transition snapshot still captures it by pixel, and
      // an un-named fixed element can flash if its GSAP-driven transform
      // happens to differ between the old and new snapshot moments.
      style={{ viewTransitionName: "cursor-dot" }}
    />
  );
}
