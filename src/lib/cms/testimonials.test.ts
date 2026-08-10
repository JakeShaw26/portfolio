import { afterEach, describe, expect, it, vi } from "vitest";

import { getAllTestimonials, mapTestimonial } from "./testimonials";

function entry(index: string, role = "Tech Lead", quote = "A quote.") {
  return { sys: { id: index }, fields: { index, role, quote } };
}

function stubFetchReturning(items: ReturnType<typeof entry>[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items }) }),
  );
}

describe("mapTestimonial", () => {
  it("maps a fixture to the exact expected object", () => {
    const result = mapTestimonial({
      index: "01",
      quote: "He approaches development with a practical, methodical mindset.",
      role: "Senior Developer",
    });

    expect(result).toEqual({
      index: "01",
      quote: "He approaches development with a practical, methodical mindset.",
      role: "Senior Developer",
    });
  });

  // The anonymisation is a deliberate content decision, so it is worth a test
  // that fails loudly if an `author` or `company` field is ever reintroduced
  // upstream and quietly passed through to the rendered card.
  it("carries through no field beyond index, quote and role", () => {
    const result = mapTestimonial({
      index: "01",
      quote: "A quote.",
      role: "Tech Lead",
      author: "Real Person",
      company: "Real Company",
    } as never);

    expect(Object.keys(result).sort()).toEqual(["index", "quote", "role"]);
  });
});

describe("getAllTestimonials", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  function configure() {
    process.env.CONTENTFUL_SPACE_ID = "space";
    process.env.CONTENTFUL_DELIVERY_TOKEN = "token";
  }

  it("rejects without calling fetch when env vars are missing", async () => {
    delete process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_DELIVERY_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getAllTestimonials()).rejects.toThrow(/not configured/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // Contentful returns entries in its own order, so the rendered order is only
  // ever as reliable as this sort.
  it("sorts by index regardless of the order Contentful returns", async () => {
    configure();
    stubFetchReturning([entry("03"), entry("01"), entry("02")]);

    const result = await getAllTestimonials();

    expect(result.map((testimonial) => testimonial.index)).toEqual([
      "01",
      "02",
      "03",
    ]);
  });

  it("throws when the response contains duplicate indexes", async () => {
    configure();
    stubFetchReturning([entry("01"), entry("01")]);

    await expect(getAllTestimonials()).rejects.toThrow(/Duplicate/);
  });

  // An empty space is a valid state the section handles by not rendering, so it
  // must resolve rather than throw.
  it("resolves to an empty array when the space has no testimonials", async () => {
    configure();
    stubFetchReturning([]);

    await expect(getAllTestimonials()).resolves.toEqual([]);
  });
});
