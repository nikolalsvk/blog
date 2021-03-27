/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from "styled-components"

import { rhythm } from "../utils/typography"

const BioContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`

const ImageContainer = styled.div`
  margin-right: ${rhythm(1 / 2)};

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: ${rhythm(1 / 2)};
  }
`

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fluid(maxWidth: 200, maxHeight: 200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
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
      <ImageContainer>
        <Image
          fluid={data.avatar.childImageSharp.fluid}
          alt={author.name}
          style={{
            height: 90,
            width: 90,
            borderRadius: `100%`,
          }}
        />
      </ImageContainer>
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
