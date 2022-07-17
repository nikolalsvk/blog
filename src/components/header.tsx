import React, { useState } from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import ThemeSwitch from "./theme-switch"

import styled from "styled-components"
import Burger from "./burger"

const Navigation = styled.nav`
  display: flex;
  align-items: center;

  a {
    margin-right: 18px;
    box-shadow: none;
  }

  a:hover {
    box-shadow: 0 1px 0 0 currentColor;
  }
`

const BigHeader = {
  Wrapper: styled.header`
    margin-bottom: ${rhythm(1)};
    margin-top: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    a {
      box-shadow: none;
      color: var(--color-primary);
    }
  `,
  Text: styled.h1`
    margin-top: ${rhythm(1.5)};
    font-size: ${rhythm(2.8)};

    @media (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: space-between;

      font-size: ${rhythm(1.8)};
      margin-top: ${rhythm(1)};
    }
  `,
  Navigation: styled(Navigation)`
    justify-content: space-between;
    width: 100%;

    a {
      box-shadow: none;
      color: var(--color-text);
    }

    @media (max-width: 768px) {
      display: none;
    }
  `,
}

const SmallHeader = {
  Wrapper: styled.header`
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
      color: var(--color-primary);
    }

    @media (max-width: 768px) {
      margin-top: ${rhythm(1)};
    }
  `,
  RightPart: styled.div`
    display: flex;
    align-items: center;

    a {
      box-shadow: none;
      color: var(--color-text);
    }

    @media (max-width: 768px) {
      display: none;
    }
  `,
}

const Mobile = {
  Wrapper: styled.div<MobileMenuProps>`
    display: none;

    @media (max-width: 768px) {
      z-index: 20;
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      background-color: var(--color-background);

      transition: transform 0.3s ease-in-out;
      transform: ${({ open }) =>
        open ? "translateX(0)" : "translateX(-100%)"};
    }
  `,
  Navigation: styled(Navigation)`
    display: flex;
    flex-direction: column;
    justify-content: center;

    a {
      font-size: ${rhythm(1)};
      margin-right: 0px;
      margin-bottom: ${rhythm(0.5)};

      box-shadow: none;
    }
  `,
}

const FlexBox = styled.div`
  display: flex;
`

interface MobileMenuProps {
  open: boolean
}

const MobileMenu = ({ open }: MobileMenuProps) => {
  return (
    <Mobile.Wrapper open={open}>
      <Mobile.Navigation>
        <Link to="/about">About</Link>
        <Link to="/uses">Uses</Link>
        <Link to="/newsletter">Newsletter</Link>
        <Link to="/tags">Tags</Link>

        <ThemeSwitch />
      </Mobile.Navigation>
    </Mobile.Wrapper>
  )
}

interface Props {
  title: string
  showLargeHeader?: boolean
}

const Header = ({ title, showLargeHeader }: Props) => {
  const [open, setOpen] = useState(false)

  const toggleMobileMenu = () => setOpen((value) => !value)

  if (showLargeHeader) {
    return (
      <BigHeader.Wrapper>
        <BigHeader.Navigation>
          <FlexBox>
            <Link to="/about">About</Link>
            <Link to="/uses">Uses</Link>
            <Link to="/newsletter">Newsletter</Link>
            <Link to="/tags">Tags</Link>
          </FlexBox>

          <FlexBox>
            <ThemeSwitch />
          </FlexBox>
        </BigHeader.Navigation>

        <MobileMenu open={open} />

        <BigHeader.Text>
          <Link to={`/`}>{title}</Link>
          <Burger open={open} handleClick={toggleMobileMenu} />
        </BigHeader.Text>
      </BigHeader.Wrapper>
    )
  }

  return (
    <SmallHeader.Wrapper>
      <h3>
        <Link to={`/`}>{title}</Link>
      </h3>

      <MobileMenu open={open} />

      <Burger open={open} handleClick={toggleMobileMenu} />

      <SmallHeader.RightPart>
        <Navigation>
          <Link to="/about">About</Link>
          <Link to="/uses">Uses</Link>
          <Link to="/newsletter">Newsletter</Link>
          <Link to="/tags">Tags</Link>

          <ThemeSwitch />
        </Navigation>
      </SmallHeader.RightPart>
    </SmallHeader.Wrapper>
  )
}

export default Header
