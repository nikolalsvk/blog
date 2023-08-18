import React from "react"
import { Link, graphql } from "gatsby"
import { kebabCase } from "lodash"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SubscribeForm from "../components/subscribe-form"
import ViewCounter from "../components/view-counter"
import Spacer from "../components/spacer"
import styled from "styled-components"
import Share from "../components/share"

const BlogStats = styled.p`
  display: flex;
  flex-wrap: wrap;
  color: #b3b3b3;
`

interface BlogStatProps {
  hidden?: boolean
}

const BlogStat = styled.span<BlogStatProps>`
  display: ${({ hidden }) => (hidden ? "none" : "revert")}

  &:last-of-type {
    margin-left: 4px;
  }

  &:not(:last-of-type) :after {
    content: "•";
    padding-left: 4px;
    margin-right: 4px;
  }
`
interface PageContextPage {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
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
    markdownRemark: {
      id: string
      excerpt: string
      html: string
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        publishedAt: string
        publishedAtDateTime: string
        description: string
        canonical: string
        canonicalName: string
        coverImage?: {
          publicURL: string
        }
        blogOgImage?: {
          publicURL: string
        }
        slug: string
        tags: string[]
      }
      timeToRead: number
      parent?: {
        fields: {
          updatedAt: string
          updatedAtDateTime: string
        }
      }
    }
  }
  pageContext: {
    next: PageContextPage
    previous: PageContextPage
  }
}

const BlogPostTemplate = ({ data, pageContext }: Props) => {
  const post = data.markdownRemark
  const updatedAt = post.parent?.fields?.updatedAt
  const updatedAtDateTime = post.parent?.fields?.updatedAtDateTime
  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl
  const slug = post.fields.slug
  const { previous, next } = pageContext
  const {
    title,
    canonical,
    canonicalName,
    publishedAt,
    publishedAtDateTime,
    tags,
  } = post.frontmatter
  const defaultCanonical = `${siteUrl}${slug}`
  // const { timeToRead } = post

  return (
    <Layout title={siteTitle}>
      <SEO
        title={title}
        description={post.frontmatter.description || post.excerpt}
        canonical={canonical || defaultCanonical}
        blogOgImage={post.frontmatter.blogOgImage?.publicURL}
        coverImage={post.frontmatter.coverImage?.publicURL}
      />
      <article>
        <header>
          <h1 className="mb-0">{post.frontmatter.title}</h1>
          <BlogStats className="text-sm mt-2 mb-6">
            <BlogStat>
              Published{" "}
              <b>
                <time dateTime={publishedAtDateTime} itemProp="datePublished">
                  {publishedAt}
                </time>
              </b>
            </BlogStat>
            <BlogStat>
              Last updated{" "}
              <b>
                <time dateTime={updatedAtDateTime} itemProp="dateModified">
                  {updatedAt}
                </time>
              </b>
            </BlogStat>
            <BlogStat>
              <ViewCounter slug={slug} />
            </BlogStat>
            {/**
            Comment out for now until I figure out where to show it.
            <BlogStat hidden>
              About{" "}
              <b>
                {timeToRead} {timeToRead === 1 ? "minute" : "minutes"}
              </b>{" "}
              to read{" "}
            </BlogStat>
            */}
          </BlogStats>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />

        {canonical && (
          <>
            <hr className="mb-7" />
            <section className="ml-6">
              <p>
                <i>
                  This article was originally posted on{" "}
                  <a href={canonical}>{canonicalName}</a>
                </i>
              </p>
            </section>
          </>
        )}

        <hr className="mb-6" />

        <Share slug={slug} title={title} />

        <div className="flex justify-between">
          <p className="block mb-6">
            Tagged as:{" "}
            {tags.map((tag) => (
              <span
                className="after:content-['_|_'] last:after:content-none"
                key={tag}
              >
                <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
              </span>
            ))}
          </p>

          <p className="block">
            <a
              href={`https://github.com/nikolalsvk/blog/blob/master/content/blog${slug}index.md`}
            >
              Edit this page on GitHub
            </a>
          </p>
        </div>

        <footer className="mb-6">
          <Bio />
        </footer>

        <SubscribeForm />
      </article>

      <Spacer />

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        publishedAt: date(formatString: "MMMM DD, YYYY")
        publishedAtDateTime: date(formatString: "YYYY-MM-DD")
        description
        canonical
        canonicalName
        coverImage {
          publicURL
        }
        blogOgImage {
          publicURL
        }
        slug
        tags
      }
      timeToRead
      parent {
        ... on File {
          fields {
            updatedAt: gitLogLatestDate(formatString: "MMMM DD, YYYY")
            updatedAtDateTime: gitLogLatestDate(formatString: "YYYY-MM-DD")
          }
        }
      }
    }
  }
`
