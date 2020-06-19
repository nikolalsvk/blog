---
title: Why Should You Learn Vim in 2020
description: FREE VIM TIPS & TRICKS INSIDE
slug: why-should-you-learn-vim-in-2020
date: 2020-06-19
published: true
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
tags:
  - Vim
---

You probably heard of Vim, the almighty text-editor that is everywhere and
a place where [people get trapped from time to time](https://stackoverflow.com/questions/11828270/how-do-i-exit-the-vim-editor).
If you are hearing from your local DevOps engineer how Vim is great and awesome, then you
probably thought about giving it a try. But why do it now? It's 2020, doesn't everyone use
VSCode already?

Well, if you take a look at the
[StackOverflow survey for 2019](https://insights.stackoverflow.com/survey/2019#technology-_-most-popular-development-environments)
about most popular development environments, Vim is still there on the 5th
place, with around 25% of Web Developers using it. This is pretty neat
considering the first Vim release happened almost 30 years ago (yeah, you read
that right, Vim was first released in 1991).

## Brief history of Vim

To better understand why and how Vim got so popular, it is best to look into
the roots of how it all started. Before `vim` there was `vi`, before `vi`
there was `ed`. What are all of these? Let us dive and figure out.

### Punch cards and line editors

It might be obvious today why we have text editors and fully-fledged IDE
(Integrated Development Environment), but what did we have before that?
As you may know, early forms of programming involved putting [papers with
holes (punch cards)](https://en.wikipedia.org/wiki/Punched_card) inside a
computer. Order in which you put these in was very important. For example, this
is a picture of 4.5 megabytes data, stacked in 62500 punch cards. Imagine
dropping that and having to stack it again.

![Punch card stack](./punch-card-stack.jpg)

<div class="photo-caption">
  OK, mom, I'll come down, just need to re-stack my new blog post
</div>

This proved a bit inefficient as computer power and programming
evolved, and then there came what are called "line editors". One of great
examples of this is a [`ed` editor](<https://en.wikipedia.org/wiki/Ed_(text_editor)>).
If you are on Linux or Mac OS, open your terminal and type `ed` and you
will get a simple line editor. If you are amazed by this finding (as I was), you can write
a file by typing `a` and pressing enter, then write your text. Typing `.`
following an enter will exit the append (insert) mode. Then, to write a file, you can
type `w myfile.txt` and press enter and lastly write `q` and enter to exit.

```
# ed
a
Hey there!
I am using ed right now, how cool.
OK, that's enough.
.
w myfile.txt
64
q
```

As you may notice, there are similarities between working with `ed` and with
today's `vim`.

### Vim's dad - The Vi

After ed

So why would you consider
something that is almost about to throw its 30th birthday party? I would say
speed and constant learning.
