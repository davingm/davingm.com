# Anime archive entries

Add one `.mdx` file per anime under the matching language folder:
`content/anime/id/`, `content/anime/en/`, or `content/anime/zh/`. Keep
landscape images in `public/images/anime/<slug>/` and use their public paths
in the `images` list. Each entry supports one to five images; only one is
shown at a time.

```md
---
year: 2026
title: "Anime title"
description: "Your description or notes about the anime."
images:
  - "/images/anime/sample-landscape-1.svg"
  - "/images/anime/sample-landscape-2.svg"
rating: 7
episodeDurationMinutes: 24
pinned: false
categories:
  - Comedy
  - Fantasy
---
```

`rating` is an integer from 0 to 10 and is displayed as five gold stars (one star per
two points, including half-stars). `episodeDurationMinutes` must be from 20
to 40. `year` is the year for the archive timeline.
Set `pinned: true` to keep an anime above all unpinned entries. Omit the field
or use `false` for a regular entry. Pinned entries have no special visual
marker. The archive initially shows 20 anime and the round down-arrow button
reveals 20 more at a time.

The language folders contain two example entries each. Their titles,
descriptions, and categories are localized; replace or remove these examples
when adding your own watch history. The sample landscape illustrations are
shared across all three languages.
