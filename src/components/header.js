import React from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import ThemeSwitch from "./themeSwitch"

import styled from "styled-components"

const BigHeaderText = styled.h1`
  font-size: ${rhythm(2.2)};

  @media (max-width: 768px) {
    font-size: ${rhythm(1.5)};
    margin-top: ${rhythm(1)};
  }
`

const Header = ({ location, title, showLargeHeader }) => {
  const rootPath = `${__PATH_PREFIX__}/`

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
        <BigHeaderText>
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
        </BigHeaderText>
        <ThemeSwitch />
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: 0,
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: `center`,
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

      <h3
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        <ThemeSwitch />
      </h3>
    </div>
  )
}

export default Header
