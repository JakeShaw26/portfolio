# Glossary

## Contentful space

The `98ddc4l0fmm4` space (env `master`) contains 5 stale `experiencePost` entries
and 5 stale logo assets from an earlier, abandoned migration attempt. These do
not match the site's real content (`and-digital`/`cloudm` experience,
`travelchapter`/`jlr`/`asset-licensing-platform`/`ask-andi` projects) and are
confirmed dead — including one logo asset that was touched on 2026-07-05
alongside its now-deleted local counterpart in `public/work/` (confirmed
coincidental, not in-progress work). All of it is deleted as part of the
Contentful migration.

Client names are deliberately absent here: work delivered through AND Digital
sits under their client agreements, so this repo names a client only where the
live site already does.

## Template JSON files

`content/experience-template.json` and `content/work-template.json` were manual
drafting aids that mirror the static TS content arrays exactly. Once the site
reads from Contentful, these are deleted (not kept as a reference snapshot) —
two sources of truth for the same data risks silent drift.
