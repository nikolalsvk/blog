import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SubscribeForm from "../components/subscribe-form"
import SEO from "../components/seo"

const NewsletterPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => (
  <Layout location={location} title={title}>
    <SEO title="💌 Newsletter" />

    <div>
      <h1>Get Blog Updates</h1>

      <p>
        Why should you subscribe? Well, why not? If you like some of my blog
        posts or talks, I will send you an email when I release a new one. That
        means <b>FREE</b> knowledge, tips, and pineapples 🍍.
      </p>

      <p>
        At most, it will be a couple of emails a year. Can your mailbox undergo
        that many emails? If the answer is yes, subscribe and let us keep in
        touch. You can always unsubscribe later!
      </p>

      <SubscribeForm />
    </div>
  </Layout>
)

export default NewsletterPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
