import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const ThankYouPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle} showLargeHeader>
      <SEO title="Thank you for subscribing" />

      <article>
        <h2>
          Thank you for subscribing!{" "}
          <span role="img" aria-label="bow">
            🙇
          </span>
        </h2>
        <h3>Please check your inbox to confirm the subscription.</h3>
      </article>
    </Layout>
  )
}

export default ThankYouPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
