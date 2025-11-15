import { Alert } from "react-native";
import { smartErrorHandler } from "./error-classification";
import { addBreadcrumb, captureError } from "./sentry-setup";

export interface ErrorHandlerOptions {
  showAlert?: boolean;
  alertTitle?: string;
  alertMessage?: string;
  logToConsole?: boolean;
  tags?: Record<string, string>;
  context?: Record<string, any>;
  onError?: (error: Error) => void;
}

// Standardized error handler
export function handleError(
  error: Error | string,
  options: ErrorHandlerOptions = {}
) {
  const {
    showAlert = true,
    alertTitle = "Error",
    alertMessage,
    logToConsole = true,
    tags = {},
    context = {},
    onError,
  } = options;

  const errorObj = typeof error === "string" ? new Error(error) : error;

  // Log to console if enabled
  if (logToConsole) {
    console.error("Error handled:", errorObj);
  }

  // Capture to Sentry
  captureError(errorObj, {
    tags: {
      handled: "true",
      ...tags,
    },
    extra: context,
  });

  // Show alert if enabled
  if (showAlert) {
    const message =
      alertMessage || errorObj.message || "An unexpected error occurred";
    Alert.alert(alertTitle, message);
  }

  // Call custom error handler
  if (onError) {
    onError(errorObj);
  }

  return errorObj;
}

// Wrapper cho async functions
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ErrorHandlerOptions = {}
): T {
  return (async (...args: any[]) => {
    try {
      // Add breadcrumb before function execution
      addBreadcrumb(
        `Executing ${fn.name || "anonymous function"}`,
        "function",
        "info",
        { args: args.length }
      );

      const result = await fn(...args);

      // Add breadcrumb for successful execution
      addBreadcrumb(
        `Successfully executed ${fn.name || "anonymous function"}`,
        "function",
        "info"
      );

      return result;
    } catch (error: any) {
      handleError(error, {
        ...options,
        tags: {
          functionName: fn.name || "anonymous",
          ...options.tags,
        },
        context: {
          functionArgs: args,
          ...options.context,
        },
      });
      throw error;
    }
  }) as T;
}

// Hook để wrap async functions trong React components
export function useErrorHandler() {
  return {
    handleError,
    withErrorHandling,
  };
}

// Specialized error handlers for common scenarios
export const authErrorHandler = (error: Error | string) => {
  smartErrorHandler(error, {
    showAlert: true,
    alertTitle: "Lỗi Đăng Nhập",
    tags: {
      action: "authentication",
    },
  });
};

export const networkErrorHandler = (error: Error | string) => {
  smartErrorHandler(error, {
    showAlert: true,
    alertTitle: "Lỗi Mạng",
    tags: {
      action: "network",
    },
  });
};

export const validationErrorHandler = (error: Error | string) => {
  smartErrorHandler(error, {
    showAlert: true,
    alertTitle: "Lỗi Dữ Liệu",
    tags: {
      action: "validation",
    },
  });
};

export const silentErrorHandler = (error: Error | string) => {
  smartErrorHandler(error, {
    showAlert: false,
    tags: {
      action: "silent",
    },
  });
};
