// TODO(content): tune to your real stack and proficiency.

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "HTML", "CSS", "SQL"],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Express"],
  },
  {
    label: "Craft",
    items: ["GSAP", "Tailwind", "Accessibility", "Design Systems"],
  },
  {
    label: "Learning",
    items: ["Docker", "GitHub Actions", "OWASP", "Auth patterns"],
  },
];
