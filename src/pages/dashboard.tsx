import React, { PropsWithChildren, ReactNode, useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import { ref, Database, onValue } from "firebase/database"
import { Chart as ChartJS } from "chart.js"

import Layout from "../components/layout"
import SEO from "../components/seo"
import loadDb from "../utils/firebase-db"
import SubscribeForm from "../components/subscribe-form"
import Spacer from "../components/spacer"

import { COLORS, useTheme } from "../contexts/theme"
import { LineChart, BarChart } from "../components/charts"
import { Subscribers } from "../components/subscribers"

interface Post {
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

type Node = Props["data"]["allMarkdownRemark"]["edges"][number]["node"]

const Dashboard = ({ data }: Props) => {
  const { theme } = useTheme()
  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl
  const posts = data.posts.edges
  const newsletters = data.newsletters.edges

  const fontColor = theme === "dark" ? COLORS.dark.text : COLORS.light.text

  ChartJS.defaults.color = fontColor
  ChartJS.defaults.font.family = "Roboto, sans-serif"

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

  const viewCounts = Object.values(views) as number[]
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

  let years = []
  const currentYear = new Date().getFullYear()
  let startYear = 2015
  while (startYear <= currentYear) {
    years.push(startYear++)
  }

  const postsByYearChartData = {
    labels: years,
    datasets: [
      {
        label: "Posts",
        data: years.map((year) => postsByYear[year]?.length || 0),
        borderColor:
          theme === "light" ? COLORS.light.primary : COLORS.dark.primary,
        backgroundColor:
          theme === "light" ? COLORS.light.secondary : COLORS.dark.secondary,

        tension: 0.2,
      },
    ],
  }

  const postsByCanonical = posts.reduce((acc, { node }) => {
    if (!node.frontmatter.canonical) {
      return acc
    }

    const guestBlog = node.frontmatter.canonicalName

    const existingGuest = acc.find((guest) => guest.name === guestBlog)
    if (existingGuest) {
      existingGuest.posts.push(node)

      acc = acc.map((guest) => {
        if (guest.name === existingGuest.name) {
          return existingGuest
        }
        return guest
      })
    } else {
      acc.push({ name: guestBlog, posts: [node] })
    }

    return acc
  }, [] as { name: string; posts: Post[] }[])

  const guestPosts = postsByCanonical.sort(
    (a, b) => b.posts.length - a.posts.length
  )

  const guestPostsChartData = {
    labels: guestPosts.map((guest) => guest.name),
    datasets: [
      {
        label: "Posts",
        data: guestPosts.map((guest) => guest.posts.length),
        backgroundColor:
          theme === "light" ? COLORS.light.secondary : COLORS.dark.secondary,
        borderColor:
          theme === "light" ? COLORS.light.primary : COLORS.dark.primary,
        borderRadius: 8,
        borderWidth: 3,
      },
    ],
  }

  const postsBySlug = posts.reduce((acc, { node }) => {
    const slug = node.frontmatter.slug

    acc[slug] ??= node

    return acc
  }, {} as Record<number, Post[]>) as Record<number, Post[]>

  const topPosts = Object.keys(views)
    .sort((a, b) => views[b] - views[a])
    .map((slug) => ({
      ...postsBySlug[slug],
      views: views[slug].toLocaleString(),
    }))
    .filter((post) => post.frontmatter !== undefined)
    .slice(0, 6)

  return (
    <Layout title={siteTitle}>
      <SEO title="Dashboard" canonical={siteUrl} />
      <h1>Dashboard</h1>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardWithStat
          title="total views"
          stat={totalViews ? totalViews.toLocaleString() : "..."}
        >
          <span className="absolute bottom-2 right-4 text-xl">👀</span>
        </CardWithStat>
        <CardWithStat title="posts" stat={posts.length}>
          <span className="absolute bottom-2 right-4 text-xl">📝</span>
        </CardWithStat>
        <CardWithStat title="newsletters" stat={newsletters.length}>
          <span className="absolute bottom-2 right-4 text-xl">💌</span>
        </CardWithStat>
        <CardWithStat title="subscribers" stat={<Subscribers />}>
          <span className="absolute bottom-2 right-4 text-xl">⛷</span>
        </CardWithStat>
      </section>

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

      <article>
        <header>
          <h2>Posts by year</h2>
        </header>

        <LineChart color={fontColor} data={postsByYearChartData} />
      </article>

      <article>
        <header>
          <h2>Posts on other blogs</h2>
        </header>

        <section className="">
          <BarChart color={fontColor} data={guestPostsChartData} />
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
  stat: ReactNode
}

const CardWithStat = ({
  title,
  stat,
  children,
}: PropsWithChildren<CardWithStatProps>) => {
  return (
    <section className="relative border p-5 shadow-xl hover:shadow-xl rounded-lg hover:rotate-1 hover:skew-y-2 transition-all">
      <h3 className="m-0">{stat}</h3> <p className="text-xs mb-3">{title}</p>
      {children}
    </section>
  )
}
