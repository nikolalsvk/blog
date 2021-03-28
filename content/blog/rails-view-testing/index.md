---
title: Rails View Testing
description: TODO
slug: rails-view-testing
date: 2021-03-30
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
published: true
tags:
  - Rails
  - Testing
---

There is a lot of ways to test a Ruby on Rails application, but there is one
way that is not so often talked about. That is the way of testing Rails views.
Yes - there are controller, model and other types of tests, but we rarely see
the view layer tests. Let's give them more attention and see what they are all
about.

You might ask - well, why don't you write integration tests and test view layer
with them? I could, but running integration tests can be slow and writing a
simple view 'unit' test can be much simpler. Plus, RSpec has great support for
writing a view spec. What is even more interesting, I created an example
project to test these out and this is what I found out.

## New Project, Who This

I created new Rails 6.1 project, installed RSpec and generated the Book model with:

```bash
bin/rails generate scaffold Book title:string description:text download_url:string status:string
```

And look at what I got generated:

```bash
...

    create      spec/views/books/edit.html.erb_spec.rb
    create      spec/views/books/index.html.erb_spec.rb
    create      spec/views/books/new.html.erb_spec.rb
    create      spec/views/books/show.html.erb_spec.rb

...
```

If we take a look at one of the specs, we can find the following code:

```rb
# spec/views/books/index.html.erb_spec.rb

require 'rails_helper'

RSpec.describe "books/index", type: :view do
  before(:each) do
    assign(:books, [
      Book.create!(
        title: "Title",
        description: "MyText",
        download_url: "Download Url",
        status: "Status"
      ),
      Book.create!(
        title: "Title",
        description: "MyText",
        download_url: "Download Url",
        status: "Status"
      )
    ])
  end

  it "renders a list of books" do
    render
    assert_select "tr>td", text: "Title".to_s, count: 2
    assert_select "tr>td", text: "MyText".to_s, count: 2
    assert_select "tr>td", text: "Download Url".to_s, count: 2
    assert_select "tr>td", text: "Status".to_s, count: 2
  end
end
```

There's the `type: view` that indicates the special type of specs. We will go
into this later a bit. You can distinguish `assign` and `render` methods that
indicate that they are defined somewhere internally and not something we should
provide. But, there is also one thing sticking into my eyes as I go through
this test.

What's interesting here, this `assert_select` matcher looks a bit "deprecated"
or like it is not from the RSpec world. There's no class `expect(...).to`
formation. What happened here is that the template for generating these specs
got a bit dusty. It didn't change from 2010 when it was originally pushed to
the repo. You can find the commit that brought the `assert_select`
[here on GitHub](https://github.com/rspec/rspec-rails/commit/800a56402ced481ae5b531e9a1d1a69bc8f66e90).

No worries, I didn't see many projects actually using view specs, let alone
generating models and relying on those generated view specs. I guess that is
why nobody took out the time to refactor or improve the existing template. But,
since this blog post is about focusing our attention on Rails view testing,
let us try to do just that.

## Spring Cleaning

If we take a look at the [docs for view specs in RSpec](https://relishapp.com/rspec/rspec-rails/docs/view-specs/view-spec), we
can see that almost all of them use the following:

```rb
expect(rendered).to match /something/
```

To switch the index page test to use different matchers
What we get is a test that looks like this:

```rb
# spec/views/books/index.html.erb_spec.rb

require 'rails_helper'

RSpec.describe "books/index", type: :view do
  before(:each) do
    assign(:books, [
      Book.create!(
        title: "Rails Testing",
        description: "How to test Ruby on Rails applications.",
        download_url: nil,
        status: "draft"
      ),
      Book.create!(
        title: "Rails Patterns",
        description: "A book about patterns and anti-patterns in Ruby on Rails.",
        download_url: "rails-patterns.com/download",
        status: "published"
      )
    ])
  end

  it "renders a list of books" do
    render

    expect(rendered).to match(/Rails Testing/)
    expect(rendered).to include("Rails Patterns")

    expect(rendered).to match(/How to test Ruby on Rails applications./)
    expect(rendered).to include("A book about patterns and anti-patterns in Ruby on Rails.")

    expect(rendered).to include("rails-patterns.com/download")

    expect(rendered).to include("published")
  end
end
```

This feels more like RSpec. But, what can be noticed is that we lost that
ability to check whether the actual content is inside a certain HTML tag.
`assert_select` gives us more flexibility in matching the expected result.
There's more options you can pass to `assert_select` in
[its docs](https://api.rubyonrails.org/v4.1/classes/ActionDispatch/Assertions/SelectorAssertions.html#method-i-assert_select).
I suggest you choose the option you feel gives you more control.
