import { create } from 'zustand';
import { Chat, Folder, Platform, PersistedChat, STORAGE_KEYS } from '../types';
import { MOCK_FOLDERS } from '../constants';
import { persistedChatsToChats } from './utils';

interface Store {
  chats: Chat[];
  folders: Folder[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFolder: string | null;
  setActiveFolder: (id: string | null) => void;
  activeFilter: Platform | 'all';
  setFilter: (filter: Platform | 'all') => void;
  togglePin: (id: string) => void;
  deleteChat: (id: string) => void;
  loadChatsFromStorage: () => Promise<void>;
  setChats: (chats: Chat[]) => void;
}

/**
 * Load persisted chats from chrome.storage.local
 * Falls back to empty array if storage is empty or unavailable
 */
async function loadPersistedChats(): Promise<Chat[]> {
  try {
    // Check if chrome.storage is available (not in all contexts)
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      console.log('[ChatVault] chrome.storage not available, using empty state');
      return [];
    }
    
    const result = await chrome.storage.local.get(STORAGE_KEYS.CHATS);
    const persisted = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
    
    console.log('[ChatVault] Loaded', persisted.length, 'chats from storage');
    return persistedChatsToChats(persisted);
  } catch (error) {
    console.error('[ChatVault] Failed to load chats from storage:', error);
    return [];
  }
}

/**
 * Setup listener for storage changes to update store reactively
 */
function setupStorageListener(setChats: (chats: Chat[]) => void): void {
  if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) {
    return;
  }
  
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[STORAGE_KEYS.CHATS]) {
      const newValue = changes[STORAGE_KEYS.CHATS].newValue as PersistedChat[] | undefined;
      if (newValue) {
        console.log('[ChatVault] Storage changed, updating store with', newValue.length, 'chats');
        setChats(persistedChatsToChats(newValue));
      }
    }
  });
}

export const useStore = create<Store>((set, get) => {
  // Setup storage listener on store creation
  setupStorageListener((chats) => set({ chats }));
  
  // Trigger initial load (async, will update state when ready)
  loadPersistedChats().then(chats => {
    set({ chats, isLoading: false });
  });

  return {
    chats: [], // Start empty, will be populated from storage
    folders: MOCK_FOLDERS, // TODO: Load from storage in future phase
    isLoading: true,
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    activeFolder: null,
    setActiveFolder: (id) => set({ activeFolder: id }),
    activeFilter: 'all',
    setFilter: (filter) => set({ activeFilter: filter }),
    togglePin: (id) => {
      // Update local state
      set((state) => ({
        chats: state.chats.map(chat =>
          chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat
        )
      }));
      
      // Persist to storage
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.CHATS).then(result => {
          const persisted = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
          const updated = persisted.map(chat =>
            chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat
          );
          chrome.storage.local.set({ [STORAGE_KEYS.CHATS]: updated });
        });
      }
    },
    deleteChat: (id) => {
      // Update local state
      set((state) => ({
        chats: state.chats.filter(chat => chat.id !== id)
      }));
      
      // Persist to storage
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.CHATS).then(result => {
          const persisted = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
          const updated = persisted.filter(chat => chat.id !== id);
          chrome.storage.local.set({ [STORAGE_KEYS.CHATS]: updated });
        });
      }
    },
    loadChatsFromStorage: async () => {
      set({ isLoading: true });
      const chats = await loadPersistedChats();
      set({ chats, isLoading: false });
    },
    setChats: (chats) => set({ chats }),
  };
});
