import React, { useEffect, useMemo, useState } from "react"
import { graphql } from "gatsby"
import { ref, Database, onValue } from "firebase/database"
import { Chart as ChartJS } from "chart.js"

import Layout from "../components/layout"
import SEO from "../components/seo"
import loadDb from "../utils/firebase-db"
import SubscribeForm from "../components/subscribe-form"
import Spacer from "../components/spacer"

import { COLORS, useTheme } from "../contexts/theme"
import { Subscribers } from "../components/subscribers"
import { TopPostsSection } from "../components/top-posts-section"
import { PostsByYearSection } from "../components/posts-by-year-section"
import { GuestPostsSection } from "../components/guest-posts-section"
import { CardWithStat } from "../components/card-with-stat"

export interface Post {
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
        node: Post
      }[]
    }
    newsletters: {
      edges: {
        node: Post
      }[]
    }
  }
}

const Dashboard = ({ data }: Props) => {
  const { theme } = useTheme()
  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl
  const posts = data.posts.edges
  const newsletters = data.newsletters.edges

  const fontColor = theme === "dark" ? COLORS.dark.text : COLORS.light.text

  useEffect(() => {
    ChartJS.defaults.color = fontColor
    ChartJS.defaults.font.family = "Roboto, sans-serif"
  }, [fontColor])

  const [views, setViews] = useState<null | { [key: string]: number }>(null)

  // Subscribe to view count updates
  useEffect(() => {
    const onViews = (newViews: { val: () => { [key: string]: number } }) => {
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

  const totalViews = useMemo(() => {
    if (!views) {
      return null
    }

    const viewCounts = Object.values(views)

    return viewCounts.reduce((acc, curr): number => {
      if (typeof curr !== "number") {
        return Object.values(curr as number).reduce(
          (acc, curr) => acc + curr,
          0
        )
      }

      return acc + curr
    }, 0)
  }, [views])

  return (
    <Layout title={siteTitle}>
      <SEO title="Dashboard" canonical={siteUrl} />
      <h1>Dashboard</h1>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardWithStat
          href="/"
          title="views"
          stat={totalViews ? totalViews.toLocaleString() : "..."}
        >
          <span className="absolute bottom-2 right-4 text-xl">👀</span>
        </CardWithStat>
        <CardWithStat href="/" title="posts" stat={posts.length}>
          <span className="absolute bottom-2 right-4 text-xl">📝</span>
        </CardWithStat>
        <CardWithStat
          href="/newsletter"
          title="newsletters"
          stat={newsletters.length}
        >
          <span className="absolute bottom-2 right-4 text-xl">💌</span>
        </CardWithStat>
        <CardWithStat
          href="/newsletter"
          title="subscribers"
          stat={<Subscribers />}
        >
          <span className="absolute bottom-2 right-4 text-xl">⛷</span>
        </CardWithStat>
      </section>

      <TopPostsSection posts={posts} views={views} />

      <PostsByYearSection posts={posts} fontColor={fontColor} />

      <GuestPostsSection posts={posts} fontColor={fontColor} />

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
