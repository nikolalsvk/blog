import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
  }
}

Wordpress2016.googleFonts = [
  {
    name: "Josefin Sans",
    styles: [
      "100",
      "100i",
      "200",
      "200i",
      "300",
      "300i",
      "400",
      "400i",
      "500",
      "500i",
      "600",
      "600i",
      "700",
      "700i",
    ],
  },
  {
    name: "Roboto",
    styles: [
      "100",
      "100i",
      "200",
      "200i",
      "300",
      "300i",
      "400",
      "400i",
      "500",
      "500i",
      "600",
      "600i",
      "700",
      "700i",
    ],
  },
]

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
