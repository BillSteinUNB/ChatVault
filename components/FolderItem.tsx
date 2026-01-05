import React, { useState } from 'react';
import { Folder, Chat } from '../types';
import { Folder as FolderIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatItem } from './ChatItem';
import { cn } from '../lib/utils';

interface FolderItemProps {
  folder: Folder;
  chats: Chat[];
}

export const FolderItem: React.FC<FolderItemProps> = ({ folder, chats }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter chats that belong to this folder
  const folderChats = chats.filter(c => folder.chats.includes(c.id));

  if (folderChats.length === 0) return null;

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group text-left"
      >
        <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="text-gray-400"
        >
            <ChevronRight size={16} />
        </motion.div>
        
        <FolderIcon size={16} className="text-primary-500 fill-primary-100" />
        
        <span className="flex-1 font-medium text-sm text-gray-700 group-hover:text-gray-900">
          {folder.name}
        </span>
        
        <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full group-hover:bg-white group-hover:shadow-sm">
          {folderChats.length}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pr-1 py-1 flex flex-col gap-2 border-l-2 border-gray-100 ml-4">
              {folderChats.map(chat => (
                <ChatItem key={chat.id} chat={chat} compact />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};