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
};
