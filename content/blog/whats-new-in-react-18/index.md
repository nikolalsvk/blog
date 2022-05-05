---
title: What's New in React 18
description: Let's explore the new features and improvements in React 18.
slug: whats-new-in-react-18
date: 2022-04-13
canonical: https://blog.appsignal.com/2022/04/13/whats-new-in-react-18.html
canonicalName: AppSignal
coverImage: ./cover.png
blogOgImage: ./cover.png
published: true
tags:
  - JavaScript
  - React
---

![React 18](./cover.png)

Some exciting new improvements have been launched with React 18. When React 18 was announced a year ago, the team promised a gradual adoption strategy. Now, a year later, this is exactly what they've done and you can upgrade your app to the newest version.

React 18 comes with a few breaking changes, depending on how you use it. But all in all, it also brings out-of-the-box performance improvements including batching more by default, which removes the need to manually batch updates in application or library code.

For some, this is music to their ears, others might need more convincing. So let's dive deeper into some of the most important new changes that Facebook's team has brought us.

## Breaking Changes in React 18

What would a major release be without a breaking change? Well, this version of React is a bit different, and you will see why in a second. One of the changes you can make is to alter `render` to `createRoot` like so:

```js
// Before
import { render } from "react-dom"

const container = document.getElementById("app")
render(<App tab="home" />, container)

// After
import { createRoot } from "react-dom/client"

const container = document.getElementById("app")
const root = createRoot(container)
root.render(<App tab="home" />)
```

`createRoot` enables concurrent features from React 18. If you don't use it, your app will behave like it's on React 17, and you won't get to experience sweet out-of-the-box optimization. So for now, you will see a deprecation notice if you're still using `render` instead of `createRoot`.

This is a good chance to experiment and see if the new concurrent features improve your production performance. You can run an experiment where one variant has `render` and the other uses `createRoot`. Also, you won't break your code by switching to the new API. You can gradually switch to `createRoot` without the possibility of breaking your app.

To ensure you migrate your app properly, try enabling [strict mode](https://reactjs.org/docs/strict-mode.html). Strict mode will let you know what is happening with components in development, and it will print out any irregularities in the console. Enabling strict mode won't affect production builds. You can do it somewhere in your app like so:

```js
import React from "react"
import { createRoot } from "react-dom/client"

function App() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <Content />
          <SignUpForm />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  )
}

const container = document.getElementById("app")
const root = createRoot(container)
root.render(<App />)
```

Also, if you're using `hydrate` for server-side rendering with hydration, you can upgrade to `hydrateRoot`:

```js
// Before
import { hydrate } from "react-dom"
const container = document.getElementById("app")
hydrate(<App tab="home" />, container)

// After
import { hydrateRoot } from "react-dom/client"
const container = document.getElementById("app")
const root = hydrateRoot(container, <App tab="home" />)
// Unlike with createRoot, you don't need a separate root.render() call here.
```

And that's it as far as high-level features are concerned. You can [take a look at other breaking changes in React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#other-breaking-changes).

Let's see what new goodies React 18 brings in the next section.

## Automatic Batching in React 18

React 18 brings us automatic batching. It might sound confusing — you might ask: 'what batching?'. We'll go through it, don't worry. Let's take a look at an example:

```js
// Before: only React events were batched
setTimeout(() => {
  setSize((oldSize) => oldSize + 1)
  setOpen((oldOpen) => !oldOpen)
  // React will render twice, once for each state update (no batching)
}, 1000)

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched
setTimeout(() => {
  setSize((oldSize) => oldSize + 1)
  setOpen((oldOpen) => !oldOpen)
  // React will only re-render once at the end (that is batching)
}, 1000)
```

Automatic batching means that React will now batch updates you make inside your components. Batching prevents unnecessary renders of your component.

In React 17, if you change the state of the component two times, the component will re-render two times. Now, in React 18, the two updates will be batched, and the component will render only once. And that's only if you're using `createRoot` instead of `render`. Take a look at the examples below:

- ✅ [Demo: React 18 with createRoot batches, even outside event handlers!](https://codesandbox.io/s/morning-sun-lgz88?file=/src/index.js) — notice one render per click in the console!
- 🟡 [Demo: React 18 with legacy render keeps the old behavior](https://codesandbox.io/s/jolly-benz-hb1zx?file=/src/index.js) — notice two renders per click in the console.

If automatic batching is not something you want in your component, you can always opt-out with `flushSync`. Let's go through an example:

```js
import { flushSync } from "react-dom" // Note: we are importing from react-dom, not react

function handleSubmit() {
  flushSync(() => {
    setSize((oldSize) => oldSize + 1)
  })

  // React has updated the DOM by now
  flushSync(() => {
    setOpen((oldOpen) => !oldOpen)
  })

  // React has updated the DOM by now
}
```

Calls to `setCounter` and `setFlag` will immediately try to update the DOM instead of being batched together.

This new feature alone can make a difference in how your app performs. And the coolest thing about it is that you only have to change the mounting point of your app to use `createRoot`.

Let's see what else there is in the new version.

## Transitions

React 18 brings in a new API for transitions. A transition is a new concept in React to distinguish between urgent and non-urgent updates.

- **Urgent updates** are the ones that reflect direct interaction, like typing, clicking, pressing, and so on.
- **Transition updates** transition the UI from one view to another in a non-urgent manner.

Let's imagine a page with search capabilities. Once you add text into an input field, you want to see that text show up there immediately. This is an urgent update. But, as you type, it is not urgent to immediately show the user search results. On the contrary, developers usually debounce or throttle a user's input before showing search results.

So typing into an input field or clicking a filter button is an urgent update. Showing search results is not an urgent update, and it is considered a transition update. Let's see that in a code example:

```js
import { startTransition } from "react"

// Urgent: Show what was typed in the input
setInputValue(newInputValue)

// Mark any state updates inside as transitions and mark them as non-urgent
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(newInputValue)
})
```

Updates wrapped in `startTransition` are handled as non-urgent and will be interrupted if more urgent updates like clicks or keypresses come in. Suppose a transition gets interrupted by the user (for example, by typing multiple characters in a row). In that case, React will throw out the stale rendering work that wasn't finished and render only the latest update.

You can use a hook called `useTransition` to get a pending flag, like so:

```js
function App() {
  const [isPending, startTransition] = useTransition()
  const [count, setCount] = useState(0)

  function handleClick() {
    startTransition(() => {
      setCount((oldCount) => oldCount + 1)
    })
  }

  return (
    <div>
      <span>Current count: {count}</span>

      {isPending && <Spinner />}

      <button onClick={handleClick}>Increment</button>
    </div>
  )
}
```

There are other hooks with the new release, but first, let's see something we've waited a long time for — `Suspense` — being brought to our server-side rendering apps.

## Suspense On the Server

`Suspense` is now available on the server. Previously, it was available on the client-side with code splitting using `React.lazy`. But now, you can have a placeholder of some sort while your components "suspend". Let's see it in code:

```js
<Suspense fallback={<PageSkeleton />}>
  <RightColumn>
    <ProfileHeader />
  </RightColumn>
  <LeftColumn>
    <Suspense fallback={<LeftColumnSkeleton />}>
      <Comments />
      <Photos />
    </Suspense>
  </LeftColumn>
</Suspense>
```

`Suspense` will fall back to the component you give it if any of the components in the tree "suspend". But what does it mean for a component to "suspend"? It can mean many things, however, in every case, it means that the component is not ready to render — it could be missing data or code.

What does this mean for the code example above? If a component suspends, the closest `Suspense` component above it "catches" it, no matter how many components there are in between. In the above example, if `ProfileHeader` suspends, then the entire page will be replaced with `PageSkeleton`.

However, if either `Comments` or `Photos` suspend, they'll both be replaced with `LeftColumnSkeleton`. This lets you safely add and remove `Suspense` boundaries according to the granularity of your visual UI design, without worrying about the components that might depend on asynchronous code and data.

If you use `Suspense`, a slow rendering component on the server will no longer hold the entire page back. Read more about it in [this detailed GitHub discussion about SSR Suspense](https://github.com/reactwg/react-18/discussions/37).

A door has also been opened for third-party data-fetching libraries to come in and support Suspense. Some GraphQL or REST libraries can support suspending components until requests finish. You can run your own ad hoc solution for data fetching and Suspense, but it is not recommended at the moment.

## 5 New Hooks in React 18

With React 18, we have five new hooks:

### 1\. useId

`useId` is a new hook for generating unique IDs on both the client and server, while avoiding hydration mismatches. For example:

```js
function CodeOfConductField() {
  const id = useId()

  return (
    <>
      <label htmlFor={id}>Do you agree with our Code of Conduct?</label>
      <input id={id} type="checkbox" name="coc" />
    </>
  )
}
```

### 2\. useTransition

We already covered this one in the previous section about transitions.

### 3\. useDeferredValue

`useDeferredValue` lets you defer re-rendering a non-urgent part of the tree. It is similar to debouncing or throttling, but has a few advantages. There is no fixed time delay, so React will attempt the deferred render right after the first render is reflected on the screen. The deferred render is interruptible and doesn't block user input.

If we take a look at the example with the search, we'd need to memoize the child component that's using the deferred value. Let's see an example:

```js
function SearchResults() {
  const query = useSearchQuery("")
  const deferredQuery = useDeferredValue(query)

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestionResuls = useMemo(
    () => <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  )

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading suggestion results...">
        {suggestionResuls}
      </Suspense>
    </>
  )
}
```

Now, the `SearchSuggestions` component will re-render only when the `deferredQuery` is updated. And to tie everything together, while the `SearchSuggestions` is suspended, we'd see "Loading results..." text.

### 4\. useSyncExternalStore

`useSyncExternalStore` is a hook meant for reading and subscribing from external data sources in a way that’s compatible with concurrent rendering features like selective hydration and time slicing.

This hook is intended for library authors and is not typically used in application code. If you're maintaining a library and it sounds like you might need it, you can [read more in the `useSyncExternalStore` official docs](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore).

### 5\. useInsertionEffect

The signature of `useInsertionEffect` is identical to `useEffect`, but it fires synchronously **before** all DOM mutations. This hook is meant to inject styles into the DOM before reading layout in `useLayoutEffect`. It does not have access to refs and cannot schedule updates.

`useInsertionEffect` is meant to be limited to `css-in-js` library authors. You should instead use `useEffect` or `useLayoutEffect`.

If you're an author or maintainer of `css-in-js` library, you can [find more info about `useInsertionEffect` in its documentation](https://reactjs.org/docs/hooks-reference.html#useinsertioneffect).

## Other Notable React 18 Changes

### Bye-bye Older Browsers!

React now depends on modern browser features, including `Promise`, `Symbol`, and `Object.assign`.

Consider including a global polyfill in your bundled application if you support older browsers and devices such as Internet Explorer, which do not provide modern browser features natively or have non-compliant implementations.

### Components Can Now Render `undefined`

React no longer throws an error if you return `undefined` from a component. The allowed component returns values consistent with allowed values in the middle of a component tree. The React team suggests using a linter to prevent mistakes like forgetting a return statement before JSX.

### No `setState` Warning on Unmounted Components

Previously, React warned about memory leaks when you called `setState` on an unmounted component. This warning was added for subscriptions, but people primarily ran into it in scenarios where the setting state was fine, and workarounds would worsen the code.

### Improved Memory Usage

React now cleans up more internal fields on unmount, so the impact from unfixed memory leaks in your application code is less severe. It would be interesting to see how memory usage drops compared to the previous versions.

## Wrap-up: React 18 Brings Great Improvements

A lot of new and exciting announcements have come from the React team about React 18. To sum up, here's an overview:

- `React.render` will warn you that you should replace it with `React.createRoot`
- `ReactDOM.hydrate` will tell you the same about `React.hydrateRoot`
- Automatic batching is batching state updates and performing them together, thus reducing the re-rendering count.
- Transitions let you do more critical state updates and possibly interrupt other non-urgent updates. The API is `useTransition` and `startTransition`.
- Suspense allows you to SSR your components in a way that doesn't block other components.
- Suspense also opens a way for data frameworks to come in and build on it. That way, data fetching with a data framework will make the components suspend out of the box.
- A couple of new hooks have come in to save the day. You might not need `debounce` and `throttle` in your code if you decide to use `useDeferredValue`.
- Old browsers will be affected, so be sure to add polyfills if you need to support them.

That's it! We've gone through all the major changes. You can read the [full React 18 changelog on GitHub](https://github.com/facebook/react/blob/main/CHANGELOG.md#1800-march-29-2022). What change excites you the most?

Thanks for reading, and see you in the next one.
