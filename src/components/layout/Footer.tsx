import Link from "next/link";

import { site } from "@/lib/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16 sm:px-10 lg:px-16">
      <div className="flex flex-col justify-between gap-4 text-sm text-muted sm:flex-row">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <Link href="/colophon" className="transition-colors hover:text-accent">
          Crafted with Next.js + GSAP
        </Link>
      </div>
    </footer>
  );
}
