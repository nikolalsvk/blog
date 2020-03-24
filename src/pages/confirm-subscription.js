import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const ConfirmSubscriptionPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Thank you for subscribing" />
      
      <article>
        <h2>
          Subscription confirmed! 🎉
        </h2>
        <h3>
          You are oficially on the list! I will send you any new content as
          soon as it gets released.
        </h3>
        <Link style={{ boxShadow: `none` }} to="/">Head back to the blog</Link>
      </article>
    </Layout>
  )
}

export default ConfirmSubscriptionPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
