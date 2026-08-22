export type ProjectSection = {
  heading: string;
  body: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  /** Path under /public, e.g. "/work/helix-analytics.png". Falls back to a placeholder graphic when omitted. */
  image?: string;
  imageAlt?: string;
  /** External link (live site or repo) shown on the case study page. */
  liveUrl?: string;
  /** Case study body. Falls back to `summary` on the detail page when omitted. */
  caseStudy?: ProjectSection[];
  /**
   * The sharpest decision line from the case study, rendered once at large
   * scale after the first section. Only worth adding where a genuinely
   * strong line exists — not every project needs one.
   */
  pullQuote?: string;
};

/**
 * `<ViewTransition name>` pairs must match exactly between the project card
 * (`ProjectShowcase`) and the case-study hero (`/work/[slug]/page.tsx`) for
 * the browser to morph one into the other. Centralised here so the two
 * call sites can't drift into mismatched names, which would silently fall
 * back to a hard cut with no error.
 */
export function projectImageViewTransitionName(slug: string) {
  return `project-image-${slug}`;
}

export function projectTitleViewTransitionName(slug: string) {
  return `project-title-${slug}`;
}
