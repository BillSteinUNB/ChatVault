import React from 'react';
import { useStore } from '../lib/storage';
import { ChatItem } from './ChatItem';
import { SearchBar } from './SearchBar';
import { Button } from './ui/Button';
import { Folder, PieChart, Star, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const SidePanel: React.FC = () => {
    const { chats } = useStore();

    // Mock stats
    const stats = {
        total: chats.length,
        saved: "12h",
        top: "ChatGPT"
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
                        <Button variant="secondary" size="sm">Export</Button>
                        <Button size="sm" className="gap-2">
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

                {/* Chat Grid */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">All Chats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {chats.map(chat => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, active }: { icon: React.ReactNode, active?: boolean }) => (
    <button className={`w-full aspect-square flex items-center justify-center rounded-lg transition-colors ${active ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
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
