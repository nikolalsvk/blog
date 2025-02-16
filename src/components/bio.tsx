/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
            landingPage
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div className="flex items-center md:flex-row flex-col text-center md:text-left">
      <div className="mr-0 mb-3 md:mr-3 md:mb-0">
        <StaticImage
          src="../../content/assets/profile-pic.jpg"
          alt={author.name}
          className="h-[100px] w-[100px] rounded-full"
          imgClassName="rounded-full"
        />
      </div>
      <p className="mb-0">
        Written by{" "}
        <strong>
          <a href={author.landingPage}>{author.name}</a>
        </strong>{" "}
        {author.summary}
        {` `}
        <a href={`https://twitter.com/${social.twitter}`}>
          You can connect with him on Twitter
        </a>
        .
      </p>
    </div>
  )
}

export default Bio
