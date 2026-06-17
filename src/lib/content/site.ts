// TODO(content): replace all placeholder copy/links with real values.
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
// Override per-environment with NEXT_PUBLIC_SITE_URL on Vercel.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://jakeshaw.dev"; // TODO(content): real production domain

export const site = {
  name: "Jake Shaw",
  role: "Software Engineer",
  location: "UK",
  available: true,
  tagline: "builds interfaces that ship.",
  intro:
    "Frontend-focused engineer crafting fast, accessible, and considered web interfaces. Currently learning the backend, CI/CD, and security craft end-to-end.",
  email: "hello@example.com", // TODO(content): real contact email
  socials: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
  ] satisfies SocialLink[],
};

export const nav: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
