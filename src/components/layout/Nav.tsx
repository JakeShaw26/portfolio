import { site, nav } from "@/lib/content/site";
import { Magnetic } from "@/components/motion/Magnetic";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <a
          href="#"
          className="font-display text-xl font-semibold tracking-tight"
        >
          {site.name}
        </a>
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
        <Magnetic>
          <a
            href="#contact"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
          >
            Say hello
          </a>
        </Magnetic>
      </div>
    </header>
  );
}
