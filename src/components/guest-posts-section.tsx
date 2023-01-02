import React, { useMemo } from "react"
import { COLORS, useTheme } from "../contexts/theme"
import { Post } from "../pages/dashboard"
import { BarChart } from "./charts"

interface Props {
  posts: { node: Post }[]
  fontColor: string
}

export const GuestPostsSection = ({ posts, fontColor }: Props) => {
  const { theme } = useTheme()

  const guestPosts = useMemo(() => {
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

    return postsByCanonical.sort((a, b) => b.posts.length - a.posts.length)
  }, [posts])

  const guestPostsChartData = {
    labels: guestPosts.map((guest) => guest.name),
    datasets: [
      {
        label: "Posts",
        data: guestPosts.map((guest) => guest.posts.length),
        backgroundColor: COLORS.light.secondary,
        borderColor:
          theme === "light" ? COLORS.light.primary : COLORS.dark.primary,
        borderRadius: 8,
        borderWidth: 3,
      },
    ],
  }

  return (
    <article>
      <header>
        <h2>Posts on other blogs</h2>
      </header>

      <section className="">
        <BarChart color={fontColor} data={guestPostsChartData} />
      </section>
    </article>
  )
}
