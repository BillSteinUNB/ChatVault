import React from 'react';
import { ExternalLink, Download, Crown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface QuickActionsProps {
  onExportAll?: () => void;
  currentTier?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onExportAll,
  currentTier = 'Hobbyist',
}) => {
  const { user } = useAuth();

  const handleOpenExtension = () => {
    // Try to open the extension, or redirect to install page
    const extensionUrl = 'chrome-extension://your-extension-id/sidepanel.html';
    window.open(extensionUrl, '_blank');
  };

  const handleExportAll = () => {
    if (onExportAll) {
      onExportAll();
    }
  };

  const handleUpgrade = () => {
    // Navigate to pricing page or open upgrade modal
    window.location.href = '/pricing';
  };

  const isFreeTier = currentTier.toLowerCase() === 'hobbyist';

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>

      <div className="space-y-3">
        {/* Open Extension Button */}
        <button
          onClick={handleOpenExtension}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-750 transition border border-white/5 hover:border-white/10 group"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-medium text-white group-hover:text-primary-300 transition">
              Open Extension
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Access your saved conversations
            </p>
          </div>
        </button>

        {/* Export All Data Button */}
        <button
          onClick={handleExportAll}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-750 transition border border-white/5 hover:border-white/10 group"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-medium text-white group-hover:text-blue-300 transition">
              Export All Data
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Download your conversations as JSON
            </p>
          </div>
        </button>

        {/* Upgrade Button (only show for free tier) */}
        {isFreeTier && (
          <button
            onClick={handleUpgrade}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 transition border border-primary-400/20 hover:border-primary-400/40 group shadow-lg shadow-primary-500/10"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-medium text-white group-hover:text-white transition">
                Upgrade to Power User
              </h3>
              <p className="text-xs text-primary-100 mt-0.5">
                Unlimited storage and cloud sync
              </p>
            </div>
          </button>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.email}
              </p>
              <p className="text-xs text-neutral-400 capitalize">{currentTier}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
