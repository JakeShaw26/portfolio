/*
 * PLACEHOLDER — Phase 1 design-system proof only.
 * Real sections (Hero, About, Projects, …) replace this in Phase 2–3.
 * No GSAP here yet; motion primitives arrive in Phase 2.
 */
export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col justify-center px-6 sm:px-10 lg:px-16">
      <span className="font-mono text-label text-muted uppercase">
        01 / index
      </span>

      <h1 className="mt-6 max-w-5xl font-display text-display font-bold">
        Jake Shaw builds{" "}
        <span className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-transparent">
          interfaces
        </span>{" "}
        that ship.
      </h1>

      <p className="mt-8 max-w-md font-mono text-sm text-muted">
        frontend engineer — UK
        <span className="text-accent"> ▮</span>
      </p>

      <div className="mt-16 flex items-center gap-3 border-t border-hairline pt-6 font-mono text-xs text-muted uppercase">
        <span>scroll ▼</span>
        <span className="text-foreground/40">design system: SIGNAL</span>
      </div>
    </main>
  );
}
