---
title: Why Should You Learn Vim in 2020
description: Pros and cons of using a 30-year-old editor in 2020.
slug: why-should-you-learn-vim-in-2020
date: 2020-07-10
published: false
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
tags:
  - Vim
---

![Riffs](./cover.jpg)

<div class="photo-caption">
  Photo by <a href="https://unsplash.com/@aleksdahlberg?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Aleks Dahlberg</a> on <a href="https://unsplash.com/s/photos/old-vs-new?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a>
</div>

You probably heard of Vim, the almighty text-editor that is everywhere and a
place where people get trapped from time to time. If you are hearing from your
local DevOps engineer how Vim is great and awesome, then you probably thought
about giving it a try. But why do it now? It’s 2020, doesn’t everyone use
VSCode already?

## The Need for Speed

No, this isn't about the popular racing game series, it is still about editing
files in Vim - which is super fast. But don't let **me** fool you, editing is super
fast when you get a hang of it, which can happen also pretty fast. It is not a
mere coincidence that majority of popular websites (Facebook, Twitter, Gmail,
Tumblr) allow you to move around with `h`, `j`, `k`, and `l` around the
feed. This is why developers love Vim. Instead of having to use your mouse,
you can use combination of key presses that let you jump around the file with
ease. For example:

- `gg` - jump at the top of the file
- `G` - jump at the bottom of the file
- `{` - move up between empty space or code blocks in your file
- `}` - move down between empty space or code blocks in your file
- `(` - move back onto the previous sentence
- `)` - move forward onto the next sentence

![Moving around in Vim](./moving-around.gif)

These are just the basic movement tips you can try out in your next Vim
session. I will not go into details how to move around, and how you should
disable arrow keys on the start (you probably should), there are many of
resources for that on the internet. I will just leave you with these couple of
navigation shortcuts for you to try out.

If that is not enough, I have a very [pragmatic](/) advice for you in the next
section.

## Getting closer to the metal

Learning Vim also means learning what is in your Terminal and your machine. To
better paint the picture of what I mean, I'll approach it form the other side
and give you an example of what you usually do with a IDE. When you use an
IDE-like experience, you don't actually need to tinker around much. You get a
theme or a plugin manager, you search for a plugin there, click install and
voilà, you just got yourself a full support for TypeScript.

But, this is a bit different in Vim. Yes, you have a sea of plugins and a vast
community of folks contributing to it. But you can get really deep into
configuration and figuring out how everything works by customizing your Vim
experience. Some plugin has some pros and works well with others, some are so
good with fitting into your current configuration and you have to do a lot of
manual work yourself. So all this time you are learning more about what you have
in your development environment.

For example, to search for text occurrences I used
[ack-grep](http://manpages.ubuntu.com/manpages/trusty/man1/ack-grep.1p.html).
Later on I found that there is a faster approach using [ag](https://github.com/ggreer/the_silver_searcher). Then, there is
an even faster alternative called [ripgrep](https://github.com/BurntSushi/ripgrep).
Of course, I stopped at the `ag`, but my point is that you are encouraged to
learn more about what you have on your machine, and thus have more confidence
and knowledge about what is happening. This is all getting you closer to the
metal (machine) as possible, instead of mindlessly installing plugins from the
IDE's marketplace.

If you want to get a quick glance on what it takes to have
[Vim and TypeScript together, check out this blog post](/ultimate-vim-typescript-setup).

## Some cons to all of this

## Final thoughts

Thanks for reading this far, I appreciate it. If you are still wondering
whether to start learning Vim or not, I'd say give it a try. You never know
when you might need it, or you even fully switch to using Vim.

Maybe you get a Vim mode inside your IDE or VSCode, who knows. I am not saying
that Vim should replace what you are using now, but trying to learn and
configure it will definitely improve your skills and abilities. Also, at the
end of the day, it doesn't really matter what editor you use, it is what you do
with it!

At the end of the day, it's the matter of finding the proper editor
(tool) that makes you do what you do even better.

If you liked the blog post, you can share it with your friends and coworkers below:

Consider subscribing to my [newsletter](/newsletter) if you want, you will get
similar blog posts like this one when they get out.

Thanks for reading, catch you in the next one, cheers 🍻
