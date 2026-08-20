---
name: publish-review
description: Review a Contentful entry (testimonial, work project, experience entry) against this site's content rules — before publishing, or as an audit of something already live. Use whenever asked to review, check, or audit Contentful/CMS content, before publishing any entry, or when a new testimonial/case study/experience entry needs sign-off.
---

# Contentful publish-review

## Why this exists

Contentful publishing bypasses git review entirely — no PR, no CI, nothing catches a
problem before it's live. This is the only item in the 2026-08-20 skills/rules research
pass with zero pre-existing compensating control, and it already caused two real
incidents: fabricated testimonials went live (fixed in commit `8f333b1`, "replace
fabricated testimonials with real quotes from Contentful"), and a client-identifying
quote reached production before a planned review pass. The rules below were previously
prose-only, in a local planning doc (`plans/HANDOFF.md`, gitignored — not visible to
every agent that might touch content). This skill makes them checkable and repeatable
instead.

**Space:** `98ddc4l0fmm4`, environment `master` (same space ID documented as non-secret
in `.env.example` and `ci.yml` — safe to reference directly). Content types:
`testimonial`, `workProject`, `experienceEntry`.

## Rules

Apply the rules relevant to the entry's content type. "Prose fields" below means the
free-text fields an editor writes — `quote`, `summary`, `description`, and the `body`
of each `caseStudy`/`detail` section. It does not mean structural fields like `year`,
`period`, or `order`, which are allowed to contain numbers by design (`year: "2026"`,
`period: "4 Months"` are both fine).

1. **No figures/numbers in prose fields.** No specific metrics, percentages, dollar
   amounts, headcounts, or thresholds in `quote`/`summary`/`description`/case-study or
   detail `body` text. Qualitative claims only ("reduced load time" not "reduced load
   time by 40%"). Structural fields are exempt — see above.
2. **No client name the live site doesn't already name.** Known-public names (shared
   with `prose-leak-check`'s allowlist — keep the two in sync if either changes): **AND
   Digital, CloudM, JLR, Travelchapter, Ask Andi**. Any other company name in a prose
   field is a finding. Note the existing pattern of naming a _role_ without a company
   when the company isn't public (e.g. the Travelchapter entry's "Two companies had
   recently merged" and the Asset Licensing Platform entry's "a third-party provider" —
   both correctly omit a name that isn't public elsewhere).
3. **No speaker/company identifiers in testimonials specifically.** The `testimonial`
   content type's own Contentful description states this directly: "Role only — no
   names, no company. Deliberate: role plus company can single a person out." Check
   `quote` and `role` for anything identifying beyond a generic job title (a company
   name, a person's name, a distinctive enough team/project reference that the speaker
   could be identified).
4. **No Ask Andi guardrail parameters.** Ask Andi's own case study (`caseStudy`, entry
   `ask-andi`) describes rate limiting, reply-length ceilings, and PII stripping in
   qualitative terms only — no actual thresholds, model names beyond what's already
   public, or prompt/guardrail implementation detail. Any new content about Ask Andi
   must hold the same line: describe the _class_ of guardrail, never its parameters.
5. **`imageAlt` present** for any `workProject` entry with an `image` set. Don't rely on
   the code-level fallback (a generated "`<title> screenshot`" string, in
   `ProjectShowcase.tsx` and `app/work/[slug]/page.tsx`) as if it were a pass — a
   missing `imageAlt` on a published entry is a finding here even though the page
   won't break. See `.claude/skills/a11y-audit/SKILL.md` invariant 4 for the
   code-level half of this.
6. **`caseStudy`/`detail` JSON valid against the Zod schemas.** Both are Contentful
   Object fields with no server-side shape enforcement — see the schemas actually used
   at the fetch boundary: `sectionSchema`/`caseStudySchema` in `src/lib/cms/projects.ts`,
   `sectionSchema`/`detailSchema` in `src/lib/cms/experience.ts`. Shape required:
   `{ heading: string, body: string }[]`. A malformed entry doesn't fail quietly — Zod
   throws at fetch time, per `.parse()` in `mapProject`/`mapExperienceEntry` — so this
   check is really "would this entry currently break the live page," not a style
   preference.
7. **Cross-section consistency.** Ticket 07 subtask 9, folded in here rather than kept
   standalone. Check whether this entry contradicts anything already live — either
   another Contentful entry, or the static content in `src/lib/content/*.ts` and the
   components that render it. This is broader than just Contentful: the known example as
   of this writing is `site.available` (`src/lib/content/site.ts`) rendering "Not
   actively looking" in `About.tsx` while `Contact.tsx` hardcodes "Open to new work and
   interesting problems" regardless of that flag — a real, currently-live contradiction,
   not a hypothetical. Flag any case where two places on the site would tell a visitor
   different things.

## Procedure

1. Identify the entry (or entries) to review — by ID, slug, or "review everything of
   type X." Use `mcp__contentful__search_entries` / `get_entry` to fetch current field
   values. Space ID and environment are given above; don't ask for them.
2. Apply rules 1-6 relevant to the content type (testimonials only get 1 and 3;
   work/experience entries get 1, 2, 4 (if Ask Andi), 5, 6).
3. Apply rule 7 against the rest of the live site — this means actually checking other
   content, not just this one entry in isolation.
4. Report per rule: **pass**, **finding** (quote the exact text, name what's wrong, and
   for anything content-judgment-based — rules 1-4, 7 — ask for confirmation before
   anything is changed; rule 5/6 findings are more mechanical and can be stated as
   fixes needed).
5. State a clean pass explicitly when everything checks out — silence reads as "the
   check didn't run," not as "it passed."
