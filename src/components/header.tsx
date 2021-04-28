import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import ThemeSwitch from "./themeSwitch"

import styled from "styled-components"

const BigHeader = styled.header`
  margin-bottom: ${rhythm(1)};
  margin-top: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  a {
    box-shadow: none;
    color: inherit;
  }
`

const BigHeaderTopPart = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SmallHeader = styled.header`
  margin-top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin-top: 0;
    margin-bottom: 0;
  }

  a {
    box-shadow: none;
    color: inherit;
  }
`

const BigHeaderText = styled.h1`
  margin-top: ${rhythm(1.5)};

  font-size: ${rhythm(2.3)};

  @media (max-width: 768px) {
    font-size: ${rhythm(1.5)};
    margin-top: ${rhythm(1)};
  }
`

const Navigation = styled.nav`
  display: flex;
  align-items: center;

  a {
    margin-right: 20px;
    box-shadow: none;
  }

  a:hover {
    box-shadow: 0 1px 0 0 currentColor;
  }
`

interface Props {
  title: string
  showLargeHeader?: boolean
}

const Header = ({ title, showLargeHeader }: Props) => {
  const [windowDimension, setWindowDimension] = useState(window.innerWidth)

  useEffect(() => {
    setWindowDimension(window.innerWidth)
  }, [])

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = windowDimension <= 640

  if (showLargeHeader) {
    return (
      <BigHeader>
        <BigHeaderTopPart>
          <Navigation>
            <Link to="/about">About</Link>
            <Link to="/talks">Talks</Link>
            <Link to="/newsletter">Newsletter</Link>
          </Navigation>
          <ThemeSwitch />
        </BigHeaderTopPart>
        <BigHeaderText>
          <Link to={`/`}>{title}</Link>
        </BigHeaderText>
      </BigHeader>
    )
  }

  return (
    <SmallHeader>
      <h3>
        <Link to={`/`}>{title}</Link>
      </h3>

      <Navigation>
        <Link to="/about">About</Link>
        <Link to="/talks">Talks</Link>
        <Link to="/newsletter">Newsletter</Link>
        <ThemeSwitch />
      </Navigation>
    </SmallHeader>
  )
}

export default Header
