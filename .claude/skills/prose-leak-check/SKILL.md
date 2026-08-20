---
name: prose-leak-check
description: Check staged .md/.mdx changes for client names or identifying detail not already public on the live site, before committing. Use before committing any change to a Markdown file in this repo (CONTEXT.md, ARCHITECTURE.md, README.md, plans, notes), or whenever asked to review prose for a leak before it's committed.
---

# Public-repo prose leak check

## Why this exists

This repo is public. Real precedent: five client names were committed to `CONTEXT.md`
after the repo went public, went unnoticed, and are still recoverable from git history
today (`refs/pull/*/head` and old commits survive a history rewrite — a rewrite would
not actually fix this if it happened again). Markdown files are where this leaks in
practice: they're where working notes, planning docs, and glossaries get written
informally, without the same scrutiny as a line of application code, and identifying
detail slips in exactly because it reads as harmless internal context at the time.

**Why this is a skill, not a script:** the actual sensitive information — which client
names are NOT yet public — cannot itself be written down anywhere in this repo. A
hardcoded denylist of "these names are secret" would itself be the leak. So this check
works the other way: maintain a short, safe-to-commit **allowlist of names already
public**, and treat anything else that looks like a client/company/person identifier as
a candidate finding requiring human confirmation before it's committed. That's a
judgment call about what a piece of prose is actually saying, not a pattern match — this
skill exists to make that judgment call consistently, not to replace it with a regex.

## Already public (do not flag)

These client names are already named on the live site (`About.tsx`, work project
titles) — repeating them is not a leak:

- **AND Digital** — current employer, named directly in `About.tsx`
- **CloudM** — named in `About.tsx` (internship)
- **JLR** — named as a work project title
- **Travelchapter** — named as a work project title

Anything else — a company name, a named individual (beyond the site owner, Jake Shaw),
a named team, a named internal project/product that doesn't appear in `src/` or on the
live site — is a candidate finding.

## Procedure

1. Get the staged Markdown diff:

   ```bash
   git diff --cached -- '*.md' '*.mdx'
   ```

   (Or the equivalent range for a non-staged review — e.g. `git diff main...HEAD -- '*.md' '*.mdx'`
   when reviewing a branch rather than a staging area.)

2. Read the **added** lines only (`+` lines, excluding the `+++` file header). Removed
   lines are not a new leak.

3. For every proper noun that could plausibly be a client, employer, product, team, or
   person's name (not the site owner) in the added lines:
   - **Already public** (matches the allowlist above, or is independently verifiable as
     already named on the live site right now) → not a finding.
   - **Not on the allowlist** → flag it. Quote the line, name what looks identifying
     about it, and ask for explicit confirmation before it's committed. Do not commit
     on the check's own authority — surface it and let the person decide, since only
     they know whether a given name is actually fine to publish (e.g. the person
     themself, a public technology/tool name, a well-known publication title).
   - Genuinely ambiguous cases (a name that could be a client or could be a common
     word/generic project codename) → flag as ambiguous, don't silently pass it.

4. Report a clean pass explicitly when there's nothing to flag — don't stay silent, so
   the person committing knows the check ran rather than wondering if it was skipped.

## What this does not do

This is not a git hook — it can't be, since it requires judgment a deterministic
pre-commit script can't apply without either the denylist problem above or a flood of
false positives on every proper noun in a technical doc. Run it deliberately before
committing `.md`/`.mdx` changes, the same way you'd proofread before publishing.
