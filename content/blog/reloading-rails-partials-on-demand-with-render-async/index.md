---
title: Reloading Rails Partials on Demand with render_async
description: Refresh parts of your page using the new version of render_async.
slug: reloading-rails-partials-on-demand-with-render-async
date: 2020-10-27
coverImage: ./cover.jpg
blogOgImage: ./og-image.jpg
published: true
tags:
  - Rails
  - Ruby
  - JavaScript
  - render_async
---

The new version of render_async is out, and one of the most requested features is out with it as well!
Read on to find out about the novelties in the [new 2.1.8 version](https://github.com/renderedtext/render_async/releases/tag/2.1.6) of the gem.

![Niagara Falls](./cover.jpg)

<div class="photo-caption">
Photo by <a href="https://unsplash.com/@vishweshji?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vishwesh Jirgale</a> on <a href="https://unsplash.com/s/photos/niagara-falls?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</div>

A quick overview of the recent changes:

- [Refresh Rails partials on demand](#refresh-rails-partials-on-demand)
- [Start polling immediately when the toggle is used](#start-polling-immediately-when-the-toggle-is-used)
- [DRY up the code with new configuration options](#dry-up-the-code-with-new-configuration-options)
- [Fix start and stop events](#fix-start-and-stop-events)

That's it, let's jump into details of each change below.

> 👂 Psst! We have a [render_async Discord server](https://discord.gg/SPfbeRm). Join us there.

## Refresh Rails partials on demand

As you might already know, render_async loads partials asynchronously after
your page has loaded. Loading of partials in an async way is excellent and
helpful, but the gem users wanted more power and control. After so many
different requests for this, we implemented the feature to manually refresh the
already loaded partial on the page without reloading the whole page.

You can do this easily by dispatching an event with a "refresh" name to the
render_async HTML container. Let's show this on an example where we load
comments in a partial:

```erb
<%= render_async comments_path,
                 container_id: 'refresh-me',
                 replace_container: false %>

<button id="refresh-button">Refresh comments</button>

<script>
  var button = document.getElementById('refresh-button')
  var container = document.getElementById('refresh-me');

  button.addEventListener('click', function() {
    var event = new Event('refresh');
    // Dispatch 'refresh' on the render_async container
    container.dispatchEvent(event)
  })
</script>
```

Now, the render_async will load comments on page load. But, if the user wants
to reload the comments section, she can click the "Refresh comments" button. The
button will then emit the "refresh" event to the render_async's container.

One thing to note is that you need to pass in the `replace_container: false`.
Passing this option will save the original render_async HTML element so you can
dispatch the "refresh" event on it. To find out how you can enable this
globally, so you only write it in one place, see the [configuration options](#dry-up-the-code-with-new-configuration-options).

Working on this feature and solving so many people's problems with this was
amazing. I hope you find it useful in your routine.

## Start polling immediately when the toggle is used

We added a new feature to the existing combination of features. Just in case
you weren't aware, you can do [HTML polling with render_async](https://github.com/renderedtext/render_async#polling).
On top of that, we added a feature where you can start and stop polling on
demand. This is doing a great service to users, but some of the users wanted to
start polling immediately as the page loads, not to wait for the user to
trigger polling.

Luckily, we added a feature that allows you to specify to start polling on page load:

```erb
<a href='#' id='comments-button'>Toggle comments loading</a>
<%= render_async comments_path,
                 toggle: { selector: '#comments-button',
                           event: :click,
                           start: true },
                 interval: 2000 %>
```

The code above should render the "Toggle comments loading" button, and start
polling as soon as the page is rendered. This is all possible by adding the
`start: true` option to the `toggle` hash.

## DRY up the code with new configuration options

Finally, some new configuration options landed in the latest 2.1.8 version. So,
what is new? If you needed to set `nonce: true` with render_async, you could
now do this globally. Also, if you are about to use our new feature with
refreshing partials, you will benefit from setting `replace_container: false`
in one place.

You can do this in your initializers or wherever you find comfortable by doing:

```rb
RenderAsync.configure do |config|
  config.nonces = true # setting it to true, all render_asnyc javascript_tag elements receive nonce: true
  config.replace_container = false # setting it to false, the original render_asnyc container is kept
end
```

To figure out why you would need `replace_container: false`, please read the
first section of this blog post about [refreshing Rails partials](#refresh-rails-partials-on-demand).

If it is your first time hearing about this, we also have other
[configuration options in the docs](https://github.com/renderedtext/render_async#configuration-options).

## Fix start and stop events

There were problems with event listeners for `async-start` and `async-stop`
events. Those events served to control polling through events. Since those
event listeners were set up as soon as the render_async JavaScript code got
evaluated, they didn't get registered if you put `content_for :render_async`
in the head of your pages.

In the new version, we made sure these event listeners registered after the
page has fully loaded. If you have this problem, you can safely put back
`content_for` in the head, and everything should work fine.

## Final thoughts

Do not forget to star 🌟 the project and share it with your friends and
coworkers if you find it useful.

Releasing a new version, polishing the README, and working on new features was
a blast! Thanks to everyone that helped and keep doing the great work on
contributing. Please join the [Discord](https://discord.gg/SPfbeRm) if you are
using this gem. That way, we can make it even better!

P.S. 💸 If you like my work on this gem so far, and you want to give me some juice
and motivation to keep improving and maintaining it, consider sponsoring me on
[GitHub Sponsors](https://github.com/sponsors/nikolalsvk) or through
[PayPal](https://www.paypal.me/nikolalsvk/9.99).

Also, feel free to share this on Twitter with friends and coworkers below:

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">I just released a new version of render_async with a cool feature. Read all about it below ⏬<a href="https://t.co/crECfBrtn4">https://t.co/crECfBrtn4</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/1321087060854378497?ref_src=twsrc%5Etfw">October 27, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
