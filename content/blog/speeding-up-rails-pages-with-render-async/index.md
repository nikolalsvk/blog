---
title: Speeding Up Rendering Rails Pages with render_async
description: Adding new code to Rails controllers can slow your pages down. Here's how to make rendering your Rails pages faster.
slug: speeding-up-rails-pages-with-render-async
date: 2017-06-08
canonical: https://semaphoreci.com/blog/2017/06/08/speeding-up-rails-pages-with-render-async.html
canonicalName: Semaphore
coverImage: ./cover.png
blogOgImage: ./cover.png
published: true
tags:
  - Rails
  - Ruby
  - JavaScript
  - render_async
---

![Speeding Up Rendering Rails Pages with render_async](./cover.png)

Adding new code to Rails controllers can bring a couple of problems with it. Sometimes controller actions get really big, and they tend to do a lot of things. Another common problem is an increase in data over time, which can lead to slow page loading time. Adding new code to controller actions can also sometimes block the rendering of some actions if it fails, breaking user experience and user happiness.

Here at [Semaphore](https://semaphoreci.com/), we came across these types of problems a couple of times. We usually resolved them by splitting controller actions into smaller actions, and rendering them asynchronously using plain JavaScript.

After some time, we saw that this can be extracted to [render_async](https://rubygems.org/gems/render_async), a gem that speeds up Rails pages for you – it loads content to your HTML asynchronously by making an AJAX call to your Rails server.

## Problem no. 1: Slowness accumulates over time

As new code gets added, Rails controller actions can get “fat”. If we’re not careful, page load time slowly increases as the amount of code and data rises.

## Problem no. 2: Dealing with code that blocks your actions

As we add new code to our controllers, we sometimes need to load extra data in the controller action in order to render the complete view.

Let’s take a look at an example of code that blocks the rendering of an action.

Let’s say we have a movies_controller.rb, and in the show action we want to fetch a movie from the database, but we also want to get the movie rating from IMDB.

```ruby
class MoviesController < ApplicationController
  def show
    @movie = Movies.find_by_id(params[:id])

    @movie_rating = IMDB.movie_rating(@movie)
  end
end
```

Getting the movie by find_by_id is a normal line that tries to find a movie in **our** database that **we** can control.

However, the line where we fetch the movie rating makes an external request to an IMDB service that is expected to return the answer. The problem starts when an external service is not available or is experiencing downtime. Now our MoviesController#show is down and cannot be loaded to the user that wants the movie.

## The solution

Both problems can be solved or relieved by splitting your code using the rendered_async gem. rendered_async loads content asynchronously to your Rails pages after they’ve rendered.

Why choose rendered_async over traditional JavaScript code that does async requests and adds HTML to the page? Because rendered_async does the boring JavaScript fetch and replace for you.

## How render_async works

Let’s say you have an app/views/movies/show.html.erb file that shows details about a specified movie and ratings it fetches from an external service.

Here’s the code before using render_async:

```erb
# app/views/movies/show.html.erb

Information about <%= @movie.title %>
<%= @movie.description %>

<%= render_async movie_rating_path(@movie.id) %>
```

And this is what it looks like after using render_async:

```erb
# app/views/movies/show.html.erb

Information about <%= @movie.title %>
<%= @movie.description %>

<%= render_async movie_rating_path(@movie.id) %>
```

With rendered_async, the section with the movie rating is loaded after the show.html.erb loads. The page makes an AJAX request using jQuery to movie_rating_path, and it renders the contents of the AJAX response in the HTML of the page.

Since rendered_async makes a request to the specified path, we need to add it to config/routes.rb:

```ruby
# config/routes.rb

get :movie_rating, :controller => :movies
```

We also need to add a proper action in the controller we set in the routes, so we’ll add the movie_rating action inside movies_controller.rb:

```ruby
# app/controllers/movies_controller.rb

def movie_rating
  @movie_rating = IMDB.movie_ratings(@movie)
  render :partial => "movie_ratings"
end
```

Since our movie_rating is rendering a partial, we need to create a partial for it to render:

```erb
# app/views/movies/_movie_rating.html.erb
Movie rating on IMDB: <%%= @movie_rating %>
```

The most important part is to add the content_for tag to your application layout, because rendered_async will put the code for fetching AJAX responses there. It’s best is to put it just before the footer in your layout.

```erb
# app/views/layouts/application.html.erb
<%= content_for :render_async %>
```

If the IMDB service is down or not responding, our show page will load without the movie rating. The movie page now cannot be broken by an external service, leaving the rest of the page fully usable.

## Wrapping Up

In this example we managed to speed up rendering Rails pages with rendered_async by:

1.  Simplifying the MoviesController show action, thus making it easier to test and load.
2.  Splitting our movie rating markup into a partial, which is a good pattern in the Rails world, and
3.  Freeing up show action from being blocked by an external service.

If you have ideas on what else could be added or improved in render_async, you can submit a pull request or an issue at [render_async](https://github.com/renderedtext/render_async).

Also, feel free to leave any comments or questions you may have on
[Twitter](https://twitter.com/nikolalsvk/status/872823260668469248) or
[send me an email](mailto:nikola@pragmaticpineapple.com). If you find this article
useful, or think someone else would find it useful, please share it with the
world.
