/**
 * Error Toast Component
 * PRD-64: Toast notifications for errors
 *
 * Displays toast notifications for errors that occur in the application.
 * Features:
 * - Slides in from bottom/top
 * - Error icon and message
 * - Dismiss button
 * - Auto-dismiss after 5s
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useStore } from '../lib/storage';
import { getUserMessage, isAppError } from '../lib/errors';

interface ErrorToastProps {
  /**
   * Position of the toast
   */
  position?: 'top' | 'bottom';

  /**
   * Auto-dismiss timeout in milliseconds
   * @default 5000
   */
  autoDismissTimeout?: number;
}

/**
 * ErrorToast component displays error notifications
 *
 * @param props - Component props
 * @returns JSX element or null if no error
 */
export function ErrorToast({
  position = 'bottom',
  autoDismissTimeout = 5000,
}: ErrorToastProps) {
  const error = useStore((state) => state.error);
  const clearError = useStore((state) => state.clearError);

  useEffect(() => {
    if (!error) return;

    // Auto-dismiss after timeout
    const timer = setTimeout(() => {
      clearError();
    }, autoDismissTimeout);

    return () => clearTimeout(timer);
  }, [error, autoDismissTimeout, clearError]);

  if (!error) return null;

  const userMessage = getUserMessage(error);
  const isRecoverable = isAppError(error) && error.recoverable;

  // Animation variants
  const variants = {
    initial: {
      opacity: 0,
      y: position === 'top' ? -20 : 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: position === 'top' ? -20 : 20,
      scale: 0.95,
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed left-0 right-0 z-50 flex justify-center p-4 ${position === 'top' ? 'top-0' : 'bottom-0'}`}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <div
          className="flex items-start gap-3 max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {/* Error Icon */}
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>

          {/* Error Message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              {userMessage}
            </p>
            {isRecoverable && (
              <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                This action can be retried.
              </p>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={clearError}
            className="flex-shrink-0 inline-flex rounded-md p-1.5 text-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Default export of ErrorToast component
 */
export default ErrorToast;
