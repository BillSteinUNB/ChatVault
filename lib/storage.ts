import { create } from 'zustand';
import { Chat, Folder, Platform } from '../types';
import { MOCK_CHATS, MOCK_FOLDERS } from '../constants';

interface AppState {
  chats: Chat[];
  folders: Folder[];
  searchQuery: string;
  activeFilter: 'all' | Platform;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: 'all' | Platform) => void;
  togglePin: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  createFolder: (name: string) => void;
}

// In a real extension, we would use an async middleware to persist to chrome.storage
export const useStore = create<AppState>((set) => ({
  chats: MOCK_CHATS,
  folders: MOCK_FOLDERS,
  searchQuery: '',
  activeFilter: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilter: (filter) => set({ activeFilter: filter }),
  togglePin: (chatId) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      ),
    })),
  deleteChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== chatId),
    })),
  createFolder: (name) =>
    set((state) => ({
      folders: [
        ...state.folders,
        { id: crypto.randomUUID(), name, chats: [] },
      ],
    })),
}));