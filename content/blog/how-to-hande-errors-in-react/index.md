---
title: How to Handle Errors in React
description: Let's look at the various ways you can handle React errors.
slug: how-to-handle-errors-in-react
date: 2022-06-15
canonical: https://blog.appsignal.com/2022/06/15/how-to-handle-errors-in-react.html
canonicalName: AppSignal
coverImage: ./cover.avif
blogOgImage: ./cover.avif
published: true
tags:
  - React
  - JavaScript
---

Let's face it. Nobody wants to see a broken, empty page while surfing the web. It leaves you stranded and confused. You don't know what happened or what caused it, leaving you with a bad impression of the website.

It is often better to communicate the error and let the user continue to use the app. The user will get less of a bad impression and can continue to use its features.

In today's post, we'll go through different ways to handle errors in React applications.

## The Classic "Try and Catch" Method in React

If you've used JavaScript, you've probably had to write a 'try and catch' statement. To make sure we're on board with what it is, here's one:

```js
try {
  somethingBadMightHappen()
} catch (error) {
  console.error("Something bad happened")
  console.error(error)
}
```

It is a great tool to catch misbehaving code and ensure our app doesn't blow up into smithereens. To be more realistic and close to the React world as possible, let's see an example of how you'd use this in your app:

```js
const fetchData = async () => {
  try {
    return await fetch("https://some-url-that-might-fail.com")
  } catch (error) {
    console.error(error) // You might send an exception to your error tracker like AppSignal
    return error
  }
}
```

When doing network calls in React, you'd usually use the `try...catch` statement. But why? Unfortunately, `try...catch only` works on imperative code. It does not work on declarative code like the JSX we are writing in our components. So that is why you don't see a massive `try...catch` wrapping our whole app. It just won't work.

So, what do we do? Glad you asked. In React 16, a new concept got introduced — React Error Boundaries. Let's dig into what they are.

## React Error Boundaries

Before we get into error boundaries, let us first see why they are necessary. Imagine you had a component like this:

```js
const CrashableComponent = (props) => {
  return <span>{props.iDontExist.prop}</span>
}

export default CrashableComponent
```

If you try to render this component somewhere, you'll get an error like this one:

![Crashable component renders error in the console](./crashable-component.png)

Not only that, the whole page will be blank, and the user won't be able to do or see anything. But what happened? We tried to access a property `iDontExist.prop`, which doesn't exist (we don't pass it to the component). This is a banal example, but it shows that we cannot catch these errors with the `try...catch` statement.

This whole experiment brings us to error boundaries. Error boundaries are React components that catch JavaScript errors anywhere in their child component tree. Then, they log those caught errors and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

An error boundary is a class component that defines either (or both) of the lifecycle methods `static getDerivedStateFromError()` or `componentDidCatch()`. `static getDerivedStateFromError()` renders a fallback UI after an error has been thrown. `componentDidCatch()` can log error information to your service provider (like AppSignal) or to a browser console.

Let's see a typical error boundary component:

```js
import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like AppSignal
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <p>Something went wrong 😭</p>

          {error.message && <span>Here's the error: {error.message}</span>}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

We can use ErrorBoundary like so:

```js
<ErrorBoundary>
  <CrashableComponent />
</ErrorBoundary>
```

Now, when we open our app, we will get a working app with the following:

![Error boundary shows the error](./error-boundary-error.png)

That is precisely what we want. We want our app to remain functional when an error occurs. But we also want to inform the user (and our error tracking service) about the error.

Beware that using an error boundary is not a silver bullet. Error boundaries do not catch errors for:

- Event handlers
- Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
- Server side rendering
- Errors that are thrown in the error boundary itself (rather than its children)

You still need to use the `try...catch` statement for these fellas. So, let's go ahead and show how you can do that.

## Error Catching in Event Handlers

As mentioned before, error boundaries can't help us when an error is thrown inside an event handler. Let's see how we can handle those. Below is a small button component that throws an error when you click it:

```js
import { useState } from "react"

const CrashableButton = () => {
  const [error, setError] = useState(null)

  const handleClick = () => {
    try {
      throw Error("Oh no :(")
    } catch (error) {
      setError(error)
    }
  }

  if (error) {
    return <span>Caught an error.</span>
  }

  return <button onClick={handleClick}>Click Me To Throw Error</button>
}

export default CrashableButton
```

Notice that we have a try and catch block inside `handleClick` that ensures our error is caught. If you render the component and try to click it, this happens:

![Clicking a button catches an error and displays error text](./error-click.gif)

We have to do the same in other cases, like in `setTimeout` calls.

## Error Catching in `setTimeout` Calls

Imagine we have a similar button component, but this one calls `setTimeout` when clicked. Here's how it looks:

```js
import { useState } from "react"

const SetTimeoutButton = () => {
  const [error, setError] = useState(null)

  const handleClick = () => {
    setTimeout(() => {
      try {
        throw Error("Oh no, an error :(")
      } catch (error) {
        setError(error)
      }
    }, 1000)
  }

  if (error) {
    return <span>Caught a delayed error.</span>
  }

  return (
    <button onClick={handleClick}>Click Me To Throw a Delayed Error</button>
  )
}

export default SetTimeoutButton
```

After 1,000 milliseconds, the `setTimeout` callback will throw an error. Luckily, we wrap that callback logic in `try...catch`, and `setError` in the component. That way, no stack trace is shown in the browser console. Also, we communicate the error to the user. Here's how it looks in the app:

![Clicking a button causes a delayed error that gets caught](./delayed-error-click.gif)

That is all well and good, as we got our app's pages up and running despite errors popping all over the place in the background. But is there an easier way to handle errors without writing custom error boundaries? You bet there is, and of course, it comes in the form of a JavaScript package. Let me introduce you to the `react-error-boundary`.

## JavaScript's `react-error-boundary` Package

You can pop that library inside your `package.json` faster than ever with:

```bash
npm install --save react-error-boundary
```

Now, you're ready to use it. Remember the `ErrorBoundary` component we made? You can forget about it because this package exports its own. Here's how to use it:

```js
import { ErrorBoundary } from "react-error-boundary"
import CrashableComponent from "./CrashableComponent"

const FancyDependencyErrorHandling = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        // You can also log the error to an error reporting service like AppSignal
        // logErrorToMyService(error, errorInfo);
        console.error(error)
      }}
    >
      <CrashableComponent />
    </ErrorBoundary>
  )
}

const ErrorFallback = ({ error }) => (
  <div>
    <p>Something went wrong 😭</p>

    {error.message && <span>Here's the error: {error.message}</span>}
  </div>
)

export default FancyDependencyErrorHandling
```

In the example above, we render the same `CrashableComponent`, but this time, we use the `ErrorBoundary` component from the react-error-boundary library. It does the same thing as our custom one, except that it receives the `FallbackComponent` prop plus the `onError` function handler. The result is the same as we had with our custom `ErrorBoundary` component, except you don't have to worry about maintaining it since you're using an external package.

One great thing about this package is that you can easily wrap your function components into a `withErrorBoundary` making it a [higher-order component (HOC)](https://reactjs.org/docs/higher-order-components.html). Here's how that looks:

```js
import { withErrorBoundary } from "react-error-boundary"

const CrashableComponent = (props) => {
  return <span>{props.iDontExist.prop}</span>
}

export default withErrorBoundary(CrashableComponent, {
  FallbackComponent: () => <span>Oh no :(</span>,
})
```

Nice, you're good to go now to capture all those errors bugging you.

But maybe you don't want another dependency in your project. Can you achieve it yourself? Of course you can. Let's see how it can be done.

## Using Your Boundaries

You can achieve a similar, if not the same, effect you get from `react-error-boundary`. We already showed a custom `ErrorBoundary` component, but let's improve it.

```js
import { Component } from "react"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like AppSignal
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state

    if (hasError) {
      // You can render any custom fallback UI
      return <ErrorFallback error={error} />
    }

    return this.props.children
  }
}

const ErrorFallback = ({ error }) => (
  <div>
    <p>Something went wrong 😭</p>

    {error.message && <span>Here's the error: {error.message}</span>}
  </div>
)

const errorBoundary = (WrappedComponent) => {
  return class extends ErrorBoundary {
    render() {
      const { hasError, error } = this.state

      if (hasError) {
        // You can render any custom fallback UI
        return <ErrorFallback error={error} />
      }

      return <WrappedComponent {...this.props} />
    }
  }
}

export { errorBoundary }
```

Now you get the `ErrorBoundary` and the HOC `errorBoundary` that you can use across your app. Extend and play around with it as much as you want. You can make them receive custom fallback components to customize how you recover from each error. You can also make them receive an `onError` prop and later call it inside `componentDidCatch`. The possibilities are endless.

But one thing is for sure — you didn't need that dependency after all. I bet writing your own error boundary will bring a sense of achievement, and you'll get to understand it better. Also, who knows what ideas you might get when you're trying to customize it.

## Summing Up: Get Started with React Error Handling

Thanks for reading this blog post about handling errors in React. I hope you had as much fun reading and trying things out as I did writing it. You can find all the code, with examples, in the [GitHub repo I created](https://github.com/nikolalsvk/react-error-handling).

A quick rundown of the things we went through:

- React Error boundaries are great for catching errors in declarative code (e.g., inside their child component tree).
- For other cases, you need to use a `try...catch` statement (e.g., async calls like `setTimeout`, event handlers, server-side rendering, and errors thrown in the error boundary itself).
- A library like `react-error-boundary` can help you write less code.
- You can also run your own error boundary and customize it as much as you want.

That is all, folks. Thanks for tuning in, and catch you in the next one!
