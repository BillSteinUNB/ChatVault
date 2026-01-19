import React, { useState } from 'react';
import { X, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useStore } from '../lib/storage';
import { cn } from '../lib/utils';
import { Folder } from '../types';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (folder: Folder) => void;
}

const PRESET_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6B7280', // Gray
];

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const addFolder = useStore((state) => state.addFolder);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[3]);
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

    const newFolder: Folder = {
      id: generateUUID(),
      name: name.trim(),
      parentId: null,
      color: selectedColor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addFolder(newFolder);
    onCreated?.(newFolder);

    setName('');
    setSelectedColor(PRESET_COLORS[3]);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedColor(PRESET_COLORS[3]);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Palette size={18} className="text-primary-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">New Folder</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            'w-10 h-10 rounded-full border-2 transition-all hover:scale-110',
                            selectedColor === color
                              ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                              : 'border-transparent hover:border-gray-300'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Folder</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
