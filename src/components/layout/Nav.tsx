import { site, nav } from "@/lib/content/site";
import { Magnetic } from "@/components/motion/Magnetic";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <a href="#" className="font-mono text-sm font-medium tracking-tight">
          {site.name.toUpperCase()}
        </a>
        <nav className="hidden gap-6 font-mono text-xs text-muted uppercase sm:flex">
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
            className="font-mono text-xs text-accent uppercase transition-opacity hover:opacity-70"
          >
            Say hi →
          </a>
        </Magnetic>
      </div>
    </header>
  );
}
