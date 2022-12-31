module.exports = {
  siteMetadata: {
    title: `Pragmatic Pineapple 🍍`,
    author: {
      name: `Nikola Đuza`,
      summary: `who helps developers improve their productivity by sharing pragmatic advice & applicable knowledge on JavaScript and Ruby.`,
      landingPage: "https://nikolalsvk.github.io",
    },
    description: `A blog by Nikola Đuza that aims to spread knowledge and give practical tips on JavaScript and Ruby.`,
    siteUrl: `https://pragmaticpineapple.com/`,
    social: {
      twitter: `nikolalsvk`,
    },
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: "/",
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              filter: {
                frontmatter: { published: { eq: true }, newsletter: { ne: true } }
              }
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  parent {
                    ... on File {
                      fields {
                        updatedAt: gitLogLatestDate(formatString: "MMMM DD, YYYY")
                        updatedAtDateTime: gitLogLatestDate(formatString: "YYYY-MM-DD")
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        resolvePages: ({ allSitePage, allMarkdownRemark }) => {
          const allMarkdownRemarkMap = allMarkdownRemark.edges.reduce(
            (acc, edge) => {
              const { node } = edge
              const {
                fields: { slug },
              } = node
              acc[slug] = node

              return acc
            },
            {}
          )

          return allSitePage.nodes.map((page) => {
            return { ...page, ...allMarkdownRemarkMap[page.path] }
          })
        },
        serialize: ({ path, parent }) => {
          if (parent) {
            return {
              url: path,
              lastmod: parent.fields?.updatedAt,
              priority: 1,
            }
          }

          if (path.includes("/tags/")) {
            return { url: path, priority: 0.5 }
          }

          return { url: path, priority: 0.9 }
        },
        excludes: [`/newsletter/*`, `/thank-you/`, `/confirm-subscription/`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/newsletter`,
        name: `newsletter`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/root`,
        name: `newsletter`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              withWebp: true,
              quality: 100,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `markdown-header-link`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          placeholder: `blurred`,
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: `GTM-PG86LMK`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-111191498-2`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: {
                    order: DESC,
                    fields: [frontmatter___date]
                  },
                  filter: {
                    frontmatter: {
                      newsletter: { ne: true },
                      published: { eq: true }
                    }
                  }
                ) {
                  edges {
                    node {
                      frontmatter {
                        title
                        date
                      }
                      fields {
                        slug
                      }
                      excerpt
                      html
                    }
                  }
                }
              }
            `,
            output: `rss.xml`,

            title: `Pragmatic Pineapple RSS feed`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Pragmatic Pineapple Blog`,
        short_name: `Pragmatic Pineapple`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        display: `minimal-ui`,
        icon: `content/assets/pineapple-emoji.png`,
        icons: [
          {
            src: `content/assets/icons/maskable_icon_x48.png`,
            sizes: `48x48`,
            type: `image/png`,
            purpose: `any maskable`,
          },
          {
            src: `content/assets/icons/maskable_icon_x72.png`,
            sizes: `72x72`,
            type: `image/png`,
            purpose: `any maskable`,
          },
          {
            src: `content/assets/icons/maskable_icon_x96.png`,
            sizes: `96x96`,
            type: `image/png`,
            purpose: `any maskable`,
          },
          {
            src: `content/assets/icons/maskable_icon_x128.png`,
            sizes: `128x128`,
            type: `image/png`,
            purpose: `any maskable`,
          },
          {
            src: `content/assets/icons/maskable_icon_x192.png`,
            sizes: `192x192`,
            type: `image/png`,
            purpose: `any maskable`,
          },
          {
            src: `content/assets/icons/maskable_icon_x384.png`,
            sizes: `384x384`,
            type: `image/png`,
            purpose: `any maskable`,
          },
          {
            src: `content/assets/icons/maskable_icon_x512.png`,
            sizes: `512x512`,
            type: `image/png`,
            purpose: `any maskable`,
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        devMode: false,
      },
    },
    `gatsby-transformer-gitinfo`,
    `gatsby-plugin-typescript`,
  ],
}
