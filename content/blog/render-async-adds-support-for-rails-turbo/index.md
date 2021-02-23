---
title: render_async Adds Support for Rails Turbo
description: Read about changes in the new version and how Turbo is supported.
slug: render-async-adds-support-for-rails-turbo
date: 2021-02-23
coverImage: ./cover.jpg
blogOgImage: ./og-image.jpg
published: true
tags:
  - Rails
  - JavaScript
  - render_async
---

This blog post will explain all new features and how they came to be in the latest [2.1.9 version](https://github.com/renderedtext/render_async/releases/tag/2.1.9).

![Turbo](./cover.jpg)

<div class="photo-caption">
  <span>Photo by <a href="https://unsplash.com/@she_sees?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Charlotte Coneybeer</a> on <a href="https://unsplash.com/s/photos/turbo?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
</div>

We will start of with the new Turbo support.

## ⚡️ Turbo support

<div align="center">
  <img src="./turbo-kid.gif" alt="Turbo dancing" />
</div>
<div class="photo-caption">
  render_async joins the Turbo party
</div>

The new [Turbo](https://github.com/hotwired/turbo-rails) is actually a
continuation of the
[Turbolinks](https://github.com/turbolinks/turbolinks).
If you forgot about Turbolinks - it allows you to bring a single-page
experience into your application without too much fuss.

What Turbo is doing is following up on the idea of Turbolinks with more
concepts. With Turbolinks, you can navigate the pages, and the Turbolinks would
cache them, so you feel that everything is smooth like in a single-page app.
Moving around the browser's history like that was revolutionary back in the day
(I believe it is still interesting).

But how does it really work? The parts of the page are cached so when you
navigate back to the page, you instantly get a preview until the actual page
request is finished. This draws the illusion of a single-page app. Now, this
concept is extracted into _Turbo Drive_. The
[Turbo Drive](https://turbo.hotwire.dev/handbook/drive)
part of the Turbo is what we are interested in.

But how does it really work? The pages are cached, so when you navigate back to
the page, you instantly get a preview until the actual page request finishes.
By showing a preview of the page, Turbolinks draws the illusion of a
single-page app. Now, this concept moved into Turbo Drive. And we are precisely
interested in the [Turbo Drive](https://turbo.hotwire.dev/handbook/drive) part
of the Turbo.

All this magical rendering is where render_async comes in. Since render_async
makes async requests after the page loads, we have to support this somehow.
When you visit a page that has Turbo enabled and is cached inside Turbo, you
will first get a preview of the page. In the meantime, a request is sent to the
backend to get the new version of the page. Then, when the new version arrives,
it will replace it with the preview version.

To handle these effects and make render_async work, we first suggested to put
`data-turbolinks-track="reload"` or now `data-turbo-track="reload"` to the
render_async calls. These data attributes stop Turbo from doing its magic, which
is not something every user wants. Then, a clever contribution from [_eclemens_](https://github.com/eclemens)
made it possible to have the Turbo functionality and have render_async working.

The idea is to have render_async work after `turbo:load` happens - or in plain
words - when Turbo loads the page. But, we also need to stop render_async from
performing when the preview is showing with the Turbolinks. All you need to do
is set the `turbo` configuration like so:

```rb
RenderAsync.configure do |config|
  config.turbo = true # Enable this option if you are using Turbo
end
```

## 🔮 Future Turbo work

Yes, the render_async is working with the Turbo. But, we want to make it work
better. Right now, there is a slight itch that's been bugging other users and
me. After you get the Turbo preview and the page replaces the preview, the
render_async call performs and replaces the preview values.

It probably sounds a bit confusing, so I will show a GIF that should illustrate it better:

![render_async Turbo loading issue](./render-async-turbo.gif)

Notice how when we click on either of the links, we get the preview of the page with the "`render_async here :wave:`" text. Then, the page is fetched from the backend and render_async is triggered once more. At that point, we see the "`...Loading /render_async/wave`" part. And finally, after the wave request finishes, the page is back to its state as in the preview.

A future improvement would be if we could skip the showing of the loading indicator for render_async. It would be nice to show a preview inside the render_async container until render_async fetches the freshest data from the request.

If you have any ideas or would love to contribute, let me know on our [Discord server](https://discord.gg/SPfbeRm) or ping me on [Twitter here](https://twitter.com/nikolalsvk). Thanks a lot.

## 🐛 Minor bug fix

There was a problem with the configuration options in the gem. We fixed it easily
by a simple rename, but the weird thing is how it was almost unnoticed. You are good
now to use various [configuration options](https://github.com/renderedtext/render_async#configuration-options).

There were also small updates to the documentation, but nothing too drastic
there - just small typo fixes.

## Final thoughts

That is it for this version. Thanks, everyone, for contributing. Consider
joining the [Discord server](https://discord.gg/SPfbeRm),
that way, we can make it even better.

Also, feel free to share this on Twitter with friends and coworkers below:

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">I released the 2.1.9 version of render_async today. Check out what&#39;s new below 👇<a href="https://t.co/aLpAKd9f44">https://t.co/aLpAKd9f44</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/1364196876350853128?ref_src=twsrc%5Etfw">February 23, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I will see you in the next one, cheers.
