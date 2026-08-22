"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

/**
 * Drives smooth scrolling with Lenis and keeps ScrollTrigger in sync.
 * Lenis uses native scroll (no transform), so sticky/fixed elements still work.
 * Honors prefers-reduced-motion by leaving native scrolling untouched.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    // This component lives in the root layout, so it persists (and keeps the
    // same Lenis instance) across client-side navigations — only `children`
    // swaps. Lenis interpolates toward its own internal scroll target every
    // rAF tick; without this, a card -> case-study navigation lands with
    // Next's router at the top of the new page, but Lenis still remembers
    // the old page's (likely non-zero, deep-scrolled) target and pulls the
    // view back toward it on the very next frame — exactly the "transition
    // starts from the wrong visual offset" risk the ticket calls out.
    // `immediate: true` snaps rather than smooth-scrolling to 0, since this
    // is a hard reset for a new page, not a user-initiated scroll.
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
