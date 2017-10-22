---
layout: page
title: Projects
permalink: /projects/
---

Cool stuff I do in my free time.

---
### [render_async](https://github.com/renderedtext/render_async)

_Gem for asynchronously loading partials into your view._

I wrote
[a blog post on render_async](http://semaphoreci.com/blog/2017/06/08/speeding-up-rails-pages-with-render-async.html)
that explains how to use it and motivation behind it.

Biggest motivation was that some slow actions throttle the whole page to
load. There were also some code in actions that was blocking the whole page
when it fails and we couldn't do nothing about it failing. By extracting this
problematic code to a separate action and rendering it through render_async,
you save yourself time to load the page and you become unblocked.

---

### [ordinare](https://github.com/nikolalsvk/ordinare)

_Ordinare sorts your Gemfile or just checks whether it's sorted._

Motivation came from working on a big Rails project with lots of gems inside
the Gemfile. Going through those was really difficult at some times and I
figured why not create a gem that can sort it for you.

---

### [LetsMeet](https://github.com/pineapple-devs/lets-meet)

_Create meetings and invite friends from your phone_

I worked with 2 friends on this and we wanted to simplify meeting routine
you're having with your friends by allowing you to invite them through email or
app invitation with few clicks. You can view
[application demo](https://www.youtube.com/watch?v=vOQz4-EOsAQ)
to see how it works. It has it's own API written in Rails, you can find it on
GitHub, it's
[lets-meet-api](https://github.com/pineapple-devs/lets-meet-api).

---

### [congrats-you-broke-the-build](https://github.com/nikolalsvk/congrats-you-broke-the-build)

_Node.js Lambda function for sending SMS to the one who broke the build on
Semaphore CI._

It loads users and their phone numbers from a JSON file stored on
AWS S3 and tries to send them SMS if they break the build on
Semaphore CI. This was an experiment with AWS Lambda and Twilio.
Semaphore is hitting Lambda with request each time a build is
finished on Semaphore. If the build is red and branch is master,
it tries to send SMS to the one who made the build red.

---
