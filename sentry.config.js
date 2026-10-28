import {
  BrowserClient,
  breadcrumbsIntegration,
  dedupeIntegration,
  defaultStackParser,
  getCurrentScope,
  globalHandlersIntegration,
  linkedErrorsIntegration,
  makeFetchTransport,
} from "@sentry/browser"

// Error reporting only. Replay and tracing stay out of the bundle.
if (typeof window !== "undefined" && __SENTRY_DSN__) {
  const client = new BrowserClient({
    dsn: __SENTRY_DSN__,
    environment: __SENTRY_ENVIRONMENT__ || undefined,
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: [
      breadcrumbsIntegration(),
      globalHandlersIntegration(),
      linkedErrorsIntegration(),
      dedupeIntegration(),
    ],
  })

  getCurrentScope().setClient(client)
  client.init()
}
