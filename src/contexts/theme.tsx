import React, { createContext, useContext, useState, useEffect } from "react"

export const COLORS = {
  purple: {
    primary: "hsl(28, 96%, 38%, 1)",
    secondary: "hsl(309, 17%, 85%, 1)",
    text: "hsla(0, 0%, 100%, 1)",
    background: "hsla(251, 52%, 13%, 1)",
  },
  normal: {
    primary: "hsla(35, 100%, 35%, 1)",
    secondary: "hsla(28, 96%, 38%, 1)",
    text: "hsla(251, 52%, 13%, 1)",
    background: "hsla(0, 0%, 100%, 1)",
  },
}

const ThemeContext = createContext({
  theme: "white",
  setTheme: (_: string) => {},
})

export const getInitialColorMode = () => {
  const persistedColorPreference = window.localStorage.getItem("theme")
  const hasPersistedPreference = typeof persistedColorPreference === "string"

  // If the user has explicitly chosen light or dark,
  // let's use it. Otherwise, this value will be null.
  if (hasPersistedPreference) {
    return persistedColorPreference
  }

  // If they haven't been explicit, let's check the media
  // query
  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  const hasMediaQueryPreference = typeof mql.matches === "boolean"
  if (hasMediaQueryPreference) {
    return mql.matches ? "purple" : "normal"
  }

  // If they are using a browser/OS that doesn't support
  // color themes, let's default to 'light'.
  return "normal"
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>("white")

  const saveToLocalStorage = (value: string) => {
    const root = window.document.documentElement
    // 1. Update React color-mode state
    setTheme(value)
    // 2. Update localStorage
    localStorage.setItem("theme", value)
    // 3. Update each color
    root.style.setProperty(
      "--color-primary",
      value === "purple"
        ? `${COLORS.purple.primary}`
        : `${COLORS.normal.primary}`
    )
    root.style.setProperty(
      "--color-secondary",
      value === "purple"
        ? `${COLORS.purple.secondary}`
        : `${COLORS.normal.secondary}`
    )
    root.style.setProperty(
      "--color-text",
      value === "purple" ? `${COLORS.purple.text}` : `${COLORS.normal.text}`
    )
    root.style.setProperty(
      "--color-background",
      value === "purple"
        ? `${COLORS.purple.background}`
        : `${COLORS.normal.background}`
    )
  }

  useEffect(() => {
    const root = window.document.documentElement

    const initialColorValue = root.style.getPropertyValue(
      "--initial-color-mode"
    )

    setTheme(initialColorValue)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: saveToLocalStorage }}>
      {children}
    </ThemeContext.Provider>
  )
}
