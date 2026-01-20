import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { getUsagePercentage, isApproachingLimit, getMaxChats } from '../lib/tier';

interface UsageMeterProps {
  chatCount: number;
  tier: string;
  onUpgrade?: () => void;
  showUpgradeLink?: boolean;
  compact?: boolean;
}

/**
 * UsageMeter Component
 *
 * Displays usage progress with color-coded progress bar:
 * - Green: < 50% usage
 * - Yellow: 50-80% usage
 * - Red: > 80% usage
 *
 * Shows "Upgrade" link when > 80% and showUpgradeLink is true
 */
export function UsageMeter({
  chatCount,
  tier,
  onUpgrade,
  showUpgradeLink = true,
  compact = false,
}: UsageMeterProps) {
  const maxChats = getMaxChats(tier as any);
  const percentage = getUsagePercentage(tier as any, chatCount);
  const approachingLimit = isApproachingLimit(tier as any, chatCount);

  // Don't show meter for unlimited tiers
  if (percentage === null) {
    return null;
  }

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 50) return 'green';
    if (percentage < 80) return 'yellow';
    return 'red';
  };

  const color = getColor();

  // Color classes for progress bar
  const progressColorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  // Color classes for text
  const textColorClasses = {
    green: 'text-green-700 dark:text-green-400',
    yellow: 'text-yellow-700 dark:text-yellow-400',
    red: 'text-red-700 dark:text-red-400',
  };

  // Icon based on color
  const Icon = color === 'red' ? AlertTriangle : TrendingUp;

  // Compact version (just progress bar with count)
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${progressColorClasses[color]}`}
            />
          </div>
        </div>
        <span className={`text-xs font-medium ${textColorClasses[color]}`}>
          {chatCount}/{maxChats}
        </span>
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${textColorClasses[color]}`} />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Storage Usage
          </span>
        </div>
        <span className={`text-sm font-bold ${textColorClasses[color]}`}>
          {chatCount} / {maxChats}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-2.5 rounded-full ${progressColorClasses[color]}`}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {percentage.toFixed(0)}% used
          </span>
          {maxChats - chatCount > 0 && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {maxChats - chatCount} remaining
            </span>
          )}
        </div>
      </div>

      {/* Upgrade Prompt */}
      {showUpgradeLink && approachingLimit && onUpgrade && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-3 border-t border-neutral-200 dark:border-neutral-800"
        >
          <button
            onClick={onUpgrade}
            className="w-full text-sm px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all font-medium shadow-sm"
          >
            Upgrade for Unlimited Storage
          </button>
        </motion.div>
      )}
    </div>
  );
}
