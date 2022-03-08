import React from "react"
import { Link, graphql } from "gatsby"

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
      <SEO title="Thank you for confirming the subscription" />

      <article>
        <h2>
          Subscription confirmed{" "}
          <span role="img" aria-label="tada">
            🎉
          </span>
        </h2>

        <h3>
          You are officially on the list! I will send you any new content as
          soon as it gets released.
        </h3>

        <p>
          Glad to have you onboard. You can{" "}
          <Link to="/">head back to the blog</Link> or check out the{" "}
          <Link to="/about">about page</Link>.
        </p>
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
