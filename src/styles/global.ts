export const GlobalStyles = `
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
  .text-primary {
    color: var(--color-text);
  }
  h1, h2, h3, h4, h1 > a, h2 > a, h3 > a, h4 > a {
    font-family: 'Josefin Sans', sans-serif;
    color: var(--color-primary);
  }
  body:not(.gatsby-highlight) {
    // Use Roboto font everywhere except in code inserts
    font-family: 'Roboto', sans-serif;
  }
  input {
    font-family: 'Roboto', sans-serif;
    color: var(--color-primary);
  }
  hr {
    border: 1px solid var(--color-primary);
  }
  .animate-switch {
    transition: 0.3s cubic-bezier(0.62, -0.52, 0.43, 1.02);
  }
  .gatsby-resp-image-wrapper {
    margin-bottom: 1.75rem;
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
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
  .language-text {
    font-size: 1em;
  }
	pre > code[class*="language-"] {
		font-size: 1em;
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

  .markdown-header-link {
    box-shadow: none;
    fill: var(--color-text);
  }
`
