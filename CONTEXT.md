# Glossary

## Contentful space

The `98ddc4l0fmm4` space (env `master`) contains 5 stale `experiencePost` entries
(Awaze, Feeld, JLR, TravelChapter, IDAA) and 5 stale logo assets from an earlier,
abandoned migration attempt. These do not match the site's real content
(`and-digital`/`cloudm` experience, `travelchapter`/`jlr`/`idaa`/`ask-andi`
projects) and are confirmed dead — including the `Awaze logo` asset, despite it
and a local `public/work/awaze-logo.png` both being touched on 2026-07-05
(confirmed coincidental, not in-progress work). All of it is deleted as part of
the Contentful migration.

## Template JSON files

`content/experience-template.json` and `content/work-template.json` were manual
drafting aids that mirror the static TS content arrays exactly. Once the site
reads from Contentful, these are deleted (not kept as a reference snapshot) —
two sources of truth for the same data risks silent drift.
