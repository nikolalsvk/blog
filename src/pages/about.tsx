import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewCounter from "../components/view-counter"
import Spacer from "../components/spacer"
import SubscribeForm from "../components/subscribe-form"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
      }
    }
  }
}

const AboutPage = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl

  return (
    <Layout title={siteTitle}>
      <SEO title="About" canonical={`${siteUrl}/about`} />
      <ViewCounter hideText slug="/about" />
      <h1>About Nikola</h1>
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
        and choose a solution that fits. All that explained in simple words to
        make both languages easy to apply.
      </p>

      <p>
        My articles have appeared on the first page of HackerNews, and blogs
        like{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://blog.logrocket.com/author/nikola-duza/"
        >
          LogRocket
        </a>
        ,{" "}
        <a target="_blank" rel="noreferrer" href="https://blog.appsignal.com/">
          AppSignal
        </a>
        , and{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://semaphoreci.com/author/nikola"
        >
          Semaphore
        </a>
        . I've also been featured on newsletters like Ruby Weekly, JavaScript
        Weekly, and Node Weekly. I republish my posts on{" "}
        <a target="_blank" rel="noreferrer" href="https://dev.to/nikolalsvk">
          dev.to
        </a>{" "}
        and{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://medium.com/@nikolalsvk"
        >
          Medium
        </a>
        , so you can follow me there if you use those platforms.
      </p>

      <p>
        Thanks for visiting this page. If you want to connect further, feel free
        to reach out on{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/nikolalsvk"
        >
          Twitter
        </a>{" "}
        or just{" "}
        <a href="mailto:nikola@pragmaticpineapple.com">send me an email</a>.
      </p>

      <SubscribeForm />

      <Spacer />
    </Layout>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`
