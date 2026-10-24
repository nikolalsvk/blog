# Claude

This repo is the Pragmatic Pineapple blog. Gatsby, React, and Markdown posts in `content/blog/<slug>/index.md`.

Start it with `npm start`. The dev server listens on port 8000. Install dependencies with `npm install`. The lockfile is `package-lock.json`.

Path-scoped rules are symlinked into `.claude/rules` from `.agents/rules`. Always-on rules are imported below, and they are not also symlinked.

See @./.agents/rules/local-node-env.md
