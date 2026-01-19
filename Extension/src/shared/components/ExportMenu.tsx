import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { useStore } from '../lib/storage';
import { Chat } from '../types';
import { exportToJSON, exportToMarkdown, downloadFile } from '../lib/export';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportMenuProps {
  chat?: Chat;
  onClose: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ chat, onClose }) => {
  const { chats } = useStore();
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

  const getSanitizedTitle = (title: string) => {
    return title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  };

  const handleExportAsJSON = () => {
    if (chat) {
      const date = new Date(chat.timestamp).toISOString().split('T')[0];
      const sanitizedTitle = getSanitizedTitle(chat.title);
      const filename = `${sanitizedTitle}-${date}.json`;
      const content = exportToJSON([chat]);
      downloadFile(content, filename, 'application/json');
    } else {
      const date = new Date().toISOString().split('T')[0];
      const filename = `chatvault-backup-${date}.json`;
      const content = exportToJSON(chats);
      downloadFile(content, filename, 'application/json');
    }
    onClose();
  };

  const handleExportAsMarkdown = () => {
    if (!chat) return;
    
    const date = new Date(chat.timestamp).toISOString().split('T')[0];
    const sanitizedTitle = getSanitizedTitle(chat.title);
    const filename = `${sanitizedTitle}-${date}.md`;
    const content = exportToMarkdown(chat);
    downloadFile(content, filename, 'text/markdown');
    onClose();
  };

  const handleExportAll = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `chatvault-backup-${date}.json`;
    const content = exportToJSON(chats);
    downloadFile(content, filename, 'application/json');
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
          Export
        </div>

        {chat ? (
          <>
            <button
              onClick={handleExportAsJSON}
              className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <FileText size={16} className="text-gray-400" />
              <span className="flex-1 text-sm font-medium">Export as JSON</span>
            </button>

            <button
              onClick={handleExportAsMarkdown}
              className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <FileText size={16} className="text-gray-400" />
              <span className="flex-1 text-sm font-medium">Export as Markdown</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleExportAll}
            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
          >
            <Download size={16} className="text-gray-400" />
            <span className="flex-1 text-sm font-medium">Export All Chats</span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
