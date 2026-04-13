import { Handler, HandlerEvent } from "@netlify/functions"
import fetch from "node-fetch"

type SubscribeBody = {
  email?: string
  first_name?: string
  website?: string
  startedAt?: number
  turnstileToken?: string
}

const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(body),
})

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" })
  }

  let body: SubscribeBody

  try {
    body = JSON.parse(event.body || "{}")
  } catch (error) {
    console.error("Invalid subscribe payload", error)
    return json(400, { error: "Invalid request" })
  }

  const email = body.email?.trim().toLowerCase() || ""
  const firstName = body.first_name?.trim() || ""
  const honeypot = body.website?.trim() || ""
  const startedAt = Number(body.startedAt)
  const turnstileToken = body.turnstileToken?.trim() || ""
  const minSubmitMs = Number(process.env.NEWSLETTER_MIN_SUBMIT_MS || 2500)

  // Hidden input should always stay empty for real users.
  if (honeypot) {
    return json(400, { error: "Unable to subscribe right now" })
  }

  if (!Number.isFinite(startedAt) || Date.now() - startedAt < minSubmitMs) {
    return json(400, { error: "Unable to subscribe right now" })
  }

  if (!email || !isEmailValid(email)) {
    return json(400, { error: "Invalid email" })
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (!turnstileSecret || !turnstileToken) {
    return json(400, { error: "Unable to subscribe right now" })
  }

  try {
    const remoteIp = event.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    const turnstileForm = new URLSearchParams({
      secret: turnstileSecret,
      response: turnstileToken,
    })

    if (remoteIp) {
      turnstileForm.append("remoteip", remoteIp)
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: turnstileForm.toString(),
      }
    )

    const turnstileJson = (await turnstileResponse.json()) as {
      success?: boolean
      "error-codes"?: string[]
    }

    if (!turnstileJson.success) {
      console.error(
        "Turnstile verification failed",
        turnstileJson["error-codes"]
      )
      return json(400, { error: "Unable to subscribe right now" })
    }

    const convertKitFormId = process.env.CONVERTKIT_FORM_ID
    const convertKitApiKey = process.env.CONVERTKIT_API_KEY
    const convertKitApiSecret = process.env.CONVERTKIT_API_SECRET

    if (!convertKitApiKey || !convertKitApiSecret || !convertKitFormId) {
      console.error("Missing ConvertKit API key, secret, or form ID")
      return json(500, { error: "Subscription service unavailable" })
    }

    const convertKitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`,
      {
        method: "POST",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: convertKitApiKey,
          api_secret: convertKitApiSecret,
          email,
          first_name: firstName,
        }),
      }
    )

    const convertKitJson = await convertKitResponse.json()

    if (!convertKitResponse.ok || !convertKitJson?.subscription?.id) {
      console.error("ConvertKit subscribe failed", convertKitJson)
      return json(400, { error: "Unable to subscribe right now" })
    }

    return json(200, { subscription: convertKitJson.subscription })
  } catch (error) {
    console.error("Subscribe function failed", error)
    return json(500, { error: "Unable to subscribe right now" })
  }
}

export { handler }
