// TODO(content): replace with real roles.

export type ExperienceEntry = {
  period: string;
  role: string;
  company: string;
  description: string;
};

export const experience: ExperienceEntry[] = [
  {
    period: "2024 — Now",
    role: "Senior Frontend Engineer",
    company: "Nova Labs",
    description:
      "Own the web platform's interaction layer. Drive performance budgets, design-system adoption, and mentor two engineers.",
  },
  {
    period: "2021 — 2024",
    role: "Frontend Engineer",
    company: "Meridian",
    description:
      "Built customer-facing commerce surfaces and an internal experimentation framework used company-wide.",
  },
  {
    period: "2019 — 2021",
    role: "Software Engineer",
    company: "Cartograph (acquired)",
    description:
      "Founding engineer. Shipped the first product from prototype to thousands of weekly active users.",
  },
];
