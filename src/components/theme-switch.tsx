import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { useTheme } from "../contexts/theme"

const ThemeContainer = styled.button`
  height: 40px;
  width: 40px;
  padding: 0;
  border: 0;
  background: inherit;
  cursor: pointer;
  position: relative;
`

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;

  transition: opacity 0.3s ease-in-out,
    transform 2s cubic-bezier(0.4, 0, 0.49, 1);

  &:hover,
  &:active {
    transform: rotate(359deg);
  }
`

const StyledImage = styled(GatsbyImage)`
  height: 40px;
  width: 40px;
`

const ThemeSwitch = () => {
  const data = useStaticQuery(graphql`
    query ThemeIconsQuery {
      sun: file(absolutePath: { regex: "/sun.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 200, height: 200, layout: CONSTRAINED)
        }
      }
      moon: file(absolutePath: { regex: "/moon.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 200, height: 200, layout: CONSTRAINED)
        }
      }
    }
  `)

  const { theme, setTheme } = useTheme()

  return (
    <ThemeContainer
      onClick={() => {
        document.body.classList.add("animate-switch")
        setTheme(theme === "white" ? "purple" : "white")
        setTimeout(() => document.body.classList.remove("animate-switch"), 500)
      }}
    >
      <ImageWrapper
        style={{
          zIndex: theme === "purple" ? 1 : 2,
          opacity: `${theme === "purple" ? 0 : 1}`,
        }}
      >
        <StyledImage
          image={data.sun.childImageSharp.gatsbyImageData}
          alt={"Light theme switch button"}
        />
      </ImageWrapper>
      <ImageWrapper
        style={{
          zIndex: theme === "purple" ? 2 : 1,
          opacity: `${theme === "purple" ? 1 : 0}`,
        }}
      >
        <StyledImage
          image={data.moon.childImageSharp.gatsbyImageData}
          alt={"Dark theme switch button"}
        />
      </ImageWrapper>
    </ThemeContainer>
  )
}

export default ThemeSwitch
