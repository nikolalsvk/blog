import React from "react"
import "./src/styles/tailwind.css"

import { ThemeProvider } from "./src/contexts/theme"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
