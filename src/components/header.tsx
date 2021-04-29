import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import ThemeSwitch from "./theme-switch"

import styled from "styled-components"

const BigHeader = {
  Wrapper: styled.header`
    margin-bottom: ${rhythm(1)};
    margin-top: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    a {
      box-shadow: none;
      color: inherit;
    }
  `,
  TopPart: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  Text: styled.h1`
    margin-top: ${rhythm(1.5)};

    font-size: ${rhythm(2.3)};

    @media (max-width: 768px) {
      font-size: ${rhythm(1.5)};
      margin-top: ${rhythm(1)};
    }
  `,
}

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
  if (showLargeHeader) {
    return (
      <BigHeader.Wrapper>
        <BigHeader.TopPart>
          <Navigation>
            <Link to="/about">About</Link>
            <Link to="/talks">Talks</Link>
            <Link to="/newsletter">Newsletter</Link>
          </Navigation>
          <ThemeSwitch />
        </BigHeader.TopPart>

        <BigHeader.Text>
          <Link to={`/`}>{title}</Link>
        </BigHeader.Text>
      </BigHeader.Wrapper>
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
