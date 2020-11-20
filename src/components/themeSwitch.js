import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from "styled-components"
import { useTheme } from "../contexts/theme"

const ThemeContainer = styled.div`
  display: block;
  cursor: pointer;

  @keyframes sun-movement {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }
`

const StyledImage = styled(Image)`
  height: 40px;
  width: 40px;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    animation: sun-movement 3s cubic-bezier(0.4, 0, 0.49, 1) infinite;
  }
`

const ThemeSwitch = () => {
  const data = useStaticQuery(graphql`
    query ThemeIconsQuery {
      sun: file(absolutePath: { regex: "/sun.png/" }) {
        childImageSharp {
          fluid(maxWidth: 200, maxHeight: 200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      moon: file(absolutePath: { regex: "/moon.png/" }) {
        childImageSharp {
          fluid(maxWidth: 200, maxHeight: 200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  const { theme, setTheme } = useTheme()

  return (
    <ThemeContainer
      onClick={() => {
        setTheme(theme === "white" ? "purple" : "white")
      }}
    >
      <StyledImage
        fluid={data.sun.childImageSharp.fluid}
        alt={"sun"}
        style={{
          zIndex: `${theme === "purple" ? 1 : 2}`,
          position: "absolute",
          opacity: `${theme === "purple" ? 0 : 1}`,
        }}
      />
      <StyledImage
        fluid={data.moon.childImageSharp.fluid}
        alt={"moon"}
        style={{
          zIndex: `${theme === "purple" ? 2 : 1}`,
          opacity: `${theme === "purple" ? 1 : 0}`,
        }}
      />
    </ThemeContainer>
  )
}

export default ThemeSwitch
