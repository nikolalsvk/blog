import "prismjs/themes/prism.css"

import React from "react"

import { ThemeProvider } from "./src/contexts/theme"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
