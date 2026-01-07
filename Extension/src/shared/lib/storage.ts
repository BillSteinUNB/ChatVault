import { create } from 'zustand';
import { Chat, Folder, Platform } from '../types';
import { MOCK_CHATS, MOCK_FOLDERS } from '../constants';

interface Store {
  chats: Chat[];
  folders: Folder[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFolder: string | null;
  setActiveFolder: (id: string | null) => void;
  activeFilter: Platform | 'all';
  setFilter: (filter: Platform | 'all') => void;
  togglePin: (id: string) => void;
  deleteChat: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  chats: MOCK_CHATS,
  folders: MOCK_FOLDERS,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeFolder: null,
  setActiveFolder: (id) => set({ activeFolder: id }),
  activeFilter: 'all',
  setFilter: (filter) => set({ activeFilter: filter }),
  togglePin: (id) => set((state) => ({
    chats: state.chats.map(chat =>
      chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat
    )
  })),
  deleteChat: (id) => set((state) => ({
    chats: state.chats.filter(chat => chat.id !== id)
  }))
}));
