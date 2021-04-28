import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Bio from "../components/bio"
import SubscribeForm from "../components/subscribe-form"
import ViewCounter from "../components/view-counter"
import { rhythm } from "../utils/typography"

const NewsletterTemplate = ({ data }) => {
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
      <section dangerouslySetInnerHTML={{ __html: issue.html }} />

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
