import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const ThankYouPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Thank you for subscribing" />
      
      <article>
        <h2>
          Thank you for subscribing! 🙇
        </h2>
        <h3>
          Please check your inbox to confirm the subscription.
        </h3>
        <Link style={{ boxShadow: `none` }} to="/">Head back to the blog</Link>
      </article>
    </Layout>
  )
}

export default ThankYouPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
