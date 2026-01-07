import React from 'react';
import { useStore } from '../lib/storage';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { Platform } from '../types';

type FilterId = Platform | 'all';

export const FilterChips: React.FC = () => {
  const { activeFilter, setFilter, chats } = useStore();
  
  const filters: readonly { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'chatgpt', label: 'ChatGPT' },
    { id: 'claude', label: 'Claude' },
    { id: 'perplexity', label: 'Perplexity' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-fade-right">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const count = filter.id === 'all' 
          ? chats.length 
          : chats.filter(c => c.platform === filter.id).length;

        if (count === 0 && filter.id !== 'all') return null;

        return (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(filter.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              isActive 
                ? "bg-primary-100 text-primary-700" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {filter.label}
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full",
              isActive ? "bg-white/50" : "bg-gray-200"
            )}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};