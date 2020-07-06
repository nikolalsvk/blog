import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Bio from "../components/bio"
import SubscribeForm from "../components/subscribe-form"

const NewsletterTemplate = ({ data, location }) => {
  const issue = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  console.log(issue)

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={issue.frontmatter.title}
        description={issue.frontmatter.description}
      />
      <section dangerouslySetInnerHTML={{ __html: issue.html }} />

      <footer>
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
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
      timeToRead
    }
  }
`
