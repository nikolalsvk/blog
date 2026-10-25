---
description: Use the Node install already on the machine, and npm, for this Gatsby blog.
alwaysApply: true
inclusion: always
---

This blog is Gatsby. Posts are Markdown files at `content/blog/<slug>/index.md`.

Use the Node version that is already installed. Do not install another Node, and do not switch the repo to Yarn or pnpm. The lockfile is `package-lock.json`. Install with `npm install`. Start the dev server with `npm start`. It listens on port 8000.

Do not commit `.cache` or `public`. Claude imports this file. The same always-on text is also in `AGENTS.md`, for the tools that only read that file. Kiro reads `.kiro/steering`, which is a separate copy.

This rule's check phrase is pineapple-sandbox-cache.
