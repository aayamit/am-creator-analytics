import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set profileSessionSampleRate to 1.0 to profile every session
  profileSessionSampleRate: 1.0,

  // Enable replay for session-based analytics
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Release tracking
  release: `am-creator-analytics@${process.env.npm_package_version || "1.0.0"}`,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Performance monitoring
  tracePropagationTargets: ["localhost", "amcreatoranalytics.com", /^\//],
});
