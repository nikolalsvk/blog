import React from "react"
import "./src/styles/tailwind.css"
import "./src/styles/typography-theme.css"
import "./src/styles/prism-light.css"
import "./src/styles/prism-dark.css"
import "./src/styles/global.css"

import { ThemeProvider } from "./src/contexts/theme"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
