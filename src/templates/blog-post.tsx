import React from "react"
import { Link, graphql } from "gatsby"
import { kebabCase } from "lodash"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SubscribeForm from "../components/subscribe-form"
import ViewCounter from "../components/view-counter"
import Spacer from "../components/spacer"
import Share from "../components/share"

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
          <p className="flex flex-wrap text-neutral-400 text-sm mt-2 mb-6">
            <span className="after:content-['•'] after:px-1 last:after:content-none">
              Published{" "}
              <b>
                <time dateTime={publishedAtDateTime} itemProp="datePublished">
                  {publishedAt}
                </time>
              </b>
            </span>
            <span className="after:content-['•'] after:px-1 last:after:content-none">
              Last updated{" "}
              <b>
                <time dateTime={updatedAtDateTime} itemProp="dateModified">
                  {updatedAt}
                </time>
              </b>
            </span>
            <span className="after:content-['•'] after:px-1 last:after:content-none">
              <ViewCounter slug={slug} />
            </span>
          </p>
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
        <ul className="flex flex-wrap justify-between list-none p-0">
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
