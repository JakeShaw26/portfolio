---
name: security-review
description: A repo-aware security review for this portfolio site — wraps a general security review with this repo's own settled trade-offs and last-audit baseline, so it doesn't waste a pass re-flagging decisions already made. Use for /security-review requests, or any explicit ask for a security audit of this repo.
---

# Security review for this repo

This is a project-scoped `security-review` skill — it shadows the generic one when
working in this repo. Run the generic security review as your base pass, then apply the
two adjustments below before reporting anything.

## 1. Don't re-flag settled trade-offs

**`script-src 'unsafe-inline'` in the CSP (`next.config.ts`).** Deliberate, and
extensively documented in a comment directly above `cspDirectives` in that file: Next.js
inlines the RSC flight payload as per-page, per-build `<script>` blocks that a static
hash allowlist can't cover, and the strict alternative (a per-request nonce) requires
dynamic rendering — which would disable static generation, ISR, and CDN caching for a
site that is 100% static. The comment also explains why it costs little here: no user
input is accepted, no request data is reflected, there are no route handlers or server
actions, and CMS copy renders as React text (no `dangerouslySetInnerHTML` anywhere in
`src/`) — so the markup-injection vector this would normally defend against doesn't
exist on this site to begin with. **Confirm this reasoning still holds** (still no
route handlers, still no `dangerouslySetInnerHTML`, still no dynamic rendering) rather
than accepting it blind, but don't re-derive or re-flag the trade-off itself.

**A note on this skill's other originally-planned entry:** the research pass that
specified this skill (2026-08-20) also named `Access-Control-Allow-Origin: *` as a
second settled, documented trade-off in `next.config.ts`. It isn't there. A repo-wide
search (source, `next.config.ts`, git history via `git log -S`) found no such header,
no `vercel.json`, no route handler, and no middleware anywhere in this repo, past or
present — consistent with the CSP comment's own claim that there are no route handlers
or server actions at all. Whatever prompted that line in the original research either
described a different repo, an earlier draft, or was mistaken. **Do not add it to the
settled-trade-offs list on trust** — if a CORS header does show up in a future review,
treat it as new and audit it properly; don't assume it was pre-cleared.

## 2. Scope to what's changed since the last real audit

**Baseline: commit `8dc4e51` (2026-08-10, "chore(security): send security headers,
scope the CI token, update toolchain")** — the commit that introduced the current CSP
and security headers. That's the last audit this skill treats as a trusted baseline.

Before reviewing, run:

```bash
git log --oneline 8dc4e51..HEAD
git diff 8dc4e51..HEAD
```

Review the diff, not the whole tree. Re-auditing everything on every run either takes
too long to actually get used, or gets skimmed and misses the one thing that changed —
the same failure mode `upgrade-deps/SKILL.md` describes for Dependabot. If nothing
security-relevant changed since the baseline, say so plainly rather than padding the
report with a re-hash of already-settled items.

**Update the baseline commit in this file** after a real review is completed, so the
next run's diff stays small and current.

## Procedure

1. `git log --oneline 8dc4e51..HEAD` — get the shape of what's changed.
2. `git diff 8dc4e51..HEAD` — read it.
3. Run the generic security review against that diff specifically (OWASP Top 10 lens,
   secrets, injection, auth/authz, dependency risk as relevant).
4. Cross-check any CSP/header/CORS-shaped finding against section 1 above before
   reporting it — confirm it's genuinely new, not the already-settled `unsafe-inline`
   item restated.
5. Report: what changed, what (if anything) is a real finding, and confirmation that
   the settled items were checked and not re-flagged.
