import { Link } from "gatsby"
import React, { useMemo } from "react"
import { Post } from "../pages/dashboard"

export const TopPostsSection = ({
  posts,
  views,
}: {
  posts: { node: Post }[]
  views: { [key: string]: number } | null
}) => {
  const topPosts = useMemo(() => {
    if (!views) {
      return []
    }

    const postsBySlug = posts.reduce((acc, { node }) => {
      const slug = node.fields.slug.replace(/\//g, "")

      acc[slug] ??= node

      return acc
    }, {} as Record<string, Post>)

    return Object.keys(views)
      .sort((a, b) => views[b] - views[a])
      .map((slug) => ({
        ...postsBySlug[slug],
        views: views[slug].toLocaleString(),
      }))
      .filter((post) => post.frontmatter !== undefined)
      .slice(0, 6)
  }, [views, posts])

  return (
    <article>
      <header>
        <h2>Most popular blog posts</h2>
      </header>
      <section className="grid grid-cols-2 gap-4">
        {!topPosts.length &&
          [...Array(6)].map((_, i) => (
            <section
              key={i}
              className="animate-pulse p-5 border shadow-xl hover:shadow-xl rounded-lg hover:rotate-1 hover:skew-y-1 transition-all"
            >
              <div className="flex flex-col justify-between h-full">
                <section>
                  <div className="h-4 mb-2 mr-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="grid mt-4 grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
                  </div>
                </section>
                <div className="grid grid-cols-3 mt-8 gap-4">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
                </div>
              </div>
            </section>
          ))}
        {topPosts.map((postWithViews) => {
          return (
            <Link
              to={postWithViews.fields.slug}
              key={postWithViews.fields.slug}
              className="p-5 border shadow-xl hover:shadow-xl rounded-lg hover:rotate-1 hover:skew-y-1 transition-all"
            >
              <div className="flex flex-col justify-between h-full">
                <section>
                  <h3 className="m-0">{postWithViews.frontmatter.title}</h3>
                  <p className="m-0 pt-1 text-xs text-primary">
                    {postWithViews.frontmatter.date}
                  </p>
                </section>
                <p className="m-0 pt-4 text-sm text-primary">
                  <b>{postWithViews.views.toString()}</b> views
                </p>
              </div>
            </Link>
          )
        })}
      </section>
    </article>
  )
}
