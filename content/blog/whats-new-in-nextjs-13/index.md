---
title: What's New in Next.js 13
description: TODO
slug: TODO
date: 2022-11-01
canonical: TODO
canonicalName: TODO
coverImage: TODO
blogOgImage: TODO
published: true
tags:
  - TODO
---

Next.js, a famous and well-established React framework from the Vercel company, just released version 13 last week. The announcement was made at the Next.js Conf, with over 110 000 registered users and more than 55 000 that joined live.

The conference was like a breath of fresh air in the frontend community and took the news by storm. People worldwide quickly spread the news about features and goodies announced live on October 25th. Now, as the dust slowly settles, we can go through what's new in Next.js 13.

And what's a better way to check out what's new than playing and building a simple app, right? If you want, you can jump start a new Next.js 13 project with this command:

```
npx create-next-app@latest --typescript
```

> Note that the `--typescript` is optional, you can omit it.

Alright, let's jump in into the Layout features in Next.js 13.

## app/ Directory (in beta right now)

The ability to simply create a file in your project and have Next.js create a route based on it was a great developer experience from the start. Now, Next.js wants to improve routing and layouts by introducing the `app` directory in the root of your Next.js project.

This feature is still in beta, and it is entirely optional. You can keep your `pages` directory and have it coexist with the `app` directory. Or just skip adding `app` dir at all. One thing you have to do now is to "tell" Next you will use it by adding the following in your `next.config.js`:

```js
// next.config.js

const nextConfig = {
  // ...
  experimental: { appDir: true },
}

// ...
```

Then, you can create the app directory with a `page.tsx` file like so:

```typescript
// app/page.tsx
// This file maps to the index route (/)
export default function Page() {
  return <h1>Hello, I am Page!</h1>
}
```

Of course, if you have `pages/index.tsx`, you have to either rename it or delete it. You'll have to make up your mind here, you can't have both. When you dealt with `pages/index.tsx`, the running Next.js server will create a `app/layout.tsx` - how thoughtful of it, thanks Next.js.

```
Your page app/page.tsx did not have a root layout, we created app/layout.tsx for you.
```

Having the `app/layout.tsx` created for us is a great segway to the next section about Layouts in Next.js

## Layouts

Layout in Next.js makes it easier to extract shared code between multiple pages. The `layout.tsx` accepts another layout or a page as a child. Here's how it looks:

```typescript
// app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  )
}
```

Now, with the `app/page.tsx` and `app.layout.tsx` in your project, you can rock and roll. To get a bit of styling, you can copy the boilerplate CSS from `pages/globals.css` to `app/global.css`. Then, it is best if you include it `app/layout.tsx` like so:

```typescript
import "./global.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  )
}
```

And then, when you run `npm run dev and visit http://localhost:3000/ you should see something like this:

![Basic Next.js page using app directory](./basic-nextjs-page-using-app-dir.png)

Of course, you can create another page like `app/product/page.tsx` and have a layout for products `app/product/layout.tsx`.

Let's see what else is new.

## React Server Components

If you use Server Components in Next.js, you can reduce the amount of JavaScript sent to the client, enabling faster initial page loads.
We touched a bit on this subject when [React 18 came out](https://blog.appsignal.com/2022/04/13/whats-new-in-react-18.html).

And what is great in Next.js 13 is that all components inside the [app directory](https://beta.nextjs.org/docs/routing/fundamentals#the-app-directory) are React Server Components by default, including [special files](https://beta.nextjs.org/docs/routing/fundamentals#special-files) and [colocated components](https://beta.nextjs.org/docs/routing/fundamentals#colocation) (tests, styles, other components, etc.). That way, you are set up to achieve performance gains without doing any work or rewriting your components.

When a page is loaded, the Next.js and React runtime will get loaded, which is cacheable and predictable in size. This runtime remains the same size as your application grows. Additional JavaScript will only be added as client-side interactivity is needed in your application through the use of [Client Components](https://beta.nextjs.org/docs/rendering/server-and-client-components#client-components).

You can use Client Components by specifying a "use client" directive at the top of the component that's meant for the client. Let's create a new file under `app/counter/page.tsx`:

```typescript
"use client"

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked the Count++ button {count} times</p>
      <button onClick={() => setCount(count + 1)}>Count++</button>
    </div>
  )
}
```

You should add "use client" when you are using `useState` or `useEffect` client hooks from React. Or, if you depend on certain browser APIs or you want to add certain event listeners. In other cases, when you don't need things from the client, it is best to leave components as they are and let them be rendered as Server Components by Next.js. That will help ensure the smallest amount of client-side JavaScript code.

If you decide to utilize `useState` or any other client hooks, Next.js will fail to render and show an error like so:

![Error when no "use client" directive is used](./no-use-client-directive.png)

I wonder why `"use client"` does not happen automatically. But anyways, there you go, it is hard to make a mistake because Next.js really gave it a good thought and made the developer experience great.

On that note, there's an even greater goodie when it comes to developer experience. Great way to do data fetching and show loading states. Let's jump into it in the next section.

## Streaming and Data Fetching

In Next.js 13, you can now easily stream parts of the UI to the client with React Suspense. For example, if the data fetching is waiting to complete, you can show a loading state to the user. Then, when the data fetching is complete, new info will be streamed to the page in the place of the previously shown loading state.

The API to fetch data has been simplified, and the old APIs [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props), [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/get-static-props), and [getInitialProps](https://nextjs.org/docs/api-reference/data-fetching/get-initial-props) are not supported in the new `app` directory.

It is recommended that you fetch data inside Server Components (the ones we touched in a section above). That way, fetching and rendering happen in the same environment, reducing the back and forth between client and server and, ultimately, the work done in the browser.

You can fetch data anywhere in the `app` directory, but, because of the way how Streaming and Suspense work in React, you should adopt a new mental model when fetching data. Namely, you should fetch data directly in the components that use it, even if you need to request the data in multiple components. Behind the scenes, React and Next.js will [cache and dedupe](https://beta.nextjs.org/docs/data-fetching/fundamentals#automatic-fetch-request-deduping) requests to avoid the same data being fetched more than once.

### Streaming and fetching in Server Components

What's great about the new Next.js release is that you can show a loading state simply by creating a `loading.tsx` file. In this example, we made `app/dashboard/loading.tsx` like so:

```typescript
export default function Loading() {
  return <p>Loading the Dashboard...</p>
}
```

And in `app/dashboard/page.tsx` we have the following code:

```typescript
async function getData() {
  // You would usually fetch data from an API here.
  // const res = await fetch("https://api.github.com/");

  // But, here we just wait for 3 seconds.
  await new Promise((res) => setTimeout(res, 3000))

  // You would usually return data from an API here.
  // return res.json();
  return "Dashboard data"
}

export default async function Page() {
  const name = await getData()

  return <p>🤩 Hello {name}!</p>
}
```

If we try to load `http://localhost:3000/dashboard`, there will first be a loading screen and then the dashboard will show up.

![Using loading.tsx to show a loading state before the page is loaded](./using-loading-tsx-before-data-is-fetched.gif)

You can even get into details and use React's Suspense to further break down the UI and make sure the layout renders while a specific component in the layout is waiting for data to be fetched.

Being able to utilize async/await in Server Components is great and is a part of [React RFC for adding a first class support for Promises](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md). It allows us to do what we just did in `app/dashboard/page.tsx`:

```typescript
export default async function Page() {
  const name = await getData()

  return <p>🤩 Hello {name}!</p>
}
```

But we can't use async/await in this manner in Client Components. Let's see how we can fetch data there in the next section.

### Streaming and fetching in Client Components

The example above showed how to show a loading screen while the data is prepared for rendering in Server Components. But, if you want to do a similar thing on the client, you have to utilize the `use` hook.

Let's change our example to make sure it's rendered properly as a Client Component. We will create `app/dashboard-client/loading.tsx` - it will be same but with a different copy:

```typescript
export default function Loading() {
  return <p>Loading the Dashboard in Client Components...</p>
}
```

Then, the `app/dashboard-client/page.tsx` will use the `use` hook from React like so:

```typescript
"use client"

import { use } from "react"

async function getData() {
  // You would usually fetch data from an API here.
  // const res = await fetch("https://api.github.com/");

  // But, here we just wait for 3 seconds.
  await new Promise((res) => setTimeout(res, 3000))

  // You would usually return data from an API here.
  // return res.json();
  return "Dashboard data in Client Components"
}

export default function Page() {
  const name = use(getData())

  return <p>🤩 Hello {name}!</p>
}
```

Notice how call `use(getData())`. This is because use is a new React function that accepts a promise and it is conceptually similar to await. We need `use` becase it handles the promise returned by a function in a way that is compatible with components, hooks, and Suspense. The `use` hook is a part of [React RFC](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#usepromise) we mentioned earlier.

If we visit http://localhost:3000/dashboard-client, we should see a similar thing as before. The loading state shows briefly until the actual dashboard is shown.

![Stream dashboard using Client Componets](./stream-dashboard-client-components.gif)

### Caching with fetch

The `fetch()` function is a Web API that fetches remote resources and returns a promise. React extends `fetch` to provide [automatic request deduping](https://beta.nextjs.org/docs/data-fetching/fundamentals#automatic-fetch-request-deduping), and Next.js extends the fetch options object to allow each request to set its own [caching and revalidating](https://beta.nextjs.org/docs/data-fetching/caching).

So React and Next.js take the `fetch` browser API and they are putting some sprinkles on top of it. Now, in Next.js 13, you can speficy how you want requests to be cached (or not to be cached at all):

```typescript
// This request should be cached until manually invalidated.
// Similar to `getStaticProps` from Next.js 12.
// `force-cache` is the default and can be omitted for brevity.
// This is called static data in Next.js world
fetch(URL, { cache: "force-cache" })

// This request should be refetched on every request.
// Similar to `getServerSideProps`.
// Here we have loading of dynamic data in Next.js world.
fetch(URL, { cache: "no-store" })

// This request should be cached with a lifetime of 10 seconds.
// Similar to `getStaticProps` with the `revalidate` option.
fetch(URL, { next: { revalidate: 10 } })
```

And that's is as far as streaming and fetching does. You can read more about it in [Next.js' official docs here](https://beta.nextjs.org/docs/data-fetching/fundamentals). Now, let's go into the part which drew attention from the big part of the frontend world - a 700 times faster bundler - Turbopack.

## Turbopack

[Turbopack](https://turbo.build/pack) is branded as a "up to 700x faster Rust-based Webpack replacement". It even features a small letter to the public from the Webpack create himself - Tobias Koppers. Tobias is leading the initiative and the project, which can only mean good news for the whole frontend community.

Right now, you can use Turbopack with Next.js 13 if you run `next dev --turbo` (or, if you're running it via npm in the project we generated at the beggining - `npm run dev --turbo`).

It supports Server Components, TypeScript, JSX, CSS, and more. As the project is in alpha state, many of the features are not yet supported. But, we can only hope for a stable release where it can speed up projects across the world.

## `next/image` improvements

The new Image component in Next.js comes with less client-side JavaScript, it is easier to style and configure, and it is more accessible by requiring alt tags by default.

In terms of code changes, the `next/image` import was renamed to `next/legacy/image`. The `next/future/image` import was renamed to next/image. There's [a codemod](https://github.com/vercel/next.js/blob/canary/docs/advanced-features/codemods.md#next-image-to-legacy-image) to help you migrate quickly.

If you were not using `width` and `height` on non-static images (or images without the `fill` property. You will now have to set them. Same goes with the `alt` prop - it is not mandatory.

Here's [a guide on migrating to the new `next/image`](https://github.com/vercel/next.js/blob/canary/docs/api-reference/next/image.md#migration).

## `@next/font`

The new `@next/font` let's you use Google Fonts (or any custom font= without sending any requests from the browser. CSS and font files are downloaded at build time with the rest of the static assets.

To try it out, you need to install the package with:

```
npm install @next/font
```

Then, you can use it like this:

```typescript
import { Montserrat } from "@next/font/google"

const montserrat = Montserrat()

// This file maps to the index route (/)
export default function Page() {
  return (
    <article>
      <h1>Hello, I am Page!</h1>

      <p className={montserrat.className}>I am using Montserrat font</p>
    </article>
  )
}
```

You can read more about the custom font loading and font optimization in [the official docs](https://nextjs.org/docs/basic-features/font-optimization).

## `next/link` improvement

You no longer have to include the `<a>` tag when using `next/link`.

```typescript
import Link from 'next/link'

// Next.js 12: `<a>` has to be nested otherwise, it's excluded
<Link href="/dashboard">
  <a>Dashboard</a>
</Link>

// Next.js 13: `<Link>` always renders `<a>`
<Link href="/dashboard">
  Dashboard
</Link>
```

There is also [a codemod](https://nextjs.org/docs/advanced-features/codemods#new-link) to help you remove the extra `<a>` tag you may have in your existing project.

## Generating OG images with `@vercel/og`

A new `@vercel/og` library allows you to generate open graph (OG) images. The OG images are well-known to increase engagement rate of the links you share.

Vercel and Next.js have been on this topic for some time, providing you with docs on how to generate OG images via functions. But, now there is a new guide that shows how you can utilize the new [Edge Runtime](https://vercel.com/docs/concepts/functions/edge-functions/edge-functions-api) together with the `@vercel/og` library.

## Middleware API Changes

The new Next.js 13 improves the [Middleware](https://nextjs.org/docs/advanced-features/middleware) feature. Vercel's Middleware is code that executes before a request is processed on a site. There, you can modify the incoming request, do some logic before the request is processed, and similar.

Now, it is easier to set headers in the middleware. Plus, you can directly return a response from the middleware, without the need to do `rewrite` or `redirect`. But, for this, you need to enable `experimental.allowMiddlewareResponseBody` configuration option inside `next.config.js`.

To get started, you need to have a `middleware.js` or middleware.ts` in the root of your Next.js project like so. We'll use the TypeScript version and show how you can set a header to an incoming request.

```typescript
// middleware.ts

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header
  // that will be sent to the server `header-for-the-server`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("header-for-the-server", "hello server")

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })

  // Set a new response header that you can inspect in the browser
  // `header-for-the-client`
  response.headers.set("header-for-the-client", "hello client")
  return response
}
```

You can do the same in the project we were using from the beginning and inspect the headers of http://localhost:3000/ in the browser. There, you should see the `header-for-the-client` header in the Network tab.

## Telemetry

I am not sure if this was before, but when I ran `npm run dev` (or `next dev`) after upgrading I got this message:

```
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry
```

It might be that I first noticed it and I can't find a written proof of when did Next.js start collecting anonymous usage reports.
Anyways, you can easily opt out by running:

```
npx next telemetry disable
```

You can also quickly check if this is disabled or enabled for you with:

```
npx next telemetry status
```

In any case, I feel that collecting usage should be optional and not turned on by the default. Let's go over to the breaking changes in this version.

## Breaking Changes

- Here are the breaking changes, together with the ones we mentioned before:
- The minimum React version has been bumped from 17.0.2 to 18.2.0.
- The minimum Node.js version has been bumped from 12.22.0 to 14.6.0, since 12.x has reached end-of-life (PR).
- The swcMinify configuration property was changed from false to true. See [Next.js Compiler](https://nextjs.org/docs/advanced-features/compiler) for more info.
- The next/image import was renamed to next/legacy/image. The next/future/image import was renamed to next/image. A [codemod is available](https://nextjs.org/docs/advanced-features/codemods#next-image-to-legacy-image) to safely and automatically rename your imports.
- The next/link child can no longer be <a>. Add the legacyBehavior prop to use the legacy behavior or remove the <a> to upgrade. A [codemod is available](https://nextjs.org/docs/advanced-features/codemods#new-link) to automatically upgrade your code.
- Routes are no longer prefetched when the User-Agent is a bot.
- The deprecated target option of next.config.js has been removed.
- The supported browsers have been changed to drop Internet Explorer and target modern browsers. You can still use Browserslist to change targeted browsers.
  - Chrome 64+
  - Edge 79+
  - Firefox 67+
  - Opera 51+
  - Safari 12+

## Wrapping up

That's all, folks, we have gone through all changes in the new Next.js 13. Hope this version is exciting for you, and it encourages you to jump straight in and explore new features.

I pushed the code mentioned here onto [a GitHub repo you can find here](https://github.com/nikolalsvk/next-the-13th). There's also a live demo to play with at https://next-the-13th.vercel.app/. You can also check out the official blog post announcing version 13 [here](https://nextjs.org/blog/next-13).

Thanks for reading, and see you in the next one.
