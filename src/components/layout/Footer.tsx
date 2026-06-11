import { site } from "@/lib/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16 sm:px-10 lg:px-16">
      <div className="flex flex-col justify-between gap-4 text-sm text-muted sm:flex-row">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Crafted with Next.js + GSAP</span>
      </div>
    </footer>
  );
}
