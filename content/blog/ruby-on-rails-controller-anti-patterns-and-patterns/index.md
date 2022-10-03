---
title: Ruby on Rails Controller Patterns and Anti-patterns
description: In this part of the series on Rails patterns and anti-patterns, we are going to analyze the final part of the MVC (Model-View-Controller) design pattern — the Controller.
slug: ruby-on-rails-controller-patterns-and-anti-patterns
date: 2021-04-14
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
canonical: https://blog.appsignal.com/2021/04/14/ruby-on-rails-controller-patterns-and-anti-patterns.html
canonicalName: AppSignal
published: true
tags:
  - Rails
  - Ruby
  - Patterns
---

Welcome back to the fourth installment of the
[Ruby on Rails Patterns and Anti-Patterns series](https://blog.appsignal.com/category/rails-patterns-and-anti-patterns.html).

Previously, we covered patterns and anti-patterns in general as well as in
relation to Rails Models and Views. In this post, we are going to analyze the
final part of the MVC (Model-View-Controller) design pattern — the Controller.
Let’s dive in and go through the patterns and anti-patterns related to Rails
Controllers.

## At The Front Lines

Since Ruby on Rails is a web framework, HTTP requests are a vital part of it.
All sorts of Clients reach out to Rails backends via requests and this is where
controllers shine. Controllers are at the front lines of receiving and handling
requests. That makes them a fundamental part of the Ruby on Rails framework. Of
course, there is code that comes before controllers, but controller code is
something most of us can control.

Once you define routes at the `config/routes.rb`, you can hit the server on the
set route, and the corresponding controller will take care of the rest. Reading
the previous sentence might give an impression that everything is as simple as
that. But, often, a lot of the weight falls on the controller’s shoulders.
There is the concern of authentication and authorization, then there are
problems of how to fetch the needed data, as well as where and how to perform
business logic.

All of these concerns and responsibilities that can occur inside the controller
can lead to some anti-patterns. One of the most ‘famous’ ones is the
anti-pattern of a “fat” controller.

## Fat (Obese) Controllers

The problem with putting too much logic in the controller is that you are
starting to violate the Single Responsibility Principle (SRP). This means that
we are doing too much work inside the controller. Often, this leads to a lot of
code and responsibilities piling up there. Here, 'fat’ refers to the extensive
code contained in the controller files, as well as the logic the controller
supports. It is often considered an anti-pattern.

There are a lot of opinions on what a controller should do. A common ground of
the responsibilities a controller should have include the following:

- **Authentication and authorization** - checking whether the entity
  (oftentimes, a user) behind the request is who it says it is and whether it
  is allowed to access the resource or perform the action. Often,
  authentication is saved in the session or the cookie, but the controller
  should still check whether authentication data is still valid.
- **Data fetching** - it should call the logic for finding the right data based on
  the parameters that came with the request. In the perfect world, it should be
  a call to one method that does all the work. The controller should not do the
  heavy work, and should delegate it further.
- **Template rendering** - finally, it should return the right response by
  rendering the result with the proper format (HTML, JSON, etc.). Or, it should
  redirect to some other path or URL.

Following these ideas can save you from having too much going on inside the
controller actions and controller in general. Keeping it simple at the
controller level will allow you to delegate work to other areas of your
application. Delegating responsibilities and testing them one by one will
ensure that you are developing your app to be robust.

Sure, you can follow the above principles, but you must be eager for some
examples. Let’s dive in and see what patterns we can use to relieve controllers
of some weight.

## Query Objects

One of the problems that happen inside controller actions is too much querying
of data. If you followed our blog post on
[Rails Model anti-patterns and patterns](https://blog.appsignal.com/2020/11/18/rails-model-patterns-and-anti-patterns.html),
we went through a similar problem where models had too much querying
logic. But, this time we’ll use a pattern called Query Object. A Query Object
is a technique that isolates your complex queries into a single object.

In most cases, Query Object is a Plain Old Ruby Object that is initialized with
an ActiveRecord relation. A typical Query Object might look like this:

```rb
# app/queries/all_songs_query.rb

class AllSongsQuery
  def initialize(songs = Song.all)
    @songs = songs
  end

  def call(params, songs = Song.all)
    songs.where(published: true)
         .where(artist_id: params[:artist_id])
         .order(:title)
  end
end
```

It is made to be used inside the controller like so:

```rb
class SongsController < ApplicationController
  def index
    @songs = AllSongsQuery.new.call(all_songs_params)
  end

  private

  def all_songs_params
    params.slice(:artist_id)
  end
end
```

You can also try out another approach of the query object:

```rb
# app/queries/all_songs_query.rb

class AllSongsQuery
  attr_reader :songs

  def initialize(songs = Song.all)
    @songs = songs
  end

  def call(params = {})
    scope = published(songs)
    scope = by_artist_id(scope, params[:artist_id])
    scope = order_by_title(scope)
  end

  private

  def published(scope)
    scope.where(published: true)
  end

  def by_artist_id(scope, artist_id)
    artist_id ? scope.where(artist_id: artist_id) : scope
  end

  def order_by_title(scope)
    scope.order(:title)
  end
end
```

The latter approach make the query object more robust by making `params`
optional. Also, you will notice that now we can call `AllSongsQuery.new.call`.
If you're not a big fan of this, you can resort to class methods. If you write
your query class with class methods, it will no longer be an 'object', but this
is a matter of personal taste. For illustration purposes, let's see how we `AllSongsQuery` simpler to call in the wild.

The latter approach makes the query object more robust by making `params`
optional. Also, notice that we can now call `AllSongsQuery.new.call`. If you’re
not a big fan of this, you can resort to class methods. If you write your query
class with class methods, it will no longer be an 'object', but this is a
matter of personal taste. For illustration purposes, let’s see how we can
make `AllSongsQuery` simpler to call in the wild.

```rb
# app/queries/all_songs_query.rb

class AllSongsQuery
  class << self
    def call(params = {}, songs = Song.all)
      scope = published(songs)
      scope = by_artist_id(scope, params[:artist_id])
      scope = order_by_title(scope)
    end

    private

    def published(scope)
      scope.where(published: true)
    end

    def by_artist_id(scope, artist_id)
      artist_id ? scope.where(artist_id: artist_id) : scope
    end

    def order_by_title(scope)
      scope.order(:title)
    end
  end
end
```

Now, we can call `AllSongsQuery.call` and we're done. We can pass in `params`
with `artist_id`. Also, we can pass the initial scope if we need to change it
for some reasons. If you really want to avoid calling of the `new` over a query class, try out this 'trick':

```rb
# app/queries/application_query.rb

class ApplicationQuery
  def self.call(*params)
    new(*params).call
  end
end
```

You can create the `ApplicationQuery` and then inherit from it in other query
classes:

```rb
# app/queries/all_songs_query.rb
class AllSongsQuery < ApplicationQuery
  ...
end
```

You still keep the `AllSongsQuery.call`, but you made it more elegant.

What’s great about query objects is that you can test them in isolation and
ensure that they are doing what they should do. Furthermore, you can extend
these query classes and test them without worrying too much about the logic in
the controller. One thing to note is that you should handle your request
parameters elsewhere, and not rely on the query object to do so. What do you
think, are you going to give query object a try?

## Ready To Serve

OK, so we’ve handled ways to delegate the gathering and fetching of data into
Query Objects. What do we do with the pilled-up logic between data gathering
and the step where we render it? Good that you asked, because one of the
solutions is to use what are called Services. A service is oftentimes regarded
as a PORO (Plain Old Ruby Object) that performs a single (business) action. We
will go ahead and explore this idea a bit below.

Imagine we have two services. One creates a receipt, the other sends a receipt
to the user like so:

```rb
# app/services/create_receipt_service.rb
class CreateReceiptService
  def self.call(total, user_id)
    Receipt.create!(total: total, user_id: user_id)
  end
end

# app/services/send_receipt_service.rb
class SendReceiptService
  def self.call(user)
    receipt = user.receipt.last

    UserMailer.send_receipt(receipt).deliver_later
  end
end
```

Then, in our controller we would call the `SendReceiptService` like this:

```rb
# app/controllers/receipts_controller.rb

class ReceiptsController < ApplicationController
  def create
    receipt = CreateReceiptService.call(total: receipt_params[:total],
                                        user_id: receipt_params[:user_id])

    SendReceiptService.call(receipt)
  end
end
```

Now you have two services doing all the work, and the controller just calls
them. You can test these separately, but the problem is, there’s no clear
connection between the services. Yes, in theory, all of them perform a single
business action. But, if we consider the abstraction level from the
stakeholders’ perspective — their view of the action of creating a receipt
involves sending an email of it. Whose level of abstraction is 'right'™️?

To make this thought experiment a bit more complex, let’s add a requirement
that the total sum on the receipt has to be calculated or fetched from
somewhere during the creation of the receipt. What do we do then? Write another
service to handle the summation of the total sum? The answer might be to follow
the Single Responsibility Principle (SRP) and abstract things away from each
other.

```rb
# app/services/create_receipt_service.rb
class CreateReceiptService
  ...
end

# app/services/send_receipt_service.rb
class SendReceiptService
  ...
end

# app/services/calculate_receipt_total_service.rb
class CalculateReceiptTotalService
  ...
end

# app/controllers/receipts_controller.rb
class ReceiptsController < ApplicationController
  def create
    total = CalculateReceiptTotalService.call(user_id: receipts_controller[:user_id])

    receipt = CreateReceiptService.call(total: total,
                                        user_id: receipt_params[:user_id])

    SendReceiptService.call(receipt)
  end
end
```

By following SRE, we make sure our services can be composed together into
larger abstractions, like `ReceiptCreation` process. By creating this 'process'
class, we can group all the actions needed to complete the process. What do you
think about this idea? It might sound like a too much of abstraction at first,
but it might prove beneficial if you are calling these actions all over
the place.

By following SRP, we make sure that our services can be composed together into
larger abstractions, like the ReceiptCreation process. By creating this
'process’ class, we can group all the actions needed to complete the process.
What do you think about this idea? It might sound like too much abstraction at
first, but it might prove beneficial if you are calling these actions all over
the place. If this sounds good to you, check out the [Trailblazer's
Operation](https://trailblazer.to/2.1/docs/operation.html).

To sum up, the new `CalculateReceiptTotalService` service can deal with all the
number crunching. Our `CreateReceiptService` is responsible for writing a
receipt to the database. The `SendReceiptService` is there to dispatch emails
to users about their receipts. Having these small and focused classes can make
combining them in other use cases easier, thus resulting in an easier to
maintain and easier to test codebase.

To sum up, the new `CalculateReceiptTotalService` service can deal with all the
number crunching. Our `CreateReceiptService` is responsible for writing a receipt
to the database. The `SendReceiptService` is there to dispatch emails to users
about their receipts. Having these small and focused classes can make combining
them in other use cases easier, thus resulting in an easier to maintain and
easier to test codebase.

### The Service Backstory

In the Ruby world, the approach of using service classes is also known as
actions, operations, and similar. What these all boil down to is the [Command pattern](https://en.wikipedia.org/wiki/Command_pattern).
The idea behind the Command pattern is that an object (or in our
example, a class) is encapsulating all the information needed to perform a
business action or trigger an event. The information that the caller of the
command should know is:

- name of the command
- method name to call on the command object/class
- values to be passed for the method parameters

So, in our case, the caller of a command is a controller. The approach
is very similar, just the naming in Ruby is 'Service'.

## Split Up The Work

If your controllers are calling some 3rd party services and they are blocking
your rendering, maybe it’s time to extract these calls and render them
separately with another controller action. An example of this can be when you
try to render a book’s information and fetch its rating from some other service
that you can’t really influence (like Goodreads).

```rb
# app/controllers/books_controller.rb

class BooksController < ApplicationController
  def show
    @book = Book.find(params[:id])

    @rating = GoodreadsRatingService.new(book).call
  end
end
```

If Goodreads is down or something similar, your users are going to have to wait
for the request to Goodreads servers to timeout. Or, if something is slow on
their servers, the page will load slowly. You can extract the calling of the
3rd party service into another action like so:

```rb
# app/controllers/books_controller.rb

class BooksController < ApplicationController
  def show
    @book = Book.find(params[:id])
  end

  def rating
    @rating = GoodreadsRatingService.new(book).call

    render partial: 'book_rating'
  end
end
```

Then, you will have to call the rating path from your views, but hey, your show
action doesn’t have a blocker anymore. Also, you need the 'book_rating’
partial. To do this more easily, you can use the [render_async gem](https://github.com/renderedtext/render_async).
You just need to put the following statement where you render your book’s rating:

```erb
<%= render_async book_rating_path %>
```

Extract HTML for rendering the rating into the `book_rating` partial, and put:

```erb
<%= content_for :render_async %>
```

Inside your layout file, the gem will call `book_rating_path` with an AJAX
request once your page loads, and when the rating is fetched, it will show it
on the page. One big gain in this is that your users get to see the book page
faster by loading ratings separately.

Or, if you want, you can use [Turbo Frames](https://turbo.hotwire.dev/handbook/frames#lazily-loading-frames)
from Basecamp. The idea is the same, but you just use the `<turbo-frame>`
element in your markup like so:

```html
<turbo-frame id="rating_1" src="/books/1/rating"> </turbo-frame>
```

Whatever option you choose, the idea is to split the heavy or flaky work from
your main controller action and show the page to the user as soon as possible.

## Final Thoughts

If you like the idea of keeping controllers thin and picture them as just
'callers’ of other methods, then I believe this post brought some insight on
how to keep them that way. The few patterns and anti-patterns that we mentioned
here are, of course, not an exhaustive list. If you have an idea on what is
better or what you prefer, please reach out on Twitter and we can discuss.

Definitely stay tuned on this series, we are going to do at least one more blog
post where we sum up common Rails problems and takeaways from the series.

Until next time, cheers!
