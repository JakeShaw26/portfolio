// This is the single source of truth for top-level site info.

export type SocialLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
};

// Canonical site origin (no trailing slash). Used for metadata, OG, sitemap.
//
// MUST be set as NEXT_PUBLIC_SITE_URL in Vercel (Production + Preview) — it is
// read at build time and inlined, so changing it needs a redeploy.
//
// The fallback is localhost deliberately: a wrong-but-plausible domain here would
// silently point canonical URLs, OG tags and sitemap.xml at a site we don't own,
// which is worse than an obviously-broken local URL.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const site = {
  name: "Jake Shaw",
  role: "Software Engineer",
  location: "Manchester, UK",
  available: false,
  // Rendered directly beneath `name` on the OG card, so it reads as a continuation
  // of it ("Jake Shaw / builds interfaces…") — hence the lowercase start.
  // Deliberately mirrors the About heading so the shared card and the page agree.
  tagline: "builds interfaces that are simple to use — and simple to test.",
  intro:
    "Frontend engineer with a background in test, building accessible interfaces and AI-enhanced products. React, Next.js and Node — going deeper, not wider.",
  // Public contact address. Rendered as a `mailto:` link, so it is intentionally
  // visible — not a secret, and not injectable via env (it's needed at build time
  // for static output).
  email: "jakeshaw121@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/JakeShaw26" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jake--shaw/" },
  ] satisfies SocialLink[],
};

/** Subject line pre-filled when someone opens the `mailto:` link. */
export const contactSubject = "Portfolio enquiry";

export const nav: NavItem[] = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];
