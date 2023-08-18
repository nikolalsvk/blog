import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewCounter from "../components/view-counter"
import Spacer from "../components/spacer"
import Share from "../components/share"
import SubscribeForm from "../components/subscribe-form"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
      }
    }
    markdownRemark: {
      fields: {
        slug: string
      }
      id: string
      excerpt: string
      html: string
      frontmatter: {
        title: string
        description: string
      }
    }
  }
}

const NewComponent = ({ data }: Props) => {
  const post = data.markdownRemark
  const slug = post.fields.slug

  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl

  const { title } = post.frontmatter

  return (
    <Layout title={siteTitle}>
      <SEO
        title={title}
        description={post.frontmatter.description || post.excerpt}
        canonical={`${siteUrl}${slug}`}
      />
      <article>
        <h1>
          {post.frontmatter.title}
          <ViewCounter slug={slug} hideText />
        </h1>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <hr className="mb-6" />

      <div className="flex justify-between">
        <Share slug={slug} title={title} />

        <p className="block">
          <a
            href={`https://github.com/nikolalsvk/blog/blob/master/content/root${slug}index.md`}
          >
            Edit this page on GitHub
          </a>
        </p>
      </div>

      <SubscribeForm />

      <Spacer />
    </Layout>
  )
}

export default NewComponent

export const pageQuery = graphql`
  query RootBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        description
        slug
      }
    }
  }
`
