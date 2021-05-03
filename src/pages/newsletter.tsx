import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SubscribeForm from "../components/subscribe-form"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const SeeMoreButton = styled.div`
  border: none;
  cursor: pointer;
`

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
  const [showIssues, setShowIssues] = useState(false)

  return (
    <Layout title={title}>
      <SEO title="💌 Newsletter" />

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
          At most, it will be a couple of emails a year. Can your mailbox
          undergo that many emails? If the answer is yes, subscribe and let us
          keep in touch. You can always unsubscribe later!
        </p>

        <p>
          {showIssues ? (
            <SeeMoreButton onClick={() => setShowIssues(false)}>
              Hide previous issues.
            </SeeMoreButton>
          ) : (
            <SeeMoreButton onClick={() => setShowIssues(true)}>
              You can see previous issues by clicking here.
            </SeeMoreButton>
          )}
        </p>

        {showIssues &&
          issues.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug

            return (
              <article key={node.fields.slug}>
                <header>
                  <h3
                    style={{
                      marginBottom: rhythm(1 / 4),
                    }}
                  >
                    <Link
                      style={{ boxShadow: `none` }}
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

        <SubscribeForm />
      </div>
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
      filter: { frontmatter: { newsletter: { eq: true } } }
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
