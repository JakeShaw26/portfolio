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
