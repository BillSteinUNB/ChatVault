import React, { useState } from 'react';
import { Folder as FolderIcon } from 'lucide-react';
import { useStore } from '../lib/storage';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Palette } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const PRESET_COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
];

interface ContextMenuProps {
  x: number;
  y: number;
  onRename: () => void;
  onChangeColor: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const FolderContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onRename,
  onChangeColor,
  onDelete,
  onClose,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
        style={{ left: x, top: y }}
      >
        <button
          onClick={() => {
            onRename();
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
        >
          <Edit2 size={14} />
          Rename
        </button>
        <button
          onClick={() => {
            onChangeColor();
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
        >
          <Palette size={14} />
          Change Color
        </button>
        <div className="h-px bg-gray-100 my-1" />
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </motion.div>
    </>
  );
};

interface RenameModalProps {
  isOpen: boolean;
  initialName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  initialName,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    if (name.trim().length > 50) {
      setError('Folder name must be 50 characters or less');
      return;
    }

    onSave(name.trim());
    setName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName(initialName);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-md pointer-events-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Rename Folder</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="My Projects"
                maxLength={50}
                className={cn(error && 'border-red-500 focus:border-red-500 focus:ring-red-100')}
                autoFocus
              />
              <div className="flex justify-between items-center mt-1">
                {error && <p className="text-xs text-red-600">{error}</p>}
                <span className="text-xs text-gray-400 ml-auto">{name.length}/50</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface ChangeColorModalProps {
  isOpen: boolean;
  currentColor?: string;
  onSave: (color: string) => void;
  onClose: () => void;
}

const ChangeColorModal: React.FC<ChangeColorModalProps> = ({
  isOpen,
  currentColor,
  onSave,
  onClose,
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor || PRESET_COLORS[3]);

  const handleSave = () => {
    onSave(selectedColor);
    onClose();
  };

  const handleClose = () => {
    setSelectedColor(currentColor || PRESET_COLORS[3]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-md pointer-events-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Change Folder Color</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-3 justify-center">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'w-12 h-12 rounded-full border-2 transition-all hover:scale-110',
                    selectedColor === color
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                      : 'border-transparent hover:border-gray-300'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  folderName: string;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  folderName,
  onConfirm,
  onClose,
}) => {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-md pointer-events-auto"
        >
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Folder</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>"{folderName}"</strong>? This will not delete any chats in the folder.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <strong>DELETE</strong> to confirm
              </label>
              <Input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onConfirm();
                  setConfirmText('');
                  onClose();
                }}
                disabled={confirmText !== 'DELETE'}
              >
                Delete Folder
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const FolderList: React.FC = () => {
  const { folders, chats, activeFolder, setActiveFolder, updateFolder, deleteFolder, moveChatToFolder } = useStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folderId: string } | null>(null);
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean; folderId: string; initialName: string }>({ isOpen: false, folderId: '', initialName: '' });
  const [changeColorModal, setChangeColorModal] = useState<{ isOpen: boolean; folderId: string; currentColor?: string }>({ isOpen: false, folderId: '', currentColor: undefined });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; folderId: string; folderName: string }>({ isOpen: false, folderId: '', folderName: '' });

  const handleFolderRightClick = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, folderId });
  };

  const handleRename = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setRenameModal({ isOpen: true, folderId, initialName: folder.name });
    }
  };

  const handleRenameSave = (name: string) => {
    updateFolder(renameModal.folderId, { name });
  };

  const handleChangeColor = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setChangeColorModal({ isOpen: true, folderId, currentColor: folder.color });
    }
  };

  const handleChangeColorSave = (color: string) => {
    updateFolder(changeColorModal.folderId, { color });
  };

  const handleDelete = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setDeleteModal({ isOpen: true, folderId, folderName: folder.name });
    }
  };

  const handleDeleteConfirm = () => {
    const folder = folders.find(f => f.id === deleteModal.folderId);
    if (folder) {
      chats.filter(chat => chat.folderId === folder.id).forEach(chat => {
        moveChatToFolder(chat.id, null);
      });
      deleteFolder(deleteModal.folderId);
      if (activeFolder === deleteModal.folderId) {
        setActiveFolder(null);
      }
    }
  };

  return (
    <>
      <div className="space-y-1">
        <button
          onClick={() => setActiveFolder(null)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            activeFolder === null
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <FolderIcon size={16} className={cn(activeFolder === null ? 'text-primary-600' : 'text-gray-400')} />
          <span className="flex-1 text-left">All Chats</span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            activeFolder === null ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
          )}>
            {chats.length}
          </span>
        </button>

        {folders.map((folder) => {
          const folderChatCount = chats.filter(chat => chat.folderId === folder.id).length;
          return (
            <div key={folder.id}>
              <button
                onClick={() => setActiveFolder(folder.id === activeFolder ? null : folder.id)}
                onContextMenu={(e) => handleFolderRightClick(e, folder.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeFolder === folder.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: folder.color || PRESET_COLORS[3] }}
                />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  activeFolder === folder.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                )}>
                  {folderChatCount}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {contextMenu && (
          <FolderContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onRename={() => handleRename(contextMenu.folderId)}
            onChangeColor={() => handleChangeColor(contextMenu.folderId)}
            onDelete={() => handleDelete(contextMenu.folderId)}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>

      <RenameModal
        isOpen={renameModal.isOpen}
        initialName={renameModal.initialName}
        onSave={handleRenameSave}
        onClose={() => setRenameModal({ isOpen: false, folderId: '', initialName: '' })}
      />

      <ChangeColorModal
        isOpen={changeColorModal.isOpen}
        currentColor={changeColorModal.currentColor}
        onSave={handleChangeColorSave}
        onClose={() => setChangeColorModal({ isOpen: false, folderId: '', currentColor: undefined })}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        folderName={deleteModal.folderName}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ isOpen: false, folderId: '', folderName: '' })}
      />
    </>
  );
};
