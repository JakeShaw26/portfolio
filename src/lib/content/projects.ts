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

export const projects: Project[] = [
  {
    slug: "travelchapter",
    index: "01",
    title: "Travelchapter",
    summary:
      "Built and maintained a Cypress test suite spanning two newly merged flagship sites, plus a recurring data-integrity script that caught listings missing required property attributes before they reached customers.",
    role: "Software Engineer in Test (SEIT)",
    year: "2024-2025",
    stack: ["Cypress", "Gherkin", "JavaScript", "TypeScript"],
    image: "/work/tc-logo.png",
    imageAlt: "Travelchapter logo",
    caseStudy: [
      {
        heading: "The problem",
        body: "Two companies had recently merged, and the business needed confidence that consolidating their codebases wouldn't break existing functionality on either flagship site.",
      },
      {
        heading: "The approach",
        body: "Built a Cypress test suite covering both flagship sites, verifying UI behaviour and confirming that the correct API calls fired for key user actions. Along the way, identified that some newly merged property listings weren't returning valid room and bathroom counts, caused by discrepancies between the two legacy systems — so wrote a weekly script that trawled roughly 600 properties, flagged the ones with missing attributes, and routed them to business operations for correction.",
      },
      {
        heading: "The outcome",
        body: "A comprehensive test suite now runs in the staging pipeline ahead of every release, catching regressions before they reach production, with documentation in place so other SEITs can extend it. The weekly attribute-gap script continues to flag at-risk listings, reducing the business's exposure to legal risk from inaccurate listings.",
      },
    ],
  },
  {
    slug: "jlr",
    index: "02",
    title: "JLR — OneApp & Home Charging Units",
    summary:
      "Tested the API services behind JLR's OneApp and Home Charging Units products, covering happy and unhappy paths ahead of production releases.",
    role: "Software Engineer in Test (SEIT)",
    year: "2025",
    stack: ["Gherkin", "Robot Framework", "JavaScript", "TypeScript", "Python"],
    image: "/work/jlr-logo.png",
    imageAlt: "JLR logo",
    caseStudy: [
      {
        heading: "The problem",
        body: "OneApp and the Home Charging Units product both needed thorough functional coverage of their API services before release.",
      },
      {
        heading: "The approach",
        body: "Worked across both teams testing the OneApp and Home Charging Units APIs, writing detailed test cases and scripts to cover happy and unhappy paths, and coordinating closely with developers to agree which features were production-ready and which needed further work.",
      },
      {
        heading: "The outcome",
        body: "Both OneApp and the Home Charging Units shipped successfully, backed by high levels of test coverage that caught potential issues before they reached production.",
      },
    ],
  },
  {
    slug: "idaa",
    index: "03",
    title: "IDAA",
    summary:
      "Built the front-end upload flow for a platform that lets team managers distribute licensed personality assets to customers.",
    role: "Front-end Developer",
    year: "2026",
    stack: ["AWS S3", "Next.js", "JavaScript", "TypeScript", "React"],
    image: "/work/and-logo.png",
    imageAlt: "Company logo",
    caseStudy: [
      {
        heading: "The problem",
        body: "Team managers needed a reliable way to upload personality assets and distribute the associated licenses to customers through a new web application.",
      },
      {
        heading: "The approach",
        body: "Owned the front-end build, with particular focus on the upload flow — restricting uploads to approved file types and the correct S3 buckets while keeping the experience seamless for users. Also resolved front-end bugs and worked directly with third parties to debug JSON structure issues.",
      },
      {
        heading: "The outcome",
        body: "An application has been built and provided to the client that utilises 3rd party asset generation and allows management teams to upload assets for a personality and distribute licenses to customers at various prices.",
      },
    ],
  },
  {
    slug: "ask-andi",
    index: "04",
    title: "Ask Andi",
    summary:
      "Built an AI-powered chatbot widget for AND Digital's website that discusses the consultancy's capabilities with prospective clients and routes them to the right expert.",
    role: "Front-end Developer",
    year: "2026",
    stack: ["GCP", "Vertex AI", "React", "Next.js", "TypeScript", "JavaScript"],
    image: "/work/and-logo.png",
    imageAlt: "AND Digital logo",
    caseStudy: [
      {
        heading: "The problem",
        body: "Prospective clients browsing AND Digital's website had no quick way to ask about the consultancy's capabilities or get connected with the right expert.",
      },
      {
        heading: "The approach",
        body: "Used GCP and Vertex AI to design prompts that extract conversation topics and match them against an existing skills dataset, surfacing the most relevant expert for each enquiry. Added guardrails such as unique per-conversation tokens and rate limiting to prevent abuse, and built the supporting email templates.",
      },
      {
        heading: "The outcome",
        body: "The chatbot is live on the AND Digital website, giving prospective clients an interactive way to explore the consultancy's capabilities and get matched with a relevant expert.",
      },
    ],
  },
];
