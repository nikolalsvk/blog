import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Bio from "../components/bio"
import SubscribeForm from "../components/subscribe-form"
import ViewCounter from "../components/view-counter"
import { rhythm } from "../utils/typography"
import styled from "styled-components"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
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
        date: string
        description: string
      }
      timeToRead: number
    }
  }
}

const Article = styled.article`
  a {
    box-shadow: none;
  }
  h3 {
    margin-bottom: 1rem;
  }
`

const NewsletterTemplate = ({ data }: Props) => {
  const issue = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const slug = issue.fields.slug

  return (
    <Layout title={siteTitle}>
      <SEO
        title={issue.frontmatter.title}
        description={issue.frontmatter.description}
      />
      <ViewCounter hideText slug={`/newsletter${slug}`} />
      <Article>
        <section dangerouslySetInnerHTML={{ __html: issue.html }} />
      </Article>

      <footer style={{ marginBottom: rhythm(1) }}>
        <Bio />
      </footer>

      <SubscribeForm />
    </Layout>
  )
}

export default NewsletterTemplate

export const pageQuery = graphql`
  query NewsletterByIssueNumber($slug: String!) {
    site {
      siteMetadata {
        title
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
        date(formatString: "MMMM DD, YYYY")
        description
      }
      timeToRead
    }
  }
`
