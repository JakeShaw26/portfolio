import Link from "next/link";

import { site, nav } from "@/lib/content/site";
import { CtaLink } from "@/components/ui/CtaLink";

export function Nav() {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      // Named so the view transition triggered by clicking a project card
      // pulls the header into its own snapshot group instead of leaving it
      // in the default root group (see globals.css) — otherwise it flashes/
      // duplicates during the card -> case-study morph.
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        {/*
          `/` rather than `#` — a bare `#` fragment has no real navigable
          target (jsx-a11y/anchor-is-valid). `next/link` rather than a plain
          `<a>` because this is an internal same-site destination
          (@next/next/no-html-link-for-pages).
        */}
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight"
        >
          {site.name}
        </Link>
        <nav className="hidden gap-8 text-sm text-muted sm:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <CtaLink href="/#contact" size="sm">
          Say hello
        </CtaLink>
      </div>
    </header>
  );
}
