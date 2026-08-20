import { defineConfig } from "@playwright/test";

/**
 * Accessibility-only Playwright config — not a general e2e suite. Kept
 * separate from vitest.config.mts on purpose: vitest runs in Node against
 * pure logic, this runs a real Chromium against real rendered pages, which
 * is the only way axe-core can see contrast, focus order, or anything else
 * that depends on actual layout and paint.
 *
 * `webServer` reuses whatever `.next` build already exists (CI runs `npm
 * run build` as its own separate, earlier step — see ci.yml) rather than
 * rebuilding here. Locally, run `npm run build` once yourself first, then
 * `npm run test:a11y` re-runs fast against the same build.
 */
// Local-testing escape hatch only, never used in CI: lets this suite run
// against an already-deployed URL (e.g. the live Vercel deployment) when a
// local `.next` build isn't available — the exact situation in a sandboxed
// checkout with no Contentful credentials. Unset in every real CI run, so
// `webServer` always applies there.
const externalBaseUrl = process.env.PW_BASE_URL;

export default defineConfig({
  testDir: "./test/a11y",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "dot" : "list",
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:3000",
  },
  ...(externalBaseUrl
    ? {}
    : {
        webServer: {
          command: "npm run start",
          url: "http://127.0.0.1:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      }),
});
