import React from 'react';
import { useStore } from '../lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const TagFilter: React.FC = () => {
    const { tags, chats, activeTags, toggleActiveTag, setActiveTags } = useStore();

    const clearAll = () => {
        setActiveTags([]);
    };

    const getTagChatCount = (tagId: string): number => {
        return chats.filter(chat => chat.tags.includes(tagId)).length;
    };

    const hasActiveFilters = activeTags.length > 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Filter by tags
                </h3>
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            onClick={clearAll}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Clear all
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {tags.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                    No tags created yet
                </p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => {
                        const isSelected = activeTags.includes(tag.id);
                        const chatCount = getTagChatCount(tag.id);

                        return (
                            <motion.button
                                key={tag.id}
                                onClick={() => toggleActiveTag(tag.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                                    transition-colors
                                    ${isSelected
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                `}
                                style={isSelected ? { backgroundColor: tag.color } : {}}
                            >
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                                <span>{tag.name}</span>
                                {chatCount > 0 && (
                                    <span className={`
                                        text-xs opacity-70
                                        ${isSelected ? 'bg-white/20' : 'bg-gray-100'}
                                        px-1.5 rounded-full
                                    `}>
                                        {chatCount}
                                    </span>
                                )}
                                {isSelected && (
                                    <X size={12} className="opacity-70 hover:opacity-100" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            )}

            {hasActiveFilters && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-xs text-gray-500"
                    >
                        <span>Showing chats with</span>
                        <div className="flex gap-1">
                            {activeTags.map(tagId => {
                                const tag = tags.find(t => t.id === tagId);
                                if (!tag) return null;
                                return (
                                    <span
                                        key={tagId}
                                        className="px-2 py-0.5 rounded-full text-white text-xs"
                                        style={{ backgroundColor: tag.color }}
                                    >
                                        {tag.name}
                                    </span>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};
