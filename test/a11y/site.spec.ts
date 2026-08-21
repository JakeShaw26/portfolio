import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Priced honestly, per the ticket that added this: axe-core is a new
 * runtime dependency with its own CVE stream, on a CI pipeline that had
 * none before this. It earns its place because it's the only check here
 * that exercises real layout and paint — contrast, focus order, and other
 * things a static ESLint rule structurally cannot see.
 *
 * IMPORTANT CAVEAT, restated wherever this check is referenced (per the
 * ticket's AC): automated tooling like this catches roughly a third of
 * real accessibility issues. A green run here is not proof of compliance —
 * see .claude/skills/a11y-audit/SKILL.md for the invariants this can't see
 * (runtime motion-preference gating) and eslint-plugin-jsx-a11y for the
 * static JSX patterns this duplicates less well than a linter would.
 */

test.beforeEach(async ({ page }) => {
  // Without this, above-the-fold content (e.g. /work/[slug]'s hero block)
  // triggers its GSAP entrance fade immediately on mount, and axe can land
  // mid-tween — a transient low-opacity frame that reads as a color-contrast
  // violation even though the settled state is fine. Reduced-motion is the
  // deterministic, race-free state to scan: gsap.matchMedia in Reveal.tsx
  // skips the animation entirely under this preference, so content renders
  // at its final styles from first paint. It's also the more representative
  // target — this is exactly the state motion-sensitive users get.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function assertNoViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).analyze();

  if (results.violations.length > 0) {
    const summary = results.violations
      .map(
        (v) =>
          `  [${v.impact ?? "unknown"}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n` +
          v.nodes.map((n) => `    - ${n.target.join(" ")}`).join("\n"),
      )
      .join("\n");
    throw new Error(
      `axe found ${results.violations.length} violation(s) on ${label}:\n${summary}`,
    );
  }

  expect(results.violations).toEqual([]);
}

test("homepage has no axe violations", async ({ page }) => {
  await page.goto("/");
  await assertNoViolations(page, "/");
});

/**
 * Work/experience detail pages are CMS-driven (Contentful), so a hardcoded
 * slug would go stale the moment content changes. Discover a real link from
 * the homepage instead — this is intentionally a live check against
 * whatever content is actually published, not a fixed fixture.
 */
test("a work detail page has no axe violations", async ({ page }) => {
  await page.goto("/");
  const workLink = page.locator('a[href^="/work/"]').first();
  await expect(workLink).toHaveCount(1);
  const href = await workLink.getAttribute("href");

  await page.goto(href!);
  await assertNoViolations(page, href!);
});

test("an experience detail page has no axe violations", async ({ page }) => {
  await page.goto("/");
  const experienceLink = page.locator('a[href^="/experience/"]').first();
  const count = await experienceLink.count();

  // Experience entries render inline on the homepage in some layouts and may
  // not always link out to a detail page — skip gracefully rather than fail
  // the whole suite if there's genuinely nothing to navigate to, but only
  // after confirming the homepage itself already passed (see the test above).
  test.skip(count === 0, "No /experience/[slug] link found on the homepage");

  const href = await experienceLink.getAttribute("href");
  await page.goto(href!);
  await assertNoViolations(page, href!);
});
