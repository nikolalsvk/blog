---
title: Ruby on Rails Model Anti-patterns and Patterns
description: If you're struggling with models, this blog post is for you. We will quickly go through the process of putting your models on a diet and finish strongly with some things to avoid when writing migrations.
slug: rails-model-anti-patterns-and-patterns
date: 2020-11-18
coverImage: ./cover.jpeg
blogOgImage: ./cover.jpeg
canonical: https://blog.appsignal.com/2020/11/18/rails-model-patterns-and-anti-patterns.html
canonicalName: AppSignal Blog
published: true
tags:
  - Rails
  - Patterns
---

Welcome back to the second post in the Ruby on Rails Patterns and Anti-patterns series. In the last blog post, we went over what patterns and anti-patterns are in general. We also mentioned some of the most famous patterns and anti-patterns in the Rails world. In this blog post, we’ll go through a couple of Rails model anti-patterns and patterns.

If you’re struggling with models, this blog post is for you. We will quickly go through the process of putting your models on a diet and finish strongly with some things to avoid when writing migrations. Let’s jump right in.

## ~~Fat~~ Overweight models

When developing a Rails application, whether it’s a full-blown Rails website or an API, people tend to store most of the logic in the model. In the last blog post, we had an example of a Song class that did many things. Keeping a lot of things in the model breaks the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) (SRP).

Let’s have a look.

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

The problem with models like these is that they become a dumping ground for the different logic related to a song. Methods start piling up as they get added slowly, one by one over time.

I suggested splitting the code inside the model into smaller modules. But by doing that, you are simply moving code from one place to another. Nonetheless, moving code around allows you to organize code better and avoid obese models with reduced readability.

Some people even resort to using [Rails concerns](https://blog.appsignal.com/2020/09/16/rails-concers-to-concern-or-not-to-concern.html) and find that the logic can be reused across models. I previously wrote about it and some people loved it, others didn’t. Anyway, the story with concerns is similar to modules. You should be aware that you are just moving code to a module that can be included anywhere.

Another alternative is to create small classes and then call them whenever needed. For example, we can extract the song converting code to a separate class.

```rb
class SongConverter
  attr_reader :song

  def initialize(song)
    @song = song
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

class Song
  ...

  def converter
    SongConverter.new(self)
  end

  ...
end
```

Now we have the `SongConverter` that has the purpose of converting songs to a
different format. It can have its own tests and future logic about converting.
And, if we want to convert a song to MP3, we can do the following:

```rb
@song.converter.to_mp3
```

To me, this looks a bit clearer than using a module or a concern. Maybe because I prefer to use composition over inheritance. I consider it more intuitive and readable. I suggest you review both cases before deciding which way to go. Or you can choose both if you want, nobody is stopping you.

## SQL Pasta Parmesan

Who doesn’t love some good pasta in real life? On the other hand, when it comes to code pasta, almost no one is a fan. And for good reasons. In Rails models, you can quickly turn your Active Record usage into spaghetti, swirling around all over the codebase. How do you avoid this?

There are a few ideas out there that seem to keep those long queries from turning into lines of spaghetti. Let’s first see how database-related code can be everywhere. Let’s go back to our Song model. Specifically, to when we try to fetch something from it.

```rb
class SongReportService
  def gather_songs_from_artist(artist_id)
    songs = Song.where(status: :published)
                .where(artist_id: artist_id)
                .order(:title)

    ...
  end
end

class SongController < ApplicationController
  def index
    @songs = Song.where(status: :published)
                 .order(:release_date)

    ...
  end
end

class SongRefreshJob < ApplicationJob
  def perform
    songs = Song.where(status: :published)

    ...
  end
end
```

In the example above, we have three use-cases where the Song model is being queried. In the SongReporterService that is used for reporting data about songs, we try to get published songs from a concrete artist. Then, in the SongController, we get published songs and order them by the release date. And finally, in the SongRefreshJob we get only published songs and do something with them.

This is all fine, but what if we suddenly decide to change the status name to released or make some other changes to the way we fetch songs? We would have to go and edit all occurrences separately. Also, the code above is not DRY. It repeats itself across the application. Don’t let this get you down. Luckily, there are solutions to this problem.

We can use Rails scopes to DRY this code out. Scoping allows you to define commonly-used queries, which can be called on associations and objects. This makes our code readable and easier to change. But, maybe the most important thing is that scopes allow us to chain other Active Record methods such as joins, where, etc. Let’s see how our code looks with scopes.

```rb
class Song < ApplicationRecord
  ...

  scope :published, ->            { where(published: true) }
  scope :by_artist, ->(artist_id) { where(artist_id: artist_id) }
  scope :sorted_by_title,         { order(:title) }
  scope :sorted_by_release_date,  { order(:release_date) }

  ...
end

class SongReportService
  def gather_songs_from_artist(artist_id)
    songs = Song.published.by_artist(artist_id).sorted_by_title

    ...
  end
end

class SongController < ApplicationController
  def index
    @songs = Song.published.sorted_by_release_date

    ...
  end
end

class SongRefreshJob < ApplicationJob
  def perform
    songs = Song.published

    ...
  end
end
```

There you go. We managed to cut the repeating code and put it in the model. But this doesn’t always work out for the best, especially if you are diagnosed with the case of a fat model or a [God Object](https://en.wikipedia.org/wiki/God_object). Adding more and more methods and responsibilities to the model might not be such a great idea.

My advice here is to keep scope usage to a minimum and only extract the common queries there. In our case, maybe the where(published: true) would be a perfect scope since it is used everywhere. For other SQL related code, you could use something called a Repository pattern. Let’s find out what it is.

## Repository pattern

What we are about to show is not a 1:1 Repository pattern as defined in the [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design) book. The idea behind ours and the Rails Repository pattern is to separate database logic from business logic. We could also go full-on and create a repository class that does the raw SQL calls for us instead of Active Record, but I wouldn’t recommend such things unless you really need it.

What we can do is create a SongRepository and put the database logic in there.

```rb
class SongRepository
  class << self
    def find(id)
      Song.find(id)
    rescue ActiveRecord::RecordNotFound => e
      raise RecordNotFoundError, e
    end

    def destroy(id)
      find(id).destroy
    end

    def recently_published_by_artist(artist_id)
      Song.where(published: true)
          .where(artist_id: artist_id)
          .order(:release_date)
    end
  end
end

class SongReportService
  def gather_songs_from_artist(artist_id)
    songs = SongRepository.recently_published_by_artist(artist_id)

    ...
  end
end

class SongController < ApplicationController
  def destroy
    ...

    SongRepository.destroy(params[:id])

    ...
  end
end
```

What we did here is we isolated the querying logic into a testable class. Also, the model is no longer concerned with scopes and logic. The controller and models are thin, and everyone’s happy. Right? Well, there is still Active Record doing all the heavy pulling there. In our scenario, we use find, which generates the following:

```sql
SELECT "songs".* FROM "songs" WHERE "songs"."id" = $1 LIMIT $2  [["id", 1], ["LIMIT", 1]]
```

The “right” way would be to have all this defined inside the SongRepository. As I said, I would not recommend that. You don’t need it and you want to have full control. A use case for going away from Active Record would be that you need some complex tricks inside SQL that are not easily supported by Active Record.

Talking about raw SQL and Active Record, I also have to bring up one topic. The topic of migrations and how to do them properly. Let’s dive in.

## Migrations - who cares?

I often hear an argument when writing migrations that the code there should not be as good as it is in the rest of the application. And that argument doesn’t sit well with me. People tend to use this excuse to set up smelly code in the migrations since it will only be run once and forgotten. Maybe this is true if you are working with a couple of people and everyone is in constant sync all the time.

The reality is often different. The application can be used by a larger number of people not knowing what happens with different application parts. And if you put some questionable one-off code there, you might break someone’s development environment for a couple of hours because of the corrupted database state or just a weird migration. Not sure if this is an anti-pattern, but you should be aware of it.

How to make migrations more convenient for other people? Let’s go through a list that will make migrations easier for everyone on the project.

### Make sure always to provide a down method.

You never know when something is going to be rolled back. If your migration is not reversible, make sure to raise ActiveRecord::IrreversibleMigration exception like so:

```rb
def down
  raise ActiveRecord::IrreversibleMigration
end
```

### Try to avoid Active Record in migrations

The idea here is to minimize external dependencies except for the state of the database at the time when the migration should be executed. So there will be no Active Record validations to ruin (or maybe save) your day. You are left with plain SQL. For example, let’s write a migration that will publish all songs from a certain artist.

```rb
class UpdateArtistsSongsToPublished < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      UPDATE songs
      SET published = true
      WHERE artist_id = 46
    SQL
  end

  def down
    execute <<-SQL
      UPDATE songs
      SET published = false
      WHERE artist_id = 46
    SQL
  end
end
```

If you have a great need for the Song model, a suggestion would be to define it inside the migration. That way, you can bulletproof your migration from any potential changes in the actual Active Record model inside the app/models. But, is this all fine and dandy? Let’s go to our next point.

### Separate schema migrations from data migrations

Going through the [Rails Guides on migrations](https://edgeguides.rubyonrails.org/active_record_migrations.html), you'll read the following:

> Migrations are a feature of Active Record that allows you to evolve your **database schema** over time. Rather than write schema modifications in pure SQL, migrations allow you to use a Ruby DSL to describe changes to your tables.

In the summary of the guide, there is no mention of editing the actual data of
the database table, only the structure. So, the fact that we used the regular migration
to update songs in the second point is not completely right.

If you need to do something similar in your project often, consider using
the [`data_migrate` gem](https://github.com/ilyakatz/data-migrate). It is a nice way
of separating data migrations from schema migrations. We can easily rewrite our previous example with it. To generate the data migration, we can do the following:

```bash
bin/rails generate data_migration update_artists_songs_to_published
```

And then add the migration logic there:

```rb
class UpdateArtistsSongsToPublished < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      UPDATE songs
      SET published = true
      WHERE artist_id = 46
    SQL
  end

  def down
    execute <<-SQL
      UPDATE songs
      SET published = false
      WHERE artist_id = 46
    SQL
  end
end
```

This way, you are keeping all your schema migrations inside the `db/migrate`
directory and all the migrations that deal with the data inside the `db/data`
directory.

## Final thoughts

Dealing with models and keeping them readably in Rails is a constant struggle. Hopefully, in this blog post, you got to see the possible pitfalls and solutions to common problems. The list of model anti-patterns and patterns is far from complete in this post, but these are the most notable ones I found recently.

If you are interested in more Rails patterns and anti-patterns, stay tuned for the next installment in the series. In upcoming posts, we’ll go through common problems and solutions to the view and controller side of the Rails MVC.

Until next time, cheers!
