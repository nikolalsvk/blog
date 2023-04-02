/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"

const BioContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`

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
    <BioContainer>
      <div className="mr-0 mb-3 md:mr-3 md:mb-0">
        <StaticImage
          src="../../content/assets/profile-pic.jpg"
          alt={author.name}
          style={{
            height: 100,
            width: 100,
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `100%`,
          }}
        />
      </div>
      <p style={{ marginBottom: 0 }}>
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
    </BioContainer>
  )
}

export default Bio
