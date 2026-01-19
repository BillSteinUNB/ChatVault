import React, { useState, useRef } from 'react';
import { Chat, Tag } from '../types';
import { formatRelativeTime } from '../lib/utils';
import { Pin, Trash2, ExternalLink, Folder, X, Plus, Download, FileText } from 'lucide-react';
import { useStore } from '../lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { MoveToFolderMenu } from './MoveToFolderMenu';
import { TagInput } from './TagInput';
import { exportToJSON, exportToMarkdown, downloadFile } from '../lib/export';

interface ChatItemProps {
  chat: Chat;
  compact?: boolean;
  isSelected?: boolean;
  onClick?: (chat: Chat) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, compact, isSelected, onClick }) => {
  const { togglePin, deleteChat, folders, tags, removeTagFromChat, addTagToChat } = useStore();
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [tagEditorPosition, setTagEditorPosition] = useState({ top: 0, left: 0 });
  const tagButtonRef = useRef<HTMLButtonElement>(null);

  const chatTags = tags.filter(tag => chat.tags.includes(tag.id));
  const visibleTags = chatTags.slice(0, 3);
  const remainingCount = chatTags.length - 3;

  const platformColors = {
    chatgpt: 'border-l-[#10A37F]',
    claude: 'border-l-[#D97757]',
    perplexity: 'border-l-[#6B4FFF]',
  };

  const folder = chat.folderId ? folders.find(f => f.id === chat.folderId) : null;

  const handleOpenTagEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tagButtonRef.current) {
      const rect = tagButtonRef.current.getBoundingClientRect();
      setTagEditorPosition({ top: rect.bottom + 4, left: rect.left });
    }
    setShowTagEditor(true);
  };

  const handleRemoveTag = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    removeTagFromChat(chat.id, tagId);
  };

  const handleTagsChange = (newTagIds: string[]) => {
    const addedTags = newTagIds.filter(id => !chat.tags.includes(id));
    const removedTags = chat.tags.filter(id => !newTagIds.includes(id));

    removedTags.forEach(tagId => removeTagFromChat(chat.id, tagId));
    addedTags.forEach(tagId => addTagToChat(chat.id, tagId));
  };

  const handleExportAsJSON = () => {
    const date = new Date(chat.timestamp).toISOString().split('T')[0];
    const sanitizedTitle = chat.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${sanitizedTitle}-${date}.json`;
    const content = exportToJSON([chat]);
    downloadFile(content, filename, 'application/json');
    setShowExportMenu(false);
  };

  const handleExportAsMarkdown = () => {
    const date = new Date(chat.timestamp).toISOString().split('T')[0];
    const sanitizedTitle = chat.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${sanitizedTitle}-${date}.md`;
    const content = exportToMarkdown(chat);
    downloadFile(content, filename, 'text/markdown');
    setShowExportMenu(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      onClick={() => onClick?.(chat)}
      className={cn(
        "group relative bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-all cursor-pointer border-l-4",
        platformColors[chat.platform],
        isSelected && "ring-2 ring-primary-500 ring-offset-2"
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
          <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
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
          <div className="flex items-center gap-1.5 flex-wrap">
            {visibleTags.map((tag) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <button
                  onClick={(e) => handleRemoveTag(e, tag.id)}
                  className="hover:opacity-80 focus:outline-none rounded-full p-0.5"
                >
                  <X size={8} />
                </button>
              </motion.span>
            ))}
            {remainingCount > 0 && (
              <span className="text-[10px] text-gray-400">
                +{remainingCount} more
              </span>
            )}
            <button
              ref={tagButtonRef}
              onClick={handleOpenTagEditor}
              className="inline-flex items-center justify-center p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Add tags"
            >
              <Plus size={10} />
            </button>
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
           <div className="relative">
             <button
               onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); setShowFolderMenu(false); }}
               className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-500"
             >
               <Download size={14} />
             </button>

             {/* Export Menu */}
             <AnimatePresence>
               {showExportMenu && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.15 }}
                   className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                   onClick={(e) => e.stopPropagation()}
                 >
                   <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                     Export
                   </div>
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
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
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

        {/* Tag Editor */}
        <AnimatePresence>
          {showTagEditor && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowTagEditor(false); }} />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="fixed z-50 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-3"
                style={{
                  top: tagEditorPosition.top,
                  left: tagEditorPosition.left,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <TagInput
                  chatId={chat.id}
                  selectedTags={chat.tags}
                  onTagsChange={handleTagsChange}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
