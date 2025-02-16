import React from "react"
import Header from "./header"

import "@fontsource/josefin-sans/700.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/700.css"

import { useTheme } from "../contexts/theme"

interface Props {
  title: string
  showLargeHeader?: boolean
  children: React.ReactNode
}

const Layout = ({ title, showLargeHeader, children }: Props) => {
  const { theme } = useTheme()

  const prismTheme = theme === "light" ? "prism-light" : "prism-dark"

  return (
    <div
      className={`flex flex-col mx-auto px-3 py-4 max-w-2xl min-h-full ${prismTheme}`}
    >
      <main className="flex-1 flex-shrink-0 flex-grow-0">
        <Header title={title} showLargeHeader={showLargeHeader} />
        {children}
      </main>
      <footer className="shrink-0 text-center md:text-left">
        © {new Date().getFullYear()} Nikola Đuza
      </footer>
    </div>
  )
}

export default Layout
