import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions"
import fetch from "node-fetch"

const handler: Handler = async (
  _event: HandlerEvent,
  _context: HandlerContext
) => {
  // your server-side functionality
  // Logic to fetch subscriber count from ConvertKit API
  const response = await fetch(
    `https://api.convertkit.com/v3/subscribers?api_secret=${process.env.CONVERTKIT_API_SECRET}`
  )
  const data = await response.json()
  const subscriberCount = data.total_subscribers

  return {
    statusCode: 200,
    body: JSON.stringify({ subscriberCount }),
  }
}

export { handler }
