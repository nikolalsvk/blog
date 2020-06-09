---
title: Do Not Follow JavaScript Trends
description: Stop adopting every little trend you come across
slug: do-not-follow-javascript-trends
date: 2020-06-09
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
published: false
tags:
  - JavaScript
---

![Pineapple on the beach](./cover.jpg)

<div class="photo-caption">
Photo by <a href="https://unsplash.com/@eepeng?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Eepeng Cheong</a> on <a href="https://unsplash.com/s/photos/trends?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</div>

It is one of those days. You typed in [twitter.com](https://twitter.com/) in
your browser and you saw a new tweet from someone on how to use React Hooks.
But, for some reason, your company / team hasn't switched to using Hooks.
Or, maybe you are using them, but not in a new "trendy" way. Maybe you are
using Vue.js or Angular, but this React Hooks is something that is popping up
everywhere, almost starting to show up on your microwave when you are heating
up your dinner.

Since it is one of those days, you start questioning whether what you have in
your codebase is right? Should you maybe refactor that piece of logic with what
you just read? As the question settle down, you start imagining how would that
look in your code.

Now, you feel a sudden urge to use it. You ping your team lead, or you send a
message to your whole team how there is this cool new way of doing things, and
you suggest that y'all start using it.

Spoiler alert: YOU SHOULD NOT.

## Rewriting Your Code

![Rewriting your frontend every six weeks](./rewriting-frontend.jpg)

Some time ago, a cover for an imaginary book surfaced on the [@ThePracticalDev](https://twitter.com/ThePracticalDev/status/715623065078644738/photo/1) Twitter account.
Back in 2016, it was popular to make fun of the ever-changing world of
JavaScript in a bit of different manner than folks do today.

![Interest in frameworks over time](./framework-interest.png)

Psst, I have invented a time machine (don't tell anyone)! Let us quickly travel
back in time to 2016. SWOOOSH! We are there. JavaScript landscape looks like this:

If you are using a JavaScript framework, or you want to use a framework,
Angular.js is probably something you are looking into. But, the news about
Angular 2 that will make you rewrite almost everything is just around the
corner. Also, this new kid on the block - React.js is coming up and getting ripe.
Of course, Vanilla JS and no-framework-folks are there, it is still a trendy
opinion that you can do without jQuery or Angular.js.

Knowing all this, what would you do? Which path would you choose and why? The
answer might seem obvious now that you come from the future - React. But if you
chose Angular.js, couple years down the road, you will get tempted to use new
Angular versions and rewrite your code. If you chose React, you'd be a lucky
winner since everyone is riding the React train nowdays. But, you are now
tempted to drop class components and use functional components with those
sweet, sweet hooks, right? Well, at least it is not a whole new API to learn as
with Angular.js - Angular 2 change, right?

So many choices, so little time. What do to?

To me, it doesn't matter what we choose now or what we chose back in the day.
We will still be tempted or have to rewrite our code later down the road.
Reasons to do it might vary:

- your company was using [insert framework name] and is unable to hire new folks
- you feel old solution is not working out for you anymore, and you want something new
- you succumbed to the industry trends and want to use latest and greatest

Unless, we break the cycle.

## Breaking The Cycle

Constant improvement and shipping a new better version is planted deep inside
our industry. The need to make a more efficient, less complex, prettier, robust
solutions is breathing down our necks. To undermine the idea of continuous
learning and advancement is to go against everything and everyone these days.
I am not going to go that road, but do subscribe to the [newsletter](/newsletter)
if you want to hear more on this in the future.

Idea of having to learn something new is good, and I agree with that, but how
often should you do that? Looking at the world of JavaScript, new idea, blog
post, library, framework and what-not pops up very often. Things become
trending and people quickly try to adopt that. I'm not saying you should not
adopt new things and consider different approaches to a solution, not at all! I
am trying to propose the idea of doing that less often.

Let us get more practical, if not pragmatic. I used
[axios](https://github.com/axios/axios) before, and it works great. You can
test it properly, it is widely supported, it has a lot of internet points
(GitHub stars) and so on. Then, I come across a
[blog post](https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper)
that tells you to replace axios, and roll your own fetching logic. Did I do
this? Of course not, why should I?

After reading the title of the blog post
"[Replace axios with a simple custom fetch wrapper](https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper)", it makes you go through the thought process from the start of this blog post.
Basically, it makes you question your choices.

![Question everything](./question-everything.jpg)

I won't go into details whether you should or should not do as the post tells
you, posts does that pretty well on its own. I can help you with the basic
decision making. Are you happy with axios right now? If the answer is yes, it
is probably best to leave alone this idea of replacing it. Is axios proving
difficult for you or your team? If the answer is yes, then try to do what the
post is telling you and see how that works out.

In short: do not fall for the hype. Try to "feel" what works for you and go
with that. Try not to succumb to flashy new tweets, blog posts, Hacker News
top posts, trending hash tags of what you should or should not do. Read on to find
out how to avoid this Hype Driven Development.

## HDD - Hype Driven Development

Hype is something very real in our industry. Remember NoSQL? Or when everyone
went crazy over Microservices? Or the AI / Machine learning burst? The list
goes on and on. People get excited about new and breakthrough technologies and
ideas. Folks at Gartner did a good job of drawing a Hype Cycle:

![Hype Cycle](./hype-cycle.jpg)

It shows a typical life cycle of a new and emerging technology. Do you recognize
anything that you are using right now that might fall into some part of the
graph? [Ayman](https://medium.com/@aymanarif/the-hype-cycle-bdbb1adec14)
made a more detailed hype cycle graph:

![Detailed Hype Cycle](./detailed-hype-cycle.png)

Remember this when trying to adopt a brand new library / framework.
