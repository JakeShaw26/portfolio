# Architecture decisions

Lightweight ADR log for decisions that aren't obvious from the code. Newest entries
at the top. Format: **Decision**, **Context**, **Why**, **Status**.

---

## Experience & work content moves to Contentful

**Decision:** `experience` and `work` content is fetched from Contentful (two
content types: `experienceEntry`, `workProject`) instead of living in static TS
arrays. `src/lib/content/experience.ts` and `projects.ts` keep only their type
exports; `src/lib/cms/contentful.ts`, `experience.ts`, and `projects.ts` do the
fetching, validation, and mapping. Site info, skills, and testimonials are
unaffected and stay in `src/lib/content/*.ts`.

**Context:** The previous ADR below rejected a CMS outright. That still holds for
most of the site, but experience/work are the two sections the owner actually
wants to update without touching code or waiting on a redeploy — a new role, a
new case study.

**Why / technical choices:**

- Plain `fetch()` against the Content Delivery API, no SDK — mirrors
  `src/lib/email/contact.ts`'s existing "plain fetch, no dependency" precedent.
  Token sent via `Authorization: Bearer`, never a query string, so it can't leak
  into a logged URL.
- Time-based revalidation (`export const revalidate = 3600`) on `/`,
  `/experience/[slug]`, `/work/[slug]` — no Contentful webhook or on-demand
  `revalidateTag`. Content changes "a few times a year" per the original ADR, so
  an hour of staleness is a non-issue and this avoids a new secret, a Route
  Handler, and webhook config for a freshness gain nobody would notice.
- `detail`/`caseStudy` are Contentful **Object** (JSON) fields, validated with
  Zod at the fetch boundary — Contentful enforces shape on every other field
  type (Symbol, Text, Array, Integer) but not on Object, so this is the one spot
  that can still receive malformed data and needs to fail loudly instead of
  rendering garbage.
- Slug uniqueness is enforced by Contentful's `unique: true` field validation
  (authoring-time) plus a duplicate-slug throw in `getAllExperience`/
  `getAllProjects` (fetch-time defense-in-depth) — no client-side test asserts
  this anymore, since the static array it used to check no longer exists.
- `experienceEntry` has an explicit `order` field (not derived from the source
  JSON, which only had array position) so a content editor can reorder entries
  from Contentful without a code change.

**Status:** Accepted (2026-07-24).

---

## No CMS — content stays in typed TS files

**Decision:** Content (site info, projects, experience, skills, testimonials) stays
in `src/lib/content/*.ts`. No headless or git-based CMS.

**Context:** Considered adding a CMS (e.g. Sanity, Contentful) before filling in real
content, to get a nicer editing UI decoupled from code deploys.

**Why:** The only editor is the site owner, content changes a few times a year at
most, and there's no blog or high-volume content. A CMS would add an account, an
API, data-fetching/revalidation logic, and a runtime dependency to solve a problem
that doesn't exist here. Plain content files are simpler, type-checked at build
time, version-controlled with the rest of the site, and deploy atomically — no
extra moving parts.

**Status:** Superseded (2026-07-05) for experience/work content specifically —
see the entry above. Still holds for site info, skills, and testimonials.
