import * as Sentry from "@sentry/react-native";
import { useCallback, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface AsyncOptions {
  showAlert?: boolean;
  customErrorHandler?: (error: Error) => void;
  tags?: Record<string, string>;
  context?: Record<string, any>;
}

export function useAsyncWithSentry<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: AsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error: any) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));

        // Log to Sentry with context
        Sentry.captureException(errorObj, {
          tags: {
            asyncFunction: asyncFunction.name || "anonymous",
            ...options.tags,
          },
          contexts: {
            custom: {
              functionName: asyncFunction.name || "anonymous",
              args: args.length > 0 ? args : undefined,
              ...options.context,
            },
          },
        });

        setState({ data: null, loading: false, error: errorObj });

        // Call custom error handler if provided
        if (options.customErrorHandler) {
          options.customErrorHandler(errorObj);
        }

        throw errorObj;
      }
    },
    [asyncFunction, options]
  );

  return {
    ...state,
    execute,
  };
}

// Hook đặc biệt cho React Query mutations
export function useMutationWithSentry<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: AsyncOptions = {}
) {
  const { execute, ...state } = useAsyncWithSentry(mutationFn, options);

  const mutate = useCallback(
    (variables: TVariables) => {
      return execute(variables);
    },
    [execute]
  );

  return {
    ...state,
    mutate,
    mutateAsync: execute,
  };
}
