import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { rhythm, scale } from "../utils/typography"
import { useTheme } from "../contexts/theme"
import Image from "gatsby-image"
import styled from "styled-components"

const ThemeButton = styled.div`
  display: block;

  @keyframes sun-movement {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }
`

const Header = ({ location, title, showLargeHeader }) => {
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

  const rootPath = `${__PATH_PREFIX__}/`

  const { theme, setTheme } = useTheme()

  if (location.pathname === rootPath || showLargeHeader) {
    return (
      <div
        style={{
          marginBottom: rhythm(1),
          marginTop: 0,
          display: `flex`,
          justifyContent: `space-between`,
          alignItems: "center",
        }}
      >
        <h1
          style={{
            ...scale(1.5),
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
        <ThemeButton
          onClick={() => {
            setTheme(theme === "white" ? "purple" : "white")
          }}
        >
          <Image
            fluid={data.sun.childImageSharp.fluid}
            alt={"sun"}
            style={{
              height: 40,
              width: 40,
              position: "absolute",
              transition: `opacity .1s ease-in-out`,
              opacity: `${theme === "purple" ? 0 : 1}`,
              animation:
                "sun-movement 3s cubic-bezier(0.4, 0, 0.49, 1) infinite",
            }}
          />
          <Image
            fluid={data.moon.childImageSharp.fluid}
            alt={"moon"}
            style={{
              display: "block",
              height: 40,
              width: 40,
              position: "relative",
              transition: `opacity .1s ease-in-out`,
              opacity: `${theme === "purple" ? 1 : 0}`,
            }}
          />
        </ThemeButton>
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: 0,
        display: `flex`,
        justifyContent: `space-between`,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>

      <h3
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
            textAlign: `right`,
            fontSize: `1.1rem`,
          }}
          to={`/newsletter`}
        >
          Newsletter{" "}
          <span role="img" aria-label="letter">
            💌
          </span>
        </Link>
      </h3>
    </div>
  )
}

export default Header
