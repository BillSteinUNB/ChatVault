import React, { useState, useRef, useEffect } from 'react';
import { Folder, FolderOpen, Check } from 'lucide-react';
import { useStore } from '../lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface MoveToFolderMenuProps {
  chatId: string;
  currentFolderId: string | null;
  onClose: () => void;
}

export const MoveToFolderMenu: React.FC<MoveToFolderMenuProps> = ({ chatId, currentFolderId, onClose }) => {
  const { folders, moveChatToFolder } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMoveToFolder = (folderId: string | null) => {
    moveChatToFolder(chatId, folderId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        ref={menuRef}
        className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
      >
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Move to Folder
        </div>

        <button
          onClick={() => handleMoveToFolder(null)}
          className={cn(
            "w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left",
            !currentFolderId && "bg-primary-50 text-primary-700"
          )}
        >
          <FolderOpen size={16} className={cn(!currentFolderId ? "text-primary-600" : "text-gray-400")} />
          <span className="flex-1 text-sm font-medium">No Folder</span>
          {!currentFolderId && <Check size={14} className="text-primary-600" />}
        </button>

        {folders.length === 0 ? (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">
            No folders yet
          </div>
        ) : (
          folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => handleMoveToFolder(folder.id)}
              className={cn(
                "w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left",
                currentFolderId === folder.id && "bg-primary-50 text-primary-700"
              )}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: folder.color || '#9CA3AF' }}
              />
              <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
              {currentFolderId === folder.id && <Check size={14} className="text-primary-600" />}
            </button>
          ))
        )}
      </motion.div>
    </AnimatePresence>
  );
};
