// Five groups. `Skills.tsx` tracks this count in its grid — keep them in step.
//
// There is no "Learning" group. An earlier version had one (Docker, GitHub Actions,
// OWASP, Auth patterns) and it worked against the site's positioning: this reads as a
// list of what's held, with depth shown by what's in it rather than by a bucket
// admitting what isn't. Two of those four are also demonstrable in this repo now.
//
// Everything under AI is grounded in shipped production work. Nothing here claims
// evaluation or RAG, which haven't been built, and nothing names a control parameter —
// describing the class of guardrail is fine, publishing its thresholds is not.

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
    label: "AI",
    items: [
      "Agentic products",
      "LLM integration",
      "Prompt design",
      "Guardrails",
    ],
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
