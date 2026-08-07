# Portfolio — Jake Shaw

Personal site and case-study collection for a frontend engineer with a background in
test. Built with Next.js 16 (App Router) and React 19, with work and experience content
served from Contentful.

**Live:** https://portfolio-ten-navy-83.vercel.app

---

## Why it's built this way

The site is small, so most of the interesting decisions are about what _isn't_ here.
The full log lives in [`ARCHITECTURE.md`](./ARCHITECTURE.md); the short version:

**Content is split across two sources on purpose.** Work projects and experience
entries come from Contentful, because those are the two things worth editing without a
code deploy — a new role, a new case study. Everything else (site info, skills) stays in
typed TS modules under `src/lib/content/`, where it's type-checked at build time and
version-controlled with the code. A CMS for a five-field object that changes once a year
is a runtime dependency bought for nothing.

**No Contentful SDK.** `src/lib/cms/contentful.ts` is a plain `fetch` against the
Content Delivery API — about 50 lines, no dependency to keep current. The token goes in
an `Authorization: Bearer` header rather than the `?access_token=` query param the API
also accepts, so it can't end up in a proxy log or a browser referrer.

**Zod validates exactly one thing.** Contentful enforces shape on Symbol, Text, Array
and Integer fields itself, so re-validating them would be theatre. The `caseStudy` and
`detail` fields are Object (free-form JSON) fields with no server-side shape enforcement,
so those — and only those — are parsed at the fetch boundary, where malformed content
fails the build loudly instead of rendering garbage.

**Revalidation is time-based, not webhook-driven.** `revalidate = 3600` on the pages
that read the CMS. On-demand revalidation would mean a webhook secret, a Route Handler
and Contentful-side config to shave staleness nobody would notice.

**Every animation is gated on `prefers-reduced-motion`.** GSAP timelines are created
inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`, which reverts them
on cleanup, and `globals.css` neutralises stray CSS transitions as a safety net. The
custom cursor additionally requires `(pointer: fine)` and never replaces the native one
on touch. Motion is decoration here; the site has to work fully without it.

---

## Stack

|            |                                           |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 16 (App Router, RSC) · React 19   |
| Language   | TypeScript (strict)                       |
| Styling    | Tailwind CSS v4                           |
| Content    | Contentful Content Delivery API           |
| Motion     | GSAP + ScrollTrigger, Lenis smooth scroll |
| Validation | Zod                                       |
| Tests      | Vitest                                    |
| Hosting    | Vercel                                    |

---

## Running it locally

Requires **Node ≥ 20.9** (Next 16's floor).

```bash
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev
```

`.env.local` needs a Contentful **Content Delivery** token — the read-only one, not the
Management API token. `.env.example` documents where to find it. Without it the app
throws on first fetch rather than silently rendering an empty site, which is the intended
behaviour: a portfolio with no work on it is a worse failure than a crash.

| Script              |                                                    |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server on :3000                                |
| `npm run build`     | Production build (**hits Contentful** — see below) |
| `npm run lint`      | ESLint                                             |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm run test`      | Vitest                                             |
| `npm run format`    | Prettier                                           |

---

## Project structure

```
src/
  app/                  Routes, metadata, sitemap, robots, OG image
    work/[slug]/        Case studies      — pre-rendered from Contentful
    experience/[slug]/  Experience detail — pre-rendered from Contentful
  components/
    layout/             Nav, Footer, Section shell
    motion/             Reveal, SmoothScroll, Cursor, headline & stack motion
    sections/           Hero, work showcase, About, Experience, Skills, Contact
    ui/                 Shared primitives
  lib/
    cms/                Contentful fetch, Zod validation, domain mapping (+ tests)
    content/            Typed static content and site config
    motion/             GSAP registration
```

`src/lib/cms/` returns domain types (`Project`, `ExperienceEntry`) rather than leaking
Contentful's `sys`/`fields` envelope upward, so swapping the CMS would touch that
directory and nothing else.

---

## CI

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs lint → typecheck → test →
build on every PR into `main`, in that order: the cheap checks fail first, and the build
is by far the slowest step.

Two things about that build step are deliberate:

- **It is not just a compile check.** `next build` pre-renders `/work/[slug]`,
  `/experience/[slug]` and `sitemap.xml` from live Contentful data, so it genuinely needs
  delivery credentials. A malformed case study fails CI, not production.
- **`CONTENTFUL_SPACE_ID` is inline, not a secret.** It's already published in the
  committed `.env.example`. Storing a non-secret as a secret creates false confidence
  about what actually needs rotating.

The delivery token is scoped to the single build step rather than the whole job, so no
earlier step — or anything it shells out to — can read it. Actions are pinned to full
commit SHAs: a tag can be repointed at new code, a SHA can't.

Fork PRs get no secrets and will fail at the build step. That's the correct trade for a
solo repo; `pull_request_target` would fix it by running untrusted code with secrets and
a write-scoped token, which is how CI pipelines get compromised.

---

## Deployment

Vercel, on push to `main`. `NEXT_PUBLIC_SITE_URL` must be set for both Production and
Preview — it's read at **build** time and inlined, so it needs a redeploy to change, not
a restart. Unset, it falls back to `http://localhost:3000`, which is a deliberately
obvious break: a plausible-but-wrong domain would silently point canonical URLs, OG tags
and `sitemap.xml` at a site nobody here owns.
