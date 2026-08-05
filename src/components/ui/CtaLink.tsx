import Link from "next/link";
import type { ReactNode } from "react";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  /** Primary = filled accent (one per view). Secondary = outlined. */
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  /** Opens in a new tab, adds the safe `rel`, and swaps → for ↗. */
  external?: boolean;
};

// One hover treatment for every CTA on the site: a small warm lift with an
// accent-tinted shadow, the trailing glyph nudging in its own direction, and a
// press that settles the lift back down.
//
// Picked over a fill/border wipe because it reads identically on the filled and
// the outlined variant, so the two still look like one family. Pure CSS — no JS,
// no hydration cost.
//
// Every hover: state is mirrored on focus-visible so keyboard users get the same
// affordance, and anything that moves is gated behind motion-safe.
const base =
  "group inline-flex items-center gap-2 rounded-full border font-display shadow-accent/25 transition duration-300 ease-out hover:shadow-xl focus-visible:shadow-xl motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5 motion-safe:active:translate-y-0";

const variants = {
  primary: "border-accent bg-accent text-surface",
  secondary:
    "border-line bg-surface/60 text-foreground hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent",
} as const;

const sizes = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3 text-lg",
} as const;

export function CtaLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
}: CtaLinkProps) {
  const glyphMotion = external
    ? "motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5"
    : "motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1";

  const content = (
    <>
      {children}
      {/* The ↗ is decorative, so new-tab links would otherwise open without warning. */}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
      <span
        aria-hidden="true"
        className={`transition-transform duration-300 ease-out ${glyphMotion}`}
      >
        {external ? "↗" : "→"}
      </span>
    </>
  );

  const className = `${base} ${variants[variant]} ${sizes[size]}`;

  // Route paths go through next/link for client-side navigation; mailto: and
  // same-page hashes have nothing to prefetch, so they stay plain anchors.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={className}
    >
      {content}
    </a>
  );
}
