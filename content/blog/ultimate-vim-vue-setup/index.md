---
title: Ultimate Vim Vue Setup
description: TODO
slug: ultimate-vim-vue-setup
date: 2024-02-14
coverImage: TODO
blogOgImage: TODO
published: true
tags:
  - Vim
  - Vue
  - TypeScript
---

I've recently started working with Vue 3 and Nuxt 3 so I had to figure out how to have proper development experience in my favorite editor - Vim. Yes, I could have switched to VSCode or any other modern editor / IDE but it is hard for me. I am one of those folks that learned Vim early in his career and now I have a Vim-syndrome - every editor I go to, I try to make it like home (Vim).

Before, I worked mostly with React and TypeScript, and I have [a popular post on how to configure TypeScript in Vim](/ultimate-vim-typescript-setup). In my current work, the TypeScript stayed but I switched over to the Vue world. I'll write more topics about that in the future, so you can subscribe to the [newsletter](/newsletter) to follow along (it is free).

Vue's been great for these last 6 months, I gotten to like it and it feels natural. But oh boy, the first couple of weeks were hell. Mostly because I lacked editor support I needed. Yes, I did have [my TypeScript setup](/ultimate-vim-typescript-setup) I mentioned, but it wasn't enough. My colleagues were asking me if I have some kind of a Vue language tool/plugin installed. I was ashamed to answer that, but the truth was I was running in dark.

One day I wanted to add proper setup for Vue and nothing could stop me. I also must admit I switched to NeoVim in the meantime, but I'll write about that in another post. There are bunch of advices and setups on the web, but I could never find the one I could follow through easily. That's the main reason I'm writing this blog post - I came up with a simple way you can get going with Vue. Let's get started.

## Vue Syntax Highlight in Vim

To get started, we'll need some syntax highlighting. If you're using NeoVim, you should already be covered. If you're using latest Vim (mine is 9.1 at the time of writing) then you'll also have some syntax highlighting.

If that's not working, try an popular plugin for Vue syntax:

- [posva/vim-vue](https://github.com/posva/vim-vue)

I'm using [vim-plug](https://github.com/junegunn/vim-plug) to install plugins, so I have a line like this in my `.vimrc`:

```vim
Plug 'posva/vim-vue'
```

After adding the line, run `:PlugInstall` and you should be good.

For TypeScript syntax, you should be covered. Both NeoVim and Vim have an out-of-the-box support for it. If not, try to update them.

Cool, let's move on to the most useful part of the setup - code completion and suggestions!

## VSCode-like Setup

Many folks are going to roll their eyes over in this section. Why? Because I will suggest a straightforward solution instead of digging deep and configuring everything yourself. Nothing wrong with any of those approaches, I feel like it is easier to start quickly, rather than slowly.

To achieve an easy and simple start to editing and reading Vue files in Vim, we will use [coc.nvim](https://github.com/neoclide/coc.nvim). CoC is a swiss-army knife of Vim. It is largely inspired by VSCode and once configured, it probably is. I wouldn't know because I never converted to a full-time VSCode user.

To set up `coc.nvim` plugin, you need to include the plugin in your `.vimrc`:

```vim
Plug 'neoclide/coc.nvim', {'branch': 'release'}
```

And then do `:PlugInstall` so the plugin gets installed.

But wait, there's more. We need to install a Vue language tool to give us completions and documentation in the editor.

### Installing Volar - Vue language tool

Installing CoC is not enough, we need to install Volar - a Vue language tool that will actually help us with writing code. Luckily, there is a [coc-volar](https://github.com/yaegassy/coc-volar) plugin we can install. It is recommended by the folks who develop the "raw" version of it over at [Vue language tools](https://github.com/vuejs/language-tools). If you're using vim-plug, you can install it as a plugin like so:

```vim
Plug 'yaegassy/coc-volar', { 'do': 'yarn install --frozen-lockfile' }
Plug 'yaegassy/coc-volar-tools', { 'do': 'yarn install --frozen-lockfile' }
```

After you've added these three plugins, go ahead and run `:PlugInstall`. The `coc.nvim` will pickup out-of-the-box `coc-volar` and `coc-volar-tools` if they're installed via vim-plug.

<details>
<summary>An alternative way to install CoC plugins</summary>

You can also install `coc-volar` and `coc-volar-tools` via these commands:

```vim
:CocInstall @yaegassy/coc-volar
```

and

```vim
:CocInstall @yaegassy/coc-volar-tools
```

</details>

Before testing out everything, let's make sure our setup will work well.

### Enabling "Takeover Mode"

To make sure everything works well, let's enable the so-called "Takeover Mode". The "Takeover Mode" is there to improve performance of the Vue language tools. In short, it disabled the default TypeScript language service and only runs the Vue language service. That's because Volar creates a separate TypeScript language service patched with Vue specifics. So that's why we're turning the default TS language service.

To enable "Takeover Mode", do this:

1. Open one of the `*.vue`, `*.ts`, `*.js`, `*.tsx`, or `*.jsx` file.
2. Run `:CocCommand volar.initializeTakeOverMode`.
3. When prompted by `Enable Take Over Mode? (y/n)?`, enter y
4. The `.vim/coc-settings.json` file will be created in the root of the project.
   - The `"volar.takeOverMode.enabled": true` and `"tsserver.enable": false` settings will be added.
5. `coc.nvim` will restart and the settings will reflect.

You can either commit the `.vim/coc-settings.json` or add it to `.gitignore` file, in either case, Vim/NeoVim will pick up settings from there and make sure only on instance of TypeScript language service is running and showing errors / suggestions.
