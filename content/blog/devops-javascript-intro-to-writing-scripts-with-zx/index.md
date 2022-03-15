---
title: DevOps JavaScript - Intro to Writing Scripts With zx
description: Become a JavaScript DevOps engineers by writing scripts using zx.js.
slug: devops-javascript-intro-to-writing-scripts-with-zx
date: 2022-03-15
coverImage: ./cover.jpeg
blogOgImage: ./og-image.jpg
published: true
tags:
  - JavaScript
  - DevOps
---

So you just read DevOps and JavaScript in the same sentence. Are you mad or madly curious? In any case, you don't put these two together very often. JavaScript was used to add a bit of sprinkle to the web pages back in the day. No way it has its place in DevOps, right? Oh, yes, it does.

JavaScript (and now TypeScript) has poured down into every pore of software engineering. First, it was a frontend thingy. Then, it became a backend thingy (with Node.js). Then internet of things thingy. And now, finally, we arrived at the DevOps train station with our JS luggage. Get off the frickin' train and unpack your bags. You're going to be one step closer to becoming a JavaScript DevOps engineer after you read this post.

</figure>
  <img alt="Old typewriter cover image" src="/cover.jpeg" />
  <figcaption class='photo-caption'>
Photo by <a href="https://unsplash.com/@markuswinkler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Markus Winkler</a> on <a href="https://unsplash.com/s/photos/script?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  </figcaption>
</figure>

## Introducing zx

First, let me introduce you to zx. It is a library that lets you write scripts easily using JavaScript. To get started, you need to install it as a global package with

```bash
$ npm i -g zx
```

Nice, now that you have it locally, let's write the first script to try it out. To use JS inside scripts, we need to put a header that indicates we'll use zx. So open up your favorite editor, create a new file `test.mjs`, and put this on the first line:

```javascript
#!/usr/bin/env zx
```

Excellent, now let's add some JavaScript there:

```javascript
#!/usr/bin/env zx

console.log("Hello from JS script")
```

Let's make it executable by running the following command in the terminal:

```bash
$ chmod +x test.mjs
```

And then, let's run the script with:

```bash
$ ./test.mjs
```

Did your script greet you? Yay, we got it working. If you want to have the file as `.js`, you need to use a different syntax like so:

```javascript
#!/usr/bin/env zx

;(async function () {
  console.log("Hello from JS script")
})()
```

The `.mjs` is handy because you can use top-level `await` calls. But with `.js`, you need to create an `async` function and use `await there`.

You can also run scripts with:

```bash
$ zx test.mjs
$ zx test.js
```

Cool, we went over the basics of using zx. Let's go over some complicated examples and see where zx truly shines. I have an install script in my dotfiles to set up my environment. It primarily deals with the installation of programs I use in my every day. I wrote it in Ruby a while ago, but let's rewrite it in JavaScript below.

## Real use for zx

We are going to create a script that installs a couple of things for us:
vim-plug
ripgrep
zsh and oh-my-zsh
a theme for the terminal
It will also copy dotfiles from my [dotfiles repo](https://github.com/nikolalsvk/dotfiles) into the proper place on the local disk. And, it will add one line to `.zshrc`. "Wow, wow, wow, slow down" - you must be thinking. Sorry, I got a little bit ahead of myself. We'll start with installing ripgrep and learn how to run commands from zx scripts.

### Running commands

To keep it short, [ripgrep](https://github.com/BurntSushi/ripgrep) is your text/regex search buddy. It is super-fast and easy to use. Check it out if you're not using it. Before installing it, let's check if `ripgrep` is available. We don't want to install it if it's already there, obviously. We can run a command from our script `which rg` that should let us know if ripgrep is there or not. Let's try it out:

```javascript
#!/usr/bin/env zx

await $`which rg`
```

Save the script as `install.mjs` and run it via `zx install.mjs`. Did it fail? Nice, this is exactly the point we were aiming for. If you don't have `rg` installed, the command `which rg` will cause the script to fail and exit early. Why? Well, this is how zx works. You can specify a command with `$\`some command\`` and it will return a promise. Basically, it will spawn a child process and run the specified command there. The program will break if the command fails and you don't handle the failed promise. Pretty smart, huh?

OK, so let's handle a case where we don't have `rg` (`ripgrep`) installed. We're going to `try catch` the `which rg` command and install `ripgrep` in the `catch` block. I'm on a Mac, and I use `brew` to install things. You can use whatever package manager you use, I'm not going to tell you what to do, duh. Let's see how we can programmatically install it:

```javascript
#!/usr/bin/env zx

console.log(chalk.blue("Checking if rg exists..."))

try {
  await $`which rg`
  console.log(chalk.green("You already have rg, awesome!"))
} catch {
  console.log(chalk.red("Nope, installing rg (rigrep)"))

  await $`brew install ripgrep`
}
```

Looks neat, huh? Try saving this code into the `install.mjs` file and run it with `zx install.mjs`. The first thing you notice will be a blue text saying - "Checking if rg exists...". Wow, colors. Yeah, you can use `chalk` out of the box with zx and color your output text on the go.

If you don't have `rg`, you will get a red text in your terminal, followed by the command's output responsible for installing `ripgrep`. Again, if you're on Linux, you can substitute `brew` with `apt` or even `sudo apt`. You know your system the best.

If you have rg executable, it will print out "You already have rg, awesome!" in green text, and we are good to go to our next step.

### Not throwing exceptions

We'll explore the `nothrow` method from `zx` now. To show how we can do it, let's first try to implement the copying of `.vimrc` from [my dotfiles](https://github.com/nikolalsvk/dotfiles) to the system `.vimrc` in the home directory.

The idea is to have the `install.mjs` copy the `.vimrc` to `~/.vimrc`, but it should ask whether the user wants to overwrite the existing `~/.vimrc`. We can do this easily with the `cp -i` command, which will ask whether you wish to overwrite the destination you're copying to. Here's the explanation of the `-i` flag:

```bash
$ man cp

...

     -i    Cause cp to write a prompt to the standard error output before copying a file that would overwrite an existing file. If the
           response from the standard input begins with the character ‘y’ or ‘Y’, the file copy is attempted. (The -i option overrides any
           previous -n option.)

...
```

Let's do it like this in our `install.mjs`:

```javascript
#!/usr/bin/env zx

console.log(chalk.blue("Copying .vimrc to ~/.vimrc"))
await $`cp -i .vimrc ~/.vimrc`
```

Save the file and run the `zx install.mjs`. If you run it the first time and there is no file, you won't get the overwrite prompt. But, if you rerun it and it asks you whether to overwrite or not - inputting `n` for no will stop the script. Why? Well, `cp -i .vimrc ~/.vimrc` returns exit code 1 like so:

```bash
$ zx test.mjs
Copying .vimrc to ~/.vimrc
$ cp -i .vimrc ~/.vimrc
overwrite ~/.vimrc? (y/n [n]) n
not overwritten
Error: overwrite ~/.vimrc? (y/n [n]) not overwritten
    at file:///Users/.../test.mjs:4:8
    exit code: 1
```

Your first thought must be - let's do a `try catch` block and catch that command from ending our script. And you are right, it can work. But, we want to try out the `nothrow` method here. Let's wrap our command in it like so:

```javascript
#!/usr/bin/env zx

console.log(chalk.blue("Copying .vimrc to ~/.vimrc"))
await nothrow($`cp -i .vimrc ~/.vimrc`)
```

And then, when we run `zx install.mjs`, we get:

```bash
$ zx test.mjs
Copying .vimrc to ~/.vimrc
$ cp -i .vimrc ~/.vimrc
overwrite /Users/nikolalsvk/.vimrc? (y/n [n]) n
not overwritten
```

So `nothrow` won't make our script end abruptly, and it will silently ignore the "failed" command. How neat! Can we do something else here? You bet we can. Get ready for the bonus round.

### BONUS ROUND: get the OS homedir

We use the `~/` a lot in the previous examples. How can we make it more agnostic and 'right'? Luckily, there's `os.homedir()` to the rescue that we can use and be sure we're safe. Right? Right. Let's refactor our code a bit to use it.

```javascript
#!/usr/bin/env zx

const homeDir = os.homedir()
console.log(chalk.blue(`Copying .vimrc to ${homeDir}/.vimrc`))
await nothrow($`cp -i .vimrc ${homeDir}/.vimrc`)
```

Oh wow, but will it work? You know the drill, save the file, and run `zx install.mjs`. You should get something similar to below:

```bash
$ zx test.mjs
Copying .vimrc to /Users/nikolalsvk/.vimrc
$ cp -i .vimrc /Users/nikolalsvk/.vimrc
overwrite /Users/nikolalsvk/.vimrc? (y/n [n]) n
not overwritten
```

Now everyone who will read your JS scripts will be - I'm lucky to know/hired/worked/hung out with this guy because you're so sweet and caring. But jokes aside, an excellent thing here is that you don't have to explicitly import `os` to use it, `zx` already does it for us, which leads to a clean and brief script to copy a file. Thanks, `zx`, you rock.

Let's try out one more feature from `zx` - the ability to ask questions.

### Asking questions

Let's use our previous example of copying a file, but let's write our logic that will ask the user whether he wants to overwrite the file or not. Thanks to `zx`, we have the `question` method that we can use. Let's try it out like so:

```javascript
#!/usr/bin/env zx

const homeDir = os.homedir()

console.log(chalk.blue(`Copying .vimrc to ${homeDir}/.vimrc`))

if (fs.exists(`${homeDir}/.vimrc`)) {
  const overwrite = await question(
    `Do you want to overwrite ${homeDir}/.vimrc? (y/n [n]) `
  )

  if (overwrite.toLowerCase().startsWith("y")) {
    console.log(chalk.green(`Overwriting ${homeDir}/.vimrc`))
    await $`cp .vimrc ${homeDir}/.vimrc`
  } else {
    console.log(chalk.blue(`Not overwritting ${homeDir}/.vimrc`))
  }
} else {
  await $`cp .vimrc ${homeDir}/.vimrc`
}
```

A lot of things going on here. We first check whether `${homeDir}/.vimrc` exists. If so, we ask the user whether they want to overwrite it. We overwrite the file if the lowercased answer matches 'y'. If not, we print out that the script won't overwrite the file. And finally, if there's no `${homeDir}/.vimrc`, we call the basic `cp` command without the built-in prompt we had before.

If we run the script and say 'y', this is the output:

```bash
$ zx test.mjs
Copying .vimrc to /Users/nikolalsvk/.vimrc
Do you want to overwrite /Users/nikolalsvk/.vimrc? (y/n [n]) y
Overwriting /Users/nikolalsvk/.vimrc
$ cp .vimrc /Users/nikolalsvk/.vimrc
```

And, if we input something else or just press enter, this is what we get:

```bash
$ zx test.mjs
Copying .vimrc to /Users/nikolalsvk/.vimrc
Do you want to overwrite /Users/nikolalsvk/.vimrc? (y/n [n])
Not overwritting /Users/nikolalsvk/.vimrc
```

Cool, we have now gone through almost all of the essential features of `zx`, which are a breeze to use.

## Other features

We covered a couple with our install script. Let's see what else is there.

### Can you `fetch` me that thing?

You also have the `fetch` available to fetch any URL. Try it out with:

```javascript
#!/usr/bin/env zx

const response = await fetch("https://api.github.com/octocat")
console.log(await response.text())
```

After running it, this is what I got:

```bash
$ zx fetch.mjs
$ fetch https://api.github.com/octocat

               MMM.           .MMM
               MMMMMMMMMMMMMMMMMMM
               MMMMMMMMMMMMMMMMMMM      ____________________________
              MMMMMMMMMMMMMMMMMMMMM    |                            |
             MMMMMMMMMMMMMMMMMMMMMMM   | Keep it logically awesome. |
            MMMMMMMMMMMMMMMMMMMMMMMM   |_   ________________________|
            MMMM::- -:::::::- -::MMMM    |/
             MM~:~ 00~:::::~ 00~:~MM
        .. MMMMM::.00:::+:::.00::MMMMM ..
              .MM::::: ._. :::::MM.
                 MMMM;:::::;MMMM
          -MM        MMMMMMM
          ^  M+     MMMMMMMMM
              MMMMMMM MM MM MM
                   MM MM MM MM
                   MM MM MM MM
                .~~MM~MM~MM~MM~~.
             ~~~~MM:~MM~~~MM~:MM~~~~
            ~~~~~~==~==~~~==~==~~~~~~
             ~~~~~~==~==~==~==~~~~~~
                 :~==~==~==~==~~
```

### `cd` your way home

You can use the `cd` command to move around the file system easily. Let's print out the Lord of the Rings calendar you (maybe) didn't know you had on your Unix system:

```javascript
#!/usr/bin/env zx

cd("/usr/share/calendar")

await $`cat calendar.lotr`
```

You should see at least this part:

```
01/05   Fellowship enters Moria
01/09   Fellowship reaches Lorien
01/17   Passing of Gandalf
02/07   Fellowship leaves Lorien
02/17   Death of Boromir
02/20   Meriadoc & Pippin meet Treebeard
02/22   Passing of King Elessar
02/24   Ents destroy Isengard
02/26   Aragorn takes the Paths of the Dead
03/05   Frodo & Samwise encounter Shelob
03/08   Deaths of Denethor & Theoden
03/18   Destruction of the Ring
03/29   Flowering of the Mallorn
04/04   Gandalf visits Bilbo
04/17   An unexpected party
04/23   Crowning of King Elessar
05/19   Arwen leaves Lorien to wed King Elessar
06/11   Sauron attacks Osgiliath
06/13   Bilbo returns to Bag End
06/23   Wedding of Elessar & Arwen
07/04   Gandalf imprisoned by Saruman
07/24   The ring comes to Bilbo
07/26   Bilbo rescued from Wargs by Eagles
08/03   Funeral of King Theoden
08/29   Saruman enters the Shire
09/10   Gandalf escapes from Orthanc
09/14   Frodo & Bilbo's birthday
09/15   Black riders enter the Shire
09/18   Frodo and company rescued by Bombadil
09/28   Frodo wounded at Weathertop
10/05   Frodo crosses bridge of Mitheithel
10/16   Boromir reaches Rivendell
10/17   Council of Elrond
10/25   End of War of the Ring
11/16   Bilbo reaches the Lonely Mountain
12/05   Death of Smaug
12/16   Fellowship begins Quest
```

There are a couple more of `zx`'s feature, and you can check them out on the [official repo on GitHub](https://github.com/google/zx). The README is pretty detailed and can help you extensively with whatever you're trying to build.

## Summing up

Thanks for reading this far, it means a lot to me. Today we learned a lot about `zx`. You are now one step closer to becoming a JavaScript DevOps engineer, congrats 🎉. Do you already feel proud and productive? Nice, glad I helped.

We went over a couple of features of `zx`:

- The ability to call a command with `$\`command\` - it will spawn a process that you need to await. It can also throw an exception you need to catch, so beware of that.
- There's `nothrow` that will make sure the command doesn't break your script.
- We learned about the `questions` and how to make your script interactive.
- There's `fetch` to fetch URLs from the web (and maybe locally?)
- You can navigate with `cd`.

And that is pretty much it for this blog post. Join the [newsletter](/newsletter) because I plan to do all of this but in TypeScript. Yep, the hot thingy everyone is rewriting their codebases to. Also, let me know if you like the idea of DevOps JS, and I'll write more on it.

You can find the script I converted from Ruby to JavaScript in [my dotfiles on GitHub](https://github.com/nikolalsvk/dotfiles). Here's the [full `install.mjs` file](https://github.com/nikolalsvk/dotfiles/blob/master/install.mjs). Leave a star if you like. Close the browser tab quickly if you don't.

Consider sharing the blog post with your friends and colleagues. Maybe someone is just waiting for this type of content. Here's a quick way to do it on Twitter:

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">Did you know you can go beyond Full Stack JavaScript and potentially become a DevOps JS dev?<br><br>Here&#39;s the first step 👇<a href="https://t.co/lRYKJf4SWc">https://t.co/lRYKJf4SWc</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/1503664442097250309?ref_src=twsrc%5Etfw">March 15, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

That's all I have for you today. Catch you in the next one.

Cheers.
