import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useStore } from '../lib/storage';
import { Tag } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
];

interface TagInputProps {
  chatId: string;
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({
  chatId,
  selectedTags,
  onTagsChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const tags = useStore((state) => state.tags);
  const addTag = useStore((state) => state.addTag);
  const addTagToChat = useStore((state) => state.addTagToChat);
  const removeTagFromChat = useStore((state) => state.removeTagFromChat);

  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id));
  const availableTags = tags.filter((tag) => !selectedTags.includes(tag.id));

  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    if (inputValue || filteredTags.length > 0) {
      setShowDropdown(true);
    }
    updateDropdownPosition();
  };

  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const getRandomColor = (): string => {
    return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
  };

  const addNewTag = (tagName: string) => {
    const trimmedName = tagName.trim();
    if (!trimmedName) return;

    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingTag) {
      addTagToChat(chatId, existingTag.id);
    } else {
      const newTag: Tag = {
        id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        name: trimmedName,
        color: getRandomColor(),
        createdAt: Date.now(),
      };
      addTag(newTag);
      addTagToChat(chatId, newTag.id);
    }

    setInputValue('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addNewTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      const lastTagId = selectedTags[selectedTags.length - 1];
      removeTagFromChat(chatId, lastTagId);
      onTagsChange(selectedTags.filter((id) => id !== lastTagId));
    }
  };

  const removeTag = (tagId: string) => {
    removeTagFromChat(chatId, tagId);
    onTagsChange(selectedTags.filter((id) => id !== tagId));
  };

  const selectTag = (tagId: string) => {
    addTagToChat(chatId, tagId);
    onTagsChange([...selectedTags, tagId]);
    setInputValue('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent" role="combobox" aria-expanded={showDropdown} aria-haspopup="listbox" aria-labelledby="tag-input-label">
        {selectedTagObjects.map((tag) => (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: tag.color }}
            role="listitem"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
              aria-label={`Remove ${tag.name} tag`}
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
        <input
          ref={inputRef}
          id="tag-input-label"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[120px] outline-none text-sm text-gray-900 placeholder-gray-400"
          aria-autocomplete="list"
          aria-controls="tag-listbox"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => addNewTag(inputValue)}
            className="p-1 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={`Add tag: ${inputValue}`}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (filteredTags.length > 0 || inputValue) && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-[200px] overflow-y-auto"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
              id="tag-listbox"
              role="listbox"
            >
              {filteredTags.map((tag, index) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => selectTag(tag.id)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  role="option"
                  aria-selected={false}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                    aria-hidden="true"
                  />
                  {tag.name}
                </button>
              ))}
              {inputValue && (
                <>
                  {filteredTags.length > 0 && <div className="h-px bg-gray-100 my-1" role="separator" />}
                  <button
                    type="button"
                    onClick={() => addNewTag(inputValue)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600 font-medium"
                    role="option"
                  >
                    <Plus size={14} aria-hidden="true" />
                    Create "{inputValue}"
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
