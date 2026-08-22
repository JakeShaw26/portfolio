import { describe, expect, it } from "vitest";

import {
  projectImageViewTransitionName,
  projectTitleViewTransitionName,
} from "./projects";

// These two helpers are the only thing standing between ProjectShowcase and
// /work/[slug]/page.tsx agreeing on a `view-transition-name`. If the two call
// sites ever compute the name differently, the browser silently falls back to
// a hard cut instead of morphing — no error, no test failure at the call
// sites themselves — so pinning the exact format here is what would catch a
// future edit to one of these functions changing the shape unexpectedly.
describe("projectImageViewTransitionName", () => {
  it("derives a stable name from the slug", () => {
    expect(projectImageViewTransitionName("travelchapter")).toBe(
      "project-image-travelchapter",
    );
  });
});

describe("projectTitleViewTransitionName", () => {
  it("derives a stable name from the slug", () => {
    expect(projectTitleViewTransitionName("travelchapter")).toBe(
      "project-title-travelchapter",
    );
  });

  it("never collides with the image name for the same slug", () => {
    const slug = "jlr";
    expect(projectTitleViewTransitionName(slug)).not.toBe(
      projectImageViewTransitionName(slug),
    );
  });
});
