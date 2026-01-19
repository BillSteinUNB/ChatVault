import React, { useState } from 'react';
import { useStore } from '../lib/storage';
import { ChatItem } from './ChatItem';
import { SearchBar } from './SearchBar';
import { AuthBanner } from './AuthBanner';
import { Button } from './ui/Button';
import { Folder, PieChart, Star, Clock, Plus, Loader2, MessageSquare, Settings } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';
import { FolderList } from './FolderList';
import { CreateFolderModal } from './CreateFolderModal';
import { TagFilter } from './TagFilter';
import { ExportMenu } from './ExportMenu';
import { SettingsPage } from './SettingsPage';

import { motion } from 'framer-motion';

export const SidePanel: React.FC = () => {
    const { chats, isLoading, activeFolder, activeTags, viewMode, setViewMode } = useStore();
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportButtonRef = React.useRef<HTMLButtonElement>(null);

    // Handle settings view
    if (viewMode === 'settings') {
        return <SettingsPage onBack={() => setViewMode('main')} />;
    }

    const filteredChats = chats.filter(chat => {
        if (activeFolder && chat.folderId !== activeFolder) {
            return false;
        }
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
                    <NavItem icon={<Clock size={20} />} active />
                    <NavItem icon={<Folder size={20} />} />
                    <NavItem icon={<Star size={20} />} />
                    <NavItem icon={<PieChart size={20} />} />
                    <NavItem icon={<Settings size={20} />} onClick={() => setViewMode('settings')} />
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
                        <h1 className="text-xl font-bold text-gray-900">Conversations</h1>
                        <p className="text-sm text-gray-500">Manage and organize your AI chats</p>
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
                <div className="px-6 py-6 grid grid-cols-3 gap-4">
                     <StatCard label="Total Chats" value={stats.total} />
                     <StatCard label="Time Saved" value={stats.saved} />
                     <StatCard label="Top Platform" value={stats.top} />
                </div>

                <div className="px-6 pb-4">
                    <div className="max-w-md">
                        <SearchBar />
                    </div>
                </div>

                <div className="px-6 pb-4">
                    <TagFilter />
                </div>

                <div className="px-6 pb-4">
                    <AuthBanner />
                </div>

                {/* Folder List */}
                <div className="px-6 pb-4">
                    <FolderList />
                </div>

                {/* Chat Grid */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">
                        {activeFolder ? `Folder` : 'All Chats'}
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
            </div>

            <CreateFolderModal
                isOpen={isCreateFolderModalOpen}
                onClose={() => setIsCreateFolderModalOpen(false)}
            />
        </div>
    );
};

const NavItem = ({ icon, active, onClick }: { icon: React.ReactNode, active?: boolean, onClick?: () => void }) => (
    <button 
        className={`w-full aspect-square flex items-center justify-center rounded-lg transition-colors ${active ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
        onClick={onClick}
    >
        {icon}
    </button>
);

const StatCard = ({ label, value }: { label: string, value: string | number }) => (
    <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
    >
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </motion.div>
);
