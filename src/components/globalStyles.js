import React from "react"
import { useTheme } from "../contexts/theme"
import { createGlobalStyle } from "styled-components"
import { rhythm } from "../utils/typography"

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
    height: 100%;
    transition: .3s cubic-bezier(0.62, -0.52, 0.43, 1.02);
    color: var(--text-color);
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

const GlobalStyles = () => {
  const { theme } = useTheme()

  console.log("You are using the " + theme + " theme. 🍍")

  return <GlobalStyle theme="purple" />
}

export default GlobalStyles
