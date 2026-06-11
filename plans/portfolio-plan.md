# Award-Winning Software Engineer Portfolio — Project Plan

## Context

You want a portfolio site that looks award-winning (think Awwwards / FWA tier), is
highly interactive, and uses **GSAP** for all animation. The build target is your
strongest stack — **Next.js (App Router) + TypeScript**. The directory
`C:\Users\jakes\portfolio` is currently empty, so this is a greenfield build.

Decisions locked in from our Q&A:

- **Sections**: Hero, About, Projects, Experience timeline, Skills/tech stack,
  Testimonials, Contact (core + your selected extras; no blog).
- **Content**: Placeholder data in a typed content layer with clear `TODO` markers so
  you swap in real copy/projects without touching components.
- **Visual direction**: delegated to the **Fable design model** — a dedicated design
  exploration step picks a cohesive, award-tier aesthetic (palette, type scale, motion
  language) before component build.
- **Stack**: Next.js + TypeScript, deployed to Vercel.

This plan also doubles as a learning vehicle for your growth areas: the Contact form is
built the _correct_ backend way (server-side validation + a Route Handler), not the
naive client-only way.

---

## Architecture Overview

```
portfolio/
  src/
    app/
      layout.tsx            # root layout, fonts, metadata, <SmoothScroll> wrapper
      page.tsx              # composes the section components
      api/
        contact/route.ts    # POST handler: zod validation + email send
      sitemap.ts            # SEO
      robots.ts
    components/
      sections/             # Hero, About, Projects, Experience, Skills, Testimonials, Contact
      ui/                   # Button, MagneticLink, Cursor, RevealText, etc.
      layout/               # Nav, Footer, SmoothScroll, PageTransition
    lib/
      gsap/                 # gsap registration + reusable animation hooks
      content/              # typed placeholder content (projects.ts, experience.ts, ...)
      validation/           # zod schemas (contact)
    styles/                 # globals.css, design tokens
  public/                   # images, og image, favicons
```

### Key technical choices (and _why_)

- **GSAP is now fully free**, including all former Club plugins (ScrollTrigger,
  ScrollSmoother, SplitText, Flip, DrawSVG). We'll use them via the official
  `@gsap/react` package with the **`useGSAP()` hook** — it handles cleanup of
  animations/ScrollTriggers automatically in React 18/19 strict mode, which is the #1
  GSAP-in-React footgun.
- **Animations registered in a client boundary.** GSAP is browser-only. All animated
  components are `"use client"`; the page shell and content stay server components for
  SEO and performance. _Why:_ keeps the JS payload down and preserves SSR for crawlers.
- **Smooth scrolling** via GSAP ScrollSmoother (or Lenis as a lighter fallback if
  ScrollSmoother fights Next's layout). Wrapped once at the layout level.
- **Design tokens first.** Fable's chosen palette/type/spacing become CSS custom
  properties + a Tailwind theme extension, so the whole site is themeable from one place.
- **`prefers-reduced-motion` respected** everywhere — animations gate behind a
  `useReducedMotion` check. _Why:_ accessibility is itself an Awwwards judging criterion.

---

## Phased Implementation

### Phase 0 — Scaffold & tooling

- `create-next-app` (App Router, TypeScript, Tailwind, ESLint, `src/` dir).
- Add deps: `gsap`, `@gsap/react`, `zod`, `clsx`, `tailwind-merge`. (Lenis only if we
  drop ScrollSmoother.)
- Prettier + Tailwind plugin, strict `tsconfig`, base `eslint` rules.
- Commit baseline.

### Phase 1 — Design exploration with Fable (the "award-winning" step)

- Use the **Fable model** to generate the visual system: 2–3 distinct directions, then
  one chosen. Output is concrete tokens, not vibes:
  - Colour palette (bg, surface, text, accent, gradients) → CSS variables.
  - Type system (display + body font pairing, fluid type scale via `clamp()`).
  - Motion language (easing curves, durations, reveal style, signature interaction).
  - Layout grid + spacing scale.
- Encode the chosen direction into `styles/globals.css` tokens + `tailwind.config`.
- **This is a checkpoint** — I'll show you the direction before building components.

### Phase 2 — Core layout & motion primitives

- `SmoothScroll` wrapper, `Nav` (with magnetic/hover states), `Footer`.
- Reusable GSAP hooks in `lib/gsap/`:
  - `useRevealOnScroll` — ScrollTrigger fade/translate reveal.
  - `useSplitTextReveal` — per-line/char headline animation.
  - `useMagnetic` — magnetic buttons/links.
  - Custom `Cursor` component (follows pointer, grows on interactive elements).
- Page transition / load animation (intro overlay).

### Phase 3 — Sections (placeholder content, real interactions)

Built in this order, each wired to the typed content layer:

1. **Hero** — animated headline (SplitText), signature interactive element, scroll cue.
2. **About** — text reveal, portrait with parallax/Flip on scroll.
3. **Projects** — featured cards with hover media, scroll-pinned showcase or
   horizontal scroll gallery; each project has an expand/detail interaction.
4. **Experience** — animated vertical timeline (ScrollTrigger scrub).
5. **Skills** — tech-stack grid with staggered reveal + interactive hover.
6. **Testimonials** — auto/scroll-driven carousel or marquee.
7. **Contact** — see Phase 4.

### Phase 4 — Contact form (your backend/security learning surface)

- **Client**: accessible form, optimistic UI states (idle/sending/success/error).
- **Server**: `app/api/contact/route.ts` Route Handler.
  - Validate with a **zod** schema server-side (never trust client input —
    **back-end-naive flag**: client validation is UX only, the server is the real gate).
  - **Honeypot field + basic rate limiting** to resist spam/abuse
    (OWASP: unvalidated input / lack of anti-automation).
  - Send via an email provider (**Resend** recommended) using an API key from an env var
    — **I will never read `.env`; you'll paste only the key name/setup, never the secret.**
  - **Security flag**: API key stays server-side in the Route Handler, never shipped to
    the client bundle. Return generic error messages (don't leak internals).
- A `mailto:` fallback so the site still functions before you wire up Resend.

### Phase 5 — Polish, SEO, performance, a11y

- Metadata API, OpenGraph image, `sitemap.ts`, `robots.ts`.
- Lighthouse pass: lazy-load heavy media, `next/image`, font `display: swap`,
  code-split animations.
- Keyboard nav, focus states, semantic landmarks, `prefers-reduced-motion` audit.
- 404 page with on-brand motion.

### Phase 6 — Tests & CI

- **Unit**: zod contact schema (valid/invalid/honeypot) with Vitest.
- **Integration**: POST to `api/contact/route.ts` — asserts 400 on bad input,
  200 on valid, honeypot rejection. _Why:_ the API route is the security boundary, so
  it's where integration tests earn their keep.
- **Component**: a render/interaction smoke test for a key section (React Testing Library).
- **CI**: a GitHub Actions workflow (lint + typecheck + test on PR). Actions pinned to
  SHA, no secrets in plain env — **Docker/CI pitfall flag** noted.
- Optional: Vercel preview deploys per PR.

---

## Critical Files To Be Created

| File                                            | Purpose                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| `src/app/layout.tsx`                            | Root layout, fonts, metadata, smooth-scroll wrapper |
| `src/app/page.tsx`                              | Section composition                                 |
| `src/lib/gsap/*`                                | Reusable animation hooks (single source for motion) |
| `src/lib/content/*`                             | Typed placeholder content + TODOs                   |
| `src/lib/validation/contact.ts`                 | zod schema (shared client/server)                   |
| `src/app/api/contact/route.ts`                  | Secure contact handler                              |
| `src/styles/globals.css` + `tailwind.config.ts` | Fable design tokens                                 |
| `src/components/sections/*`                     | All seven sections                                  |
| `.github/workflows/ci.yml`                      | Lint/typecheck/test pipeline                        |

---

## Verification

1. `npm run dev` → walk every section; confirm GSAP reveals fire on scroll and respect
   `prefers-reduced-motion` (toggle OS setting).
2. Contact form: submit empty/invalid → see client + server 400; submit valid →
   success state; submit with honeypot filled → silently rejected.
3. `npm run test` → all unit/integration/component tests green.
4. `npm run build` → no type errors, no client/server boundary warnings.
5. Lighthouse (mobile) → target 90+ across Performance, A11y, Best Practices, SEO.
6. Cross-browser smoke (Chromium + Firefox) for cursor/scroll behaviour.

---

## Open Items / Defaults I'll Assume (tell me if you disagree)

- **Email provider**: Resend (clean DX, generous free tier). Easy to swap.
- **Smooth scroll**: GSAP ScrollSmoother first; fall back to Lenis if it conflicts.
- **Deploy**: Vercel.
- **Package manager**: npm (say the word for pnpm).
