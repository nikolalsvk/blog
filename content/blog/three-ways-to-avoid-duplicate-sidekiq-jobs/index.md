---
title: Three Different Ways To Avoid Duplicate Sidekiq Jobs
description: TODO
slug: three-different-ways-to-avoid-duplicate-sidekiq-jobs
date: 2021-04-18
published: true
tags:
  - Rails
  - Sidekiq
---

Chances are that if you are writing some sort of a Ruby code, you are using
Sidekiq to handle background processing. If you are coming from the ActiveJob
or some other background, stay tuned, some of the tips can be applied there as
well.

Folks utilize (Sidekiq) background jobs for many different cases. Some crunch
numbers, some dispatch welcome emails to users, and some even schedule data
syncing. Whatever your case may be, you might eventually come to a request to
avoid duplicate jobs. By duplicate jobs I envision two jobs that do the exactly
same thing. Let us dive in on that a bit.

## Why De-Duplicate Jobs?

Imagine a scenario where your job like the following:

```rb
class BookSalesWorker
  include Sidekiq::Worker

  def perform(book_id)
    crunch_some_numbers(book_id)

    upload_to_s3
  end

  ...
end
```

The `BookSalesWorker` always does the same thing, queries the DB for a book
based on the `book_id` and fetches the latest sales data to calculate some
numbers. Then, it uploads them to a storage service. And imagine every time a
book is sold on your website, you will have this job enqueued.

Now what if you got 100 sales at one moment, you'd have 100 of these jobs doing
exactly the same thing. Maybe you are fine with that, you don't care about S3
writes that much and your queues are not as congested so you can handle that
load. But, "does it scale?"™️

Well, definitely not. If you start receiving even more sales on even more
books, your queue would pile up so fast with unnecessary work. If you have 100
jobs that does the same thing for a single book, and you 10 books selling in
parallel, you are now 1000 jobs deep in your queue, where in reality, you could
have just 10 jobs for each book.

Now, let's go through couple of options on how you can prevent duplicate jobs
from piling up your queues.

## DIY Way

If you are not a fan of external dependencies and complex logic, you can go
ahead and add some kind of a custom solution to your codebase.

### One Flag Approach

You can add one flag that decides whether to enqueue a job or not.
One might add a `sales_enqueued_at` in their Book table and maintain that
one. For example:

```rb
# somewhere deep in the codebase

# Check if the job was enqueued more than 10 minutes ago
if book.sales_enqueued_at < 10.minutes.ago
  # Update sales_enqueued_at
  book.update(sales_enqueued_at: Time.current)

  # Enqueue the job
  BookSalesWorker.perform_later(book)
end
```

That means that no new jobs will be enqueued until 10 minutes is passed from
when the last job got enqueued. After 10 minutes is passed, we then update the
`sales_enqueued_at` and enqueue a new job.

Another thing you can do is set one flag that is boolean - e.g.
`crunching_sales`. You set `crunching_sales` to true before the first job is
enqueued. Then, you set it to false once the job is complete. All other jobs
that try to schedule will be rejected until `crunching_sales` is false.

### Two Flags Approach

If "locking" a job from being enqueued for 10 minutes sounds too scary, but you are
still fine with extra flags in your code, then the next suggestion might interest you.

You can add another flag to the existing `sales_enqueued_at` - the `sales_calculated_at`.
Then, our code would look something like this:

```rb
if book.sales_enqueued_at <= book.sales_calculated_at
  book.update(sales_enqueued_at: Time.current)

  BookSalesWorker.perform_later(book)
end

class BookSalesWorker
  include Sidekiq::Worker

  def perform(book_id)
    crunch_some_numbers(book_id)

    upload_to_s3

    # New adition
    book.update(sales_calculated_at: Time.current)
  end

  ...
end
```

Now we control a portion of time between job is enqueued and finished. In that
portion of time, no job can be enqueued. While the job is running, the
`sales_enqueued_at` will be larger than `sales_calculated_at`. When the job
finishes running, the `sales_calculated_at` will be larger (more recent) than
the `sales_enqueued_at` and new job will get enqueued.

Using two flags might be interesting so you could show when was the last time
those sales numbers got updated in the UI. Then the users that read those
numbers can have an idea on how recent is the data. A win-win situation.

### Flag Sum Up

It might be tempting to do solutions like these in the time of need, but to me,
they look a bit clumsy and they add some overhead. I would recommend using
this if your use case is simple, but as soon as it proves complex or not
enough, I'd urge you to try out other options.

A huge con with the flag approach approach is that you will lose all the jobs
that tried to enqueue during that 10 minute period or the period where the no
other jobs could be scheduled. A huge pro is that you are not bringing in
dependencies and it will alleviate the queue numbers a bit.

### Traversing The Queue

One thing you can do is create your own
