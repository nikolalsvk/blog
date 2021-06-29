---
title: General Ruby on Rails Problems and Takeaways
description: TODO
slug: TODO
date: 2021-06-28
canonical: TODO
canonicalName: AppSignal
coverImage: TODO
blogOgImage: TODO
published: true
tags:
  - Rails
  - Ruby
  - Patterns
---

Welcome to the last part of the Rails Patterns and Anti-patterns series. It's been quite a ride writing and researching all of these topics. In this blog post, we will go over the most common problems I've encountered while building and shipping Ruby on Rails applications throughout the years.

The ideas we will go through here apply in almost any place in the code. So consider them as general ideas, not something related to the Model-View-Controller pattern. If you are interested in patterns and anti-patterns related to the Rails' MVC, you can check out the [Model](https://blog.appsignal.com/2020/11/18/rails-model-patterns-and-anti-patterns.html), [View](https://blog.appsignal.com/2021/02/10/ruby-on-rails-view-patterns-and-anti-patterns.html), and [Controller](https://blog.appsignal.com/2021/04/14/ruby-on-rails-controller-patterns-and-anti-patterns.html) blog posts. So let's jump into general problems and takeaways.

## Selfish Objects (Law of Demeter)

[The Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter) is a heuristic that got its name while a group of people worked on a Project Demeter. The idea is that your objects are fine as long as they call one method at a time and not chain multiple method calls. What this means is practice is the following:

```ruby
# Bad
song.label.address

# Good
song.label_address
```

So now the `song` object no longer needs to know from where the address is coming. The address is now the responsibility of the `label` object. So what you are encouraged to do is only to chain one method call. What you are doing is you're making your objects 'selfish', not letting them share their full information directly, but through helper methods. Luckily, in Rails, you don't have to write a helper method per se, but you can achieve this with the `delegate` helper.

```ruby
def Label < ApplicationModel
  belongs_to :song

  delegate :address, to: :song
end
```

You can go ahead and play around with the options delegate accepts in [delegete's docs](https://apidock.com/rails/Module/delegate). But the idea and execution are pretty simple. What you do by applying the Law of Demeter is you are reducing the structural coupling. Together with the powerful `delegate`, you are doing it in fewer lines and with great options included.

Another idea (read principle) very similar to the Law of Demeter is the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) or SRP for short. The gist of it is that a module, class, or function should be responsible for a single part of the system. Or presented in another way:

> Gather together the things that change for the same reasons. Separate those things that change for different reasons.

Folks can often understand SRP differently, but the idea is to keep your building blocks responsible for a single thing. It might be challenging to achieve SRP as your Rails app is expanding, but be aware of it when refactoring.

When adding features and increasing the LOC, I found out that folks often reach out for a quick solution. So sticking your hand out and grabbing the quick fix is the exact topic I'd want us to go through.

## I Know A Guy (Do You Need That Gem?)

Back in the day when Rails was the hot topic, there was a boom in open-source collaboration, and new Ruby gems popped up at every corner. So it was like nowadays with JavaScript libraries emerging into the world but at a much smaller scale. Anyways, a common thing to do was to try to find an already existing gem that solves your problem.

![NPM vs RubyGems](./npm-vs-rubygems.png)

There is nothing wrong with that idea, but I'd like to share some bits of advice before you decide to install that gem you set your eyes on. First, I'd usually ask myself a couple of questions:

- What portion of the gem's features are you going to use?
- Is there a similar gem out there that is 'simpler' or more up-to-date?
- Can you implement the feature you need easily and with confidence?

I try to evaluate whether to go with my implementation if I don't plan to use the whole array of gem features. Or, if the gem's implementation is too complex and I believe I can do it more simply, I opt-in for a custom solution. Another factor that I have to count on is how active the gem's repository is - are there any active maintainers? When was the last time a release happened?

Another thing to watch out for is the gem's dependencies. You don't want to get locked into a specific version of a dependency, so always check the `Gemfile.spec` file. For this case, always consult the [RubyGems way of specifying gem versions](https://guides.rubygems.org/patterns/#pessimistic-version-constraint).

While we're on the topic of gems, there is also one idea that I encountered. It's the Not Invented Here or NIH phenomenon that applies to the Rails / Ruby world. Let's what it is about in the next section.

## Not Invented Here (Maybe You Need That Gem After All?)

In a couple of occurrences in my career, I had a chance to experience people (me included) falling for the Not Invented Here syndrome. The idea is similar to the 'reinventing the wheel' phrase. Sometimes teams and organizations do not trust libraries (gems) that are not controllable by them. The lack of trust might be one of the triggers to reinvent the gem that is already out there to be used.

Sometimes, experiencing NIH can be a good thing. Having an in-house solution can be great, especially if you improve it over the other solutions out there. If you decide to open-source the in-house solution, it can be an even better idea (take a look at Ruby on Rails or React). But if you are reinventing the wheel for the sake of it, don't do it. The wheel itself is pretty great already.

The topic is quite tricky, and if I ever get caught in such a situation, I'd ask myself these questions:

- Are we confident that we can make a better solution than the ones that exist?
- If the existing open-source solution differs from what we need, can we make an open-source contribution and improve it?
- Furthermore, can we become the maintainers of the open-source solution and possibly improve lots of developers' lives?

But, sometimes, you just have to go your way and create it yourself. Sometimes, your organization doesn't like the licensing of the open-source library, so you are forced to build your own. But, whatever you do, I'd say to try to avoid reinventing the wheel.
