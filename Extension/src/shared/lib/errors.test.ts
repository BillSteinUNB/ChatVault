/**
 * Tests for Error Types & Utilities
 * PRD-62: Error handling utilities tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createAppError,
  isRecoverable,
  withErrorHandling,
  isAppError,
  getUserMessage,
  getErrorCode,
  createRetryAction,
  logError,
  ERROR_MESSAGES,
  type AppError,
  type ErrorCode,
} from './errors';

describe('ERROR_MESSAGES', () => {
  it('should have user-friendly messages for all error codes', () => {
    const errorCodes: ErrorCode[] = [
      'NETWORK_ERROR',
      'AUTH_ERROR',
      'STORAGE_FULL',
      'SYNC_CONFLICT',
      'SCRAPE_FAILED',
      'QUOTA_EXCEEDED',
      'UNKNOWN',
    ];

    errorCodes.forEach(code => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(ERROR_MESSAGES[code].userMessage).toBeTruthy();
      expect(ERROR_MESSAGES[code].details).toBeTruthy();
    });
  });
});

describe('createAppError', () => {
  it('should create an AppError with required properties', () => {
    const error = createAppError('NETWORK_ERROR');

    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toBeTruthy();
    expect(error.userMessage).toBeTruthy();
    expect(error.recoverable).toBe(true);
  });

  it('should use default user message when no custom message provided', () => {
    const error = createAppError('NETWORK_ERROR');

    expect(error.userMessage).toBe(ERROR_MESSAGES.NETWORK_ERROR.userMessage);
  });

  it('should use custom message when provided', () => {
    const customMessage = 'Custom error message';
    const error = createAppError('NETWORK_ERROR', undefined, customMessage);

    expect(error.userMessage).toBe(customMessage);
  });

  it('should include original error when provided', () => {
    const originalError = new Error('Original error');
    const error = createAppError('NETWORK_ERROR', originalError);

    expect(error.originalError).toBe(originalError);
  });

  it('should mark network errors as recoverable', () => {
    const error = createAppError('NETWORK_ERROR');

    expect(error.recoverable).toBe(true);
  });

  it('should mark sync conflicts as recoverable', () => {
    const error = createAppError('SYNC_CONFLICT');

    expect(error.recoverable).toBe(true);
  });

  it('should mark scrape failures as recoverable', () => {
    const error = createAppError('SCRAPE_FAILED');

    expect(error.recoverable).toBe(true);
  });

  it('should mark auth errors as not recoverable', () => {
    const error = createAppError('AUTH_ERROR');

    expect(error.recoverable).toBe(false);
  });

  it('should mark storage full as not recoverable', () => {
    const error = createAppError('STORAGE_FULL');

    expect(error.recoverable).toBe(false);
  });

  it('should mark quota exceeded as not recoverable', () => {
    const error = createAppError('QUOTA_EXCEEDED');

    expect(error.recoverable).toBe(false);
  });

  it('should mark unknown errors as not recoverable', () => {
    const error = createAppError('UNKNOWN');

    expect(error.recoverable).toBe(false);
  });
});

describe('isRecoverable', () => {
  it('should return true for network errors', () => {
    expect(isRecoverable('NETWORK_ERROR')).toBe(true);
  });

  it('should return true for sync conflicts', () => {
    expect(isRecoverable('SYNC_CONFLICT')).toBe(true);
  });

  it('should return true for scrape failures', () => {
    expect(isRecoverable('SCRAPE_FAILED')).toBe(true);
  });

  it('should return false for auth errors', () => {
    expect(isRecoverable('AUTH_ERROR')).toBe(false);
  });

  it('should return false for storage full', () => {
    expect(isRecoverable('STORAGE_FULL')).toBe(false);
  });

  it('should return false for quota exceeded', () => {
    expect(isRecoverable('QUOTA_EXCEEDED')).toBe(false);
  });

  it('should return false for unknown errors', () => {
    expect(isRecoverable('UNKNOWN')).toBe(false);
  });
});

describe('withErrorHandling', () => {
  it('should return result when function succeeds', async () => {
    const asyncFn = async () => 'success';
    const wrappedFn = withErrorHandling(asyncFn, 'NETWORK_ERROR');

    const result = await wrappedFn();

    expect(result).toBe('success');
  });

  it('should throw AppError when function fails', async () => {
    const originalError = new Error('Network failure');
    const asyncFn = async () => {
      throw originalError;
    };
    const wrappedFn = withErrorHandling(asyncFn, 'NETWORK_ERROR');

    await expect(wrappedFn()).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      originalError,
    });
  });

  it('should preserve function arguments', async () => {
    const asyncFn = async (a: number, b: number) => a + b;
    const wrappedFn = withErrorHandling(asyncFn, 'UNKNOWN');

    const result = await wrappedFn(2, 3);

    expect(result).toBe(5);
  });
});

describe('isAppError', () => {
  it('should return true for valid AppError objects', () => {
    const error: AppError = {
      code: 'NETWORK_ERROR',
      message: 'Network failed',
      userMessage: 'Cannot connect',
      recoverable: true,
    };

    expect(isAppError(error)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isAppError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isAppError(undefined)).toBe(false);
  });

  it('should return false for plain objects', () => {
    expect(isAppError({})).toBe(false);
  });

  it('should return false for objects without required properties', () => {
    expect(isAppError({ code: 'NETWORK_ERROR' })).toBe(false);
  });

  it('should return false for Error instances', () => {
    const error = new Error('Test error');

    expect(isAppError(error)).toBe(false);
  });
});

describe('getUserMessage', () => {
  it('should return userMessage from AppError', () => {
    const error: AppError = {
      code: 'NETWORK_ERROR',
      message: 'Network failed',
      userMessage: 'Cannot connect to internet',
      recoverable: true,
    };

    expect(getUserMessage(error)).toBe('Cannot connect to internet');
  });

  it('should return message from Error instance', () => {
    const error = new Error('Test error message');

    expect(getUserMessage(error)).toBe('Test error message');
  });

  it('should return default message for unknown errors', () => {
    expect(getUserMessage(null)).toBe(ERROR_MESSAGES.UNKNOWN.userMessage);
    expect(getUserMessage(undefined)).toBe(ERROR_MESSAGES.UNKNOWN.userMessage);
    expect(getUserMessage('string')).toBe(ERROR_MESSAGES.UNKNOWN.userMessage);
  });
});

describe('getErrorCode', () => {
  it('should return code from AppError', () => {
    const error: AppError = {
      code: 'NETWORK_ERROR',
      message: 'Network failed',
      userMessage: 'Cannot connect',
      recoverable: true,
    };

    expect(getErrorCode(error)).toBe('NETWORK_ERROR');
  });

  it('should detect network errors from TypeError', () => {
    const error = new TypeError('Network request failed');

    expect(getErrorCode(error)).toBe('NETWORK_ERROR');
  });

  it('should detect network errors from fetch-related TypeErrors', () => {
    const error = new TypeError('Failed to fetch');

    expect(getErrorCode(error)).toBe('NETWORK_ERROR');
  });

  it('should detect storage quota errors from DOMException', () => {
    const error = new DOMException('Quota exceeded', 'QuotaExceededError');

    expect(getErrorCode(error)).toBe('STORAGE_FULL');
  });

  it('should detect auth errors from error message', () => {
    const error = new Error('Authentication failed');

    expect(getErrorCode(error)).toBe('AUTH_ERROR');
  });

  it('should detect unauthorized errors from error message', () => {
    const error = new Error('Unauthorized access');

    expect(getErrorCode(error)).toBe('AUTH_ERROR');
  });

  it('should detect quota exceeded from error message', () => {
    const error = new Error('You have exceeded your quota');

    expect(getErrorCode(error)).toBe('QUOTA_EXCEEDED');
  });

  it('should detect sync conflicts from error message', () => {
    const error = new Error('Sync conflict detected');

    expect(getErrorCode(error)).toBe('SYNC_CONFLICT');
  });

  it('should detect scrape failures from error message', () => {
    const error = new Error('Failed to scrape content');

    expect(getErrorCode(error)).toBe('SCRAPE_FAILED');
  });

  it('should return UNKNOWN for unrecognized errors', () => {
    const error = new Error('Something completely different');

    expect(getErrorCode(error)).toBe('UNKNOWN');
  });

  it('should return UNKNOWN for non-Error objects', () => {
    expect(getErrorCode(null)).toBe('UNKNOWN');
    expect(getErrorCode(undefined)).toBe('UNKNOWN');
    expect(getErrorCode('string')).toBe('UNKNOWN');
  });
});

describe('createRetryAction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const retryFn = createRetryAction(fn, 3);

    const result = await retryFn();

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry recoverable errors', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Network failed'))
      .mockResolvedValue('success');

    const retryFn = createRetryAction(fn, 3);

    const promise = retryFn();

    // First attempt fails
    await vi.advanceTimersByTimeAsync(0);
    expect(fn).toHaveBeenCalledTimes(1);

    // Wait for backoff (1s)
    await vi.advanceTimersByTimeAsync(1000);

    // Second attempt succeeds
    await promise;

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use exponential backoff', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Network failed'))
      .mockRejectedValueOnce(new Error('Network failed'))
      .mockResolvedValue('success');

    const retryFn = createRetryAction(fn, 3);

    const promise = retryFn();

    // First attempt fails
    await vi.advanceTimersByTimeAsync(0);

    // Wait 1s for second attempt
    await vi.advanceTimersByTimeAsync(1000);

    // Second attempt fails
    await vi.advanceTimersByTimeAsync(0);

    // Wait 2s for third attempt
    await vi.advanceTimersByTimeAsync(2000);

    // Third attempt succeeds
    await promise;

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Network failed'));
    const retryFn = createRetryAction(fn, 2);

    const promise = retryFn();

    // First attempt fails
    await vi.advanceTimersByTimeAsync(0);

    // Wait for retry
    await vi.advanceTimersByTimeAsync(1000);

    // Second attempt fails
    await vi.advanceTimersByTimeAsync(0);

    // Wait for max retries to complete
    await vi.advanceTimersByTimeAsync(2000);

    await expect(promise).rejects.toThrow('Network failed');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not retry non-recoverable errors', async () => {
    const error = new Error('Auth failed');
    const fn = vi.fn().mockRejectedValue(error);
    const retryFn = createRetryAction(fn, 3);

    await expect(retryFn()).rejects.toThrow('Auth failed');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should use default max retries of 3', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Network failed'));
    const retryFn = createRetryAction(fn);

    const promise = retryFn();

    // Advance through all retry attempts
    for (let i = 0; i < 3; i++) {
      await vi.advanceTimersByTimeAsync(0);
      await vi.advanceTimersByTimeAsync(Math.pow(2, i) * 1000);
    }

    await expect(promise).rejects.toThrow('Network failed');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('logError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log error with code and user message', () => {
    const error = createAppError('NETWORK_ERROR');

    logError(error);

    expect(console.error).toHaveBeenCalledWith(
      '[ChatVault Error]',
      expect.objectContaining({
        code: 'NETWORK_ERROR',
        userMessage: expect.any(String),
      })
    );
  });

  it('should log error with context when provided', () => {
    const error = createAppError('NETWORK_ERROR');

    logError(error, 'During sync');

    expect(console.error).toHaveBeenCalledWith(
      '[ChatVault Error]',
      expect.objectContaining({
        context: 'During sync',
      })
    );
  });

  it('should log non-AppError objects', () => {
    const error = new Error('Test error');

    logError(error);

    expect(console.error).toHaveBeenCalledWith(
      '[ChatVault Error]',
      expect.objectContaining({
        code: expect.any(String),
        userMessage: expect.any(String),
        error,
      })
    );
  });
});
