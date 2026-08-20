import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // `eslint-config-next` inherits only 6 generic jsx-a11y rules — no
  // interaction-pattern coverage at all, so nothing here polices e.g. the
  // hand-rolled keyboard handling in TestimonialCarousel.tsx. `strict` (not
  // `recommended`) because About.tsx and skills.ts both claim W3C/a11y
  // compliance as a selling point; the ruleset should match the claim.
  //
  // Only `rules`/`languageOptions` are pulled from the plugin's own flat
  // config, not the whole object: `eslint-config-next` already registers
  // the `jsx-a11y` plugin itself (that's where the 6 inherited rules come
  // from), and flat config throws if two entries redeclare the same plugin
  // key. `npm ls eslint-plugin-jsx-a11y` confirms both resolve to the same
  // deduped install, so reusing next's registration is safe.
  {
    languageOptions: jsxA11y.flatConfigs.strict.languageOptions,
    rules: jsxA11y.flatConfigs.strict.rules,
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
