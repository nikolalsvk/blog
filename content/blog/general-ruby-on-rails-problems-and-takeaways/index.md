---
title: General Ruby on Rails Problems and Takeaways
description: TODO
slug: TODO
date: 2021-06-28
canonical: TODO
canonicalName: TODO
coverImage: TODO
blogOgImage: TODO
published: true
tags:
  - TODO
---

Welcome to the last part of the Rails Patterns and Anti-patterns series. It's been quite a ride writing and researching all of these topics. In this blog post, we will go over the most common problems I've encountered while building and shipping Ruby on Rails applications throughout the years.

The ideas we will go through here apply in almost any place in the code. Consider them as general ideas, not something related to the Model-View-Controller pattern. If you are interested in patterns and anti-patterns related to the Rails' MVC, you can check out the [Model](https://blog.appsignal.com/2020/11/18/rails-model-patterns-and-anti-patterns.html), [View](https://blog.appsignal.com/2021/02/10/ruby-on-rails-view-patterns-and-anti-patterns.html), and [Controller](https://blog.appsignal.com/2021/04/14/ruby-on-rails-controller-patterns-and-anti-patterns.html) blog posts. So let's jump into general problems and takeaways.

## Selfish Objects (Law of Demeter)

The Law of Demeter is a heuristic that got its name while a group of people worked on a Project Demeter. The idea is that your objects are fine as long as they call one method at a time and not chain multiple method calls. What this means is practice is the following:

```ruby
# Bad
song.label.address

# Good
song.label_address
```

So now the `song` object no longer needs to know from where the address is coming. The address is now the responsibility of the `label` object. So what you are encouraged to do is only to chain one method call. What you are doing is you're making your objects 'selfish', not letting them share their full information directly, but through helper methods. Luckily, in Rails, you don't have to write a helper method per se, but you can achieve this with the `delegate` helper.

```ruby
def Label < ApplicationModel
  belongs_to :user

  delegate :address, to: :user
end
```

You can go ahead and play around with the options delegate accepts in [delegeta's docs](https://apidock.com/rails/Module/delegate). But the idea and execution are pretty simple. What you do by applying the Law of Demeter is you are reducing the structural coupling. Together with the powerful `delegate`, you are doing it in fewer lines and with great options included.
