"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, type MouseEvent, type ReactNode } from "react";

type ViewTransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Like next/link, but drives the navigation through the native View
 * Transitions API so elements sharing a view-transition-name (the project
 * image/title pair, named in src/lib/content/projects.ts) morph instead of
 * hard-cutting. React's own <ViewTransition> component only ships in React's
 * canary channel — this repo pins the stable release — so the transition is
 * started manually here instead of through that component.
 */
export function ViewTransitionLink({
  href,
  className,
  children,
}: ViewTransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab, middle-click, etc.) behave natively.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const supportsViewTransitions =
      typeof document.startViewTransition === "function";
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!supportsViewTransitions || prefersReduced) {
      return; // fall back to Link's normal navigation
    }

    event.preventDefault();

    document.startViewTransition(() => {
      return new Promise<void>((resolve) => {
        startTransition(() => {
          router.push(href);
        });
        // Next's router resolves the new route asynchronously and there's no
        // "the new page has painted" signal without React's own
        // <ViewTransition> integration. Two animation frames is the standard
        // heuristic for "this tick's DOM update has painted", and it's
        // reliable here because Link prefetches the route by default, so the
        // RSC payload is normally already cached by the time this fires.
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    });
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
