import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SubscribeForm from "../components/subscribe-form"
import Spacer from "../components/spacer"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
    allMarkdownRemark: {
      totalCount: number
      edges: {
        node: {
          fields: {
            slug: string
          }
          frontmatter: {
            title: string
          }
        }
      }[]
    }
  }
  pageContext: {
    tag: string
  }
}

const Tag = ({ pageContext, data }: Props) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged as ${tag}`
  return (
    <Layout title={data.site.siteMetadata.title}>
      <SEO
        title={`${tag} posts`}
        description={`All Pragmatic Pineapple blog posts related to the ${tag} topic`}
      />
      <h1>{tagHeader}</h1>
      <ul>
        {edges.map(({ node }) => {
          const { slug } = node.fields
          const { title } = node.frontmatter
          return (
            <li key={slug}>
              <Link to={slug}>{title}</Link>
            </li>
          )
        })}
      </ul>

      <Link to="/tags">All tags</Link>

      <Spacer />

      <SubscribeForm />

      <Spacer />
    </Layout>
  )
}

export default Tag

export const pageQuery = graphql`
  query ($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
