"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** 0–1: how far the element follows the cursor. */
  strength?: number;
};

/**
 * Pulls its child toward the cursor on hover and springs back on leave.
 * Disabled under reduced motion (quickTo setters stay null → handlers no-op).
 */
export function Magnetic({
  children,
  className,
  strength = 0.4,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        xTo.current = gsap.quickTo(ref.current, "x", {
          duration: 0.5,
          ease: "power3.out",
        });
        yTo.current = gsap.quickTo(ref.current, "y", {
          duration: 0.5,
          ease: "power3.out",
        });
      });
    },
    { scope: ref },
  );

  const handleMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !xTo.current || !yTo.current) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    xTo.current(x);
    yTo.current(y);
  };

  const handleLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
  };

  return (
    <span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </span>
  );
}
