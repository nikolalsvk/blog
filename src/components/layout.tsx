import React from "react"
import styled, { createGlobalStyle } from "styled-components"
import Header from "./header"

import { rhythm } from "../utils/typography"
import { useTheme } from "../contexts/theme"

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    background-color: var(--color-background);
    color: var(--color-text);
    height: 100%;
  }
  #___gatsby {
    height: 100%;
  }
  #gatsby-focus-wrapper {
    height: 100%;
  }
  a {
    color: var(--color-secondary);
  }
  h1, h2, h3, h1 > a, h2 > a, h3 > a {
    font-family: 'Josefin Sans', sans-serif;
    color: var(--color-primary);
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
    border-left-color: var(--color-primary);
    font-style: normal;
    color: var(--color-text);
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

interface Props {
  location: Location
  title: string
  showLargeHeader?: boolean
  children: React.ReactNode
}

const Layout = ({ location, title, showLargeHeader, children }: Props) => {
  const { theme } = useTheme()

  return (
    <Container>
      <GlobalStyle theme={theme} />
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
