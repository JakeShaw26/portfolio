// TODO(content): replace with real projects / case studies.

export type Project = {
  index: string;
  title: string;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "Helix Analytics",
    summary:
      "A real-time analytics dashboard rebuilt for sub-100ms interaction. Led the move to streaming charts and a virtualized data grid.",
    role: "Lead Frontend Engineer",
    year: "2025",
    stack: ["Next.js", "TypeScript", "WebSockets", "D3"],
    href: "#",
  },
  {
    index: "02",
    title: "Meridian Commerce",
    summary:
      "Headless storefront with an experimentation layer. Shipped a checkout flow that lifted conversion by a double-digit margin.",
    role: "Frontend Engineer",
    year: "2024",
    stack: ["React", "GraphQL", "Tailwind", "Stripe"],
    href: "#",
  },
  {
    index: "03",
    title: "Cartograph",
    summary:
      "An interactive mapping tool for urban planners. Built the rendering pipeline and a plugin system for custom map layers.",
    role: "Founding Engineer",
    year: "2023",
    stack: ["TypeScript", "MapLibre", "Node.js"],
    href: "#",
  },
  {
    index: "04",
    title: "Orbit Design System",
    summary:
      "A component library and token pipeline adopted across five product teams, with automated accessibility and visual regression checks.",
    role: "Design Systems Engineer",
    year: "2022",
    stack: ["React", "Storybook", "Style Dictionary"],
    href: "#",
  },
];
