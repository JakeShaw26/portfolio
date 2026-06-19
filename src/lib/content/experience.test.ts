import { describe, expect, it } from "vitest";

import { experience } from "./experience";

describe("experience", () => {
  it("gives every entry a non-empty slug", () => {
    for (const entry of experience) {
      expect(entry.slug.length).toBeGreaterThan(0);
    }
  });

  it("never reuses a slug across entries", () => {
    // Why: duplicate slugs would collide in generateStaticParams and make
    // /experience/[slug] resolve to whichever entry matches first.
    const slugs = experience.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
