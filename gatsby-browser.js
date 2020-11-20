// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

import "prismjs/themes/prism.css"

import React from "react"

import { ThemeProvider } from "./src/contexts/theme"
import GlobalStyles from "./src/components/globalStyles"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    <GlobalStyles />
    {element}
  </ThemeProvider>
)
