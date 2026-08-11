// Four groups, deliberately: `Skills.tsx` lays out at `lg:grid-cols-4`, so a fifth
// would sit alone on a second row.
//
// There is no "Learning" group. An earlier version had one (Docker, GitHub Actions,
// OWASP, Auth patterns) and it worked against the site's positioning: this reads as a
// list of what's held, with depth shown by what's in it rather than by a bucket
// admitting what isn't. Two of those four are also demonstrable in this repo now.

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Core",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js"],
  },
  {
    label: "Interface",
    items: [
      "Tailwind",
      "GSAP",
      "Accessibility",
      "Design systems",
      "HTML & CSS",
    ],
  },
  {
    label: "Testing",
    items: [
      "Vitest",
      "Test strategy",
      "Test automation",
      "Accessibility audits",
    ],
  },
  {
    label: "Platform",
    items: [
      "GitHub Actions",
      "Vercel",
      "Contentful",
      "Web security (OWASP)",
      "CI/CD",
    ],
  },
];
