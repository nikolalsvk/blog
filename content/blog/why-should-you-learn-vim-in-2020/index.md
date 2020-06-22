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

To better understand why and how Vim got (and is) so popular, it is best to
look into the roots of how it all started. Before `vim` there was `vi`, before
`vi` there was `ed`. But, what are all of these two or three letter words, and
what is the story behind it? Let us dive in and figure out.

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

After `ed`, then came the `em` - [the "editor for mortals"](http://www.eecs.qmul.ac.uk/~gc/history/).
It could do similar things as `ed`, but it be 'less cryptic' and built for
regular people. Based off of `em`'s code, Bill Joy developed `ex` which
stands for "extended ed"! This was big, because `ex` had, besides the previous
modes, the `visual` mode which will show the whole file on your screen. You
must be thinking - duh, how didn't they think of that earlier? Well, to have
that thing show up on computers in those days was pretty tricky and some
considered it a resource hog. But, at that point, the benefits had outweighed
objections and having a file opened on your screen as you edit it became
today's a standard.

![Vi editor](./vi.png)

And like that the **vi**sual mode was born. Later, the executable `vi` was
introduced in operating systems, but you can still access `ex` commands by
typing `:` in `vi`/`vim`. The `ex` was released in 1976, and the `vi`
executable was released in 1979. 40-something years ago! But, how did `vim` came to life?

### The Imitation Game

Couple of years later, a lot of `vi` clones emerged. One of them was "Vi
Improved" which was created by Bram Moolenaar - the name you now see when you
try to open `vim` in your terminal. Bram used a clone of `vi` called `STEVIE`
(nice name, BTW), and noticed that it lacks many of `vi`'s commands. He added
some new features and made it compatible with `vi` and released it under the
name "Vi Improved". The name `vim` came in the version 2.0 in 1993 and stayed
like that until present day.

### Half a century of contributions

If you take a look at the essential commands to move around in Vim: `h`, `j`,
`k`, and `l`, these all pull roots from the old `vi` days. The Bill Joy's keyboard
at that time didn't have cursors to move around. Also, the `ESC` key was in the place
of today's `TAB` key.

[ADM 3A keyboard](./adm-3a-keyboard.jpg)

Commands to replace text like `:%s/text_to_replace/text_to_replace_it_with/` is
also something from that era. Having to type `:` in order to perform a command
was an answer to `ed`'s complete silence when you enter the editor.

What I am trying to say is that `vim` is an effort of over half a century of
good idea accumulation, putting lots of effort on being backwards compatible.
Yes, good features probably made Vim famous. But what kept Vim in the loop is
the compatibility with almost everything you can think about. Wherever you SSH
today, you can start the Vim session, or at least Vi session.

### Other sweet pros

Yes, you get the 'speed' of which you edit and jump around. Yes, you
get that close-to-the-barebone-metal felling of editing inside your terminal.
