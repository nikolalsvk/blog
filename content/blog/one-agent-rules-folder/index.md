---
title: One Rules Folder for Your Coding Agents
description: Do not duplicate. Keep one source of truth when the tool will let you. A generated copy is how the files drift apart.
slug: one-agent-rules-folder
date: 2026-10-25
coverImage: ./cover.jpg
blogOgImage: ./og-image.jpg
published: true
tags:
  - AI
  - LLMs
  - Cursor
  - Claude
---

![Laptop on a wooden desk by a window](./cover.jpg)

<div class="photo-caption">
Photo by <a href="https://unsplash.com/@dying_apricity?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Nguyen Phan Nam Anh</a> on <a href="https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-desk-v6vxTvqeVuo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
</div>

I had a pile of project rules written for Cursor. Claude Code never saw them. Codex only saw them if someone remembered to open the file. The first fix was a script that copied every rule into Claude's folder on commit. The copy worked. It was also the start of two sources of truth.

Do not duplicate. Keep one source of truth when the tool will let you. That is the rule.

The markdown lives in one folder, `.agents`. Cursor and Claude open that same file through a symlink. Codex, ZCode, and Antigravity do not expand an import, so the always-on sentence is also written in `AGENTS.md`. Kiro will not follow a symlink in `.kiro/steering`, so that folder is a real copy until [kirodotdev/Kiro#2921](https://github.com/kirodotdev/Kiro/issues/2921) is fixed. Everywhere else, a second body is a miss. There is no generator.

Here is the layout I ended up with, and how that one folder reaches Cursor, Claude Code, Codex, and Kiro. ZCode is in here too. That is the editor Z.ai ships for GLM. I have run this on Cursor, Claude, Kiro, Kiro Crew, and in the ZCode, ChatGPT, and Antigravity desktop apps, plus the Copilot CLI. The Copilot desktop app does not load these shared files.

## What each tool actually opens

They do not read each other's directories. A rule that lives only in `.cursor/rules` is invisible to Claude. A `CLAUDE.md` is invisible to a tool that only opens `AGENTS.md`.

| Tool                       | Always-on instructions                                           | Scoped instructions                                         | Skills                           |
| -------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------- |
| Cursor                     | `AGENTS.md`                                                      | `globs` in a `.cursor/rules/*.mdc`                          | `.cursor/skills/<name>/SKILL.md` |
| Claude Code                | `CLAUDE.md`, and a `.claude/rules/*.md` that has no `paths` key  | `paths` in that file                                        | `.claude/skills/<name>/SKILL.md` |
| Codex                      | `AGENTS.md`                                                      | Nested `AGENTS.md`, or an instruction to read a file        | `.agents/skills/<name>/SKILL.md` |
| Kiro                       | `AGENTS.md`, or `.kiro/steering/*.md` with `inclusion: always`   | `inclusion: fileMatch` and `fileMatchPattern`               | `.kiro/skills/<name>/SKILL.md`   |
| GitHub Copilot desktop app | it did not load `AGENTS.md` or `.github/copilot-instructions.md` | it did not load those either                                | `.agents/skills/<name>/SKILL.md` |
| Antigravity                | `AGENTS.md` and `GEMINI.md`                                      | `.agents/rules` with `trigger: glob`, `globs` as one string | not checked                      |
| ZCode                      | the workspace `AGENTS.md`                                        | it does not scope rules by path                             | `.agents/skills/<name>/SKILL.md` |

Cursor will not load a plain `.md` file dropped in `.cursor/rules`. The file has to be named `.mdc`. Claude Code will not load an `.mdc`. The file has to be named `.md`, and the only frontmatter key it reads is `paths`. Kiro wants `inclusion`. Same prose, different filename.

## One directory, then a link with the right name

Edit the markdown in `.agents`. Give Cursor and Claude a symlink whose **name** matches what that tool scans. The target stays `.md`. Kiro gets a copy, and that part is below.

```text
.agents/rules/devices-api.md
.agents/skills/rspec-focused-runs/SKILL.md

.cursor/rules/devices-api.mdc -> ../../.agents/rules/devices-api.md
.claude/rules/devices-api.md  -> ../../.agents/rules/devices-api.md
```

```bash
mkdir -p .agents/rules .cursor/rules .claude/rules

ln -s ../../.agents/rules/devices-api.md .cursor/rules/devices-api.mdc
ln -s ../../.agents/rules/devices-api.md .claude/rules/devices-api.md
```

I tried the other direction first. A Claude file named `.md` whose target was the existing `.mdc`. Claude follows the link and then skips it, because the real file is not markdown it is willing to load. A link the other way, an `.mdc` name pointing at an `.md` file, showed up in Cursor's rules list after a window reload and attached to the right files.

Keep the link inside the repo. Claude treats a symlink that points outside the working directory as an external import. You have to approve it, and after that it only loads the rules that have no `paths` key. Path-scoped rules have to live in the checkout.

On Windows, Git will write a symlink as a tiny text file unless `core.symlinks` is on. Both tools then read the path string instead of the rule. On a Mac the link stays a link. If someone on the team uses Windows, they need `core.symlinks` on before they clone.

## One frontmatter block, several keys

Each tool ignores the keys it does not know. The path lists have to be the same paths. These are the files in this repo. The prose under the frontmatter is the rule. The keys are the part that changes per tool.

**A path-scoped rule.** `.agents/rules/blog-post-template.md`. Cursor, Claude, and Kiro can all read this file. Antigravity can too, because `trigger` is set.

```markdown
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
```

| Key                | Who reads it                                     | What it decides                                                                                                                        |
| ------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `description`      | Cursor                                           | When an on-demand rule is relevant. On this file it is only a label, because the paths decide.                                         |
| `alwaysApply`      | Cursor                                           | `false` waits for `globs`. `true` puts the rule in every chat.                                                                         |
| `globs`            | Cursor, and Antigravity when `trigger` is `glob` | One comma-separated string. A YAML list is the error I got: `cannot unmarshal !!seq into string`.                                      |
| `paths`            | Claude                                           | Attach the rule when Claude reads a matching file.                                                                                     |
| `trigger`          | Antigravity                                      | `glob` here. The other values it accepts are `always_on`, `model_decision`, and `manual`. No `trigger` and Antigravity skips the file. |
| `inclusion`        | Kiro                                             | `fileMatch` waits for a matching file. `always` loads it at the start. `manual` waits until you ask.                                   |
| `fileMatchPattern` | Kiro                                             | The paths for `fileMatch`. Same list as `paths` and `globs`.                                                                           |

**An always-on rule.** `.agents/rules/local-node-env.md`.

```markdown
---
description: Use the Node install already on the machine, and npm, for this Gatsby blog.
alwaysApply: true
inclusion: always
---
```

No `paths`, no `globs`, no `trigger`. Cursor loads it in every chat. I do not symlink it into `.claude/rules`. `CLAUDE.md` imports the file instead. Leaving `trigger` off means Antigravity does not load it a second time from `.agents/rules`. The sentence those tools need is already in `AGENTS.md`. Kiro's copy of this file keeps only `inclusion: always`.

**An on-demand rule.** `.agents/rules/accessibility-review.md`.

```markdown
---
description: Review the blog UI for accessibility. Use when the user asks for an accessibility review of a page, component, or the theme switch.
alwaysApply: false
inclusion: manual
name: accessibility-review
---
```

`alwaysApply: false` and no `globs` is Cursor's on-demand shape. The `description` is what Cursor matches against the task. `inclusion: manual` is Kiro's version of the same idea. `name` is the handle Kiro shows for that manual rule. This file is not linked into `.claude/rules`. A Claude file with no `paths` would be always on.

**A skill.** `.agents/skills/gatsby-post-check/SKILL.md`. A skill is not a rule. Nothing in here is a path.

```markdown
---
name: gatsby-post-check
description: Check a new Markdown post has frontmatter, a cover image, and an OG image before it is published. Use when adding or editing a file under content/blog.
---
```

`name` matches the directory. `description` is how the agent decides the skill applies. Cursor shows `Error parsing skill` if this header is missing.

**The Kiro copy** of the path-scoped rule is the same prose with a thinner header. Kiro only needs its own keys, and this file is the duplicate I could not avoid.

```markdown
---
inclusion: fileMatch
fileMatchPattern:
  - src/templates/blog-post.tsx
  - src/components/seo.tsx
---
```

The GitHub Copilot desktop app is the one I would not use for this layout right now. Its docs describe `.github/copilot-instructions.md` for repo-wide instructions, and a `*.instructions.md` file with `applyTo` for a path. I added both. The app listed the `gatsby-post-check` skill from `.agents/skills` and did not load `AGENTS.md` or that instruction file. The skill list is not the instruction set. It also has a Settings box per repository. Pasting the sentence there would not mean the app had read a file, so I left the box empty and deleted both files. The Copilot CLI does read `AGENTS.md`.

## Three kinds of rule, and Claude only wants two of them linked

This is the part that makes a blanket symlink wrong.

**Always on.** Coding habits, "use the Ruby that is already installed", anything that should be in every session. Cursor expresses that with `alwaysApply: true`. Claude expresses it by leaving `paths` out. A real file in `.claude/rules` with no `paths` loads at startup, next to `CLAUDE.md`.

A symlink with no `paths` did not load. I watched Claude Code skip it. The rule was not in the session. Import it from `CLAUDE.md` instead. The `./` is required. A bare `@.agents/...` was left in the file as text and never expanded.

```markdown
See @./.agents/rules/agent-execution-habits.md
See @./.agents/rules/local-bundler-env.md
```

Do not also symlink those two into `.claude/rules`. The day a Claude release starts following that symlink, the rule loads twice.

**Path scoped.** The Devices API contract, PaperTrail, the report cache. Link these into `.claude/rules`. Claude attaches the file when it reads a matching path. Cursor attaches it when a matching file is in the chat.

**On demand.** "You are reviewing accessibility." Cursor loads these when the description looks relevant (`alwaysApply: false`, empty `globs`). Kiro has the same idea as `inclusion: auto` or `inclusion: manual`. Claude has no equivalent. A linked file with no `paths` is the same shape as an always-on rule. Leave those out of `.claude/rules`. If a later Claude follows the symlink, they stop being on demand and sit in every session. Codex and Kiro can still open them, because `AGENTS.md` can name the file.

## AGENTS.md is the shared front door

`AGENTS.md` is the shared front door for Codex, Kiro, Cursor, Copilot, ZCode, Windsurf, and a long list of smaller agents. Keep it short. Point it at `CLAUDE.md` for the engineering guide and at `.agents/rules` for the area notes.

Codex will not crawl `.cursor/rules` on its own. If the rule matters, `AGENTS.md` has to name the file, or you put a nested `AGENTS.md` next to the code. Nested files are a good fit for a big monorepo. They are a poor fit for one rule that matches fifteen paths spread across `app/models` and `app/jobs`. That rule stays in `.agents/rules` and gets a `fileMatchPattern`.

[ZCode](https://zcode.z.ai/en/docs/agents) reads `~/.zcode/AGENTS.md`, then appends the workspace `AGENTS.md`. It does not expand an `@` import, and it does not attach a rule because a path matched. It already looks in `.agents/skills`. A `.zcode/skills` folder of the same name would win, so I did not add one.

Kiro loads a root `AGENTS.md` automatically, and it also loads `AGENTS.md` files nested next to the code they describe. An `AGENTS.md` is always on for Kiro. It does not support inclusion modes. If you want the path scoping, use a steering file.

Kiro's docs also let a steering file pull another file in without copying it:

```markdown
---
inclusion: fileMatch
fileMatchPattern: "app/models/device.rb"
---

#[[file:.agents/rules/devices-api.md]]
```

That file reference is what the docs offer. I tried it, and I tried a symlink in `.kiro/steering` first. Kiro did not load the rule from either one. The `#[[file:]]` line stayed as text. The symlink is a bug in the steering loader. Kiro only opens a normal file in that folder. A relative link, an absolute link, and a link to the whole directory are all skipped, so the rule never reaches the session. This used to work. A maintainer reproduced the break, and it is still open: [kirodotdev/Kiro#2921](https://github.com/kirodotdev/Kiro/issues/2921). Until that lands, `.kiro/steering` has to be a second copy of the rule body. Same for Kiro Crew. Cursor and Claude still share the file in `.agents` through a symlink. Kiro does not, so an edit in `.agents/rules` stays there. The always-on copy has already drifted by one sentence.

Kiro IDE does the path scope. With `inclusion: fileMatch`, the template rule is there after the matching file is open, and it stays out for a file that matches nothing. Crew loads steering when the session starts, and it does not attach a `fileMatch` file later. The always-on file is there because `inclusion: always` is already loaded at the start.

Both apps read the same `.kiro/steering` folder. Marking the template rule `always` would put it in every Crew session, and it would also load that rule on every file in the IDE. I left it as `fileMatch`. Kiro keeps the scope. Crew only gets the always-on rule.

Current Claude Code, 2.1.277 and later, will read `AGENTS.md` on its own when the repo has no `CLAUDE.md`. I still keep `CLAUDE.md`. Once that file exists, Claude reads it and leaves `AGENTS.md` alone, unless you change the project-instructions setting or import the file. Importing is what I actually watched work. Older builds, including the 2.0.9 I had on my `PATH`, do not have this.

A few other tools already open a root `AGENTS.md` and need no symlink of their own: OpenCode, Amp, Zed, Windsurf, Junie, Jules. I have not installed those, so they stay out of the table.

## Skills are the same idea, plus a frontmatter tax

A skill is a folder with a `SKILL.md`. The one in this repo is `gatsby-post-check`, and its header is above. Write it once:

```text
.agents/skills/rspec-focused-runs/SKILL.md

.cursor/skills/rspec-focused-runs -> ../../.agents/skills/rspec-focused-runs
.claude/skills/rspec-focused-runs -> ../../.agents/skills/rspec-focused-runs
```

Codex already looks in `.agents/skills`, so it needs no link. ZCode does too. Cursor and Claude Code want their own directory names. A directory symlink is enough. Cursor followed it.

Cursor will list the skill and then show `Error parsing skill` if the file is plain markdown. The two skills I already had frontmatter on parsed. The other five did not. This header fixed them:

```markdown
---
name: rspec-focused-runs
description: Run the smallest spec that covers the change, using the Ruby install that is already on the machine.
---
```

`name` should match the directory. `description` is what the agent uses to decide the skill is relevant. Reload the window after adding a skill. Cursor does not notice a new symlink until you do.

Claude Code exposes the same folder as `/rspec-focused-runs`, and `/skills` lists them. That command exists in current Claude Code. It does not exist in 2.0.9, which is the version `npm install -g` left me on from 2025. Run `claude --version` before you conclude the skills are missing. The copy inside the editor can be a year newer than the `claude` binary on your `PATH`.

## What each app said

I ran one fresh session per app. Cursor was this editor. Claude, ZCode, ChatGPT, Antigravity, Kiro, and Kiro Crew were desktop apps. Copilot was both the desktop app and the CLI. Each session got the same three prompts. The first one says not to read any files.

- Do your instructions contain `pineapple-sandbox-cache`?
- Open `src/templates/blog-post.tsx`. Do your instructions contain `Cover Image Pair Required`?
- Open `src/pages/404.tsx`. Do your instructions contain `Cover Image Pair Required`?

Cursor and Claude had the first sentence, had the cover sentence on the template file, and did not have it on the 404 page. Claude only had the first sentence after `CLAUDE.md` imported the rule. ChatGPT, ZCode, and Antigravity had the first sentence from `AGENTS.md`, and a matching path did not pull in the cover sentence. Kiro and Kiro Crew had the first sentence once the steering file contained the rule body. Kiro had the cover sentence on the template file. Kiro Crew did not. The Copilot desktop app listed `gatsby-post-check` and did not have the first sentence. The Copilot CLI did, because it reads `AGENTS.md`. A private Google account would not sign in to the Gemini CLI, so that one is not in this list.

## What I would skip

A generator that writes `.claude/rules/foo.md` from `.cursor/rules/foo.mdc` on every commit. It works, and the diff noise can be hidden, and six months later someone edits the generated file. The pre-commit hook then refuses the commit, or it overwrites the edit. You have built a small package manager for markdown.

A symlink whose target ends in `.mdc`. Claude skips it.

Linking every Cursor rule into `.claude/rules`. Link the path-scoped ones. Leave the description-only ones out. They have no `paths`, so a Claude that follows the symlink treats them as always-on and burns context on every task. I watched the current build skip that symlink. I still would not add it.

A symlink farm that points at a directory outside the repo, including `~/.claude/rules`. Path-scoped rules will not load from there.

Trusting one `claude` binary. Check the version in the terminal you actually type in. I had 2.0.9 on `PATH` and a current build inside the editor. Skills existed in one and not the other. The rules directory did not exist in 2.0.9 at all.

## The files, in one place

```text
AGENTS.md                         # Codex, Kiro, Cursor, ZCode, Antigravity
CLAUDE.md                         # Claude Code, plus @./.agents/rules/<always-on>.md
GEMINI.md                         # Antigravity, plain markdown, no import
.agents/rules/*.md                # the only rules you edit
.agents/skills/*/SKILL.md         # the only skills you edit
.cursor/rules/*.mdc               # symlink, name ends in .mdc
.claude/rules/*.md                # symlink, only the path-scoped rules
.kiro/steering/*.md               # real copy until Kiro follows symlinks (kirodotdev/Kiro#2921)
.cursor/skills/*                  # directory symlink
.claude/skills/*                  # directory symlink
.kiro/skills/*                    # directory symlink
```

Add a rule by writing `.agents/rules/<name>.md` and linking it. Add a skill by writing the folder and linking it. The check in CI is "every link resolves, and `globs`, `paths`, and `fileMatchPattern` are the same list."

Do not duplicate. Keep one source of truth when the tool will let you. Edit `.agents`. Link it. The always-on paragraph in `AGENTS.md`, and the files in `.kiro/steering`, are the copies I could not get rid of. A generated copy of every rule is the thing I would not add back.
