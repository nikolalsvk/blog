import React, { useMemo } from "react"
import { COLORS, useTheme } from "../contexts/theme"
import { Post } from "../pages/dashboard"
import { LineChart } from "./charts"

interface Props {
  posts: { node: Post }[]
  fontColor: string
}

export const PostsByYearSection = ({ posts, fontColor }: Props) => {
  const { theme } = useTheme()

  const postsByYear = useMemo(() => {
    return posts.reduce((acc, { node }) => {
      const date = new Date(node.frontmatter.date)
      const year = date.getFullYear()

      acc[year] = acc[year] ? [...acc[year], node] : [node]

      return acc
    }, {} as Record<number, Post[]>) as Record<number, Post[]>
  }, [posts])

  const years = useMemo(() => {
    let val = []
    const currentYear = new Date().getFullYear()
    let startYear = 2015
    while (startYear <= currentYear) {
      val.push(startYear++)
    }
    return val
  }, [])

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

  return (
    <article>
      <header>
        <h2>Posts by year</h2>
      </header>

      <LineChart color={fontColor} data={postsByYearChartData} />
    </article>
  )
}
