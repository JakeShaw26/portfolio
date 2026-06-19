export type ExperienceSection = {
  heading: string;
  body: string;
};

export type ExperienceEntry = {
  slug: string;
  period: string;
  role: string;
  company: string;
  description: string;
  /** Detail-page body. Falls back to `description` alone when omitted. */
  detail?: ExperienceSection[];
};

export const experience: ExperienceEntry[] = [
  {
    slug: "and-digital",
    period: "Current",
    role: "Product Developer",
    company: "AND Digital",
    description:
      "Consultant software engineer at AND Digital, delivering full-stack development and testing work across a range of client engagements.",
    detail: [
      {
        heading: "The remit",
        body: "Working as a consultant software engineer for AND Digital, placed across a portfolio of client accounts.",
      },
      {
        heading: "The work",
        body: "Delivered work across a variety of clients, drawing on a broad range of engineering skills as each engagement demanded.",
      },
      {
        heading: "The outcome",
        body: "Delivered work spanning full-stack development to thorough testing across a multitude of client engagements, and was promoted from junior to mid-level engineer.",
      },
    ],
  },
  {
    slug: "cloudm",
    period: "4 Months",
    role: "Intern Web Developer",
    company: "CloudM",
    description:
      "Intern web developer contributing to the front-end redesign of CloudM's customer knowledgebase, picking up Sass and SCSS along the way.",
    detail: [
      {
        heading: "The remit",
        body: "Joined CloudM as an intern web developer to gain hands-on experience under the mentorship of a senior developer.",
      },
      {
        heading: "The work",
        body: "Took ownership of the styling and structure for the redesigned knowledgebase.",
      },
      {
        heading: "The outcome",
        body: "Contributed significantly to the front-end redesign of the existing knowledgebase, picking up new skills such as Sass and SCSS along the way.",
      },
    ],
  },
];
