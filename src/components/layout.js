import React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"
import Header from "./header"

import { rhythm } from "../utils/typography"

const Container = styled.div`
  min-height: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(24)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
  display: flex;
  flex-direction: column;
`

const Main = styled.div`
  flex: 1 0 auto;
`

const Footer = styled.footer`
  flex-shrink: 0;
`

const Layout = ({ location, title, showLargeHeader, children }) => {
  return (
    <Container>
      <Helmet>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin />
        <link
          href="https://fonts.googleapis.com/css?family=Josefin+Sans:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i|Roboto&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Main>
        <header>
          <Header
            location={location}
            title={title}
            showLargeHeader={showLargeHeader}
          />
        </header>
        {children}
      </Main>
      <Footer>© {new Date().getFullYear()} Nikola Đuza</Footer>
    </Container>
  )
}

export default Layout
