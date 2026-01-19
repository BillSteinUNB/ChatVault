import React from 'react';
import { useStore } from '../lib/storage';
import { PLATFORM_CONFIG } from '../constants';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Calendar, Tag as TagIcon } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
    const { chats, tags } = useStore();

    // Calculate total chats
    const totalChats = chats.length;

    // Calculate chats per platform
    const platformCounts = chats.reduce((acc, chat) => {
        acc[chat.platform] = (acc[chat.platform] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Calculate chats this week
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const chatsThisWeek = chats.filter(chat => chat.timestamp >= oneWeekAgo).length;
    const chatsThisMonth = chats.filter(chat => chat.timestamp >= oneMonthAgo).length;

    // Calculate most used tags (top 5)
    const tagCounts = chats.reduce((acc, chat) => {
        chat.tags.forEach(tagId => {
            acc[tagId] = (acc[tagId] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tagId, count]) => ({
            tag: tags.find(t => t.id === tagId),
            count
        }))
        .filter(item => item.tag !== undefined);

    return (
        <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Total Chats Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-100 text-sm font-medium mb-1">Total Chats</p>
                            <p className="text-4xl font-bold">{totalChats}</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Time-based Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">This Week</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{chatsThisWeek}</p>
                    <p className="text-xs text-gray-500 mt-1">chats added</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-50 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">This Month</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{chatsThisMonth}</p>
                    <p className="text-xs text-gray-500 mt-1">chats added</p>
                </motion.div>
            </div>

            {/* Platform Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6"
            >
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Chats by Platform</h3>
                </div>
                <div className="p-5 space-y-4">
                    {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
                        const count = platformCounts[key] || 0;
                        const percentage = totalChats > 0 ? (count / totalChats) * 100 : 0;
                        
                        return (
                            <div key={key}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{config.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">{config.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                                        <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="h-2 rounded-full"
                                        style={{ backgroundColor: config.color }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {totalChats === 0 && (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No chats yet</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Most Used Tags */}
            {topTags.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <TagIcon className="w-4 h-4 text-gray-600" />
                            <h3 className="text-sm font-semibold text-gray-900">Most Used Tags</h3>
                        </div>
                    </div>
                    <div className="p-5 space-y-3">
                        {topTags.map((item, index) => (
                            <div key={item.tag!.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-gray-400 w-4">#{index + 1}</span>
                                    <div
                                        className="px-3 py-1.5 rounded-md text-sm font-medium"
                                        style={{
                                            backgroundColor: `${item.tag!.color}15`,
                                            color: item.tag!.color,
                                            border: `1px solid ${item.tag!.color}30`
                                        }}
                                    >
                                        {item.tag!.name}
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {totalChats === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No analytics yet</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        Start saving chats from ChatGPT, Claude, or Perplexity to see your statistics here.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
