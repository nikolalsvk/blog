import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

const ThankYouPage = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout title={siteTitle} showLargeHeader>
      <SEO title="Confirm subscription" />

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
