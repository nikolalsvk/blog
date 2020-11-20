import React from "react"
import { Helmet } from "react-helmet"
import styled, { createGlobalStyle } from "styled-components"
import Header from "./header"

import { rhythm } from "../utils/typography"
import { useTheme } from "../contexts/theme"

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    --main-color: ${(props) =>
      props.theme === "purple" ? "#BD5B04" : "#B26700"};
    --secondary-color: ${(props) =>
      props.theme === "purple" ? "#E0D3DE" : "#BD5B04"};
    --text-color: ${(props) =>
      props.theme === "purple" ? "white" : "#161032"};
    --background-color: ${(props) =>
      props.theme === "purple" ? "#161032" : "white"};

    background-color: var(--background-color);
    color: var(--text-color);
    height: 100%;
  }
  #___gatsby {
    height: 100%;
  }
  #gatsby-focus-wrapper {
    height: 100%;
  }
  a {
    color: var(--secondary-color);
  }
  h1, h2, h3, h1 > a, h2 > a, h3 > a {
    font-family: 'Josefin Sans', sans-serif;
    color: var(--main-color);
  }
  body:not(.gatsby-highlight) {
    // Use Roboto font everywhere except in code inserts
    font-family: 'Roboto', sans-serif;
  }
  .animate-switch {
    transition: 0.3s cubic-bezier(0.62, -0.52, 0.43, 1.02);
  }
  .photo-caption {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    font-style: italic;
    font-size: 0.9rem;
    margin-top: -1rem;
    margin-bottom: 1rem;
    color: #b3b3b3;
  }

  // Code theme fixes
  .gatsby-highlight {
    margin-bottom: ${rhythm(1)};
    font-size: 0.9rem;
  }
  .language-text {
    font-size: 0.9rem !important;
  }
  .token.operator {
    background: inherit;
  }
  blockquote {
    border-left-color: var(--main-color);
    font-style: normal;
    color: var(--text-color);
  }

  .tags > span:not(:last-child)::after {
    content: ' | ';
  }

  .markdown-header-link {
    box-shadow: none;
  }
`

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
  const { theme } = useTheme()

  return (
    <Container>
      <GlobalStyle theme={theme} />
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
