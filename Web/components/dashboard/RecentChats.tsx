import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ExternalLink } from 'lucide-react';

// Define a simplified Chat interface for the Web app
export interface WebChat {
  id: string;
  title: string;
  platform: 'chatgpt' | 'claude' | 'perplexity';
  timestamp: number;
  url?: string;
}

interface RecentChatsProps {
  chats: WebChat[];
}

const PLATFORM_CONFIG = {
  chatgpt: { name: 'ChatGPT', color: '#10a37f', icon: '🤖' },
  claude: { name: 'Claude', color: '#d97757', icon: '🧠' },
  perplexity: { name: 'Perplexity', color: '#20B2AA', icon: '🔍' },
} as const;

export const RecentChats: React.FC<RecentChatsProps> = ({ chats }) => {
  const recentChats = chats.slice(0, 5);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (recentChats.length === 0) {
    return (
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-8">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <MessageSquare className="w-12 h-12 text-neutral-600 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No chats yet</h3>
          <p className="text-neutral-400 text-sm mb-4">
            Your recent conversations will appear here
          </p>
          <a
            href="https://chatvault.app/extension"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 text-sm font-medium"
          >
            Install the extension to get started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Chats</h2>
        <Link
          to="/chats"
          className="text-primary-400 hover:text-primary-300 text-sm font-medium"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {recentChats.map((chat) => {
          const config = PLATFORM_CONFIG[chat.platform];
          return (
            <div
              key={chat.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition border border-transparent hover:border-white/5"
            >
              {/* Platform Icon */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${config.color}20` }}
              >
                {config.icon}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">
                  {chat.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span>{config.name}</span>
                  <span>•</span>
                  <span>{formatDate(chat.timestamp)}</span>
                </div>
              </div>

              {/* External Link */}
              {chat.url && (
                <a
                  href={chat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
