---
description: Blog post template, the SEO component, and the cover plus OG image pair.
alwaysApply: false
trigger: glob
globs: src/templates/blog-post.tsx,src/components/seo.tsx
paths:
  - src/templates/blog-post.tsx
  - src/components/seo.tsx
inclusion: fileMatch
fileMatchPattern:
  - src/templates/blog-post.tsx
  - src/components/seo.tsx
---

`src/templates/blog-post.tsx` renders one post. It passes `coverImage` and `blogOgImage` into `src/components/seo.tsx`. The SEO component uses the blog OG image, then the cover, then `content/assets/default-og-image.jpg`.

A post's frontmatter has to point at `./cover.jpg` and `./og-image.png`, and both files have to sit next to that post's `index.md`. If either file is missing, the page query fails at build time.

Do not add a second image pipeline. Do not point `coverImage` or `blogOgImage` at a file outside the post directory.

This rule's check phrase is Cover Image Pair Required.
