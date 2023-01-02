---
title: "Introduction to Ruby on Rails Patterns and Anti-patterns"
description: Dig into the basics of design patterns and anti-patterns.
slug: introduction-to-ruby-on-rails-patterns-and-anti-patterns/
date: 2020-08-05
canonical: https://blog.appsignal.com/2020/08/05/introduction-to-ruby-on-rails-patterns-and-anti-patterns.html
canonicalName: AppSignal
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
published: true
tags:
  - Rails
  - Ruby
  - Patterns
---

![Rails Patterns](./cover.jpg)

<div class="photo-caption">
Photo from <a href="https://blog.appsignal.com/2020/08/05/introduction-to-ruby-on-rails-patterns-and-anti-patterns.html">AppSignal's Blog</a>
</div>

Welcome to the first post in our series about Ruby on Rails Patterns and Anti-patterns. In each of the posts, we’ll take a deep dive into all sorts of patterns you might come across while working with Rails apps.

Today, we’ll show what a (design) pattern is and then try to explain what an anti-pattern is as well. To better illustrate explanations, we will use the Ruby on Rails framework that has been around for quite some time. If Rails isn’t your cup of tea for some reason, hang on, the ideas (or patterns) described here might resonate with whatever technology you wind up using.

But before we jump into explaining what patterns and anti-patterns are, how did we get to the point where we need them? Why do we need to have all these things for our software? Why do we need to **design** our solution?

## Yes, You Are a Designer

Even from early computer programming days, people had to deal with the design of the programs they were writing. To write a program (or software) is to design a solution for a problem. When you write software, you are a designer—feel free to append that to your job title. Designing good solutions is important because the software we write will be read and/or edited by others. Also, the solutions we come up with will be built on by others in the future.

Having all this in mind, generations of engineers started seeing similar designs in code and architecture throughout their careers. Folks started extracting and documenting standard solutions to problems. Some would say it’s a natural way of how we as humans function. We like to [categorize](https://en.wikipedia.org/wiki/Principles_of_grouping) and [find patterns](https://en.wikipedia.org/wiki/Gestalt_psychology#Pr%C3%A4gnanz) in everything, and software is no exception to that.

Being human, as we are, patterns started emerging more and more as software engineering got more complex. Software design patterns began to develop and cement themselves with engineers around the world. Books, essays, and talks were given, further spreading ideas of well thought out and battle-tested solutions. Those solutions saved a lot of people time and money, so let’s go over the term design pattern, and see what it truly is.

## What Is a Design Pattern?

In software engineering, a pattern is described as a solution that can be reused to solve a common problem. The pattern is something that is considered a good practice among software engineers. Since software engineers set them, they can quickly go from patterns to their opposite—anti-patterns—but we’ll get to that later.

A design pattern will show you the way to the solution but it won’t give you a piece of code ready to be plugged into the rest of your software. Think of a pattern as a guide for writing well-designed code, but you have to come up with the implementation. Using patterns in day-to-day coding emerged in the late ‘80s, where Kent Beck and Ward Cunningham came up with an idea of using a ['pattern language’](http://c2.com/doc/oopsla87.html).

The idea of pattern languages came in the late '70s by Christopher Alexander in his book [A Pattern Language](https://www.goodreads.com/book/show/79766.A_Pattern_Language). You might be surprised, but the book is not about software engineering but the architecture of buildings. The pattern language is an organized and coherent set of patterns, each of which describes a problem and the core of a solution that can be used in many ways. Sounds familiar? (Hint: frameworks, another hint: Rails)

Later on, design patterns in software engineering became famous with large audiences after the legendary book [Design Patterns](https://www.goodreads.com/book/show/85009.Design_Patterns) by the [Gang Of Four](http://wiki.c2.com/?GangOfFour) published in 1994. In the book, there are explanations and definitions of patterns that are used nowadays — Factory, Singleton, Decorator, just to name a few.

Great, now that we got acquainted or refreshed our knowledge on design and patterns, let’s find out what anti-patterns are.

## What Is a Design Anti-Pattern?

If you think of patterns as the good guys, the anti-patterns are the bad ones. To be more precise, a software anti-pattern is a pattern that may be commonly used but is considered ineffective or counterproductive. Typical examples of anti-patterns are God objects that contain many functions and dependencies, which could be extracted and separated into different objects.

Common causes of anti-patterns in code are many. For example, a good one is when the good guy (pattern) becomes the bad guy (an anti-pattern). Let’s say you got used to using a particular technology at your previous company, and you gained a high level of competence in it. For the sake of the example, let’s use Docker. You know how to efficiently pack applications into Docker containers, orchestrate them in the cloud, and pull their logs down from the cloud. Suddenly, you get a new job where you need to ship front end applications. Since you know a lot about Docker and how to ship apps with it, your first decision is to package everything up and deploy it to the cloud.

But, little did you know, the front end apps are not that complex at your current job, and putting them into containers might not be the most effective solution. It first sounds like a good idea, but later down the road, it proves as counterproductive. This anti-pattern is called [“Golden Hammer”](https://en.wikipedia.org/wiki/Law_of_the_instrument).

It can be summed up with the saying, “If you have a hammer, everything looks like a nail”. If you are really good with Docker and orchestration of services, everything is a Docker service made to be orchestrated in the cloud.

These things happen and will happen. Good guys turn to bad buys, and vice-versa. But where do Ruby and Rails fit into this picture?

## Ruby First, Then Rails

Most folks were introduced to Ruby by using Ruby on Rails, a popular framework for building websites quickly. I got acquainted with Ruby in the same way, nothing wrong with that. Rails is based on this well-established software pattern called Model-View-Controller, or MVC for short. But before we dive into details of the MVC pattern in Rails, one big fallacy that often happens is using Rails without learning Ruby properly.

The Rails framework was one of the go-to frameworks when you had an idea and wanted to build it fast. Nowadays, it’s a whole different story, Rails is still used, but not to the extent it was in its prime. Being so easy to use and run, a lot of beginners set out to build their web apps using rails new command. What happened then, along the road, problems started occurring. As a beginner, you are lured by the speed and simplicity of development with Rails, and everything works so magically and smoothly at first. Then you see you’ve taken a lot of 'magic’ for granted, and you don’t understand what is going on behind the curtain.

I had this problem, and I’m sure many beginners and advanced beginners are suffering from it. You start with a framework in hand, you build on it, and when you try to add something highly custom, you can’t, because you’ve used up all the magic points from that framework. At that point, you have to go back to the beginning and learn the basics. Going back is no biggie, happens to the best of us. But the problem grows more significant if you move on without learning the essential things, like in Ruby. One good book that can help you in this regard is [The Well-Grounded Rubyist](https://www.goodreads.com/book/show/3892688-the-well-grounded-rubyist).

As a beginner, you don’t have to read it from start to end. But keep it by your side so you can consult it quickly. I am not saying that you should suddenly stop whatever you were doing and read the whole book, but stop from time to time and refresh your knowledge of the Ruby basics, it might open some new horizons for you.

## MVC: Rails’ Bread & Butter

OK, but what about MVC? The Model-View-Controller pattern has been around for ages. It’s been adopted by many frameworks across a plethora of languages like Ruby (Rails), Python (Django), Java (Play, Spring MVC). The idea is to have separate components that each do their job:

- The Model handles data and business logic.
- The View is for the presentation of the data and the user interface.
- The Controller ties the two together by getting data from the Model and showing the View to the user.

Sounds great in theory, and it’s excellent when the logic is minimal and your website doesn’t hold complex logic. That is where things get tricky, but we’ll get to that in a second.

MVC spread out like wildfire throughout the web development community. Even libraries like React, which is insanely popular these days is explained as the view layer of your web app. No other pattern has been popularized so much that it cannot be shaken off. Rails added the [Publish-Subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) with ActionCable, where the concept of [channels is described as the controller](https://guides.rubyonrails.org/action_cable_overview.html#terminology) of the MVC pattern.

But what are the anti-patterns there, in the so widely used pattern? Let’s go over some of the most common anti-patterns for each part of the MVC pattern.

### Model Problems

As an application grows and business logic gets expanded, folks tend to overcrowd their models. Constant growth can lead to an anti-pattern called the Fat Model.

The famous 'Fat Model, Skinny Controller’ pattern identifies as a bad guy, some as the good guy. We will say that having any of the fat is an anti-pattern. To better understand it, let’s get into an example. Imagine we have a streaming service like Spotify or Deezer. Inside it, we have a model for songs like this:

```rb
class Song < ApplicationRecord
  belongs_to :album
  belongs_to :artist
  belongs_to :publisher

  has_one :text
  has_many :downloads

  validates :artist_id, presence: true
  validates :publisher_id, presence: true

  after_update :alert_artist_followers
  after_update :alert_publisher

  def alert_artist_followers
    return if unreleased?

    artist.followers.each { |follower| follower.notify(self) }
  end

  def alert_publisher
    PublisherMailer.song_email(publisher, self).deliver_now
  end

  def includes_profanities?
    text.scan_for_profanities.any?
  end

  def user_downloaded?(user)
    user.library.has_song?(self)
  end

  def find_published_from_artist_with_albums
    ...
  end

  def find_published_with_albums
    ...
  end

  def to_wav
    ...
  end

  def to_mp3
    ...
  end

  def to_flac
    ...
  end
end
```

The problem with models like these is that they become a dumping ground for the different logic that might be related to a song. This happens as methods get added slowly one-by-one over time. The whole model then seems large and complex, and splitting the logic into a couple of other places could prove beneficial in the future.

Right off the bat, you can see that there are some recommended practices that this model is breaking. It is breaking the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) (SRP). It deals with notifying followers and the publisher. It checks the text for profanities, has methods for exporting the song to different audio formats, and so on. Having all this adds to the model’s complexity, and I cannot even imagine the test file for this model.

How to refactor this model majorly depends on how methods are called and used in other places. I will present some general ideas of how we can handle these, and you can choose the one that fits your case the best.

The callbacks that notify followers and the publisher could be extracted to jobs. The jobs will get enqueued and the logic kept out of the model, like so:

```rb
class NotifyFollowers < ApplicationJob
  def perform(followers)
    followers.each { |follower| follower.notify }
  end
end

class NotifyPublisher < ApplicationJob
  def perform(publisher, song)
    PublisherMailer.song_email(publisher, self).deliver_now
  end
end
```

Jobs will run on their own in the separate process, away from the model. Now you can test your job logic separately and just check whether the proper job was enqueued from your model.

Let’s say that checking for profanities and whether the user has downloaded the song is all happening in the view part of our app. In that case, we could use a [Decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern). One popular solution that can get you started quickly is [Draper gem](https://github.com/drapergem/draper). With it, you could write a decorator similar to this one:

```rb
class SongDecorator < Draper::Decorator
  delegate_all

  def includes_profanities?
    object.text.scan_for_profanities.any?
  end

  def user_downloaded?(user)
    object.user.library.has_song?(self)
  end
end
```

Then, you would call `decorate` in your controller, for example:

```rb
def show
  @song = Song.find(params[:id]).decorate
end
```

And use it in your views like so:

```erb
<%= @song.includes_profanities? %>
<%= @song.user_downloaded?(user) %>
```

If you don’t like using a dependency, you can roll your decorator, but we’ll talk about this in another blog post. Now that you’ve got the majority of your model concerns separated, let’s deal with the methods for finding songs and converting a song. We can use modules to separate them:

```rb
module SongFinders
  def find_published_from_artist_with_albums
    ...
  end

  def find_published_with_albums
    ...
  end
end

module SongConverter
  def to_wav
    ...
  end

  def to_mp3
    ...
  end

  def to_flac
    ...
  end
end
```

The Song model will extend the `SongFinders` module, so its methods are available as class methods. The Song model will include the `SongConverter` module, so its methods are available on the model instances.

All of this should make our Song model pretty slim and on point:

```rb
class Song < ApplicationRecord
  extend SongFinders
  include SongConverter

  belongs_to :album
  belongs_to :artist
  belongs_to :publisher

  has_one :text
  has_many :downloads

  validates :artist_id, presence: true
  validates :publisher_id, presence: true

  after_update :alert_artist_followers, if: :published?
  after_update :alert_publisher

  def alert_artist_followers
    NotifyFollowers.perform_later(self)
  end

  def alert_publisher
    NotifyPublisher.perform_later(publisher, self)
  end
end
```

There are many more model anti-patterns, and this is just one example of what can go south with models. Stay tuned for another blog post in this series, where we’ll go into details about more model anti-patterns. For now, let’s see what can go wrong with views.

## View Problems

Besides model problems, Rails folks can sometimes struggle with the complexity of their views. Back in the day, HTML and CSS were the kings of the view part of web applications. Slowly over time, JavaScript came to reign, and almost all aspects of the front end were written in JavaScript. Rails follows a bit different paradigm regarding this. Instead of having everything in JavaScript in view, you should only “sprinkle” JS onto it.

In any case, having to deal with HTML, CSS, JS, and Ruby at the same place can get messy. What’s tricky with building Rails views is that the domain logic can sometimes be found inside the view. This is a no-no since it breaks the MVC pattern, for a start.

Another case could be using too much embedded Ruby in your views and partials. Maybe some of the logic could go inside a helper or a decorator (also known as the view model or a presenter). We will get into the examples of it in some of the next posts in the series, so stay tuned.

## Controller Problems

Rails controllers can also suffer from a variety of different problems. One of them is a Fat Controller anti-pattern.

Before, our model was fat, but it lost some weight, and now we notice that the controller has added some extra weight in the process. Usually, this happens when the business logic is put inside the Controller, but its actual place is in the model or elsewhere. Some of the ideas shared in the large Model section can still apply to the controller — extracting code to presenters, using ActiveRecord callbacks, resorting to [Service objects](https://blog.appsignal.com/2020/06/17/using-service-objects-in-ruby-on-rails.html).

Some folks even resort to using gems like [Trailblazer](https://github.com/trailblazer/trailblazer) or [dry-transaction](https://dry-rb.org/gems/dry-transaction/). The idea here is to create classes that deal with specific transactions. Moving everything out of the controller and keeping the model skinny, you store and test logic inside these separate classes, which some call services, transactions, actions, and similar.

## Conclusion

There are many more anti-patterns and even more solutions for them. To try to cover everything in this post will take too much space and time and it will make our post look fat (like the model and controller we talked about). Be sure to follow our series, where we’ll deep dive into every aspect of the MVC pattern in Rails. There, you’ll find out how to deal with the most famous anti-patterns. Until then, I hope you enjoyed this overview of what patterns and anti-patterns are and the most common ones in the Ruby on Rails framework.

Until the next one, cheers!
