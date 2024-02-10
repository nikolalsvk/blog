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

To get started, we'll need some syntax highlighting.

## VSCode-like Setup

Many folks are going to roll their eyes over in this section. Why? Because I will suggest a straightforward solution instead of digging deep and configuring everything yourself. Nothing wrong with any of those approaches, I feel like it is easier to start quickly, rather than slowly.

To achieve an easy and simple start to editing and reading Vue files in Vim, we will use [coc.nvim](https://github.com/neoclide/coc.nvim). CoC is a swiss-army knife of Vim. It is largely inspired by VSCode and once configured, it probably is. I wouldn't know because I never converted to a full-time VSCode user.
