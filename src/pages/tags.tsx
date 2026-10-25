import React, { useMemo, useState } from "react"
import { kebabCase } from "lodash"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SubscribeForm from "../components/subscribe-form"
import Spacer from "../components/spacer"

const MAX_FEATURED_CARDS = 6

interface TagGroup {
  fieldValue: string
  totalCount: number
  edges: {
    node: {
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        date: string
      }
    }
  }[]
}

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
    allMarkdownRemark: {
      totalCount: number
      group: TagGroup[]
    }
  }
}

const byCountThenName = (a: TagGroup, b: TagGroup) => {
  if (b.totalCount !== a.totalCount) {
    return b.totalCount - a.totalCount
  }

  return a.fieldValue.localeCompare(b.fieldValue)
}

const byName = (a: TagGroup, b: TagGroup) =>
  a.fieldValue.localeCompare(b.fieldValue)

const fontSizeForCount = (count: number, max: number) => {
  const minRem = 0.95
  const maxRem = 1.85

  if (max <= 1) {
    return `${minRem}rem`
  }

  const weight = Math.log(count) / Math.log(max)

  return `${(minRem + weight * (maxRem - minRem)).toFixed(3)}rem`
}

const postLabel = (count: number) => (count === 1 ? "post" : "posts")

const topicLabel = (count: number) => (count === 1 ? "topic" : "topics")

const tagPath = (name: string) => `/tags/${kebabCase(name)}/`

const TagCloud = ({ tags }: { tags: TagGroup[] }) => {
  const max = tags.reduce(
    (highest, tag) => Math.max(highest, tag.totalCount),
    1
  )

  return (
    <ul
      role="list"
      className="m-0 flex list-none flex-wrap items-baseline gap-x-2 gap-y-1 p-0"
    >
      {tags.map((tag) => (
        <li key={tag.fieldValue}>
          <Link
            to={tagPath(tag.fieldValue)}
            className="shadow-none hover:shadow-[0_1px_0_0_currentColor]"
            style={{ fontSize: fontSizeForCount(tag.totalCount, max) }}
            aria-label={`${tag.fieldValue}, ${tag.totalCount} ${postLabel(
              tag.totalCount
            )}`}
          >
            {tag.fieldValue}
            <span className="ml-1 text-[0.7em] text-[var(--color-text)] opacity-60">
              {tag.totalCount}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const FeaturedTags = ({ tags }: { tags: TagGroup[] }) => (
  <ul
    role="list"
    className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2"
  >
    {tags.map((tag) => {
      const latest = tag.edges[0]?.node

      return (
        <li key={tag.fieldValue}>
          <Link
            to={tagPath(tag.fieldValue)}
            className="flex h-full flex-col rounded-lg border border-[var(--color-primary)] p-4 text-[var(--color-text)] shadow-none no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="m-0 text-2xl leading-tight">{tag.fieldValue}</h3>
              <p className="m-0 text-right leading-none">
                <span className="block font-['Josefin_Sans',sans-serif] text-3xl text-[var(--color-primary)]">
                  {tag.totalCount}
                </span>
                <span className="text-xs">{postLabel(tag.totalCount)}</span>
              </p>
            </div>
            {latest ? (
              <p className="mb-0 mt-3 text-sm leading-snug">
                <span className="opacity-70">
                  Latest · {latest.frontmatter.date}
                </span>
                <br />
                {latest.frontmatter.title}
              </p>
            ) : null}
          </Link>
        </li>
      )
    })}
  </ul>
)

const TagsPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
    allMarkdownRemark: { group, totalCount },
  },
}: Props) => {
  const [query, setQuery] = useState("")
  const normalizedQuery = query.trim().toLowerCase()

  const featured = useMemo(
    () => [...group].sort(byCountThenName).slice(0, MAX_FEATURED_CARDS),
    [group]
  )

  const rest = useMemo(() => {
    const featuredNames = new Set(featured.map((tag) => tag.fieldValue))

    return group
      .filter((tag) => !featuredNames.has(tag.fieldValue))
      .sort(byName)
  }, [group, featured])

  const matches = useMemo(() => {
    if (!normalizedQuery) {
      return []
    }

    return group
      .filter((tag) => tag.fieldValue.toLowerCase().includes(normalizedQuery))
      .sort(byName)
  }, [group, normalizedQuery])

  return (
    <Layout title={title}>
      <SEO
        title="Blog Tags"
        description="All the blog post topics on Pragmatic Pineapple blog by Nikola Đuza"
      />
      <div>
        <h1>Tags</h1>
        <p>
          {totalCount} posts across {group.length} topics. The ones I keep
          coming back to are up top, with the latest post on each. Everything
          else sits below, larger when it shows up more often.
        </p>

        <label className="mb-2 block">
          <span className="mb-2 block text-sm">Find a topic</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="JavaScript, Vim, Rails…"
            className="w-full rounded border border-[var(--color-primary)] bg-transparent p-2.5 text-[var(--color-text)]"
          />
        </label>

        {normalizedQuery ? (
          <section aria-live="polite">
            <h2 className="mb-4 mt-8">
              {matches.length === 0
                ? `No topics match “${query.trim()}”`
                : `${matches.length} ${topicLabel(matches.length)}`}
            </h2>
            {matches.length > 0 ? <TagCloud tags={matches} /> : null}
          </section>
        ) : (
          <>
            <section>
              <h2 className="mb-4 mt-8">Most written about</h2>
              <FeaturedTags tags={featured} />
            </section>

            <section>
              <h2 className="mb-4 mt-10">Everything else</h2>
              <TagCloud tags={rest} />
            </section>
          </>
        )}
      </div>

      <SubscribeForm />
      <Spacer />
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: { published: { eq: true }, newsletter: { ne: true } }
      }
    ) {
      totalCount
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              date(formatString: "MMMM YYYY")
            }
          }
        }
      }
    }
  }
`
