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
  // Scroll positions, not cards: the single source of truth for both how many
  // dots there are and which one is active, so a click always round-trips.
  const [positions, setPositions] = useState<number[]>(() =>
    testimonials.map(() => 0),
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    let snapPoints: number[] = [];

    /*
     * The scrollLeft at which this card ends up start-aligned — the position
     * the browser's own scroll-snap settles on. scroll-padding, not padding,
     * is what displaces a snap position, so reading it keeps this correct
     * however the track's gutter ends up being expressed.
     */
    const snapPositionOf = (card: HTMLElement) =>
      card.getBoundingClientRect().left -
      track.getBoundingClientRect().left -
      (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0) +
      track.scrollLeft;

    /*
     * With several cards in view the trailing ones can never be start-aligned
     * — the track runs out of scroll first — so their snap positions are
     * dropped and the end of the track becomes the final dot, where
     * `last:snap-end` parks the last card. That naturally yields fewer dots
     * than cards on desktop and one dot per card on mobile.
     *
     * Once three or more cards already fit on screen, a dot for every single
     * card is a one-card nudge that barely changes what's visible. Step two
     * cards at a time in that regime so each dot represents a real page turn;
     * narrower layouts (where every card matters) keep one dot per card.
     */
    const remeasure = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      if (cards.length === 0) return;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const cardStep =
        cards.length > 1
          ? snapPositionOf(cards[1]) - snapPositionOf(cards[0])
          : 0;
      const visibleCards =
        cardStep > 0 ? Math.floor(track.clientWidth / cardStep) : 1;
      const step = visibleCards >= 3 ? 2 : 1;
      snapPoints = cards
        .filter((_, index) => index % step === 0)
        .map(snapPositionOf)
        .filter((position) => position < maxScroll - 1);
      snapPoints.push(maxScroll);
      setPositions(snapPoints);
    };

    const measure = () => {
      frame = 0;
      let nearest = 0;
      let shortest = Infinity;
      snapPoints.forEach((position, index) => {
        const distance = Math.abs(position - track.scrollLeft);
        if (distance < shortest) {
          shortest = distance;
          nearest = index;
        }
      });
      setActive(nearest);
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    /*
     * ResizeObserver, not a window resize listener: the track's own box can
     * change without the window's (scrollbar gutter, container relayout,
     * zoom), and a snap-point measurement left stale across one of those is
     * exactly what left the trailing dots unreachable. It also fires once on
     * observe, so the initial layout is covered without a separate call.
     */
    const observer = new ResizeObserver(() => {
      remeasure();
      schedule();
    });
    observer.observe(track);
    track.addEventListener("scroll", schedule, { passive: true });

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      observer.disconnect();
      track.removeEventListener("scroll", schedule);
    };
  }, [testimonials.length]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const position = positions[index];
      if (!track || position === undefined) return;
      track.scrollTo({
        left: position,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [positions],
  );

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
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 motion-safe:scroll-smooth scroll-pl-6 scroll-pr-6 sm:-mx-10 sm:px-10 sm:scroll-pl-10 sm:scroll-pr-10 lg:-mx-16 lg:px-16 lg:scroll-pl-16 lg:scroll-pr-16"
      >
        {testimonials.map((testimonial) => (
          <li
            key={testimonial.index}
            className="w-[80vw] max-w-md shrink-0 snap-start last:snap-end sm:w-[26rem]"
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
      </ul>

      {/*
       * Buttons, not decoration: hiding the scrollbar removes the only affordance
       * a mouse-wheel user had. Padding gives each dot a 24px+ hit area
       * (WCAG 2.5.8) while the visible dot stays small.
       */}
      {positions.length > 1 && (
        <div
          role="group"
          aria-label="Jump to a quote"
          className="mt-8 flex justify-center gap-1"
        >
          {positions.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`View ${index + 1} of ${positions.length}`}
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
      )}
    </>
  );
}
