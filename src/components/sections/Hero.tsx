import { site } from "@/lib/content/site";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";
import { CtaLink } from "@/components/ui/CtaLink";

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center px-6 py-32 sm:px-10 lg:px-16">
      <AnimatedHeadline className="max-w-[14ch] font-display text-display font-semibold">
        Software <span className="text-accent italic">engineer</span> &
        interface craftsman.
      </AnimatedHeadline>

      <p className="mt-10 max-w-xl text-xl leading-relaxed text-muted">
        {site.intro}
      </p>

      {/* CtaLink appends its own trailing glyph, so no → in the label. */}
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <CtaLink href="#work">See the work</CtaLink>
        <CtaLink href="#contact" variant="secondary">
          Get in touch
        </CtaLink>
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
