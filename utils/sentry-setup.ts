import * as Sentry from "@sentry/react-native";

// Setup automatic error tracking for unhandled promise rejections
export function setupSentryErrorTracking() {
  // Track unhandled promise rejections
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check if this is an unhandled promise rejection
    if (args.length > 0 && args[0]?.includes?.("Unhandled promise rejection")) {
      const error = args[1] || new Error(args[0]);
      Sentry.captureException(error, {
        tags: {
          errorType: "unhandled_promise_rejection",
        },
        contexts: {
          custom: {
            consoleArgs: args,
          },
        },
      });
    }

    // Call original console.error
    originalConsoleError.apply(console, args);
  };

  // Track global errors in React Native
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Sentry.captureException(error, {
      tags: {
        errorType: "global_error",
        isFatal: (isFatal ?? false).toString(),
      },
      contexts: {
        custom: {
          isFatal: isFatal ?? false,
        },
      },
    });

    // Call original error handler
    if (originalErrorHandler) {
      originalErrorHandler(error, isFatal);
    }
  });
}

// Utility function để capture errors với context phong phú hơn
export function captureError(
  error: Error | string,
  context?: {
    tags?: Record<string, string>;
    user?: {
      id?: string;
      email?: string;
      username?: string;
    };
    extra?: Record<string, any>;
    level?: "fatal" | "error" | "warning" | "info" | "debug";
  }
) {
  const errorObj = typeof error === "string" ? new Error(error) : error;

  Sentry.captureException(errorObj, {
    tags: context?.tags,
    user: context?.user,
    extra: context?.extra,
    level: context?.level || "error",
  });
}

// Utility function để add breadcrumbs (track user actions)
export function addBreadcrumb(
  message: string,
  category: string = "user",
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

// Utility function để set user context
export function setUserContext(user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}) {
  Sentry.setUser(user);
}

// Utility function để set tags
export function setTags(tags: Record<string, string>) {
  Sentry.setTags(tags);
}

// Utility function để clear context
export function clearContext() {
  Sentry.setUser(null);
  Sentry.setTags({});
}
