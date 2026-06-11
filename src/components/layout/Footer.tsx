import { site } from "@/lib/content/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-10 sm:px-10 lg:px-16">
      <div className="flex flex-col justify-between gap-4 font-mono text-xs text-muted uppercase sm:flex-row">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="text-foreground/40">dark-only — by design</span>
        <span>built with Next.js + GSAP</span>
      </div>
    </footer>
  );
}
