---
title: "Rails Concerns: To Concern Or Not To Concern"
description: Should you be concerned about Rails concerns?
slug: rails-concers-to-concern-or-not-to-concern
date: 2020-09-16
canonical: https://blog.appsignal.com/2020/09/16/rails-concers-to-concern-or-not-to-concern.html
canonicalName: AppSignal
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
published: true
tags:
  - Rails
  - Ruby
  - Patterns
---

![Concerns](./cover.jpg)

<div class="photo-caption">
Photo from <a href="https://blog.appsignal.com/2020/08/05/introduction-to-ruby-on-rails-patterns-and-anti-patterns.html" target="_blank">AppSignal's Blog</a>
</div>

If you’ve ever used Ruby on Rails, you’ve probably come across the concept of concerns. Whenever you jumpstart a new Rails project, you get a directory `app/controllers/concerns` and `app/models/concerns`. But what are concerns? And why do people from the Rails community sometimes talk badly about them?

## Quick Overview

A Rails Concern is any module that extends `ActiveSupport::Concern` module. You might ask — how are concerns so different from modules? The main difference is that Rails concerns allow you to do a bit of magic, like so:

```rb
# app/models/concerns/trashable.rb

module Trashable
  extend ActiveSupport::Concern

  included do
    scope :existing, -> { where(trashed: false) }
    scope :trashed, -> { where(trashed: true) }
  end

  def trash
    update_attribute :trashed, true
  end
end
```

You see that word included. It is a bit of Rails carbohydrates sprinkled upon a Ruby module. What `ActiveSupport::Concern` does for you is it allows you to put code that you want evaluated inside the included block. For example, you want to extract the trashing logic out of your model. The `included` allows you to do what we did and later include your model’s concern like so:

```rb
class Song < ApplicationRecord
  include Trashable

  has_many :authors

  # ...
end
```

Pretty handy and naive at this point, right? The Model lost a bit of weight and trashing can now be reused throughout other models, not just our Song model. Well, things can get complicated. Let’s dive in to find out.

## A Classic Example of a Mixin

Before we embark further into the depths of concerns, let’s add another explanation of them. When you see `include SomeModule` or `extend AnotherModule`, these are called [mixins](https://en.wikipedia.org/wiki/Mixin). A mixin is a set of code that can be added to other classes. And, as we all know from the [Ruby documentation](https://ruby-doc.org/core-2.2.0/Module.html), a module is a collection of methods and constants. So what we are doing here is including modules with methods and constants into different classes so that they can use them.

That is exactly what we did with the `Trashable` concern. We extracted common logic around trashing a model object into a module. This module can later be included in other places. So, **mixin** is a design pattern used not only in Ruby and Rails. But, wherever it’s used, people either like it and think it is good, or they hate it and think it can easily spin out of control.

To better understand this, we’ll go through a couple of pros and cons of using them. Hopefully, by doing this, we can gain an understanding of when or whether to use concerns.

## I Have It All

When you decide to extract something to a concern, like `Trashable` concern, you now have access to all of the functionality of wherever `Trashable` is included. This brings great power, but as Richard Schneeman said in [his blog post](https://rollout.io/blog/when-to-be-concerned-about-concerns/) on the topic — “with great power comes great ability to make complicated code”. He meant complicating code that you might rely on, something that is _supposed_ to be there in your concerns.

If we take a look at the `Trashable` once more:

```rb
module Trashable
  extend ActiveSupport::Concern

  included do
    scope :existing, -> { where(trashed: false) }
    scope :trashed, -> { where(trashed: true) }
  end

  def trash
    update_attribute :trashed, true
  end
end
```

The logic of the concern relies on the fact that the `trashed` field exists wherever the concern is included. Right? No biggie, this is what we want after all. But, what I see happen is that people get tempted to pull in other stuff from the model into the concern. To paint a picture of how this can happen, let’s imagine that the `Song` model has another method `featured_authors`:

```rb
class Song < ApplicationRecord
  include Trashable

  has_many :authors

  def featured_authors
    authors.where(featured: true)
  end

  # ...
end

class Album < ApplicationRecord
  include Trashable

  has_many :authors

  def featured_authors
    authors.where(featured: true)
  end

  # ...
end
```

To better illustrate, I added an `Album` model that also includes `Trashable`. Let’s then say we want to notify featured authors of the song and the album when they get trashed. People will get tempted to put this logic inside the concern like so:

```rb
module Trashable
  extend ActiveSupport::Concern

  included do
    scope :existing, -> { where(trashed: false) }
    scope :trashed, -> { where(trashed: true) }
  end

  def trash
    update_attribute :trashed, true

    notify(featured_authors)
  end

  def notify(authors)
    # ...
  end
end
```

Right here, things are starting to get complicated a bit. Since we have trashing logic outside our Song model, we might be tempted to put notifying in the `Trashable` concern. In there, something “wrong” happens. The `featured_authors` is taken from the `Song` model. OK, let’s say this passes pull request review and CI checks.

Then, a couple of months down the road, a new requirement is set where the developer needs to change the way we present `featured_authors` for songs. For example, a new requirement wants to show only featured authors from Europe. Naturally, the developer will find where featured authors are defined and edit them.

```rb
class Song < ApplicationRecord
  include Trashable

  has_many :authors

  def featured_authors
    authors.where(featured: true).where(region: 'Europe')
  end

  # ...
end

class Album < ApplicationRecord
  include Trashable

  has_many :authors

  # ...
end
```

This works nicely wherever we show authors, but after we deploy to production, the folks from other parts of the world won’t get notified anymore about their songs. Mistakes like these are easy to make when using concerns. The example above is a simple and artificial one, but the ones that are “in the wild” can be super tricky.

What is risky here is that the concern (mixin) knows a lot about the model it gets included in. It is what is called a **circular dependency**. `Song` and `Album` depend on `Trashable` for trashing, `Trashable` depends on both of them for `featured_authors` definition. The same can be said for the fact that a `trashed` field needs to exist in both models in order to have the `Trashable` concern working.

This is why a no-concern club might be against, and the pro-concern club is for. I’d say, the _first_ version of `Trashable` is the one I’d go with in my codebase. Let’s see how we can make the second version with notifying better.

## Where Do Y'all Come From

Looking back at our `Trashable` with notifying, we have to do something about it. Another thing that happens when using concerns is that we tend to over-DRY things. Let’s try to do that, for demonstration purposes, to our existing models by creating another concern (bear with me on this one):

```rb
module Authorable
  has_many :authors

  def featured_authors
    authors.where(featured: true)
  end
end
```

Then, our `Song` and `Album` will look like this:

```rb
class Song < ApplicationRecord
  include Trashable
  include Authorable

  # ...
end

class Album < ApplicationRecord
  include Trashable
  include Authorable

  # ...
end
```

We dried everything up, but now the requirement for featured authors from Europe is not fulfilled. To make things worse, now the `Trashable` concern and the models depend on the `Authorable`. What the hell? Exactly my question when I was dealing with concerns some time ago. It’s hard to track down where methods are coming from.

My solution to all of this would be to keep `featured_authors` as close to the models as possible. The `notify` method should **not** be a part of `Trashable` concern at all. Each model should take care of that on its own, especially if they tend to notify different subgroups. Let’s see how to do it less painfully:

```rb
# Concerns
module Trashable
  extend ActiveSupport::Concern

  included do
    scope :existing, -> { where(trashed: false) }
    scope :trashed, -> { where(trashed: true) }
  end

  def trash
    update_attribute :trashed, true
  end
end

module Authorable
  has_many :authors

  # Other useful methods that relate to authors across models.
  # If there are none, ditch the concern.
end

# Models
class Song < ApplicationRecord
  include Trashable
  include Authorable

  def featured_authors
    authors.where(featured: true).where(region: 'Europe')
  end

  # ...
end

class Album < ApplicationRecord
  include Trashable
  include Authorable

  def featured_authors
    authors.where(featured: true)
  end

  # ...
end
```

Concerns like these are manageable and not too complex. I skipped the `notify` functionality I described earlier since that can be a topic for another day.

# The Final Boss

For Basecamp, the Rails creators, concerns referencing other concerns seem perfectly fine as [DHH illustrated in a tweet](https://twitter.com/dhh/status/964244090224128001) a while ago:

![Final concern boss](https://d33wubrfki0l68.cloudfront.net/51b08d6281aa25814857364f45d50903bc9b9764/f25a2/images/blog/2020-09/where-do-yall-come-from.jpg)

By looking at the code screenshot, you are either opening your mouth in awe or in appall. I feel there is no in-between here. If I got a chance to edit this code, I would envision it as the “Final Concern Boss Fight”. But jokes aside, the interesting thing here is that there are comments that say which concern depends on which. Take a look at:

```rb
  # ...

  include Subscribable # Depends on Readable
  include Eventable    # Depends on Recordables

  # ...
```

Putting comments like these can be helpful, but it’s still set up for doing something sketchy, especially if you are new to the codebase. Being new and not being aware of all the “gotchas” a code has can certainly send you down the concern downward spiral.

Something like this is what DHH shared in a [comment inside the discussion](https://twitter.com/jubiweb/status/964346236588494848). A response tweet inside asks how are folks who work with this codebase supposed to interact with concerns like these. DHH responds that they don’t have much written docs, they rarely hire so their team is well acquainted with these.

But having an experienced team that knows the codebase well as an argument for using them is weird and not strong. I guess it is more of a feeling whether to use them or not. Are you more comfortable with multiple inheritances that modules provide, or do you prefer composition? Your call.

## Conclusion

As we’ve seen, concerns are nothing more than modules that provide some useful syntax sugar to extract and DRY up your code. If you have more useful tools under your belt, maybe you shouldn’t reach out for concerns right away. Behavior like handling file attachments and the trashing logic we showed in the examples might be good candidates to extract into modules (concerns).

Hopefully, you get to see the possible good and bad things when dealing with concerns and modules in general. Bear in mind that no code is perfect. And in the end, how can you learn what is good and what is bad for you if you don’t try and possibly fail or succeed?

No solution is perfect, and I hope you got to understand the Rails concerns way of doing things in the blog post. As always, use your judgment and be aware of the pros and cons.

Until the next one, cheers!
