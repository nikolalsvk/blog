import React from "react"
import { graphql, Link } from "gatsby"

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

const AboutPage = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout title={siteTitle}>
      <SEO title="About" />
      <h1>About Nikola</h1>
      <p>Welcome, glad you ended up on this page.</p>
      <p>
        Hi{" "}
        <span role="img" aria-label="Wave">
          👋
        </span>
        . I am Nikola and I run the <Link to="/">Pragmatic Pineapple</Link> tech
        blog you are currently reading. My goal is to educate, teach and
        question the status quo of{" "}
        <Link to="/tags/java-script">JavaScript</Link> &{" "}
        <Link to="/tags/ruby">Ruby</Link>.
      </p>

      <p>
        How? I break down complicated and overlooked JS & Ruby problems into
        actionable take-aways for beginners and advanced coders. That includes
        multiple perspectives which encourage my readers to reflect, evaluate
        and choose a solution that fits.
      </p>

      <p>
        All that explained in simple words to make both languages easy to apply.
        My articles have appeared on the first page of HackerNews, and blogs
        like LogRocket, AppSignal and Semaphore.
      </p>
    </Layout>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
