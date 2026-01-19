import { create } from 'zustand';
import { Chat, Folder, Platform, PersistedChat, STORAGE_KEYS } from '../types';
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
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  moveChatToFolder: (chatId: string, folderId: string | null) => void;
}

/**
 * Load persisted chats from chrome.storage.local
 * Falls back to empty array if storage is empty or unavailable
 */
async function loadPersistedChats(): Promise<Chat[]> {
  try {
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
 * Load persisted folders from chrome.storage.local
 * Falls back to empty array if storage is empty or unavailable
 */
async function loadPersistedFolders(): Promise<Folder[]> {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      console.log('[ChatVault] chrome.storage not available, using empty state');
      return [];
    }
    
    const result = await chrome.storage.local.get(STORAGE_KEYS.FOLDERS);
    const persisted = (result[STORAGE_KEYS.FOLDERS] as Folder[] | undefined) ?? [];
    
    console.log('[ChatVault] Loaded', persisted.length, 'folders from storage');
    return persisted;
  } catch (error) {
    console.error('[ChatVault] Failed to load folders from storage:', error);
    return [];
  }
}

/**
 * Setup listener for storage changes to update store reactively
 */
function setupStorageListener(setChats: (chats: Chat[]) => void, setFolders: (folders: Folder[]) => void): void {
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
    
    if (areaName === 'local' && changes[STORAGE_KEYS.FOLDERS]) {
      const newValue = changes[STORAGE_KEYS.FOLDERS].newValue as Folder[] | undefined;
      if (newValue !== undefined) {
        console.log('[ChatVault] Folders storage changed, updating store with', newValue.length, 'folders');
        setFolders(newValue);
      }
    }
  });
}

export const useStore = create<Store>((set, get) => {
  // Setup storage listener on store creation
  setupStorageListener((chats) => set({ chats }), (folders) => set({ folders }));
  
  // Trigger initial load (async, will update state when ready)
  loadPersistedChats().then(chats => {
    set({ chats, isLoading: false });
  });
  
  loadPersistedFolders().then(folders => {
    set({ folders });
  });

  return {
    chats: [],
    folders: [],
    isLoading: true,
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    activeFolder: null,
    setActiveFolder: (id) => set({ activeFolder: id }),
    activeFilter: 'all',
    setFilter: (filter) => set({ activeFilter: filter }),
    togglePin: (id) => {
      set((state) => ({
        chats: state.chats.map(chat =>
          chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat
        )
      }));
      
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
      set((state) => ({
        chats: state.chats.filter(chat => chat.id !== id)
      }));
      
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
    addFolder: (folder) => {
      set((state) => ({
        folders: [...state.folders, folder]
      }));
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.FOLDERS).then(result => {
          const persisted = (result[STORAGE_KEYS.FOLDERS] as Folder[] | undefined) ?? [];
          const updated = [...persisted, folder];
          chrome.storage.local.set({ [STORAGE_KEYS.FOLDERS]: updated });
        });
      }
    },
    updateFolder: (id, updates) => {
      set((state) => ({
        folders: state.folders.map(folder =>
          folder.id === id ? { ...folder, ...updates, updatedAt: Date.now() } : folder
        )
      }));
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.FOLDERS).then(result => {
          const persisted = (result[STORAGE_KEYS.FOLDERS] as Folder[] | undefined) ?? [];
          const updated = persisted.map(folder =>
            folder.id === id ? { ...folder, ...updates, updatedAt: Date.now() } : folder
          );
          chrome.storage.local.set({ [STORAGE_KEYS.FOLDERS]: updated });
        });
      }
    },
    deleteFolder: (id) => {
      set((state) => ({
        folders: state.folders.filter(folder => folder.id !== id)
      }));
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.FOLDERS).then(result => {
          const persisted = (result[STORAGE_KEYS.FOLDERS] as Folder[] | undefined) ?? [];
          const updated = persisted.filter(folder => folder.id !== id);
          chrome.storage.local.set({ [STORAGE_KEYS.FOLDERS]: updated });
        });
      }
    },
    moveChatToFolder: (chatId, folderId) => {
      set((state) => ({
        chats: state.chats.map(chat =>
          chat.id === chatId ? { ...chat, folderId } : chat
        )
      }));
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.CHATS).then(result => {
          const persisted = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
          const updated = persisted.map(chat =>
            chat.id === chatId ? { ...chat, folderId: folderId || undefined } : chat
          );
          chrome.storage.local.set({ [STORAGE_KEYS.CHATS]: updated });
        });
      }
    },
  };
});
