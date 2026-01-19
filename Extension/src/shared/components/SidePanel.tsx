import React, { useState } from 'react';
import { useStore } from '../lib/storage';
import { ChatItem } from './ChatItem';
import { SearchBar } from './SearchBar';
import { SearchFilters } from './SearchFilters';
import { AuthBanner } from './AuthBanner';
import { Button } from './ui/Button';
import { Folder, PieChart, Star, Clock, Plus, Loader2, MessageSquare, Settings, Home } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';
import { FolderList } from './FolderList';
import { CreateFolderModal } from './CreateFolderModal';
import { TagFilter } from './TagFilter';
import { ExportMenu } from './ExportMenu';
import { SettingsPage } from './SettingsPage';
import { AnalyticsView } from './AnalyticsView';

import { motion, AnimatePresence } from 'framer-motion';

export const SidePanel: React.FC = () => {
    const { chats, isLoading, activeFolder, activeTags, settingsOpen, setSettingsOpen, viewState, setViewMode } = useStore();
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportButtonRef = React.useRef<HTMLButtonElement>(null);

    // Handle settings view
    if (settingsOpen) {
        return <SettingsPage onBack={() => setSettingsOpen(false)} />;
    }

    const filteredChats = chats.filter(chat => {
        // Filter by view mode
        if (viewState.mode === 'starred' && !chat.isPinned) {
            return false;
        }

        // Filter by active folder
        if (activeFolder && chat.folderId !== activeFolder) {
            return false;
        }

        // Filter by active tags
        if (activeTags.length > 0) {
            return activeTags.every(tagId => chat.tags.includes(tagId));
        }

        return true;
    });

    const totalChats = chats.length;

    const platformCounts = chats.reduce((acc, chat) => {
        acc[chat.platform] = (acc[chat.platform] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topPlatformKey = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topPlatform = topPlatformKey ? (PLATFORM_CONFIG[topPlatformKey as keyof typeof PLATFORM_CONFIG]?.name || topPlatformKey) : '-';

    const minutesSaved = totalChats * 5;
    const timeSaved = minutesSaved > 60
        ? `${(minutesSaved / 60).toFixed(1)}h`
        : `${minutesSaved}m`;

    const stats = {
        total: totalChats,
        saved: timeSaved,
        top: topPlatform
    };

    return (
        <div className="h-full flex bg-gray-50">
            {/* Sidebar Navigation */}
            <div className="w-16 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-6">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <span className="text-white font-bold text-sm">C</span>
                </div>
                
                <nav className="flex flex-col gap-4 w-full px-2">
                    <NavItem
                        icon={<Home size={20} />}
                        label="All Chats"
                        active={viewState.mode === 'all'}
                        onClick={() => setViewMode('all')}
                    />
                    <NavItem
                        icon={<Star size={20} />}
                        label="Starred"
                        active={viewState.mode === 'starred'}
                        onClick={() => setViewMode('starred')}
                    />
                    <NavItem
                        icon={<PieChart size={20} />}
                        label="Analytics"
                        active={viewState.mode === 'analytics'}
                        onClick={() => setViewMode('analytics')}
                    />
                    <NavItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={false}
                        onClick={() => setSettingsOpen(true)}
                    />
                </nav>

                <div className="mt-auto">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white shadow-sm" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {viewState.mode === 'starred' ? 'Starred' : viewState.mode === 'analytics' ? 'Analytics' : 'Conversations'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {viewState.mode === 'starred'
                                ? 'Your pinned and important chats'
                                : viewState.mode === 'analytics'
                                ? 'View your chat statistics'
                                : 'Manage and organize your AI chats'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                                ref={exportButtonRef}
                            >
                                Export
                            </Button>
                            {isExportMenuOpen && <ExportMenu onClose={() => setIsExportMenuOpen(false)} />}
                        </div>
                        <Button size="sm" className="gap-2" onClick={() => setIsCreateFolderModalOpen(true)}>
                            <Plus size={16} /> New Folder
                        </Button>
                    </div>
                </header>
                
                {/* Dashboard Widgets */}
                {viewState.mode !== 'analytics' && (
                    <div className="px-6 py-6 grid grid-cols-3 gap-4">
                         <StatCard label="Total Chats" value={stats.total} />
                         <StatCard label="Time Saved" value={stats.saved} />
                         <StatCard label="Top Platform" value={stats.top} />
                    </div>
                )}

                {viewState.mode !== 'analytics' && (
                    <div className="px-6 pb-4">
                        <div className="max-w-md">
                            <SearchBar />
                            <div className="mt-2">
                                <SearchFilters />
                            </div>
                        </div>
                    </div>
                )}

                {viewState.mode !== 'analytics' && (
                    <div className="px-6 pb-4">
                        <TagFilter />
                    </div>
                )}

                {viewState.mode !== 'analytics' && (
                    <div className="px-6 pb-4">
                        <AuthBanner />
                    </div>
                )}

                {/* Folder List */}
                {viewState.mode !== 'analytics' && (
                    <div className="px-6 pb-4">
                        <FolderList />
                    </div>
                )}

                {/* Chat Grid or Analytics View */}
                {viewState.mode === 'analytics' ? (
                    <AnalyticsView />
                ) : (
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">
                            {viewState.mode === 'starred'
                                ? 'Starred Chats'
                                : activeFolder
                                ? 'Folder'
                                : 'All Chats'}
                        </h2>

                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-3" />
                            <p className="text-sm">Loading your vault...</p>
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                                <MessageSquare className="w-8 h-8 text-primary-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{activeFolder ? 'No chats in this folder' : 'Your vault is empty'}</h3>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-4">
                                {activeFolder
                                    ? 'Navigate to any chat on ChatGPT or Claude to save it here.'
                                    : 'Navigate to any chat on ChatGPT or Claude to automatically save it here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredChats.map(chat => (
                                <ChatItem key={chat.id} chat={chat} />
                            ))}
                        </div>
                    )}
                    </div>
                )}
            </div>

            <CreateFolderModal
                isOpen={isCreateFolderModalOpen}
                onClose={() => setIsCreateFolderModalOpen(false)}
            />
        </div>
    );
};

const NavItem = ({
    icon,
    label,
    active = false,
    onClick
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) => {
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
        <div className="relative">
            <button
                className={`w-full aspect-square flex items-center justify-center rounded-lg transition-colors ${
                    active ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {icon}
            </button>
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-md whitespace-nowrap z-50 pointer-events-none"
                    >
                        {label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ label, value }: { label: string, value: string | number }) => (
    <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
    >
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </motion.div>
);
