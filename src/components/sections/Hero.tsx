import { site } from "@/lib/content/site";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center px-6 py-32 sm:px-10 lg:px-16">
      <span className="text-eyebrow font-semibold text-accent uppercase">
        Available 2026
      </span>

      <AnimatedHeadline className="mt-8 max-w-[14ch] font-display text-display font-semibold">
        Software <span className="text-accent italic">engineer</span> &
        interface craftsman.
      </AnimatedHeadline>

      <p className="mt-10 max-w-xl text-xl leading-relaxed text-muted">
        {site.intro}
      </p>

      <div className="mt-12 flex items-center gap-6">
        <a
          href="#work"
          className="rounded-full bg-foreground px-8 py-3.5 text-base font-medium text-background transition-opacity hover:opacity-90"
        >
          See the work
        </a>
        <a
          href="#contact"
          className="text-base text-muted transition-colors hover:text-foreground"
        >
          Get in touch →
        </a>
      </div>

      <span
        aria-hidden
        className="absolute bottom-10 left-6 text-eyebrow tracking-[0.2em] text-muted uppercase sm:left-10 lg:left-16"
      >
        Scroll ↓
      </span>
    </section>
  );
}
