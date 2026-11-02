// Gatsby inlines GATSBY_FUNCTION_HOST at build time. Preview and branch builds
// set it to that deploy's origin. An empty host keeps the request on the page origin.
export const functionUrl = (name: string) =>
  `${process.env.GATSBY_FUNCTION_HOST || ""}/.netlify/functions/${name}`
