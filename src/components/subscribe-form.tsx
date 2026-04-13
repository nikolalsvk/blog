import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/gatsby"
import Spacer from "../components/spacer"

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void
    onTurnstileExpired?: () => void
  }
}

const SubscribeForm = () => {
  const [status, setStatus] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [startedAt, setStartedAt] = useState<number>(() => Date.now())
  const [turnstileToken, setTurnstileToken] = useState("")

  const SUBSCRIBE_URL = `${
    process.env.GATSBY_FUNCTION_HOST || ""
  }/.netlify/functions/subscribe`
  const turnstileSiteKey = process.env.GATSBY_TURNSTILE_SITE_KEY?.trim()

  useEffect(() => {
    window.onTurnstileSuccess = (token) => {
      setTurnstileToken(token)
    }

    window.onTurnstileExpired = () => {
      setTurnstileToken("")
    }

    const existingScript = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    )

    if (!existingScript) {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    return () => {
      delete window.onTurnstileSuccess
      delete window.onTurnstileExpired
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (turnstileSiteKey && !turnstileToken) {
      setStatus("ERROR")
      return
    }

    const payload = JSON.stringify({
      email,
      first_name: name,
      website: honeypot,
      startedAt,
      turnstileToken,
    })

    try {
      const response = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json",
        },
      })

      const json = await response.json()

      if (json?.subscription?.id) {
        setStatus("SUCCESS")
        return
      }

      setStatus("ERROR")
      Sentry.captureMessage("Error subscribing to newsletter", {
        extra: json,
      })
    } catch (err) {
      setStatus("ERROR")
      console.error(err)
      Sentry.captureException(err)
    }
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setEmail(value)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setName(value)
  }

  return (
    <div className="relative z-5 w-full flex justify-center flex-col bg-[hsl(19,76%,97%)] rounded-md border border-[var(--color-primary)] py-11 px-8">
      {status === "SUCCESS" && (
        <>
          <h2 className="m-0">
            Welcome aboard{name ? `, ${name}` : ""}{" "}
            <span role="img" aria-label="Ship">
              🚢
            </span>
          </h2>
          <Spacer />
          <h2 className="m-0">
            Please check your inbox to confirm the subscription!
          </h2>
        </>
      )}
      {status === "ERROR" && (
        <>
          <h2 className="m-0">Oops, something went wrong...</h2>
          <Spacer />
          <h2 className="m-0">
            Please,{" "}
            <button
              onClick={() => {
                setStatus(null)
                setStartedAt(Date.now())
                setTurnstileToken("")
              }}
              className="bg-transparent border-none p-0 cursor-pointer shadow-[0_1px_0_0_currentColor] text-inherit"
            >
              try again.
            </button>
          </h2>
        </>
      )}
      {status === null && (
        <>
          <div className="flex flex-col items-center">
            <h2 className="m-0">Join the newsletter!</h2>
            <p className="text-[hsl(0,0%,33%)] w-[70%] text-center leading-[1.4] mt-2">
              Subscribe to get latest content by email and to become a fellow
              pineapple{" "}
              <span role="img" aria-label="Pineapple">
                🍍
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-between items-center m-0"
          >
            <input
              type="text"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              name="website"
              className="hidden"
            />
            <input
              className="w-full p-2.5 rounded border border-[var(--color-primary)] mb-2"
              aria-label="Your first name"
              name="fields[first_name]"
              placeholder="Your first name"
              type="text"
              onChange={handleNameChange}
              value={name}
            />
            <input
              className="w-full p-2.5 rounded border border-[var(--color-primary)] mb-2"
              aria-label="Your email address"
              name="email_address"
              placeholder="Your email address"
              required
              type="email"
              onChange={handleEmailChange}
              value={email}
            />
            {turnstileSiteKey ? (
              <div
                className="cf-turnstile mb-2"
                data-sitekey={turnstileSiteKey}
                data-callback="onTurnstileSuccess"
                data-expired-callback="onTurnstileExpired"
              />
            ) : null}
            <button className="w-full text-white bg-gradient-to-tr from-orange-600 to-orange-400 rounded font-bold border-none py-3 cursor-pointer transition-all duration-500 bg-[length:200%_auto] hover:bg-[position:right_center]">
              SUBSCRIBE
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default SubscribeForm
