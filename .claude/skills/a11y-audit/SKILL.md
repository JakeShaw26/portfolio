---
name: a11y-audit
description: Audit this repo's specific accessibility invariants — reduced-motion gating on every GSAP timeline, pointer:fine gating on the cursor, decorative layers correctly aria-hidden, CMS-supplied imageAlt present. Use when asked for an a11y/accessibility audit or check of this site, before shipping new motion/animation code, or when reviewing a PR that touches src/components/motion or src/components/sections.
---

# Accessibility audit for this repo

## Why this exists instead of a generic WCAG walk

`About.tsx` and `src/lib/content/skills.ts` both state, as a selling point, that this
site "genuinely meets W3C and a11y standards." As of the 2026-08-20 research pass that
produced this skill, almost none of that was enforced — `eslint-plugin-jsx-a11y` covers
static JSX patterns (see the ESLint config), but the site's real accessibility risk is
concentrated in a handful of **repo-specific, dynamic invariants** that a generic rule
set can't see: whether a GSAP timeline actually honours `prefers-reduced-motion` at
runtime, whether the custom cursor is gated off on touch devices, and so on. This skill
encodes exactly those invariants, not a WCAG checklist from memory.

**Companion, not replacement:** `eslint-plugin-jsx-a11y` (static JSX) + this skill
(dynamic/runtime invariants) + `axe-core` in CI (automated DOM audit) together are still
not a compliance guarantee — see the caveat at the bottom.

## The four invariants

### 1. Every GSAP timeline is reduced-motion gated

**Rule:** any `gsap.timeline(...)` or animated `useGSAP(...)` call must run inside
`gsap.matchMedia()`, keyed to `"(prefers-reduced-motion: no-preference)"` — never run
unconditionally.

**Why this shape specifically:** `gsap.matchMedia()` auto-reverts its animations on
cleanup/media-query change, which a manual `if (!prefersReduced)` check does not. The
established pattern in this repo (see `Reveal.tsx`, `AnimatedHeadline.tsx`,
`AtmosphereDrift.tsx`, `StackMotion.tsx`, `Timeline.tsx`) is:

```ts
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // ...timeline goes here...
});
```

**How to check:** grep `src/components/motion/` and `src/components/sections/` for
`gsap.timeline(` and `useGSAP(`. For each hit, confirm the enclosing function contains
`gsap.matchMedia()` with the `no-preference` key — not just a `prefers-reduced-motion`
string anywhere in the file (that can be a decoy: `TestimonialCarousel.tsx` and
`SmoothScroll.tsx` check `prefers-reduced-motion: reduce` directly via
`window.matchMedia(...).matches` for a one-off branch, e.g. picking `"auto"` vs
`"smooth"` scroll behavior — correct for their case, but it is not the GSAP
timeline-gating pattern and shouldn't be mistaken for it).

`globals.css` also carries a CSS-level `@media (prefers-reduced-motion: reduce)` block
as a safety net for anything CSS-driven — note its presence, but it doesn't excuse a
JS timeline from also being gated: CSS can't stop a GSAP-driven inline-style tween.

**One documented exception:** `Cursor.tsx` calls `useGSAP(...)` (real `gsap.quickTo`/
`gsap.to` animation) but gates it with a manual early `return` on both `pointer: fine`
and `prefers-reduced-motion` (see invariant 2) rather than `gsap.matchMedia()`.
Functionally equivalent here — nothing is ever created under reduced motion, so there's
nothing to auto-revert — but it won't match a literal "wrapped in `gsap.matchMedia()`"
grep. Don't count it as a miss on this invariant; it satisfies the intent through
invariant 2's pattern instead. If `Cursor.tsx` ever grows a second, unconditional
animation outside that early-return, that one would need its own gating.

### 2. The cursor is gated on both pointer type and motion preference

**Rule:** `Cursor.tsx` must check both `window.matchMedia("(pointer: fine)")` and
`prefers-reduced-motion` before rendering/animating — a custom cursor is actively
harmful on touch devices (it has no mouse to follow) and unwanted motion for anyone who
asked to reduce it.

**How to check:** read `src/components/motion/Cursor.tsx`, confirm both checks are
present and that the component bails out (renders nothing / does nothing) when either
condition says it shouldn't run.

### 3. Decorative layers are `aria-hidden`

**Rule:** anything purely visual with no informational content — background/atmosphere
layers, decorative rail lines, the cursor dot, a decorative glyph next to link text —
must carry `aria-hidden` (or `aria-hidden="true"`) so assistive tech skips it.

**Known decorative layers in this repo, as of this writing** (confirm each still has
`aria-hidden` — treat any that's lost it as a regression, and treat any _new_ purely
decorative element added since as a candidate that needs it too):

- `layout.tsx`: the `.atmosphere` background div
- `AtmosphereDrift.tsx`
- `Cursor.tsx`: the cursor dot
- `Hero.tsx`: the eyebrow label span
- `Timeline.tsx`: both decorative rail lines
- `CtaLink.tsx`: the directional glyph span (note it also has a paired `.sr-only` "opens
  in a new tab" span for the _external_-link case — that's the correct pattern: hide the
  decoration, but don't hide information the glyph was standing in for)

**How to check:** grep for `aria-hidden` across `src/`, diff against the list above,
and separately scan `src/components/` for new elements that are visually decorative
(no text content, no semantic role, purely CSS) but aren't in that grep output.

### 4. CMS-supplied `imageAlt` is present, and the fallback is never empty

**Rule:** every rendered project/work image must resolve to a non-empty `alt`. Contentful's
`imageAlt` field is optional at the type level
(`WorkProjectFields.imageAlt?: string` in `src/lib/cms/projects.ts`), so the _type_
allows it to be missing — the render path must not silently pass through an empty
string.

**Current fallback pattern** (in `ProjectShowcase.tsx` and `app/work/[slug]/page.tsx`):

```ts
alt={project.imageAlt ?? `${project.title} screenshot`}
```

This is acceptable as a fallback, but it's a **weaker** description than an editor-
written one — flag it as a finding (not a pass) whenever you find a live, published
entry actually relying on the fallback, since that's a real editing gap, not just a
code-correctness one. A true pass is an entry where `imageAlt` is set and descriptive.

**How to check:** for each rendered image driven by CMS data, confirm the fallback
exists in code (`?? ...`, never a bare possibly-`undefined` alt), and — when checking
real content rather than just code — confirm published entries actually set `imageAlt`
rather than relying on the fallback.

## Procedure

1. Read the four invariants above.
2. For each, grep/read the specific files named — don't re-derive the invariant from
   scratch each time, the file list is the fast path.
3. Report per-invariant: **pass** (matches the known-good pattern), **regression**
   (matches the pattern in code but content-level data is missing, e.g. a real entry
   with no `imageAlt`), or **fail** (code doesn't implement the invariant at all).
4. If checking against the deployed site rather than just source, load it and confirm
   in the DOM: decorative elements carry `aria-hidden` in the rendered markup, and
   toggling `prefers-reduced-motion: reduce` in devtools actually stops the GSAP
   timelines (not just the CSS ones).

## What this skill does not cover

Static JSX a11y patterns (missing `alt` on a plain `<img>`, invalid ARIA roles, keyboard
handler correctness) are `eslint-plugin-jsx-a11y`'s job, and automated DOM-level issues
(contrast, landmark structure, focus order) are `axe-core`'s job in CI. **Neither of
those, nor this skill, proves compliance on its own** — automated tooling across all
three still only catches roughly a third of real accessibility issues. This skill's
value is the invariants a static rule set and a generic DOM scan structurally cannot
see: whether the _runtime behaviour_ actually honours the media queries the code claims
to check.
