import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { useTheme } from "../contexts/theme"

const ThemeSwitch = () => {
  const data = useStaticQuery(graphql`
    query ThemeIconsQuery {
      sun: file(absolutePath: { regex: "/sun.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 200, height: 200, layout: CONSTRAINED)
        }
      }
      moon: file(absolutePath: { regex: "/moon.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 200, height: 200, layout: CONSTRAINED)
        }
      }
    }
  `)

  const { theme, setTheme } = useTheme()

  return (
    <button
      className="h-10 w-10 p-0 border-0 bg-inherit cursor-pointer relative"
      onClick={() => {
        document.body.classList.add("animate-switch")
        setTheme(theme === "light" ? "dark" : "light")
        setTimeout(() => document.body.classList.remove("animate-switch"), 500)
      }}
    >
      <div
        className="absolute top-0 transition-[opacity,transform] duration-300 ease-in-out hover:rotate-[359deg] active:rotate-[359deg]"
        style={{
          zIndex: theme === "dark" ? 1 : 2,
          opacity: `${theme === "dark" ? 0 : 1}`,
          transitionDuration: "0.3s, 2s",
        }}
      >
        <GatsbyImage
          className="h-10 w-10"
          image={data.sun.childImageSharp.gatsbyImageData}
          alt="Light theme switch button"
        />
      </div>
      <div
        className="absolute top-0 transition-[opacity,transform] duration-300 ease-in-out hover:rotate-[359deg] active:rotate-[359deg]"
        style={{
          zIndex: theme === "dark" ? 2 : 1,
          opacity: `${theme === "dark" ? 1 : 0}`,
          transitionDuration: "0.3s, 2s",
        }}
      >
        <GatsbyImage
          className="h-10 w-10"
          image={data.moon.childImageSharp.gatsbyImageData}
          alt="Dark theme switch button"
        />
      </div>
    </button>
  )
}

export default ThemeSwitch
