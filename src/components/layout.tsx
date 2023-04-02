import React from "react"
import styled, { createGlobalStyle } from "styled-components"
import Header from "./header"

import "@fontsource/josefin-sans/700.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/700.css"

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
      {theme === "light" ? <PrismLight /> : <PrismDark />}
    </>
  )
}

const Main = styled.main`
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
    <div className="flex flex-col mx-auto px-3 py-4 max-w-2xl min-h-full">
      <AllStyles theme={theme} />
      <Main>
        <Header title={title} showLargeHeader={showLargeHeader} />
        {children}
      </Main>
      <Footer>© {new Date().getFullYear()} Nikola Đuza</Footer>
    </div>
  )
}

export default Layout
