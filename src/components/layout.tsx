import React from "react"
import styled, { createGlobalStyle } from "styled-components"
import Header from "./header"

import "@fontsource/josefin-sans/variable.css"
import "@fontsource/roboto/variable.css"

import { rhythm } from "../utils/typography"
import { useTheme } from "../contexts/theme"

import { GlobalStyles, PrismDark, PrismLight, TypographyTheme } from "../styles"

const Styles = createGlobalStyle`
  ${TypographyTheme}
  ${GlobalStyles}
`

const AllStyles = ({ theme }: { theme: string }) => {
  return (
    <>
      <Styles />
      {theme === "white" ? <PrismLight /> : <PrismDark />}
    </>
  )
}

const Container = styled.div`
  min-height: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(28.5)};
  padding: ${rhythm(0.5)} ${rhythm(3 / 4)} ${rhythm(1.5)} ${rhythm(3 / 4)};
  display: flex;
  flex-direction: column;
`

const Main = styled.div`
  flex: 1 0 auto;
`

const Footer = styled.footer`
  flex-shrink: 0;
`

interface Props {
  title: string
  showLargeHeader?: boolean
  children: React.ReactNode
}

const Layout = ({ title, showLargeHeader, children }: Props) => {
  const { theme } = useTheme()

  return (
    <Container>
      <AllStyles theme={theme} />
      <Main>
        <Header title={title} showLargeHeader={showLargeHeader} />
        {children}
      </Main>
      <Footer>© {new Date().getFullYear()} Nikola Đuza</Footer>
    </Container>
  )
}

export default Layout
