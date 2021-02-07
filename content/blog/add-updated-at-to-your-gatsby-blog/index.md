---
title: Add Updated At To Your Gatsby Blog
description: Improve your blog post SEO with showing the date when each post got updated.
slug: add-updated-at-to-your-gatsby-blog
date: 2021-02-09
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
published: false
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
up-do-date. Many websites and especially bloggers to this from time to time. I
am also doing this here and then, but I am not showing that information to my
readers.

What is also important, I was not able to show how much up-to-date my blog
posts were to search engines (read Google). And if you want search engines to
show your blog post as close to the top of the search results as possible,
showing the time post got updated can be useful. So not only are you
informing users of how relevant the post is, but you are also improving
your post's SEO.

![SEO stocks going up](./seo-stonks.jpg)

If you are writing covering topics that change often (JavaScript _khm-khm_),
you probably want to keep those posts fresh. Besides keeping them fresh, you
want other people to know that it is fresh and not from back in the day. Of
course, there are those timeless pieces of writing that do not benefit from
showing the time of updating. If you feel you have posts like that, maybe it
is best to leave them out of showing updated at time.

I wanted to show "Updated at" for my blog posts for a very long time, and I
finally ended up doing it. I was inspired by the Monica Lent's recent
newsletter issue where she mentioned how you can do this quickly, but there
wasn't much detail on how exactly to do it.

Stay tuned, we are going to go through couple of solutions on how to show the
last modified or updated at date on your blog posts using Gatsby.

## An Obvious (Manual) Solution

One of the straightforward solutions is to add a field in your frontmatter like so:

```md
---
title: Top 5 JavaScript Libraries in 2021
published: 2021-01-04
updated: 2021-02-09
---

Hey everyone, let us go through some of the top 5 JS libraries this year.
```

If you notice, we have two date fields. One field is `published` which tells
when the post was published. Then, we have the `updated` field that will show
when the post was actually updated or modified. I named the field `updated` but
you can go ahead and unleash your inner creative and come up with a name that
better suits you.

Using this manual approach is nice and simple, but it has one drawback. You
have to remember to update it every time you update the blog post, which leaves
the room for error.

What would be better is if we could somehow automate the whole process.
Luckily, we are going in that direction right now, strap on.

## Not So Obvious (Automated) Solution

If we want to get rid of the pain of constantly updating a date field in our
frontmatter every time we update the blog post, we can use Git. Thankfully, Git
records the date, time and what files you modified in each commit. All this
information that Git stores is like music to our ears, because it is exactly
what we need.

But, how do we "pull in" this information into the Gatsby? We will need to
modify the `gatsby-node.js` and add a new field dynamically. If you are a
beginner or you are a bit scared of touching the `gatsby-node.js`, I suggest
you check out my blog post
"[Setting Up Gatsby Blog From Scratch](/setting-up-gatsby-blog-from-scratch)".
There we dwell deep into doing things dynamically with `gatsby-node.js`. Or you
can hold on to the end of the blog post where we show a simpler solution.

To generate a new field that will pull last modified time from Git, we have to
add the following code to our `gatsby-node.js`:

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
query($slug: String!) {
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
us so we don't have to write and maintain custom solution inside
`gatsby-node.js`.

After installing the plugin and running the Gatsby server, a couple of new
fields will exist on the `File` node. There's one problem with this approach,
we query for the `markdownRemark`, not the `file` in our GraphQL query
for a blog post.

Luckily, that is not a big problem, because `File` is a parent of `MarkdownRemark` node. What that means is we can extract those new fields from the plugin like so:

```graphql
query($slug: String!) {
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

Don't worry if you got confused, I did too. We used here an [inline fragment](https://graphql.org/learn/queries/#inline-fragments) from GraphQL. The parent of a `MarkdownRemark` node can be a `File`, so we did `... on File` so we can access `File`'s fields. It's not so clean as the previous example where we added the field directly to the `MarkdownRemark`, but it is still good.

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

Hopefully you managed to set up modified / updated time of your blog post
successfully after this post. I am planning to release another related blog
post soon, explaining how you can improve your blog's SEO further more. If you
are interested in content like that, consider subscribing to the
[newsletter](/newsletter).

Also, share this with your friends and coworkers on Twitter below:

Until the next one, cheers.
