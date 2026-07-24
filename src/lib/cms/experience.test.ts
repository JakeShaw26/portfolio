import { afterEach, describe, expect, it, vi } from "vitest";

import { getAllExperience, mapExperienceEntry } from "./experience";

describe("mapExperienceEntry", () => {
  it("maps a full fixture to the exact expected object", () => {
    const result = mapExperienceEntry({
      slug: "and-digital",
      period: "Current",
      role: "Product Developer",
      company: "AND Digital",
      description: "Consultant software engineer at AND Digital.",
      detail: [{ heading: "The remit", body: "Placed across accounts." }],
      order: 1,
    });

    expect(result).toEqual({
      slug: "and-digital",
      period: "Current",
      role: "Product Developer",
      company: "AND Digital",
      description: "Consultant software engineer at AND Digital.",
      detail: [{ heading: "The remit", body: "Placed across accounts." }],
    });
  });

  it("omits detail when the field is absent", () => {
    const result = mapExperienceEntry({
      slug: "cloudm",
      period: "4 Months",
      role: "Intern Web Developer",
      company: "CloudM",
      description: "Contributed to a front-end redesign.",
      order: 2,
    });

    expect(result.detail).toBeUndefined();
  });

  it("throws on a malformed detail shape", () => {
    expect(() =>
      mapExperienceEntry({
        slug: "bad",
        period: "Current",
        role: "Role",
        company: "Company",
        description: "Description",
        // Missing required `body` — Contentful's Object field has no
        // server-side shape enforcement, so this must fail loudly here.
        detail: [{ heading: "Missing body" }],
        order: 1,
      } as never),
    ).toThrow();
  });
});

describe("getAllExperience", () => {
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

    await expect(getAllExperience()).rejects.toThrow(/not configured/);
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
                period: "P",
                role: "R",
                company: "C",
                description: "D",
                order: 1,
              },
            },
            {
              sys: { id: "2" },
              fields: {
                slug: "dup",
                period: "P",
                role: "R",
                company: "C",
                description: "D",
                order: 2,
              },
            },
          ],
        }),
      }),
    );

    await expect(getAllExperience()).rejects.toThrow(/Duplicate/);
  });
});
