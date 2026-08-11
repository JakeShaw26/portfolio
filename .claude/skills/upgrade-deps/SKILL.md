---
name: upgrade-deps
description: Check for newer npm package versions, resolve the breaking changes and redundancies an upgrade creates, and land on versions with zero known vulnerabilities. Use for routine dependency maintenance, when responding to a security advisory, or when the user says "upgrade deps", "check for updates", "bump packages", or "are we on the latest".
---

# Upgrading dependencies in this repo

## Why this exists instead of Dependabot

**Dependabot version updates are deliberately OFF, and this skill is the replacement.**
The recorded reasoning: ~21 dependencies on a site with no auth, no user input and no
database would generate a constant drip of PRs whose value is already covered by security
alerts. **The failure mode isn't wasted time — it's learning to ignore Dependabot PRs and
missing the one that mattered.** So upgrades happen deliberately, in a batch, with the
reasoning written down.

What stays on: **Dependabot security alerts** (CVE-only, near-silent) and the
`github-actions` ecosystem in `.github/dependabot.yml` (monthly).

Do not propose enabling npm version updates. That decision has been made twice.

## Non-negotiables

Check these before you finish, every time:

- **`next` and `eslint-config-next` are pinned exact and must move together.** They share a
  version. A mismatch produces confusing lint failures.
- **`react` and `react-dom` are pinned exact and must move together.**
- **Node stays at 24** in `.github/workflows/ci.yml`. Vercel builds on 24; CI testing a
  different major is how "green in CI, broken on deploy" happens. It has bitten this repo
  once already.
- **GitHub Actions are SHA-pinned, and `sha_pinning_required` is enforced repo-side.** A
  tag reference will be rejected on push. Always use the full commit SHA, with the version
  in a trailing comment.
- **End state must be `npm audit` → 0 vulnerabilities.** Not "only dev-only ones left" —
  zero. If that is genuinely impossible, say so explicitly and explain what blocks it.
- **Read the docs before writing code against a new major.** Per `AGENTS.md`, this Next
  version has breaking changes that may not match training data — read
  `node_modules/next/dist/docs/` rather than recalling the API.

## Procedure

### 1. Baseline — prove the tree is green before you touch it

```bash
git status --short          # must be clean; stop if not
npm run check:assets && npm run lint && npm run typecheck && npm test
```

An upgrade that starts from a broken baseline is unattributable. Don't skip this.

### 2. Survey

```bash
npm outdated                # current vs wanted vs latest
npm audit                   # advisories, with severity
npm audit --production      # which of those actually ship to users
```

`npm audit` alone over-reports for this repo: most of the tree is build tooling. The
difference between the two audit runs is the difference between "a user is exposed" and
"a build machine is exposed". Both get fixed; only one is urgent.

### 3. Triage into three buckets

- **Security** — anything in `npm audit`. Highest priority, and the only bucket that can
  justify an awkward upgrade.
- **Patch/minor** — safe to batch. Take them all in one commit.
- **Major** — one at a time, each with its own verification pass. Never batch two majors;
  when something breaks you want one suspect.

### 4. Before any major: read, don't recall

For each major, find out what actually changed:

```bash
npm view <pkg> versions --json | tail -20     # what exists
npm view <pkg> deprecated                     # is it dead?
```

Then read the real migration notes — the package's `CHANGELOG.md` in `node_modules`, its
repo releases page, or for Next the shipped docs at `node_modules/next/dist/docs/`. Next
also ships codemods:

```bash
npx @next/codemod@latest --help
```

Prefer the codemod to hand-editing. It catches call sites you would miss.

### 5. Apply

```bash
npm install <pkg>@<version>          # ranged deps
npm install --save-exact <pkg>@<v>   # next, eslint-config-next, react, react-dom
```

Commit the updated `package-lock.json`. CI runs `npm ci`, which fails on a lockfile that
disagrees with `package.json`.

### 6. Hunt for redundancy — the step people skip

An upgrade doesn't only break things; it can make things **unnecessary**. Every major is a
chance to delete a dependency. Check all four:

1. **Absorbed by the platform.** Has the framework started shipping what a package was
   doing? Something added to Next, or to Node 24, or to baseline browsers, may make a
   polyfill or helper pointless. This is the most common one and the easiest to miss,
   because nothing breaks — you just keep paying for a package you no longer need.
2. **Deprecated or superseded.** `npm view <pkg> deprecated` returns a message when the
   maintainer has flagged it, usually naming the replacement. Watch the install output too;
   deprecation warnings scroll past and get ignored.
3. **Now only transitive.** `npm ls <pkg>` shows whether anything still depends on it
   directly. A direct dependency that nothing imports is dead weight — grep `src/` for the
   import before removing.
4. **Config or peer changes.** Majors often move config formats (flat ESLint config, PostCSS
   plugin shapes) or relax peer ranges so a pin you added as a workaround can go.

When you remove something, say why in the commit body. "Removed X, now provided by Y" is
the sentence a future reader needs.

### 7. Verify — the full gauntlet, in this order

```bash
npm run check:assets     # dependency-free, runs first in CI too
npm ci                   # clean install from the lockfile
npm run lint
npm run typecheck
npm test
npm run build            # slowest, and the real check
npm run format:check     # CI does NOT run this — local only, so it must be run here
npm audit                # must be 0
```

`npm run build` is not a compile check here: it pre-renders `/work/[slug]`,
`/experience/[slug]` and the sitemap from **live Contentful data**, so it needs delivery
credentials in `.env.local` and it exercises the real data path.

⚠️ **A local build can serve Contentful data up to an hour stale.** The CMS pages set
`revalidate = 3600` and Next persists fetch responses in `.next/cache` between local
builds. If content looks wrong, `rm -rf .next/cache` before concluding anything. CI and
Vercel are unaffected.

### 8. Report

Say plainly:

- what moved, from what to what, and why
- **what was removed and what now provides it**
- any advisory that could not be cleared, and what blocks it
- anything deprecated but not yet actionable, so it isn't rediscovered next time

Commit as `chore: <what changed>` with the reasoning in the body — matching the existing
history, where commit bodies carry the _why_. If a major landed, name the migration guide
you followed.

## Repo-specific traps

- **`.env.local` is required for `npm run build`.** Never read it; if credentials are
  missing, ask the user to set them rather than working around it.
- **Line endings.** `core.autocrlf=true` is set on this machine and `.gitattributes`
  overrides it for this repo. If `format:check` fails on files you didn't touch, that's the
  cause — `npm run format` fixes it.
- **A push to `main` is a production deploy.** Don't push to get CI to validate an upgrade
  unless you also intend to ship it.
- **`vercel link` corrupts `.gitignore`** by appending `.env*` after the `!.env.example`
  negation. If anything re-links, `git checkout -- .gitignore`.
