---
title: Rails HTML Polling Without Writing JavaScript?
description: Write simple HTML polling by writing Ruby on Rails ONLY.
slug: rails-html-polling-without-writing-javascript
date: 2019-05-14
canonical: https://medium.com/@nikolalsvk/rails-html-polling-without-javascript-dc28200d2a71
canonicalName: Medium
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
tags: ["rails", "javascript", "render_async"]
---

Write simple HTML polling by writing Ruby on Rails **ONLY**.

![Man pulling rope](./cover.jpg)

<div class="photo-caption">
Photo by <a href="https://unsplash.com/photos/Q8FHN3qSq2w?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Stijn Swinnen</a> on <a href="https://unsplash.com/search/photos/pull?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</div>

If you did Rails, you’ve probably coded one or two polling mechanisms back in the day. Midway through writing it, an annoying feeling starts creeping in when you have to write that extra JavaScript after coding the Rails part on the server. If you get that feeling, (and even if you don’t), there is now a way to do it without actually writing any JS code. First, let’s dive into idea of polling below.

## What is polling?

Polling is a process when a client (our browser in this case) **continually** sends requests to a server to check if updates are available. Polling is what is called _pull technology_. It’s often used to emulate _push technology_. Before we go on, let’s describe these terms:

### Pull technology

Definition: Initial request for data originates from a client, and then is responded to.
Example: A web browser requests a web page.

### Push technology (also known as push notifications)

Definition: A server publishes data, and a client that is subscribed is receiving data.
Example: A email server transmits an email to an email client.

So, instead of doing publish / subscribe mechanism, where the server sends data updates and we listen for those updates, we are going to repeatedly ask the server whether changes did actually happen.

## How to do polling in Rails?

OK, now that we explained what polling is, let’s get down to business. In order to do polling in Rails you will need to write 2 things:

1. Controller action that will be polled and the response/view it returns
2. JavaScript that will periodically check your controller action for changes and make necessary updates in the UI

**First** part is pretty straightforward. Let’s say we have a website that show’s movies and their ratings. Rating of a movie changes constantly, and we want to keep the user updated for any rating change that happens. For this case, we will create a _rating_ action inside the Movies controller.

```ruby
# app/controllers/movies_controller.rb
class MoviesController < ApplicationController
  # somewhere inside Movies controller
  def rating
    @rating = @movie.rating

    render partial: 'movie_rating'
  end
end
```

Then, we can create a partial for the movie rating like this, so we can show it nicely to the user:

```erb
<!-- app/views/movies/_movie_rating.html.erb -->
Movie rating: <%= @rating %>
```

**Second** part can be a little annoying sometimes. We need to write JavaScript on our frontend that will continuously query the server action we defined. But, it also needs to update the page so the changes can be reflected.

```html
<!-- app/views/movies/show.html.erb -->

<div id="rating">Loading rating...</div>

<script>
  const checkRating = () => {
    fetch("<%= movie_rating_path(@movie) %>")
      .then(response => response.text())
      .then(response => {
        document.getElementById("rating").innerHTML = response
      })
  }
  setInterval(checkRating, 2000)
</script>
```

Here we defined a checkRating (_line 6_) function that will get called every 2 seconds by the setInterval at _line 14_. On the _line 7_, we are telling it to fetch a rating of a movie by specifying its ID in the request URL.

And voilà 🎉, if you go to your movie page and open the [Network tab](https://developers.google.com/web/tools/chrome-devtools/network/) in your browser, you should see that request towards rating action is dispatched every 2 seconds.

## But how do I poll without JavaScript?

Hold your horses 🎠, we are getting there. You can do simple polling with the new version of the [render_async](https://github.com/renderedtext/render_async) gem! In order to do this, you’ll need to install the gem inside your Rails application and put this snippet in your application.html.erb file.

```
<%= content_for :render_async %>
```

This snippet will load the JavaScript code for us so that we **don’t** have to write it ourselves. So, it’s not exactly **without** it, it’s just that we don’t have to write it ourselves.

We will keep <i>movies_controller.rb</i> and <i>\_movie_rating.html.erb</i> files from the previous example, and we will only edit <i>show.html.erb</i> to look like this:

```erb
<!-- app/views/movies/show.html.erb -->

<%= render_async movie_rating_path(@movie), interval: 2000 %>
```

Wait, **that** is it? **Yep**, that’s it, congrats 🎉! This piece of code will generate JavaScript that will fetch movie rating every 2 seconds. How neat and awesome 😌. If you visit your movie page now, its rating should show up and should constantly be updated by polling.

## BONUS ROUND

That’s not all you can do with it. You can throw in some error handling in there too, also without any JS code to be written:

```html
<!-- app/views/movies/show.html.erb -->
<%= render_async movie_rating_path(@movie), interval: 2000, error_message:
"Couldn't load rating :(" %>
```

> Your reaction while reading this: WOW, I can get an error message to show up too 🤯? Where can I try out this gem?

Right [here](https://github.com/renderedtext/render_async) my friend. You’re welcome ❤️.

Polling feature was recently released in the 2.1.0 version of the gem and it’s ready to be used by the community. If you are using polling in your app, you can try out this feature of the gem.

**render_async** has been around for a long time, it’s used in products like [Codetriage](https://www.codetriage.com/) (see [issue on GitHub](https://github.com/codetriage/codetriage/issues/594) by [Richard Schneeman](https://twitter.com/schneems) and it’s been praised by [Nate Berkopec](https://twitter.com/nateberkopec) on Twitter:

<div class="center-box">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I think render_async looks like another potential valuable part of the &quot;html-over-the-wire&quot; toolkit, along with PJAX and Turbolinks.</p>&mdash; Nate Berkopec (@nateberkopec) <a href="https://twitter.com/nateberkopec/status/872832015753773057?ref_src=twsrc%5Etfw">June 8, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

You can also read the original blog post that made render_async famous and see his original use case on the [Semaphore CI blog](https://semaphoreci.com/blog/2017/06/08/speeding-up-rails-pages-with-render-async.html).

If you liked what you saw, please 👏 and spread the word. Also, check out [my website](http://nikolalsvk.github.io/) and [follow me](https://twitter.com/nikolalsvk). I’ll be posting more of Rails and JavaScript related articles, so click “Follow” and stay tuned 📹.

Also, retweeting this is an awesome way to help spread the word with your friends:

<div class="center-box">
<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">I just published “Rails HTML Polling Without JavaScript” <a href="https://twitter.com/hashtag/rails?src=hash&amp;ref_src=twsrc%5Etfw">#rails</a> <a href="https://twitter.com/hashtag/javascript?src=hash&amp;ref_src=twsrc%5Etfw">#javascript</a> <a href="https://t.co/vbO9CgStV8">https://t.co/vbO9CgStV8</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/1128302853079089153?ref_src=twsrc%5Etfw">May 14, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Cheers! 🍻
