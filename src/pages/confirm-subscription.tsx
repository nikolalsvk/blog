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
      <SEO title="Check inbox" />

      <article>
        <h2>
          Thank you for subscribing{" "}
          <span role="img" aria-label="bow">
            🙇
          </span>
        </h2>
        <h2>Please check your inbox to confirm the subscription.</h2>
        <p>
          Once you confirm that you're willingly subscribing to the Pragmatic
          Pineapple newsletter, the next issue will arrive in your inbox. If you
          don't confirm, you will miss out on great content I share, so be sure
          to do it.
        </p>
        <p>
          I want to thank you for choosing to be a part of my newsletter,
          amongst all other newsletters out there. It really means a lot to me
          and it motivates me to produce and share good content with you. I know
          our time in a day is limited and I voe to not spam you and only give
          you the high-quality writing you deserve.
        </p>
        <p>
          If you like my writing, be sure to check out the{" "}
          <Link to="/about">about page</Link> to learn more about me, follow me
          on <Link to="https://twitter.com/nikolalsvk">Twitter</Link>, or go
          back to the <Link to="/home">home page</Link>.
        </p>
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
