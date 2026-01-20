import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Zap } from 'lucide-react';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  chatCount: number;
  maxChats: number;
}

export function UpgradePrompt({ isOpen, onClose, onUpgrade, chatCount, maxChats }: UpgradePromptProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Chat Limit Reached
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  You've reached your maximum chat limit
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Storage Usage
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  {chatCount} / {maxChats === Infinity ? '∞' : maxChats}
                </span>
              </div>
              <div className="w-full bg-neutral-300 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              You've reached the maximum number of chats allowed on your current plan. 
              Upgrade to unlock unlimited chat storage and additional features.
            </p>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Unlimited chat storage
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Cloud sync across devices
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Advanced search & filtering
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium"
            >
              Dismiss
            </button>
            <button
              onClick={onUpgrade}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-sm"
            >
              Upgrade Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface LimitWarningProps {
  chatCount: number;
  maxChats: number;
  onUpgrade: () => void;
  onDismiss: () => void;
}

export function LimitWarning({ chatCount, maxChats, onUpgrade, onDismiss }: LimitWarningProps) {
  const percentage = (chatCount / maxChats) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
            Approaching Chat Limit
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mb-2">
            You're using {chatCount} of {maxChats} chats ({percentage.toFixed(0)}%). Consider upgrading to avoid losing access to saving new chats.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onUpgrade}
              className="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors font-medium"
            >
              Upgrade
            </button>
            <button
              onClick={onDismiss}
              className="text-xs px-3 py-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
