---
title: A Guide to Intersection Observer
description: Let's see how to use Intersection Observer API to determine whether the DOM element somehow intersects with the viewport, or another element
slug: intersection-observer-guide
date: 2022-08-31
canonical: https://uploadcare.com/blog/intersection-observer-guide/
canonicalName: Uploadcare
coverImage: ./cover.webp
blogOgImage: ./cover.webp
published: true
tags:
  - JavaScript
  - Browser API
---

At some point during your frontend career, you probably had to or wanted to, figure out where an element is related to the scrolling position of the user. If not, don’t worry, I believe this will still be interesting to you, because it might pop some ideas and give you inspiration for your projects. Today, we will go through the Intersection Observer API — an easy way to determine whether the DOM element somehow intersects with the viewport, or another element.

## Why Intersection Observer?

Throughout the frontend history, detecting when something is intersecting with another thing was tricky. Often, hand-crafted solutions were unreliable, to the point it caused some visible impact on users’ browsers and websites. Today, we are lucky to have the Intersection Observer API, but why? What were the main drivers behind this development? Let’s look at some examples of how things were done before.

The [lazy loading technique](/blog/lazy-loading-images/) is one example of where developers want to know when a DOM element is entering the viewport. To lazy load an image, you have to know whether a user is relatively close to the image position on the page as they are scrolling. You could achieve this by hooking up the scroll event, and calling [`getBoundingClientRect` method](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

The `getBoundingClientRect` would return an object providing information about the size of an element and its position relative to the viewport. Then, you could figure out whether to trigger the download of the image your user wants to see. Or, you could trigger a request to notify that the user just viewed an image or specific element on the page.

This solution was used over and over in the past. However, this solution was often sluggish because calling `getBoundingClientRect` forces a reflow of the page. The reflow is a process when the browser needs to re-calculate the position, and dimensions of the elements on the page. If called often, browsers and computers can only take so much heat, and will eventually start to become laggy.

Here’s a small codepen example of how you can tap into the scroll listener and get the data about the desired element:

<iframe height="600" style="width: 100%;" scrolling="no" title="getBoundingClientRect to get scrolling data" src="https://codepen.io/nikolalsvk/embed/WNzpJZz?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/nikolalsvk/pen/WNzpJZz">
  getBoundingClientRect to get scrolling data</a> by Nikola Đuza (<a href="https://codepen.io/nikolalsvk">@nikolalsvk</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

For this exact reason, the Intersection Observer API was introduced in Chrome 51. What makes this API better than the approach with the `getBoundingClientRect`, is that it provides a way to asynchronously observe changes in the intersection of a target element with another element. That way, when you use Intersection Observer, you’re not stressing the browser and the page, as much as you are with the `getBoundingClientRect` approach.

Awesome, now that we went through the backstory of how Intersection Observer came to be, let’s dive in and see how we can use it properly.

## How to use the Intersection Observer?

To get the best idea of how to use an intersection observer, let’s dive right into how to call it in code:

```js
const options = {
  root: document.getElementById("some-id"),
  rootMargin: "0px",
  threshold: 1.0,
}

const observer = new IntersectionObserver(callback, options)
```

The IntersectionObserver constructor receives two arguments:

- `callback` — a callback function that gets called whenever a threshold is crossed in any direction.

- `options` — an object with additional configuration.

The `options` object contains following fields:

- `root` — it pinpoints an element that serves as a viewport, and must be an ancestor of the target element (we will show later how to target an element). If you leave this option out, the observer will default to the browser viewport.

- `rootMargin` — it tells the observer when to trigger the intersection between the root and the target element. Here, you can put values like you usually do for a margin in CSS.

- `threshold` — this can be a single number, or array of numbers. The threshold indicates at what percentage of the target element’s visibility you want the provided callback to get called. So, if you want to lazy load an image only when a user scrolls 25% of it, then you can put the value of `0.25` there. If you want some logic to be triggered, both at 25% and 50% of visibility of the target, then you put `[0.25, 0.5]` array here.

Cool, now we know what the constructor receives, but how do we actually target an element to be observed? Let’s find out through an example:

```js
const target = document.getElementById("target-element")
observer.observe(target)
```

Nice, now when our element with the ID `target-element` intersects with the root element we set, the callback will get called. Naturally, we should look into how to write a proper callback for the Intersection Observer:

```js
const intersectionCallback = (entries, observer) => {
  entries.forEach((entry) => {
    // you can find out easily if target is intersecting by inspecting `isIntersecting` property
    if (entry.isIntersecting) {
      console.log(`Hey, I'm intersecting`)
    }
  })
}
```

The callback receives a list of entries that are of [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) type. Having a list as the first argument means that one observer can observe multiple target elements. Each entry has a set of fields, but one that’s most often used is the `isIntersecting`. In the example above, we log to the browser console whenever our target is intersected.

The second argument passed to the callback is the observer itself. This can be useful when you want to stop observing the target after an intersection — then you call `observer.unobserve()` in the callback.

Great, now that we went through some basics on using the Intersection Observer, let’s put it to use and build something.

## Using Intersection Observer

Let’s build a working example where a video starts playing as you scroll into it, and it pauses as you scroll away. To achieve this, we’ll use the powerful Intersection Observer we just showcased in the section above.

To start off, we’ll need a video inside HTML. I will share the important HTML, and full JS code if you want to try it out. There will also be an interactive demo you can try out at the bottom. Here’s the simplified HTML:

```html
<video muted controls>
  <source
    src="https://ucarecdn.com/33fa1b5d-a164-4178-908c-5a51f872fcef/video.webm"
    type="video/webm"
  />
  <source
    src="https://ucarecdn.com/1b63a65c-7796-4b23-a6fc-bb751f1221ed/video.ogg"
    type="video/ogg"
  />
  <source
    src="https://ucarecdn.com/ec3f39c9-be9f-4231-a4db-d7fcbd209e71/video.mp4"
    type="video/mp4"
  />
</video>
```

In the HTML we simply put a `video` tag with several sources. And, finally, our Intersection Observer code:

```js
let video = document.querySelector("video")

let observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio !== 1 && !video.paused) {
        video.pause()
      } else {
        video.play()
      }
    })
  },
  { threshold: 1 }
)

observer.observe(video)
```

Here, we are getting the video element using `document.querySelector(’video’)`. Then, we define our Intersection Observer instance with a callback and a threshold of `1`. The threshold of `1` means that our callback will trigger when the video is fully visible, or it stops being fully visible.

In our callback, we check whether the video is not fully visible, with the `entry.intersectionRatio !== 1` check. The `intersectionRatio` indicates which portion of the element is visible, and it goes from 0 to 1 — where 1 means it is fully visible. Everything between 0 and 0.99 means that the element, video element in our case, is hidden a bit. There, we also check whether the video is paused. If the video is playing and it is hidden a bit — we pause it.

Now, if the video’s `intersectionRatio` is 1, we fall into the else branch and we play the video.

This is a cool trick you can try out on your project. It doesn’t require a lot of code, and can be a good user experience. But remember to not autoplay videos by default — it can be annoying to users. Here’s a demo you can play around with:

<iframe height="600" style="width: 100%;" scrolling="no" title="Play &amp; pause a video based on scrolling" src="https://codepen.io/nikolalsvk/embed/NWYgMJa?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/nikolalsvk/pen/NWYgMJa">
  Play &amp; pause a video based on scrolling</a> by Nikola Đuza (<a href="https://codepen.io/nikolalsvk">@nikolalsvk</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Summing up

I hope you had a great time reading, and trying out the Intersection Observer API. If you learned a thing or two, then I call this blog post a success. Let’s go over the things we learned today:

1.  Intersection Observer can be used to detect intersections between elements, or between an element and the viewport.

2.  You use the API by instantiating the observer with `new IntersectionObserver(callback, options)`.

3.  The `callback` parameter is a method that receives an array of entries, and the observer itself.

4.  The `options` parameter is an object that can consist of `root`, `rootMargin`, and `threshold` properties. This parameter is optional.

5.  The instantiated observer can observe an element you pass to it with `observer.observe(element)`.

That’s it! You’ve learned the basics. If you’re looking for something more advanced, you can always play around with the threshold option that Intersection Observer receives. Or, you can dabble with the [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) object for extra information when the intersection happens. If we tried to cover that, this blog post would be a lengthy one, so we will save it for another time.

Until then, thanks for reading, and catch you in the next one.
