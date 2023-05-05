import React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewCounter from "../components/view-counter"
import SubscribeForm from "../components/subscribe-form"
import Spacer from "../components/spacer"
import Post from "../components/post"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
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

const BlogIndex = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl
  const posts = data.allMarkdownRemark.edges
  const firstTwoPosts = posts.slice(0, 2)
  const restOfPosts = posts.slice(2)

  return (
    <Layout title={siteTitle} showLargeHeader>
      <SEO title="Welcome" canonical={siteUrl} />
      <Bio />

      {firstTwoPosts.map(({ node: { fields, frontmatter, excerpt } }) => (
        <Post
          slug={fields.slug}
          title={frontmatter.title}
          date={frontmatter.date}
          description={frontmatter.description}
          excerpt={excerpt}
        />
      ))}

      <SubscribeForm />

      {restOfPosts.map(({ node: { fields, frontmatter, excerpt } }) => (
        <Post
          slug={fields.slug}
          title={frontmatter.title}
          date={frontmatter.date}
          description={frontmatter.description}
          excerpt={excerpt}
        />
      ))}

      <ViewCounter slug="home" hideText />

      <SubscribeForm />

      <Spacer />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { published: { eq: true }, newsletter: { ne: true } }
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
