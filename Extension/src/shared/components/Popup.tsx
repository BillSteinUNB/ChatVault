import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { FilterChips } from './FilterChips';
import { ChatItem } from './ChatItem';
import { FolderItem } from './FolderItem';
import { useStore } from '../lib/storage';
import { Settings, ExternalLink, Search, Loader2, MessageSquare } from 'lucide-react';
import { Button } from './ui/Button';
import { SettingsPage } from './SettingsPage';
import { Tooltip } from './ui/Tooltip';

export const Popup: React.FC = () => {
  const { chats, folders, searchQuery, activeFilter, isLoading, settingsOpen, setSettingsOpen } = useStore();
  const [settingsTooltip, setSettingsTooltip] = useState(false);
  const [dashboardTooltip, setDashboardTooltip] = useState(false);

  // Filter Logic
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || chat.platform === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const pinnedChats = filteredChats.filter(c => c.isPinned);
  const unpinnedChats = filteredChats.filter(c => !c.isPinned && !c.folderId);

  // Folders logic: Show folder if it has chats that match the current filter
  const relevantFolders = folders;

  const handleViewDashboard = () => {
    chrome.tabs.create({ url: 'https://chatvault.app/dashboard' });
  }; 

  const hasChats = chats.length > 0;

  // Handle settings view
  if (settingsOpen) {
      return <SettingsPage onBack={() => setSettingsOpen(false)} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 pb-2 bg-white border-b border-gray-100 flex flex-col gap-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                ChatVault
            </h1>
            <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSettingsOpen(true)}
                    onMouseEnter={() => setSettingsTooltip(true)}
                    onMouseLeave={() => setSettingsTooltip(false)}
                >
                    <Settings size={18} />
                </Button>
                {settingsTooltip && (
                    <Tooltip text="Settings" />
                )}
            </div>
        </div>
        <SearchBar />
        <FilterChips />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-8">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Loading chats...</p>
            </div>
        ) : !hasChats ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 mt-8 px-4">
                <div className="bg-primary-50 p-3 rounded-full mb-3 text-primary-500">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No chats saved yet</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Visit ChatGPT or Claude to start saving your conversations.
                </p>
            </div>
        ) : filteredChats.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 mt-12">
                <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm">No chats found</p>
            </div>
        ) : (
            <>
                {/* Pinned Section */}
                {pinnedChats.length > 0 && (
                    <section>
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Pinned</h2>
                        <div className="flex flex-col gap-2">
                            {pinnedChats.map(chat => (
                                <ChatItem key={chat.id} chat={chat} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Folders Section */}
                {relevantFolders.length > 0 && activeFilter === 'all' && !searchQuery && (
                     <section>
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Folders</h2>
                         {relevantFolders.map(folder => (
                             <FolderItem key={folder.id} folder={folder} chats={chats} />
                         ))}
                     </section>
                )}

                {/* Recent/Uncategorized Section */}
                {unpinnedChats.length > 0 && (
                     <section>
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Recent</h2>
                        <div className="flex flex-col gap-2">
                            {unpinnedChats.map(chat => (
                                <ChatItem key={chat.id} chat={chat} />
                            ))}
                        </div>
                    </section>
                )}
            </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-center">
         <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className="text-primary-600 text-xs gap-1"
                onClick={handleViewDashboard}
                onMouseEnter={() => setDashboardTooltip(true)}
                onMouseLeave={() => setDashboardTooltip(false)}
            >
               View Dashboard <ExternalLink size={12} />
            </Button>
            {dashboardTooltip && (
                <Tooltip text="Open web dashboard" />
            )}
         </div>
      </div>
    </div>
  );
};