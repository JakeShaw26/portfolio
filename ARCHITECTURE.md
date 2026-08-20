# Architecture decisions

Lightweight ADR log for decisions that aren't obvious from the code. Newest entries
at the top. Format: **Decision**, **Context**, **Why**, **Status**.

---

## Invariant: images live in `public/`, never Contentful

**Decision:** `Project.image` and `ExperienceEntry.image` must always be local
`public/` paths. A Contentful-hosted image URL (e.g. an Asset field pointing at
`images.ctfassets.net`) must never be used for these fields, even though Contentful
supports image assets and nothing in the current Zod schemas would reject one.

**Context:** `scripts/check-asset-metadata.mjs` — the CI gate that strips embedded
EXIF/XMP metadata (GPS coordinates, author names, machine identifiers) before an image
ships to a visitor — only scans `public/` (see its default `roots` argument and the
`Check assets for embedded metadata` CI step, which runs with no arguments). A
Contentful-hosted image would bypass that gate entirely: it's fetched into the page at
build/request time, never lands in `public/`, and so is never scanned. Contentful does
not strip this metadata on upload.

**Why this is a real risk and not a hypothetical:** the experience/work migration to
Contentful (see the ADR below) added `WorkProjectFields.image`/`imageAlt` and
`ExperienceEntryFields` as CMS-editable fields. It would be easy for a future editor —
or an agent acting on their behalf — to upload an image directly into a Contentful
entry and reference its hosted URL, since Contentful's own UI makes that the obvious
path and nothing in the type system distinguishes a `public/` path from a Contentful
URL at the field level.

**How this currently holds:** by absence of configuration, not by an enforced check.
`next.config.ts` declares no `images.remotePatterns` — confirmed by reading the file:
it exports only `poweredByHeader` and `headers()`, no `images` key at all — so
`next/image` cannot even render a remote Contentful-hosted image today; the build would
fail rather than silently ship an unscanned image. That's incidental protection from a
different concern (the CSP's `img-src` comment notes "No remote images"), not a
purpose-built enforcement of this invariant. If `images.remotePatterns` is ever added
for a legitimate reason (e.g. a different image host), this invariant loses its current
backstop and would need an explicit check instead.

**Status:** Accepted (2026-08-20). No code change — see `scripts/check-asset-metadata.mjs`
and the `images` key's absence in `next.config.ts` for where this is currently enforced.

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
