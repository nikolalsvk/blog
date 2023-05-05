import React from "react"
import { kebabCase } from "lodash"
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
      group: {
        fieldValue: string
        totalCount: number
      }[]
    }
  }
}

const TagsPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
    allMarkdownRemark: { group },
  },
}: Props) => (
  <Layout title={title}>
    <SEO
      title="Blog Tags"
      description="All the blog post topics on Pragmatic Pineapple blog by Nikola Đuza"
    />
    <div>
      <h1>Tags</h1>
      <p>
        Here are all the tags (topics) on the blog. Click any of them to show
        blog posts related to that topic.
      </p>
      <ul>
        {group.map((tag) => (
          <li key={tag.fieldValue}>
            <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
              {tag.fieldValue.toUpperCase()} ({tag.totalCount})
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <SubscribeForm />
    <Spacer />
  </Layout>
)

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
