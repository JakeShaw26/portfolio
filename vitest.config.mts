import { fileURLToPath } from "node:url";

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // test/a11y is a Playwright suite (see playwright.config.ts) — it uses
    // @playwright/test's own `test`/`expect`, not vitest's, and needs a real
    // browser + a running server. Vitest's default include glob would
    // otherwise pick these files up and fail them for the wrong reason.
    exclude: [...configDefaults.exclude, "test/a11y/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./test/stubs/server-only.js", import.meta.url),
      ),
    },
  },
});
