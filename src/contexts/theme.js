import React, { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({ theme: "white", setTheme: () => {} })

const supportsDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches === true

export const useTheme = () => {
  const context = useContext(ThemeContext)

  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("white")

  const saveToLocalStorage = (value) => {
    localStorage.setItem("theme", value)
    setTheme(value)
  }

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    console.log(theme)
    if (theme) {
      saveToLocalStorage(theme)
    } else if (supportsDarkMode()) {
      saveToLocalStorage("purple")
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: saveToLocalStorage }}>
      {children}
    </ThemeContext.Provider>
  )
}
