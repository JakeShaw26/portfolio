"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Testimonial } from "@/lib/content/testimonials";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [spacerWidth, setSpacerWidth] = useState(0);

  // Real cards only — excludes the trailing spacer `<li>` below, which is
  // aria-hidden precisely so it can double as the marker this filters on.
  const cardsOf = (track: HTMLUListElement) =>
    Array.from(
      track.querySelectorAll(":scope > li:not([aria-hidden])"),
    ) as HTMLElement[];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const cards = cardsOf(track);
      if (cards.length === 0) return;

      const trackLeft = track.getBoundingClientRect().left;
      let nearest = 0;
      let shortest = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(
          card.getBoundingClientRect().left - trackLeft,
        );
        if (distance < shortest) {
          shortest = distance;
          nearest = index;
        }
      });

      setActive(nearest);
    };

    /*
     * More than one card is visible at desktop widths, so without this the
     * track runs out of scrollable distance before the last card's own
     * start-aligned position — its dot (and the one before it, with enough
     * cards) becomes permanently unreachable, since "nearest to start" above
     * never fires for a card that can never actually reach the start. Sizing
     * this spacer to the leftover space after the last card fills the view
     * extends scrollWidth just enough that the last card CAN be scrolled
     * flush with the start, exactly like every other card.
     */
    const updateSpacer = () => {
      const cards = cardsOf(track);
      const lastCard = cards[cards.length - 1];
      if (!lastCard) return;
      setSpacerWidth(Math.max(0, track.clientWidth - lastCard.offsetWidth));
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    const onResize = () => {
      updateSpacer();
      schedule();
    };

    updateSpacer();
    measure();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [testimonials.length]);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = cardsOf(track)[index];
    if (!card) return;

    /*
     * scrollBy on the track rather than card.scrollIntoView, which also scrolls
     * the page vertically to reach the element. The delta only has to be close:
     * scroll-snap is mandatory, so the browser settles onto the exact snap
     * point afterwards.
     */
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const delta =
      card.getBoundingClientRect().left -
      track.getBoundingClientRect().left -
      padding;

    track.scrollBy({
      left: delta,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  return (
    <>
      {/*
       * A scroll-snap track rather than a JS carousel: every quote stays in the
       * served HTML, so search engines and LLM-driven candidate search can read
       * all of them. This component is client-side only to drive the dots — the
       * markup is still server-rendered.
       *
       * tabIndex is what makes it keyboard-scrollable (WCAG 2.1.1); without it
       * the region is reachable by mouse only. jsx-a11y/no-noninteractive-tabindex
       * flags this by default, but its own docs carve out exactly this case —
       * a scrollable container needing tabindex="0" for browsers without native
       * keyboard-focusable scroll containers — as the sanctioned exception.
       */}
      <ul
        ref={trackRef}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-label="Quotes from colleagues"
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 motion-safe:scroll-smooth sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16"
      >
        {testimonials.map((testimonial) => (
          <li
            key={testimonial.index}
            className="w-[80vw] max-w-md shrink-0 snap-start sm:w-[26rem]"
          >
            <figure className="flex h-full flex-col justify-between rounded-3xl border border-line bg-surface p-8">
              <blockquote className="font-display text-lg leading-relaxed italic">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-8 text-xs font-semibold tracking-[0.12em] text-accent uppercase">
                {testimonial.role}
              </figcaption>
            </figure>
          </li>
        ))}
        {/*
         * Not a real card — exists purely to extend scrollWidth so the last
         * card can reach the start-aligned position (see the spacer comment
         * above `updateSpacer`). aria-hidden both keeps it out of assistive
         * tech and is what cardsOf() filters on to exclude it from indexing.
         */}
        <li aria-hidden style={{ width: spacerWidth }} className="shrink-0" />
      </ul>

      {/*
       * Buttons, not decoration: hiding the scrollbar removes the only affordance
       * a mouse-wheel user had. Padding gives each dot a 24px+ hit area
       * (WCAG 2.5.8) while the visible dot stays small.
       */}
      <div
        role="group"
        aria-label="Jump to a quote"
        className="mt-8 flex justify-center gap-1"
      >
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Quote ${index + 1} of ${testimonials.length}`}
            aria-current={index === active ? "true" : undefined}
            className="group cursor-pointer p-2"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                index === active
                  ? "w-6 bg-accent"
                  : "w-2 bg-line group-hover:bg-accent/40"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
