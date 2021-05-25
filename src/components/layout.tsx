import React from "react"
import styled, { createGlobalStyle } from "styled-components"
import Header from "./header"

import "@fontsource/josefin-sans/200.css"
import "@fontsource/josefin-sans/400.css"
import "@fontsource/josefin-sans/500.css"
import "@fontsource/josefin-sans/600.css"
import "@fontsource/josefin-sans/700.css"
import "@fontsource/roboto/100.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/400-italic.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

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
  max-width: ${rhythm(24)};
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
