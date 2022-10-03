import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { ref, Database, onValue } from "firebase/database"

import Layout from "../components/layout"
import SEO from "../components/seo"
import loadDb from "../utils/firebase-db"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
      }
    }
    allMarkdownRemark: {
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
  const posts = data.allMarkdownRemark.edges

  const [views, setViews] = useState("")

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

  return (
    <Layout title={siteTitle}>
      <SEO title="Dashboard" canonical={siteUrl} />
      <h1>Welcome to the Pragmatic Pineapple Dashboard</h1>

      <div>Total number of posts: {posts.length}</div>

      <article>
        <header>
          <h2>Most popular blog posts</h2>
        </header>
        {Object.keys(views)
          .sort((a, b) => views[b] - views[a])
          .map((slug) => ({ ...postsBySlug[slug], views: views[slug] }))
          .filter((post) => post.frontmatter !== undefined)
          .slice(0, 5)
          .map((postWithViews) => {
            console.log(postWithViews)

            return (
              <p>
                {postWithViews.frontmatter.title}:{" "}
                {postWithViews.views.toString()}
              </p>
            )
          })}
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
        {Object.keys(guestPosts)
          .sort((a, b) => guestPosts[b].length - guestPosts[a].length)
          .map((blog) => {
            return (
              <p>
                For {blog} blog there were {guestPosts[blog].length}{" "}
                {guestPosts[blog].length === 1 ? "post" : "posts"}
              </p>
            )
          })}
      </article>
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
    allMarkdownRemark(
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
          }
        }
      }
    }
  }
`
