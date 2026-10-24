---
name: gatsby-post-check
description: Check a new Markdown post has frontmatter, a cover image, and an OG image before it is published. Use when adding or editing a file under content/blog.
---

# Check a Gatsby post

Use this when a post is added or edited under `content/blog`.

1. Open `content/blog/<slug>/index.md`.
2. Confirm the frontmatter has `title`, `description`, `slug`, `date`, `coverImage: ./cover.jpg`, `blogOgImage: ./og-image.png`, `published`, and `tags`.
3. Confirm `cover.jpg` and `og-image.png` sit in the same directory as `index.md`.
4. Confirm the slug matches the directory name.
5. Do not publish a post whose `published` field is still false unless the user asked for a draft.

This skill's check phrase is pineapple-skill-marker.
