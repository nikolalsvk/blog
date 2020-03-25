---
title: render_async Fires Events By Default
description: Get a grip of when your async requests finish in new version of render_async
slug: render-async-fires-events-by-default
date: 2020-03-25
coverImage: ./cover.jpg
blogOgImage: ./og-image.png
tags:
  - rails
  - javascript
  - render_async
---

The new version brings a couple of good news in these rough times.

![Girl celebrating birthday by blowing candles](./cover.jpg)

<div class="photo-caption">
Photo by <a
href="https://unsplash.com/@hngstrm?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Henry
&amp; Co.</a> on <a
href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</div>

## Explicit way to fire events on load

Before this feature got introduced, the only way to register when
render_async finishes is to 
[give it an event name](https://github.com/renderedtext/render_async#passing-in-an-event-name) 
like so:

```ruby
<%= render_async users_path, event_name: "users-loaded" %>
```

And then in your JavaScript code, you could do something like this:

```javascript
document.addEventListener("users-loaded", function(event) {
  console.log("Users have loaded!")
  console.log(event)
});
```

Let's say you wanted to catch an error when it happens. 
You had to [pass in `error_event_name` parameter](https://github.com/renderedtext/render_async#handling-errors):

```ruby
<%= render_asyc users_path, error_event_name: 'users-error-event' %>
```

Later, you can catch it like so:

```javascript
document.addEventListener('users-error-event', function(event) {
  // I'm on it
  console.log("Loading users failed!")
  console.log(event)
})
```

From version
[2.1.5](https://github.com/renderedtext/render_async/releases/tag/2.1.5), you
can easily catch these events without passing these parameters

## 🔥 Firing events on load and error by default

render_async now fires 2 events:

- `render_async_load` - if all goes well and a request is finished successfully
- `render_async_error` - if something goes south with loading the request

Now all you have to do is call render_async:

```ruby
<%= render_async users_path %>
```

And write JavaScript to catch potential events:

```javascript
document.addEventListener('render_async_load', function(event) {
  console.log('Async partial loaded!', event);
});
document.addEventListener('render_async_error', function(event) {
  console.log('Async partial could not load!', event);
});
```

## 👁 Making DOM element available in events

Some users were having a hard time establishing which DOM element was the
event fired. In 2.1.5 version, you can now access the container where your
request loads easily.

We'll take previous example with event loading:

```javascript
document.addEventListener('render_async_load', function(event) {
  console.log('Async partial loaded in this container:', event.container);
});
document.addEventListener('render_async_error', function(event) {
  console.log('Async partial could not load in this container:', event.container);
});
```

## Bugfix for toggle event handlers

A [bug](https://github.com/renderedtext/render_async/issues/90) when toggle
event handlers were added before the DOM loaded is
[fixed](https://github.com/renderedtext/render_async/pull/105).

Now you can use render_async to [easily show content on click](https://github.com/renderedtext/render_async#toggle-event) or another
event.

## Wrap up

Big thanks to all contributors working on this release, thank you for helping me:

- [colinxfleming](https://github.com/colinxfleming)
- [maximgeerinck](https://github.com/maximgeerinck)
- [lipsumar](https://github.com/lipsumar)

That's, it folks, download the gem and try it out. Show some love and
[star](https://github.com/renderedtext/render_async) the repo.

P.S. If you like my work on this gem so far, consider sponsoring me on
[GitHub Sponsors](https://github.com/sponsors/nikolalsvk) or through
[PayPal](https://www.paypal.me/nikolalsvk)
