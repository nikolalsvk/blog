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

const ConfirmSubscriptionPage = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout title={siteTitle} showLargeHeader>
      <SEO title="Thank you for subscribing" />

      <article>
        <h2>
          Subscription confirmed!{" "}
          <span role="img" aria-label="tada">
            🎉
          </span>
        </h2>
        <h3>
          You are oficially on the list! I will send you any new content as soon
          as it gets released.
        </h3>
        For now, you can{" "}
        <Link style={{ boxShadow: `none` }} to="/">
          head back to the blog
        </Link>
        .
      </article>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
