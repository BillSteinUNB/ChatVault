import React, { useState } from 'react';
import { Chat } from '../types';
import { formatRelativeTime } from '../lib/utils';
import { Pin, Trash2, ExternalLink, Folder } from 'lucide-react';
import { useStore } from '../lib/storage';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { MoveToFolderMenu } from './MoveToFolderMenu';

interface ChatItemProps {
  chat: Chat;
  compact?: boolean;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, compact }) => {
  const { togglePin, deleteChat, folders } = useStore();
  const [showFolderMenu, setShowFolderMenu] = useState(false);

  const platformColors = {
    chatgpt: 'border-l-[#10A37F]',
    claude: 'border-l-[#D97757]',
    perplexity: 'border-l-[#6B4FFF]',
  };

  const folder = chat.folderId ? folders.find(f => f.id === chat.folderId) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      className={cn(
        "group relative bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-all cursor-pointer border-l-4",
        platformColors[chat.platform]
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate leading-tight mb-1">
            {chat.title}
          </h3>
          {!compact && (
            <p className="text-gray-500 text-xs truncate mb-2">
              {chat.preview}
            </p>
          )}
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="capitalize font-medium">{chat.platform}</span>
            <span>•</span>
            <span>{formatRelativeTime(chat.timestamp)}</span>
            {folder && (
              <>
                <span>•</span>
                <span
                  className="px-1.5 py-0.5 rounded font-medium"
                  style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                >
                  {folder.name}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Hover Actions */}
        <div className="relative flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 bg-white/80 backdrop-blur-sm rounded p-1">
           <button
             onClick={(e) => { e.stopPropagation(); togglePin(chat.id); }}
             className={cn("p-1.5 rounded hover:bg-gray-100", chat.isPinned ? "text-primary-500" : "text-gray-400")}
           >
             <Pin size={14} className={cn(chat.isPinned && "fill-current")} />
           </button>
           <button
             onClick={(e) => { e.stopPropagation(); setShowFolderMenu(!showFolderMenu); }}
             className={cn("p-1.5 rounded hover:bg-gray-100", folder ? "text-primary-500" : "text-gray-400")}
           >
             <Folder size={14} className={cn(folder && "fill-current")} />
           </button>
           <button
             onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
             className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
           >
             <Trash2 size={14} />
           </button>

           {/* Move to Folder Menu */}
           {showFolderMenu && (
             <MoveToFolderMenu
               chatId={chat.id}
               currentFolderId={chat.folderId || null}
               onClose={() => setShowFolderMenu(false)}
             />
           )}
        </div>

        {/* Persistent Pin Indicator if Pinned */}
        {chat.isPinned && (
            <div className="absolute right-2 top-2 opacity-100 group-hover:opacity-0 text-primary-500">
                <Pin size={12} className="fill-current" />
            </div>
        )}
      </div>
    </motion.div>
  );
};