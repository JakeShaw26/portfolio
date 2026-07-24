import { afterEach, describe, expect, it, vi } from "vitest";

import { getAllProjects, mapProject } from "./projects";

describe("mapProject", () => {
  it("maps a full fixture to the exact expected object", () => {
    const result = mapProject({
      slug: "travelchapter",
      index: "01",
      title: "Travelchapter",
      summary: "Built and maintained a Cypress test suite.",
      role: "Software Engineer in Test (SEIT)",
      year: "2024-2025",
      stack: ["Cypress", "TypeScript"],
      image: "/work/tc-logo.png",
      imageAlt: "Travelchapter logo",
      liveUrl: "https://example.com",
      caseStudy: [{ heading: "The problem", body: "Two companies merged." }],
    });

    expect(result).toEqual({
      slug: "travelchapter",
      index: "01",
      title: "Travelchapter",
      summary: "Built and maintained a Cypress test suite.",
      role: "Software Engineer in Test (SEIT)",
      year: "2024-2025",
      stack: ["Cypress", "TypeScript"],
      image: "/work/tc-logo.png",
      imageAlt: "Travelchapter logo",
      liveUrl: "https://example.com",
      caseStudy: [{ heading: "The problem", body: "Two companies merged." }],
    });
  });

  it("omits image, imageAlt, liveUrl and caseStudy when absent", () => {
    const result = mapProject({
      slug: "jlr",
      index: "02",
      title: "JLR",
      summary: "Tested API services.",
      role: "Software Engineer in Test (SEIT)",
      year: "2025",
      stack: ["Gherkin"],
    });

    expect(result.image).toBeUndefined();
    expect(result.imageAlt).toBeUndefined();
    expect(result.liveUrl).toBeUndefined();
    expect(result.caseStudy).toBeUndefined();
  });

  it("throws on a malformed caseStudy shape", () => {
    expect(() =>
      mapProject({
        slug: "bad",
        index: "03",
        title: "Bad",
        summary: "Summary",
        role: "Role",
        year: "2026",
        stack: [],
        // Missing required `body` — Contentful's Object field has no
        // server-side shape enforcement, so this must fail loudly here.
        caseStudy: [{ heading: "Missing body" }],
      } as never),
    ).toThrow();
  });
});

describe("getAllProjects", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("rejects without calling fetch when env vars are missing", async () => {
    delete process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_DELIVERY_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getAllProjects()).rejects.toThrow(/not configured/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws when the response contains duplicate slugs", async () => {
    process.env.CONTENTFUL_SPACE_ID = "space";
    process.env.CONTENTFUL_DELIVERY_TOKEN = "token";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              sys: { id: "1" },
              fields: {
                slug: "dup",
                index: "01",
                title: "A",
                summary: "S",
                role: "R",
                year: "2026",
                stack: [],
              },
            },
            {
              sys: { id: "2" },
              fields: {
                slug: "dup",
                index: "02",
                title: "B",
                summary: "S",
                role: "R",
                year: "2026",
                stack: [],
              },
            },
          ],
        }),
      }),
    );

    await expect(getAllProjects()).rejects.toThrow(/Duplicate/);
  });
});
