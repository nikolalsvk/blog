---
title: Stop Bots From Spamming Your ConvertKit Form
description: Move a React ConvertKit form behind a Netlify Function, then check honeypot, timing, and Cloudflare Turnstile before anyone lands on your list.
slug: secure-convertkit-subscribe-with-netlify-and-turnstile
date: 2026-10-24
coverImage: ./cover.jpg
blogOgImage: ./og-image.png
published: true
tags:
  - React
  - Netlify
  - JavaScript
---

A while ago I wrote about [building a custom newsletter form in React](/add-newsletter-subscription-form-to-react-website) and sending the signup straight to [ConvertKit](https://partners.convertkit.com/oqs53bno6l4l). That form still works. It is also very easy for a bot to abuse.

The browser posts to a public URL, `https://api.convertkit.com/v3/forms/<form_id>/subscribe`, with a public API key. Anyone who can read the page can replay that request from a script. They do not even need to open the form. I started seeing a pile of junk signups, so I moved the submit behind a small backend check.

This post is that follow-up. We keep the React form from the previous article, but the browser no longer talks to ConvertKit. It talks to a [Netlify Function](https://docs.netlify.com/functions/overview/) first. The function throws away the obvious junk, checks a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) token, and only then creates the subscriber.

If you do not have a backend and you are fine with a static React site, stay with the [original form](/add-newsletter-subscription-form-to-react-website). Turn on double opt-in in ConvertKit and expect some spam. This post is for when that stops being enough.

## What is a Netlify Function?

A Netlify Function is a small JavaScript file that runs on Netlify's servers, not in the visitor's browser. You put it in a `functions` folder. After deploy, Netlify gives it a URL like `/.netlify/functions/subscribe`. Your React code can `fetch` that URL the same way it would call any other API.

That matters because the browser is public. Anything in the React bundle can be copied. A function can keep a secret, look at the request, and decide whether ConvertKit should hear about it.

This blog already uses one. In [`netlify.toml`](https://github.com/nikolalsvk/blog/blob/master/netlify.toml) the functions directory is set here:

```toml
[build]
  command = "./build.sh"
  publish = "public/"
  functions = "functions/"
```

The function I already had is [`functions/convertkit/index.ts`](https://github.com/nikolalsvk/blog/blob/master/functions/convertkit/index.ts). It does not subscribe anyone. It asks ConvertKit how many subscribers I have, using the secret API key, and returns a number. The React bit that calls it lives in [`src/components/subscribers.tsx`](https://github.com/nikolalsvk/blog/blob/master/src/components/subscribers.tsx):

```jsx
const data = await fetch(
  `${process.env.GATSBY_FUNCTION_HOST}/.netlify/functions/convertkit`
)
const json = await data.json()
setSubscriberCount(json.subscriberCount)
```

`GATSBY_FUNCTION_HOST` is empty in production, so the request stays on the same site. Locally I point it at the Netlify dev server, because `npm start` only runs Gatsby. The function URL exists when you run `netlify dev`. If that command is not running, the subscriber count stays on `...` and the console says so.

The function above is the same idea as the new subscribe endpoint: browser calls `/.netlify/functions/<name>`, secret stays on the server.

We will add a second function next to that one, at `functions/subscribe/index.ts`.

## What we are checking

Three small checks run before ConvertKit is called. None of them is magic. Together they make the public form endpoint a worse target.

**Honeypot.** A honeypot is an extra text field that real people never see. I named mine `website`, because dumb bots like filling every input they find. The field is in the HTML, hidden with CSS, and removed from keyboard and screen reader flow. If `website` has any value, the function rejects the request.

**Timing.** When the form mounts, React stores `Date.now()` in `startedAt` and sends that number with the request. The function rejects it when `Date.now() - startedAt` is under `NEWSLETTER_MIN_SUBMIT_MS` (I use 2500, so 2.5 seconds). A person needs a moment to type an email. A lot of scripts submit immediately and forget to fake the timestamp. A careful bot can send an old `startedAt` and walk through this check. That is fine. It is a speed bump, not a lock.

**Turnstile.** [Turnstile](https://developers.cloudflare.com/turnstile/) is Cloudflare's bot check. On the page it renders a small widget and, when it is happy, gives the browser a token. That token is useless until your server asks Cloudflare "did you really issue this?" That call is [siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). The widget uses a site key, which is public. Verification uses a secret key, which stays in the function.

I also keep [double opt-in](https://help.convertkit.com/en/articles/2502655-the-incentive-email) on in ConvertKit. ConvertKit emails the address and the person has to confirm. A bot that gets past the function still has to click that email. In the form editor this is the incentive / confirmation email setting.

## The form still looks the same

The inputs from the [previous post](/add-newsletter-subscription-form-to-react-website) stay: first name and email. We add state for the three checks, and we change where `fetch` goes.

```jsx
const [email, setEmail] = useState("")
const [name, setName] = useState("")
const [honeypot, setHoneypot] = useState("")
const [startedAt, setStartedAt] = useState(() => Date.now())
const [turnstileToken, setTurnstileToken] = useState("")

const SUBSCRIBE_URL = `${
  process.env.GATSBY_FUNCTION_HOST || ""
}/.netlify/functions/subscribe`
const turnstileSiteKey = process.env.GATSBY_TURNSTILE_SITE_KEY?.trim()
```

`SUBSCRIBE_URL` is no longer `https://api.convertkit.com/...`. It is our function. `turnstileSiteKey` is public, so the `GATSBY_` prefix is fine. Gatsby inlines any `GATSBY_` variable into the browser bundle at build time. Leave the Turnstile secret and the ConvertKit secret without that prefix, or they will ship to every visitor.

Turnstile's script calls a global function when it has a token. I hang those on `window` before the script loads:

```jsx
useEffect(() => {
  window.onTurnstileSuccess = (token) => setTurnstileToken(token)
  window.onTurnstileExpired = () => setTurnstileToken("")

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
```

`onTurnstileExpired` clears the token. Turnstile tokens do not live forever. If we kept an old one, siteverify would fail and a real person would see an error.

The submit handler only packages what the function needs. ConvertKit's `api_key` is gone from the browser.

```jsx
const handleSubmit = async (event) => {
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
}
```

If ConvertKit accepts the subscriber, the response still has `subscription.id`, same as in the old post. The success and error screens can stay exactly as they were.

The honeypot and the widget sit in the form with the two real inputs:

```jsx
<form onSubmit={handleSubmit}>
  <input
    type="text"
    name="website"
    value={honeypot}
    onChange={(event) => setHoneypot(event.target.value)}
    autoComplete="off"
    tabIndex={-1}
    aria-hidden="true"
    className="hidden"
  />
  <input
    aria-label="Your first name"
    name="fields[first_name]"
    placeholder="Your first name"
    type="text"
    onChange={(event) => setName(event.target.value)}
    value={name}
  />
  <input
    aria-label="Your email address"
    name="email_address"
    placeholder="Your email address"
    required
    type="email"
    onChange={(event) => setEmail(event.target.value)}
    value={email}
  />
  {turnstileSiteKey ? (
    <div
      className="cf-turnstile"
      data-sitekey={turnstileSiteKey}
      data-callback="onTurnstileSuccess"
      data-expired-callback="onTurnstileExpired"
    />
  ) : null}
  <button>SUBSCRIBE</button>
</form>
```

`className="hidden"` is the Tailwind class that sets `display: none`. `tabIndex={-1}` keeps it out of the tab order. `aria-hidden` keeps it out of the accessibility tree. `autoComplete="off"` asks the browser not to fill it with the visitor's saved website. If a password manager fills it anyway, a real person gets rejected, so it is worth testing that once.

The styled version on this blog is [`src/components/subscribe-form.tsx`](https://github.com/nikolalsvk/blog/blob/master/src/components/subscribe-form.tsx).

## The subscribe function

Create `functions/subscribe/index.ts`. Netlify will expose it as `/.netlify/functions/subscribe`. The file uses the same `Handler` type as the subscriber-count function, from `@netlify/functions`.

First, a tiny helper so every response is JSON:

```typescript
const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(body),
})
```

Then read the body. `event.body` is a string. Bad JSON stops here with a 400, before any of the bot checks.

```typescript
const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" })
  }

  let body

  try {
    body = JSON.parse(event.body || "{}")
  } catch (error) {
    return json(400, { error: "Invalid request" })
  }

  const email = body.email?.trim().toLowerCase() || ""
  const firstName = body.first_name?.trim() || ""
  const honeypot = body.website?.trim() || ""
  const startedAt = Number(body.startedAt)
  const turnstileToken = body.turnstileToken?.trim() || ""
  const minSubmitMs = Number(process.env.NEWSLETTER_MIN_SUBMIT_MS || 2500)
```

The error text is the same for every bot check. I do not want a script to learn which check it failed.

```typescript
if (honeypot) {
  return json(400, { error: "Unable to subscribe right now" })
}

if (!Number.isFinite(startedAt) || Date.now() - startedAt < minSubmitMs) {
  return json(400, { error: "Unable to subscribe right now" })
}

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return json(400, { error: "Invalid email" })
}

const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

if (!turnstileSecret || !turnstileToken) {
  return json(400, { error: "Unable to subscribe right now" })
}
```

A missing token never reaches Cloudflare. The same generic error is used for a missing secret, so the response does not reveal which one failed.

Turnstile comes next. `TURNSTILE_SECRET_KEY` never goes to the client. `remoteip` is optional. Netlify puts the visitor IP in `x-forwarded-for`, and Cloudflare can use it as an extra signal.

```typescript
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

const turnstileJson = await turnstileResponse.json()

if (!turnstileJson.success) {
  return json(400, { error: "Unable to subscribe right now" })
}
```

Only after that do we call ConvertKit. The subscribe endpoint still wants the public `api_key` from the [previous post](/add-newsletter-subscription-form-to-react-website). I also send `api_secret`, the same secret the subscriber-count function already uses. Both stay in the function's environment.

```typescript
  const convertKitFormId = process.env.CONVERTKIT_FORM_ID
  const convertKitApiKey = process.env.CONVERTKIT_API_KEY
  const convertKitApiSecret = process.env.CONVERTKIT_API_SECRET

  if (!convertKitApiKey || !convertKitApiSecret || !convertKitFormId) {
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
    return json(400, { error: "Unable to subscribe right now" })
  }

  return json(200, { subscription: convertKitJson.subscription })
}
```

In [`functions/subscribe/index.ts`](https://github.com/nikolalsvk/blog/blob/master/functions/subscribe/index.ts) those last two `fetch` calls sit in one `try/catch`. A network failure returns 500 with the same "Unable to subscribe right now" message. The checks above it stay as they are here.

One honest limit: the old ConvertKit URL is still on the internet if you shipped the previous form. Bots that already saved `https://api.convertkit.com/v3/forms/<form_id>/subscribe` can keep posting there. The function protects the form on your site. It does not delete a public API. Double opt-in is what catches those leftovers. If the spam is bad enough, rotate the form and stop using the old form id.

## Environment variables

Put these in Netlify's site settings, and in `.env` for `netlify dev`. Anything starting with `GATSBY_` is visible in the browser. The rest is not.

```bash
GATSBY_FUNCTION_HOST=
GATSBY_TURNSTILE_SITE_KEY=

CONVERTKIT_FORM_ID=
CONVERTKIT_API_KEY=
CONVERTKIT_API_SECRET=
TURNSTILE_SECRET_KEY=
NEWSLETTER_MIN_SUBMIT_MS=2500
```

- `GATSBY_FUNCTION_HOST` is blank in production. Locally it is the `netlify dev` origin, so the browser on port 8000 can reach the function.
- `GATSBY_TURNSTILE_SITE_KEY` is the site key from the [Turnstile widget page](https://dash.cloudflare.com/?to=/:account/turnstile). Safe to expose.
- `TURNSTILE_SECRET_KEY` is the matching secret. Server only.
- `CONVERTKIT_FORM_ID` is the number from the form editor URL, same as last time (`.../forms/designers/123456/edit`).
- `CONVERTKIT_API_KEY` is the public key from ConvertKit's Settings, then Advanced, the same screen as in the [first post](/add-newsletter-subscription-form-to-react-website). The subscribe call needs it. It used to live in the browser as `GATSBY_CONVERTKIT_PUBLIC_API_KEY`.
- `CONVERTKIT_API_SECRET` is the secret next to that key. The [subscriber-count function](https://github.com/nikolalsvk/blog/blob/master/functions/convertkit/index.ts) already needs it.
- `NEWSLETTER_MIN_SUBMIT_MS` is the "too fast" cutoff in milliseconds.

Cloudflare publishes [test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) that always pass. They are handy on localhost:

- site key `1x00000000000000000000AA`
- secret key `1x0000000000000000000000000000000AA`

Do not leave those in production. They accept everyone, including the bots.

## Try it before you trust it

With `netlify dev` running:

1. Submit like a person, after the Turnstile widget finishes. You should get the success state, and ConvertKit should send the confirmation email.
2. Submit with no token. The form sets the error state and never calls the function. If you skip that client check and post an empty `turnstileToken` anyway, the function refuses before siteverify.
3. Fill the hidden `website` field from DevTools and submit. The function refuses.
4. Submit in the first second. The function refuses because `startedAt` is too new. On "try again", the form stores a fresh `startedAt` and clears the Turnstile token, so the next attempt starts the timer over.

Then, in ConvertKit, confirm the form still sends the incentive email. People who never click it can sit there forever, so it is worth a rule that tags or removes unconfirmed subscribers after a few days. The function can only see the request. ConvertKit is the one that knows who clicked.

## Summing up

The first form was the right place to start. You own the markup, and a reader can subscribe without ConvertKit's embed. The missing piece was a door in front of that public API.

A Netlify Function is that door. This site already had one for the subscriber count. The subscribe function is the same shape: the browser calls `/.netlify/functions/subscribe`, the server checks honeypot, timing, and Turnstile, and ConvertKit only hears about the requests that pass.

It will not stop a determined person. It does make the lazy scripts, which were most of my problem, go bother someone else.

The form and the function are in [the blog repo](https://github.com/nikolalsvk/blog). If you want the version with no backend, the [original newsletter form post](/add-newsletter-subscription-form-to-react-website) is still there.

Until the next one, cheers.
