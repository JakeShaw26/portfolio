# Architecture decisions

Lightweight ADR log for decisions that aren't obvious from the code. Newest entries
at the top. Format: **Decision**, **Context**, **Why**, **Status**.

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

**Status:** Accepted (2026-06-17). Revisit if the site grows a blog or gains
non-technical editors.
