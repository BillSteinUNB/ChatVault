import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/storage';
import { fullSync } from '../lib/sync';
import { RefreshCw, Cloud, CloudOff, AlertCircle, Check } from 'lucide-react';

interface SyncStatusProps {
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ className = '' }) => {
  const { syncState, user } = useStore();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = async () => {
    if (isSyncing || syncState.status === 'syncing') {
      return;
    }

    setIsSyncing(true);
    try {
      await fullSync();
    } catch (error) {
      console.error('[SyncStatus] Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = () => {
    if (isSyncing || syncState.status === 'syncing') {
      return (
        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
      );
    }

    if (syncState.status === 'error') {
      return (
        <AlertCircle className="w-4 h-4 text-red-400" />
      );
    }

    if (syncState.status === 'offline') {
      return (
        <CloudOff className="w-4 h-4 text-neutral-500" />
      );
    }

    // Default: idle/synced
    return (
      <Check className="w-4 h-4 text-emerald-400" />
    );
  };

  const getStatusText = () => {
    if (isSyncing || syncState.status === 'syncing') {
      return 'Syncing...';
    }

    if (syncState.status === 'error') {
      return 'Sync error';
    }

    if (syncState.status === 'offline') {
      return 'Offline';
    }

    // Default: idle/synced
    if (syncState.lastSyncedAt) {
      const lastSync = new Date(syncState.lastSyncedAt);
      const now = new Date();
      const diffMs = now.getTime() - lastSync.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        return 'Synced just now';
      } else if (diffMins < 60) {
        return `Synced ${diffMins}m ago`;
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `Synced ${hours}h ago`;
      } else {
        return `Synced ${lastSync.toLocaleDateString()}`;
      }
    }

    return 'Synced';
  };

  const getTooltipContent = () => {
    if (isSyncing || syncState.status === 'syncing') {
      return (
        <div>
          <p className="font-medium text-white">Syncing...</p>
          {syncState.pendingChanges > 0 && (
            <p className="text-xs text-neutral-400 mt-1">
              {syncState.pendingChanges} pending change{syncState.pendingChanges > 1 ? 's' : ''}
            </p>
          )}
        </div>
      );
    }

    if (syncState.status === 'error') {
      return (
        <div>
          <p className="font-medium text-red-400">Sync Error</p>
          <p className="text-xs text-neutral-400 mt-1">{syncState.error || 'Unknown error'}</p>
          <p className="text-xs text-neutral-500 mt-2">Click to retry</p>
        </div>
      );
    }

    if (syncState.status === 'offline') {
      return (
        <div>
          <p className="font-medium text-neutral-400">Offline</p>
          <p className="text-xs text-neutral-500 mt-1">Check your connection</p>
        </div>
      );
    }

    // Default: idle/synced
    return (
      <div>
        <p className="font-medium text-emerald-400">Synced</p>
        {syncState.lastSyncedAt && (
          <p className="text-xs text-neutral-400 mt-1">
            Last sync: {new Date(syncState.lastSyncedAt).toLocaleString()}
          </p>
        )}
        {syncState.pendingChanges > 0 && (
          <p className="text-xs text-yellow-400 mt-2">
            {syncState.pendingChanges} pending change{syncState.pendingChanges > 1 ? 's' : ''}
          </p>
        )}
        <p className="text-xs text-neutral-500 mt-2">Click to sync now</p>
      </div>
    );
  };

  // Don't show sync status if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Sync Status Button */}
      <button
        onClick={handleSyncClick}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        disabled={isSyncing || syncState.status === 'syncing'}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Sync status: ${getStatusText()}. Click to sync now.`}
      >
        {getStatusIcon()}
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {getStatusText()}
        </span>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {isTooltipOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 bottom-full mb-2 w-64 bg-neutral-900 dark:bg-neutral-800 text-white rounded-lg shadow-xl p-3 z-50"
            role="tooltip"
          >
            {/* Arrow */}
            <div className="absolute left-4 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />

            {getTooltipContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
