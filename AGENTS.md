<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Secrets

**Never read `.env*` files (any variant except the committed `.env.example`
template) — this applies to every agent, on any machine, for anyone who
clones this public repo.** If you need a config value, ask the person you're
working with to paste only the specific non-secret value required. This is a
standing rule, not a suggestion: a coding agent that opens a real `.env.local`
puts a live Contentful Content Delivery token directly into its own context,
which is exactly the kind of exposure this rule exists to prevent.

A repo-local hook (`.claude/settings.json` + `.claude/hooks/block-secret-files.mjs`)
enforces this as a tool-call denial for anyone who has it active — but it is
opt-in per clone, not a guarantee. **Known gap, in both cases:** neither this
rule nor the hook stops a human pasting the contents of a secrets file into a
chat via an IDE text selection — no tool call fires for a text selection, so
nothing can intercept it. This has already happened once in this repo's
history. Treat this rule as raising the bar, not as complete protection.

# Before committing Markdown changes

Run the `prose-leak-check` skill before committing any change to a `.md`/`.mdx`
file (`CONTEXT.md`, `ARCHITECTURE.md`, `README.md`, notes, plans). This repo is
public, and identifying detail (client names not already named on the live
site, in particular) has leaked into committed Markdown before — see the skill
for the full precedent and procedure.
