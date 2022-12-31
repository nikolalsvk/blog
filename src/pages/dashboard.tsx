import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import { ref, Database, onValue } from "firebase/database"

import Layout from "../components/layout"
import SEO from "../components/seo"
import loadDb from "../utils/firebase-db"
import SubscribeForm from "../components/subscribe-form"
import Spacer from "../components/spacer"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
      }
    }
    posts: {
      edges: {
        node: {
          excerpt: string
          fields: {
            slug: string
          }
          frontmatter: {
            date: string
            title: string
            description: string
            slug: string
            canonical: string
            canonicalName: string
            newsletter: boolean
          }
        }
      }[]
    }
    newsletters: {
      edges: {
        node: {
          excerpt: string
          fields: {
            slug: string
          }
          frontmatter: {
            date: string
            title: string
            description: string
            slug: string
            canonical: string
            canonicalName: string
            newsletter: boolean
          }
        }
      }[]
    }
  }
}

type Node = Props["data"]["allMarkdownRemark"]["edges"][number]["node"]

const Dashboard = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl
  const posts = data.posts.edges
  const newsletters = data.newsletters.edges

  console.log(posts)

  const [views, setViews] = useState<
    string | { [key: string]: number | { [key: string]: number } }
  >("")

  // Subscribe to view count updates
  useEffect(() => {
    const onViews = (newViews: { val: () => string }) => {
      setViews(newViews.val())
    }

    let db: Database

    const fetchData = async () => {
      try {
        db = await loadDb()

        const slugRef = ref(db, `views`)

        onValue(slugRef, onViews)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  console.log(views)

  const viewCounts = Object.values(views) as number[]
  console.log("View counts", viewCounts)
  const totalViews = viewCounts.reduce((acc, curr) => {
    if (typeof curr !== "number") {
      return Object.values(curr).reduce((acc, curr) => acc + curr, 0)
    }

    return acc + curr
  }, 0)

  const postsByYear = posts.reduce((acc, { node }) => {
    const date = new Date(node.frontmatter.date)
    const year = date.getFullYear()

    acc[year] = acc[year] ? [...acc[year], node] : [node]

    return acc
  }, {} as Record<number, Node[]>) as Record<number, Node[]>

  console.log(postsByYear)

  const guestPosts = posts.reduce((acc, { node }) => {
    const guestBlog = node.frontmatter.canonicalName ?? "Pragmatic Pineapple"

    acc[guestBlog] = acc[guestBlog] ? [...acc[guestBlog], node] : [node]

    return acc
  }, {} as Record<string, Node[]>) as Record<number, Node[]>

  const postsBySlug = posts.reduce((acc, { node }) => {
    const slug = node.frontmatter.slug

    acc[slug] ??= node

    return acc
  }, {} as Record<number, Node[]>) as Record<number, Node[]>

  console.log(postsBySlug)

  const numberFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
  })

  return (
    <Layout title={siteTitle}>
      <SEO title="Dashboard" canonical={siteUrl} />
      <h1>Welcome to the Pragmatic Pineapple Dashboard</h1>

      <section className="grid grid-cols-4 gap-4">
        <CardWithStat title="total views" stat={totalViews.toLocaleString()} />
        <CardWithStat title="posts" stat={posts.length} />
        <CardWithStat title="newsletters" stat={newsletters.length} />
      </section>

      <article>
        <header>
          <h2>Most popular blog posts</h2>
        </header>
        <section className="grid grid-cols-2 gap-4">
          {Object.keys(views)
            .sort((a, b) => views[b] - views[a])
            .map((slug) => ({
              ...postsBySlug[slug],
              views: views[slug].toLocaleString(),
            }))
            .filter((post) => post.frontmatter !== undefined)
            .slice(0, 6)
            .map((postWithViews) => {
              console.log(postWithViews)

              return (
                <Link
                  to={postWithViews.fields.slug}
                  className="p-5 shadow-xl hover:shadow-xl rounded-lg hover:rotate-y-2 hover:skew-y-1 transition-all"
                >
                  <h3 className="m-0">{postWithViews.frontmatter.title}</h3>
                  <p className="m-0 pt-1 text-xs text-primary">
                    {postWithViews.frontmatter.date}
                  </p>
                  <p className="m-0 pt-4 text-sm text-primary">
                    <b>{postWithViews.views.toString()}</b> views
                  </p>
                </Link>
              )
            })}
        </section>
      </article>

      <article>
        <header>
          <h2>Posts by year</h2>
        </header>
        {Object.keys(postsByYear)
          .sort((a, b) => b - a)
          .map((year) => {
            const singular = postsByYear[year].length === 1
            return (
              <p>
                In {year} there {singular ? "was" : "were"}{" "}
                {postsByYear[year].length} {singular ? "post" : "posts"}
              </p>
            )
          })}
      </article>

      <article>
        <header>
          <h2>Posts on other blogs</h2>
        </header>
        <section className="grid grid-cols-3 gap-4 mb-4">
          {Object.keys(guestPosts)
            .sort((a, b) => guestPosts[b].length - guestPosts[a].length)
            .map((blog) => {
              return (
                <section className="p-5 border-slate-500 shadow-xl hover:shadow-xl rounded-lg hover:rotate-y-2 hover:skew-y-1 transition-all">
                  <h3 className="m-0">{blog}</h3>
                  <p className="m-0 pt-4 text-sm text-primary">
                    <b>{guestPosts[blog].length}</b>{" "}
                    {guestPosts[blog].length === 1 ? "post" : "posts"}
                  </p>
                </section>
              )
            })}
        </section>
      </article>

      <Spacer />
      <SubscribeForm />
      <Spacer />
    </Layout>
  )
}

export default Dashboard

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { published: { eq: true }, newsletter: { ne: true } }
      }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            slug
            canonical
            canonicalName
            newsletter
          }
        }
      }
    }
    newsletters: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { published: { eq: true }, newsletter: { eq: true } }
      }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            slug
            canonical
            canonicalName
            newsletter
          }
        }
      }
    }
  }
`

interface CardWithStatProps {
  title: string
  stat: string
}

const CardWithStat = ({ title, stat }: CardWithStatProps) => {
  return (
    <section className="p-5 shadow-xl rounded-lg">
      <span className="text-5xl">{stat}</span>{" "}
      <span className="text-xs">{title}</span>
    </section>
  )
}
