import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SubscribeForm from "../components/subscribe-form"
import SEO from "../components/seo"
import Spacer from "../components/spacer"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
    allMarkdownRemark: {
      edges: {
        node: {
          excerpt: string
          fields: {
            slug: string
          }
          frontmatter: {
            date: string
            title: string
            description: string
          }
        }
      }[]
    }
  }
}

const NewsletterPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
    allMarkdownRemark: { edges: issues },
  },
}: Props) => {
  return (
    <Layout title={title}>
      <SEO
        title="💌 Pragmatic Pineapple Newsletter 🍍"
        description="A newsletter by Nikola Đuza that aims to spread knowledge and practical tips on JavaScript and Ruby."
      />

      <div>
        <h1>Get Blog Updates</h1>

        <p>
          Why should you subscribe? Well, why not? If you like some of my blog
          posts or talks, I will send you an email when I release a new one.
          That means <b>FREE</b> knowledge, tips, and pineapples 🍍. Besides
          that, having people interested in what I write / post motivates and
          inspires me to keep going with it. There are no hidden motives, I'm
          not selling you anything.
        </p>

        <p>
          Since 2022 my goal is to send one issue per month. The issues will
          contain any updates on the blog and also include a couple of useful
          links I found. Sounds good? If so, sign up below and let's keep in
          touch.
        </p>

        <SubscribeForm />

        <section>
          <h2>📜 Newsletter Archive</h2>

          {issues.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug

            return (
              <article key={node.fields.slug}>
                <header>
                  <h3 className="mt-4 mb-1">
                    <Link
                      className="shadow-none"
                      to={`/newsletter${node.fields.slug}`}
                    >
                      {title}
                    </Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.description || node.excerpt,
                    }}
                  />
                </section>
              </article>
            )
          })}
        </section>
      </div>
      <Spacer />
    </Layout>
  )
}

export default NewsletterPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { newsletter: { eq: true }, published: { eq: true } }
      }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
