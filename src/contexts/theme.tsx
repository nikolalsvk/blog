import React, { createContext, useContext, useState, useEffect } from "react"

export const COLORS = {
  dark: {
    primary: "hsl(28, 96%, 38%, 1)",
    secondary: "hsl(309, 17%, 85%, 1)",
    text: "hsla(0, 0%, 100%, 1)",
    background: "hsla(251, 52%, 13%, 1)",
  },
  light: {
    primary: "hsla(35, 100%, 35%, 1)",
    secondary: "hsla(28, 96%, 38%, 1)",
    text: "hsla(251, 52%, 13%, 1)",
    background: "hsla(0, 0%, 100%, 1)",
  },
}

const ThemeContext = createContext({
  theme: "light",
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
    return mql.matches ? "dark" : "light"
  }

  // If they are using a browser/OS that doesn't support
  // color themes, let's default to 'light'.
  return "light"
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>("light")

  const saveToLocalStorage = (value: string) => {
    const root = window.document.documentElement
    // 1. Update React color-mode state
    setTheme(value)
    // 2. Update localStorage
    localStorage.setItem("theme", value)
    // 3. Update each color
    root.style.setProperty(
      "--color-primary",
      value === "dark" ? `${COLORS.dark.primary}` : `${COLORS.light.primary}`
    )
    root.style.setProperty(
      "--color-secondary",
      value === "dark"
        ? `${COLORS.dark.secondary}`
        : `${COLORS.light.secondary}`
    )
    root.style.setProperty(
      "--color-text",
      value === "dark" ? `${COLORS.dark.text}` : `${COLORS.light.text}`
    )
    root.style.setProperty(
      "--color-background",
      value === "dark"
        ? `${COLORS.dark.background}`
        : `${COLORS.light.background}`
    )
  }

  useEffect(() => {
    const root = window.document.documentElement

    const initialColorValue = root.style.getPropertyValue(
      "--initial-color-mode"
    )

    setTheme(initialColorValue)
  }, [])

  const root = window.document.documentElement

  if (theme === "light") {
    root.classList.remove("dark")
  }

  if (theme === "dark") {
    root.classList.add("dark")
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: saveToLocalStorage }}>
      {children}
    </ThemeContext.Provider>
  )
}
