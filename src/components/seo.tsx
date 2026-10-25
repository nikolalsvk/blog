/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import defaultOgImage from "../../content/assets/default-og-image.jpg"

interface Props {
  title: string
  description?: string
  lang?: string
  canonical?: string
  blogOgImage?: string
  blogOgImageWidth?: number
  blogOgImageHeight?: number
  coverImage?: string
  coverImageWidth?: number
  coverImageHeight?: number
}

const SEO = ({
  title,
  description = "",
  lang = "en",
  canonical,
  blogOgImage,
  blogOgImageWidth,
  blogOgImageHeight,
  coverImage,
  coverImageWidth,
  coverImageHeight,
}: Props) => {
  const { site, defaultOgImageFile } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            social {
              twitter
            }
            siteUrl
          }
        }
        defaultOgImageFile: file(
          absolutePath: { regex: "/content/assets/default-og-image.jpg/" }
        ) {
          childImageSharp {
            original {
              width
              height
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const ogImage = blogOgImage || coverImage || defaultOgImage
  const ogImageUrl = `${site.siteMetadata.siteUrl}${ogImage}`
  const defaultOgOriginal = defaultOgImageFile?.childImageSharp?.original
  const ogImageWidth = blogOgImage
    ? blogOgImageWidth
    : coverImage
    ? coverImageWidth
    : defaultOgOriginal?.width
  const ogImageHeight = blogOgImage
    ? blogOgImageHeight
    : coverImage
    ? coverImageHeight
    : defaultOgOriginal?.height

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: ogImageUrl,
        },
        ...(ogImageWidth && ogImageHeight
          ? [
              {
                property: `og:image:width`,
                content: String(ogImageWidth),
              },
              {
                property: `og:image:height`,
                content: String(ogImageHeight),
              },
            ]
          : []),
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: ogImageUrl,
        },
      ]}
    >
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  )
}

export default SEO
