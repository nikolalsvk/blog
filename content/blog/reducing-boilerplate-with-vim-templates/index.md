---
title: Reducing Boilerplate With Vim Templates
description: Jump-start React TypeScript classes, or plain HTML files with a simple Vim template. No plugins needed.
slug: reducing-boilerplate-with-vim-templates
date: 2021-05-05
canonical: https://medium.com/@nikolalsvk/reducing-boilerplate-with-vim-templates-83831f8ced12
canonicalName: Medium
coverImage: ./cover.jpg
blogOgImage: ./og-image.jpg
published: true
tags:
  - Vim
---

If you're a terminal junkie like myself, you are going to love this one.
Today we are going to explain how you can avoid writing boilerplate code
without any plugins. The feature we are about to explore is called
templates or skeletons in Vim.

![Fast lights](./cover.jpg)

<div class="photo-caption">
  Photo by <a href="https://unsplash.com/@jakegivens?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jake Givens</a> on <a href="https://unsplash.com/s/photos/fast?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</div>

## Skeletons and Vim

Don't get scared, skeleton files (or templates) are just normal files. They are
called that because they will be used as a skeleton when creating a
specific file. To create a JSX TypeScript `.tsx` file, Vim
can use a predefined template (skeleton) file and add a React class. How does
that look - you must be asking. Let's see below.

We can define a Skeleton file inside `~/.vim/skeletons/react-typescript.tsx` like so:

```tsx
import React from "react"

interface Props {}

const NewComponent = (props: Props) => {
  return (
    <>
      <div></div>
    </>
  )
}

export default NewComponent
```

Then, we can add the following line in our `.vimrc`:

```vim
autocmd BufNewFile *.tsx 0r ~/.vim/skeletons/skeletons/typescript-react.tsx
```

Let's break it down a bit:

- `autocmd BufNewFile` – run the following when we try to create a new file in Vim
- `*.tsx` – this is the pattern you want the new file to match
- `0r` – read into the buffer starting at line 0, the first line
- `~/.vim/skeletons/react-typescript.tsx` – the file to read into the new file

And, that is it. Every time you create a new React TypeScript file, there will
be sitting a new functional component. Let's see what other useful templates
we can use.

## Useful Skeletons

I added a couple of skeletons inside [my dotfiles on GitHub](https://github.com/nikolalsvk/dotfiles/).
Help yourself there and use what you like. I will also share them below.

### Bash Script Skeleton

The most common template people suggest is the one for Bash scripts. It can look like this:

```bash
#!/usr/bin/env bash

set -eou pipefail
```

You also need the following line in your `.vimrc`:

```vim
autocmd BufNewFile *.sh 0r ~/.vim/skeletons/skeletons/script.sh
```

### HTML Skeleton

I picked this one up from the [HTML boilerplate in 2021](https://www.matuzo.at/blog/html-boilerplate/).

```html
<!DOCTYPE html>
<html lang="en" class="no-js">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />

    <title>TODO</title>

    <meta name="description" content="Page description" />
    <meta property="og:title" content="Unique page title - My Site" />
    <meta property="og:description" content="Page description" />
    <meta
      property="og:image"
      content="https://pragmaticpineapple.com.com/image.jpg"
    />
    <meta property="og:image:alt" content="Image description" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="og:url" content="https://pragmaticpineapple.com.com/page" />
    <link rel="canonical" href="https://pragmaticpineapple.com.com/page" />

    <link rel="icon" href="/favicon.ico" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/my.webmanifest" />

    <meta name="theme-color" content="#FF00FF" />
  </head>

  <body></body>
</html>
```

You can add the next line in the `.vimrc` to apply HTML boilerplate on the creation of new HTML files:

```vim
autocmd BufNewFile *.html 0r ~/.vim/skeletons/skeletons/page.html
```

### Blog Post Markdown Skeleton

The following one is my favorite because I've been looking into ways on how to
scaffold a new blog post. Take a look:

```md
---
title: TODO
description: TODO
slug: TODO
date: 2021-1-1
published: true
tags:
  - TODO
---
```

I make sure these are only created inside `content/blog` directories like so:

```vim
autocmd BufNewFile *content/blog*.md 0r ~/.vim/skeletons/skeletons/blog-post.md
```

## Where To Keep Skeletons

If the current section was taken out of context, we could have been in trouble. But, jokes aside,
where can you store template files? It doesn't really matter. I keep them inside my dotfiles
which I have in version control. They are inside `~/Documents/dotfiles/skeletons`. Some folks
like them in `~/.vim/templates` or `~/.vim/skeletons`. I like mine in a [dotfiles git repo](https://github.com/nikolalsvk/dotfiles/)
where I can change and push them to GitHub easily.

## Manual Usage

If you are not a fan of Vim automatically populating your files on creation,
you can always reach out for the manual approach. To simply fill a file with
another file's content, try out `:read` command:

```vim
:read ~/.vim/skeletons/react-typescript.tsx
```

The contents of `~/.vim/skeletons/react-typescript.tsx` will show below your cursor.

## Final Thoughts

That's all for now. Thanks for tuning in. Consider subscribing to my
[newsletter](/newsletter), where we will explore the possibility of adding some
dynamic templates in one of the next blog posts.

I got the idea to write this blog post from [VimTricks in their post](https://vimtricks.com/p/automated-file-templates/), shout out to them.

Also, don't forget to share with your friends and coworkers on Twitter if you found
the post useful.

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">Brand new post on Vim skeletons 💀<br><br>Check it out below ⬇️<a href="https://t.co/2PGeASFAH3">https://t.co/2PGeASFAH3</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/1390007450586206208?ref_src=twsrc%5Etfw">May 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Until the next one, cheers.
