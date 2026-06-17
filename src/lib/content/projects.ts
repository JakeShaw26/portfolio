// TODO(content): replace with real projects / case studies.

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
  /** External link (live site or repo) shown on the case study page. */
  liveUrl?: string;
  /** Case study body. Falls back to `summary` on the detail page when omitted. */
  caseStudy?: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "helix-analytics",
    index: "01",
    title: "Helix Analytics",
    summary:
      "A real-time analytics dashboard rebuilt for sub-100ms interaction. Led the move to streaming charts and a virtualized data grid.",
    role: "Lead Frontend Engineer",
    year: "2025",
    stack: ["Next.js", "TypeScript", "WebSockets", "D3"],
    // TODO(content): mock case study — replace with the real write-up.
    caseStudy: [
      {
        heading: "The problem",
        body: "The existing dashboard re-rendered its entire chart tree on every websocket tick, capping usable refresh rates well below what traders needed and dropping frames on anything but the newest hardware.",
      },
      {
        heading: "The approach",
        body: "Rebuilt the chart layer on a canvas-based renderer driven by a windowed data store, replaced the dense table with a virtualized grid, and moved tick aggregation off the main thread into a worker.",
      },
      {
        heading: "The outcome",
        body: "Interaction latency dropped from ~400ms to sub-100ms under full tick load, and the grid now holds 50k+ rows without scroll jank.",
      },
    ],
  },
  {
    slug: "meridian-commerce",
    index: "02",
    title: "Meridian Commerce",
    summary:
      "Headless storefront with an experimentation layer. Shipped a checkout flow that lifted conversion by a double-digit margin.",
    role: "Frontend Engineer",
    year: "2024",
    stack: ["React", "GraphQL", "Tailwind", "Stripe"],
  },
  {
    slug: "cartograph",
    index: "03",
    title: "Cartograph",
    summary:
      "An interactive mapping tool for urban planners. Built the rendering pipeline and a plugin system for custom map layers.",
    role: "Founding Engineer",
    year: "2023",
    stack: ["TypeScript", "MapLibre", "Node.js"],
  },
  {
    slug: "orbit-design-system",
    index: "04",
    title: "Orbit Design System",
    summary:
      "A component library and token pipeline adopted across five product teams, with automated accessibility and visual regression checks.",
    role: "Design Systems Engineer",
    year: "2022",
    stack: ["React", "Storybook", "Style Dictionary"],
  },
];
