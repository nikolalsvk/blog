---
title: render_async 2.1.6 released
description: Read a detailed dive into all the new changes inside the 2.1.6 version.
slug: render-async-2-1-6-released
date: 2020-05-10
coverImage: ./cover.jpg
blogOgImage: ./og-image.jpg
published: true
tags:
  - Rails
  - Ruby
  - JavaScript
  - render_async
---

In this post, we will go through all the changes that are in the new
[2.1.6 version](https://github.com/renderedtext/render_async/releases/tag/2.1.6).

![Skiatos](./cover.jpg)

<div class="photo-caption">
Photo by <a href="https://unsplash.com/@nickkarvounis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nick Karvounis</a> on <a href="https://unsplash.com/s/photos/greece?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</div>

Some of the new changes and bug fixes were pretty tricky to solve. I wanted to
write a blog post to have detailed hows and whys of how I fixed them.

The new version mainly brought bug fixes:

- [Polling now stops when page navigates using Turbolinks](#polling-now-stops-when-page-navigates-using-turbolinks)
- [Default header `X-Requested-With` is now set](#default-header-x-requested-with-is-now-set)
- [Events delegate now works when toggling](#event-delegation-now-works-when-toggling)
- [Nested partials now load with Turbolinks](#nested-partials-now-load-with-turbolinks)

Let us dive into details of how each was fixed:

## Polling now stops when page navigates using Turbolinks

If you have not heard about [Turbolinks](https://github.com/turbolinks/turbolinks) before,
it is an excellent gimmick for your Rails application that makes it behave like a single-page
application. It gracefully avoids full page loads when you click a link, for
example. Turbolinks does this by fetching a page, swapping in its `<body>` tag,
and merging its `<head>` with existing content on the page. The gem has been well
adopted in the Rails world, and when you do `rails new my-awesome-app`, it comes
equipped with Turbolinks gem from the start.

Before 2.1.6 version, if you used [render_async's polling feature](https://github.com/renderedtext/render_async#polling),
render_async did not handle navigation changes with Turbolinks. For example,
if your page started polling and you clicked a link, it wouldn't stop polling.
The issue with polling sucked big time! Fortunately, in the new version, this
is no more!

There is no more polling issue because we now call `clearInterval` if the
`turbolinks:visit` event happens:

```javascript
$(document).one("turbolinks:visit", function () {
  if (typeof _interval === "number") {
    clearInterval(_interval)
    _interval = undefined
  }
})
```

## Default header `X-Requested-With` is now set

If you are using Vanilla JavaScript part of the gem (you don't have jQuery in your
project, or you want Vanilla JS for some reason), each request was missing
`X-Requested-With` header. This header is important and is set by jQuery by
default. It is set by default because some servers check this header as a
precaution from CSRF attacks. More about CSRF attack and `X-Requested-With`
header can be found in
[this great blog post](https://markitzeroday.com/x-requested-with/cors/2017/06/29/csrf-mitigation-for-ajax-requests.html).

Fix was this was pretty easy and straightforward:

```javascript
request.setRequestHeader("X-Requested-With", "XMLHttpRequest")
```

## Event delegation now works when toggling

If you wanted to [trigger the loading of render_async](https://github.com/renderedtext/render_async#toggle-event), you could use any element to do so. For example, you wanted to load comments
on your blog with render_async you would so something like this:

```erb
<!-- app/views/posts/show.html.erb -->

<%= render_async comments_path, toggle: { selector: '#comments-button',
                                          event: :click } do %>
  <a href='#' id='comments-button'>Load comments</a>
<% end %>
```

The method above worked fine if you did not have any other events depending on that
link click. But issue occurred to one user when he tried
[toggle feature on tabs](https://github.com/renderedtext/render_async/issues/109)
in his UI. He wanted to load content when the user was changing tabs in
his app. Line `event.preventDefault()` inside toggle logic was stopping the changing of
tabs. Events did not delegate to the tab-changing logic, and the tab was never
changed. Fortunately, in the new 2.1.6 version, this is not happening anymore!

## Nested partials now load with Turbolinks

Problem with nested partials was the last moment discovery by [ye-ling-aung in his comment](https://github.com/renderedtext/render_async/issues/70#issuecomment-626219698).
Nested partials did not load with Turbolinks. If, for some reason, you needed to
[nest render_async calls into one another](https://github.com/renderedtext/render_async#nested-async-renders),
you could do it quickly. The problem occurred when the page loaded with Turbolinks. The top-level
render_async call got rendered, but the nested calls below did not. It was because render_async
loading logic is triggered when `turbolinks:load` event gets triggered.
Triggering loading on `turbolinks:load` is fine for the top-level (initial)
render_async call. But, if you have a nested call, it will wait for
`turbolinks:load`, which will not happen, because the page already loaded.

In order to have nested calls render, I added a piece of logic which checks whether the document
state is either 'complete' or 'interactive':

```javascript
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  // Call render_async rendering logic
}
```

This way, when initial render_async calls loads and renders nested calls, they
are sure to be performed.

## Final thoughts

Fixing and shipping these fixes was such a relief! I am thankful and glad for
everyone that kept using render_async that were having these issues. I also
hope that more people will try out the new version and report if they have any
problems!

P.S. If you like my work on this gem so far, and you want me to keep improving
and maintaining it, consider sponsoring me on
[GitHub Sponsors](https://github.com/sponsors/nikolalsvk) or through
[PayPal](https://www.paypal.me/nikolalsvk/9.99).
