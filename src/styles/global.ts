import { createGlobalStyle } from "styled-components"
import { rhythm } from "../utils/typography"

export default createGlobalStyle`
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
  hr {
    border: 1px solid var(--color-primary);
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
		font-size: 1em;
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
