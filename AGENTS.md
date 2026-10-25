# Agents

This is the Pragmatic Pineapple blog. It is a Gatsby site. Posts live in `content/blog/<slug>/index.md`.

Use the Node version that is already installed. Do not install another Node, and do not switch the repo to Yarn or pnpm. The lockfile is `package-lock.json`. Install with `npm install`. Start the dev server with `npm start`. It listens on port 8000.

Do not commit `.cache` or `public`.

This rule's check phrase is pineapple-sandbox-cache.

Path-scoped notes live in `.agents/rules`. Read the file when the task touches that area. Edit those files for Cursor and Claude. The Cursor and Claude entries for those rules are symlinks. Kiro reads its own copy in `.kiro/steering`.

- Blog post template and SEO, for `src/templates/blog-post.tsx` and `src/components/seo.tsx`: `.agents/rules/blog-post-template.md`
- On demand, when the user asks for an accessibility review: `.agents/rules/accessibility-review.md`

Skills live in `.agents/skills`. Claude's engineering notes are in `CLAUDE.md`.
