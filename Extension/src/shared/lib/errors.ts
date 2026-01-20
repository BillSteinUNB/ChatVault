/**
 * Error Types & Utilities
 * PRD-62: Error handling utilities for ChatVault extension
 */

/**
 * Error codes for different types of errors in the application
 */
export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'STORAGE_FULL'
  | 'SYNC_CONFLICT'
  | 'SCRAPE_FAILED'
  | 'QUOTA_EXCEEDED'
  | 'UNKNOWN';

/**
 * Application error interface with user-friendly messaging
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  recoverable: boolean;
  retryAction?: () => Promise<void>;
  originalError?: unknown;
}

/**
 * User-friendly error messages for each error code
 */
export const ERROR_MESSAGES: Record<ErrorCode, { userMessage: string; details: string }> = {
  NETWORK_ERROR: {
    userMessage: "Can't connect. Check your internet.",
    details: "Unable to reach the server. Please check your internet connection and try again."
  },
  AUTH_ERROR: {
    userMessage: "Authentication failed. Please sign in.",
    details: "Your session has expired or there was a problem with your credentials."
  },
  STORAGE_FULL: {
    userMessage: "Storage full. Delete chats or upgrade.",
    details: "Browser storage quota exceeded. Please delete some chats or upgrade to a premium tier."
  },
  SYNC_CONFLICT: {
    userMessage: "Sync conflict. Please refresh.",
    details: "There was a conflict between local and cloud data. Refreshing should resolve this."
  },
  SCRAPE_FAILED: {
    userMessage: "Failed to save chat. Try again.",
    details: "Unable to extract chat content. The page structure may have changed or the chat is still loading."
  },
  QUOTA_EXCEEDED: {
    userMessage: "You've reached your chat limit.",
    details: "You've reached the maximum number of chats for your tier. Please upgrade or delete some chats."
  },
  UNKNOWN: {
    userMessage: "Something went wrong. Try again.",
    details: "An unexpected error occurred. If this persists, please contact support."
  }
};

/**
 * Creates an AppError object from an error code and optional original error
 *
 * @param code - The error code
 * @param originalError - The original error object (optional)
 * @param customMessage - Custom user message (optional)
 * @returns An AppError object
 */
export function createAppError(
  code: ErrorCode,
  originalError?: unknown,
  customMessage?: string
): AppError {
  const errorInfo = ERROR_MESSAGES[code];

  return {
    code,
    message: errorInfo.details,
    userMessage: customMessage || errorInfo.userMessage,
    recoverable: isRecoverable(code),
    originalError,
  };
}

/**
 * Determines if an error is recoverable (can be retried)
 *
 * @param code - The error code
 * @returns True if the error is recoverable
 */
export function isRecoverable(code: ErrorCode): boolean {
  return ['NETWORK_ERROR', 'SYNC_CONFLICT', 'SCRAPE_FAILED'].includes(code);
}

/**
 * Wraps an async function with error handling
 * Automatically creates AppError objects from thrown errors
 *
 * @param fn - The async function to wrap
 * @param errorCode - The error code to use if the function fails
 * @returns A wrapped function that returns AppError on failure
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  errorCode: ErrorCode
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw createAppError(errorCode, error);
    }
  }) as T;
}

/**
 * Checks if an unknown value is an AppError
 *
 * @param error - The value to check
 * @returns True if the value is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'userMessage' in error
  );
}

/**
 * Gets the user message from an error
 * Handles both AppError objects and generic errors
 *
 * @param error - The error to extract message from
 * @returns A user-friendly error message
 */
export function getUserMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return ERROR_MESSAGES.UNKNOWN.userMessage;
}

/**
 * Determines the error code from an error object or error type
 *
 * @param error - The error to classify
 * @returns The appropriate error code
 */
export function getErrorCode(error: unknown): ErrorCode {
  if (isAppError(error)) {
    return error.code;
  }

  // Check for specific error types
  if (error instanceof TypeError) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'NETWORK_ERROR';
    }
  }

  if (error instanceof DOMException) {
    if (error.name === 'QuotaExceededError') {
      return 'STORAGE_FULL';
    }
  }

  // Check error messages for specific patterns
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'NETWORK_ERROR';
    }

    if (message.includes('auth') || message.includes('unauthorized') || message.includes('token')) {
      return 'AUTH_ERROR';
    }

    if (message.includes('quota') || message.includes('storage') || message.includes('limit')) {
      return 'QUOTA_EXCEEDED';
    }

    if (message.includes('sync') || message.includes('conflict')) {
      return 'SYNC_CONFLICT';
    }

    if (message.includes('scrape') || message.includes('extract') || message.includes('parse')) {
      return 'SCRAPE_FAILED';
    }
  }

  return 'UNKNOWN';
}

/**
 * Creates a retry action for recoverable errors
 *
 * @param fn - The function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns A function that retries the original function
 */
export function createRetryAction<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): () => Promise<T> {
  return async () => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        const code = getErrorCode(error);
        if (!isRecoverable(code)) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  };
}

/**
 * Logs an error to console with structured format
 *
 * @param error - The error to log
 * @param context - Additional context information
 */
export function logError(error: unknown, context?: string): void {
  const code = getErrorCode(error);
  const userMessage = getUserMessage(error);

  console.error('[ChatVault Error]', {
    code,
    userMessage,
    context,
    error,
  });
}
