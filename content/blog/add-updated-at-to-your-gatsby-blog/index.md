---
title: Add Updated At To Your Gatsby Blog
description: Improve your blog post SEO by showing the date when each post got updated.
slug: add-updated-at-to-your-gatsby-blog
date: 2021-02-08
coverImage: ./cover.jpg
blogOgImage: ./og-image.jpg
published: true
tags:
  - Gatsby
  - JavaScript
  - SEO
---

![Lonely cliff](./cover.jpg)

<div class="photo-caption">
<span>Photo by <a href="https://unsplash.com/@guillermoalvarez?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Guillermo Álvarez</a> on <a href="https://unsplash.com/s/photos/updated-at?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
</div>

A great tip towards building your site reputation is keeping your content
up-to-date. Many websites and especially bloggers, do this from time to time. I
am also doing this here and then, but I am not showing that information to my
readers.

What is also important, I could not show how much up-to-date my blog posts were
to search engines (read Google). And if you want search engines to show your
blog post as close to the top of the search results as possible, showing the
time post updated can be useful. So not only are you informing users of how
relevant the post is, but you are also improving your post's SEO.

![SEO stocks going up](./seo-stonks.jpg)

If you are writing covering topics that often change (JavaScript khm-khm), you
probably want to keep those posts fresh. Of course, there are those timeless
pieces of writing that do not benefit from showing the time of updating. If you
feel you have posts like that, maybe it is best to leave them out of showing
the time of modification.

I wanted to show "Updated at" for my blog posts for a very long time, and I
finally ended up doing it. I was inspired by Monica Lent's recent newsletter
issue, where she mentioned how you could do this quickly, but there wasn't much
detail on how exactly to do it.

Stay tuned because we will go through a couple of solutions to show the last
modified or updated date on your blog posts using Gatsby.

## An Obvious (Manual) Solution

One of the straightforward solutions is to add a field in your front matter
like so:

```md
---
title: Top 5 JavaScript Libraries in 2021
published: 2021-01-04
updated: 2021-02-09
---

Hey everyone, let us go through some of the top 5 JS libraries this year.
```

If you notice, we have two date fields. One field is published, which tells
when the post was published. Then, we have the updated field that will show
when the post was updated or modified. I named the field updated, but you can
unleash your inner creativity and come up with a name that better suits you.

Using this manual approach is pleasant and straightforward, but it has one
drawback. You have to remember to update it every time you edit the blog post,
which leaves room for error.

What would be better is if we could somehow automate the whole process.
Luckily, we are going in that direction right now, strap on.

## Not So Obvious (Automated) Solution

If we want to get rid of the pain of continually updating a date field in our
front matter every time we edit the blog post, we can use Git. Thankfully, Git
records the date, time, and what files you modified in each commit. All this
information inside Git is like music to our ears because it is precisely what
we need.

But, how do we "pull-in" this information into the Gatsby? We will need to
modify the `gatsby-node.js` and add a new field dynamically. If you are a
beginner or you are a bit scared of touching the `gatsby-node.js`, I suggest you
check out my blog post
"[Setting Up Gatsby Blog From Scratch](/setting-up-gatsby-blog-from-scratch)".
There we dwell deep into doing things dynamically with `gatsby-node.js`. Or you
can hold on to the end of the blog post, where we show a more straightforward
solution.

To generate a new field that will pull the last modified time from Git, we have
to add the following code to our `gatsby-node.js`:

```js
const { execSync } = require("child_process")

exports.onCreateNode = ({ node, actions }) => {
  // ...

  if (node.internal.type === "MarkdownRemark") {
    const gitAuthorTime = execSync(
      `git log -1 --pretty=format:%aI ${node.fileAbsolutePath}`
    ).toString()
    actions.createNodeField({
      node,
      name: "gitAuthorTime",
      value: gitAuthorTime,
    })
  }

  // ...
}
```

What we are doing here is that we are telling Gatsby to add `gitAuthorTime`
field to a Node on the Node's creation. We use `execSync` to execute a `git log` command that returns an author date. The Git command is not so complicated
as it may seem, so let us break it down:

- `git log` returns the commit logs
- `git log -1` return the latest commit log
- `git log -1 --pretty=format:%aI` returns latest commit [author date](https://git-scm.com/docs/pretty-formats#Documentation/pretty-formats.txt-emaIem) in strict ISO 8601 format. There are a bunch of options in [its docs](https://git-scm.com/docs/pretty-formats)
- `git log -1 --pretty=format:%aI ${node.fileAbsolutePath}` returns all of the mentioned above, but for a specific file.

Awesome, now that we added a `gitAuthorTime` field to our Node, we can simply query for it in our blog post template:

```graphql
query ($slug: String!) {
  markdownRemark(fields: { slug: { eq: $slug } }) {
    # ...
    fields {
      gitAuthorTime
    }
    # ...
  }
}
```

And later we can access it in our props like so:

```jsx
import React from "react"

const BlogPost = (props) => {
  const { gitAuthorTime } = props.data.markdownRemark.fields

  render(<p>Updated at: ${gitAuthorTime}</p>)
}

export default BlogPost
```

Cool, but what if you don't want to configure the `gastby-node.js`? Look no
more, there is, and you guessed it, a Gatsby plugin for it.

## Easy (Automated) Solution

There is a
[gatsby-transformer-info](https://www.gatsbyjs.com/plugins/gatsby-transformer-gitinfo)
plugin that can pull in information from Git for us. Using the plugin will help
us, so we don't have to write and maintain custom solutions inside
`gatsby-node.js`.

After installing the plugin and running the Gatsby server, a couple of new
fields will exist on the `File` node. There's one problem with this approach,
we query for the `markdownRemark`, not the `file` in our GraphQL query
for a blog post.

Luckily, that is not a big problem, because `File` is a parent of `MarkdownRemark` node. What that means is we can extract those new fields from the plugin like so:

```graphql
query ($slug: String!) {
  markdownRemark(fields: { slug: { eq: $slug } }) {
    # ...
    parent {
      ... on File {
        fields {
          gitLogLatestDate
        }
      }
    }
    # ...
  }
}
```

Don't worry if you got confused, I did too. We used here an [inline fragment](https://graphql.org/learn/queries/#inline-fragments) from GraphQL. The parent of a `MarkdownRemark` node can be a `File`, so we did `... on File` so we could access `File`'s fields. It's not so clean as the previous example where we added the field directly to the `MarkdownRemark`, but it is still good.

We can then get the `gitLogLatestDate` in our props like so:

```jsx
import React from "react"

const BlogPost = (props) => {
  const { gitLogLatestDate } = props.data.markdownRemark.parent.fields

  render(<p>Updated at: ${gitLogLatestDate}</p>)
}

export default BlogPost
```

## Closing Off

Hopefully, you managed to successfully set up your blog post's modified /
updated time after this post. I plan to release another related blog
post soon, explaining how you can further improve your blog's SEO. If you
are interested in content like that, consider subscribing to the
[newsletter](/newsletter).

Also, share this with your friends and coworkers on Twitter below:

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">Just dropped a new blog post about adding a modified date on your <a href="https://twitter.com/GatsbyJS?ref_src=twsrc%5Etfw">@GatsbyJS</a> blog.<br><br>Would you add such kind of a feature?<a href="https://t.co/uszHgPEjAg">https://t.co/uszHgPEjAg</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/1358665782134263810?ref_src=twsrc%5Etfw">February 8, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Until the next one, cheers.
