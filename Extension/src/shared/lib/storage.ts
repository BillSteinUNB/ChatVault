import { create } from 'zustand';
import { Chat, Folder, Tag, Platform, PersistedChat, STORAGE_KEYS, Settings, DEFAULT_SETTINGS } from '../types';
import { persistedChatsToChats } from './utils';


interface Store {
  chats: Chat[];
  folders: Folder[];
  tags: Tag[];
  settings: Settings;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFolder: string | null;
  setActiveFolder: (id: string | null) => void;
  activeFilter: Platform | 'all';
  setFilter: (filter: Platform | 'all') => void;
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  toggleActiveTag: (tagId: string) => void;
  togglePin: (id: string) => void;
  deleteChat: (id: string) => void;
  loadChatsFromStorage: () => Promise<void>;
  setChats: (chats: Chat[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  moveChatToFolder: (chatId: string, folderId: string | null) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  addTagToChat: (chatId: string, tagId: string) => void;
  removeTagFromChat: (chatId: string, tagId: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
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
 * Load persisted tags from chrome.storage.local
 * Falls back to empty array if storage is empty or unavailable
 */
async function loadPersistedTags(): Promise<Tag[]> {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      console.log('[ChatVault] chrome.storage not available, using empty state');
      return [];
    }

    const result = await chrome.storage.local.get(STORAGE_KEYS.TAGS);
    const persisted = (result[STORAGE_KEYS.TAGS] as Tag[] | undefined) ?? [];

    console.log('[ChatVault] Loaded', persisted.length, 'tags from storage');
    return persisted;
  } catch (error) {
    console.error('[ChatVault] Failed to load tags from storage:', error);
    return [];
  }
}

/**
 * Load persisted settings from chrome.storage.local
 * Falls back to DEFAULT_SETTINGS if storage is empty or unavailable
 */
async function loadPersistedSettings(): Promise<Settings> {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      console.log('[ChatVault] chrome.storage not available, using default settings');
      return DEFAULT_SETTINGS;
    }

    const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
    const persisted = (result[STORAGE_KEYS.SETTINGS] as Settings | undefined) ?? DEFAULT_SETTINGS;

    console.log('[ChatVault] Loaded settings from storage:', persisted);
    return persisted;
  } catch (error) {
    console.error('[ChatVault] Failed to load settings from storage:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Setup listener for storage changes to update store reactively
 */
function setupStorageListener(
  setChats: (chats: Chat[]) => void,
  setFolders: (folders: Folder[]) => void,
  setTags: (tags: Tag[]) => void,
  setSettings: (settings: Settings) => void
): void {
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

    if (areaName === 'local' && changes[STORAGE_KEYS.TAGS]) {
      const newValue = changes[STORAGE_KEYS.TAGS].newValue as Tag[] | undefined;
      if (newValue !== undefined) {
        console.log('[ChatVault] Tags storage changed, updating store with', newValue.length, 'tags');
        setTags(newValue);
      }
    }

    if (areaName === 'local' && changes[STORAGE_KEYS.SETTINGS]) {
      const newValue = changes[STORAGE_KEYS.SETTINGS].newValue as Settings | undefined;
      if (newValue !== undefined) {
        console.log('[ChatVault] Settings storage changed:', newValue);
        setSettings(newValue);
      }
    }
  });
}

export const useStore = create<Store>((set, get) => {
  // Setup storage listener on store creation
  setupStorageListener((chats) => set({ chats }), (folders) => set({ folders }), (tags) => set({ tags }), (settings) => set({ settings }));

  // Trigger initial load (async, will update state when ready)
  loadPersistedChats().then(chats => {
    set({ chats, isLoading: false });
  });

  loadPersistedFolders().then(folders => {
    set({ folders });
  });

  loadPersistedTags().then(tags => {
    set({ tags });
  });

  loadPersistedSettings().then(settings => {
    set({ settings });
  });

  return {
    chats: [],
    folders: [],
    tags: [],
    settings: DEFAULT_SETTINGS,
    isLoading: true,
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    activeFolder: null,
    setActiveFolder: (id) => set({ activeFolder: id }),
    activeFilter: 'all',
    setFilter: (filter) => set({ activeFilter: filter }),
    activeTags: [],
    setActiveTags: (tags) => set({ activeTags: tags }),
    toggleActiveTag: (tagId) => set(state => ({
      activeTags: state.activeTags.includes(tagId)
        ? state.activeTags.filter(id => id !== tagId)
        : [...state.activeTags, tagId]
    })),
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
    addTag: (tag) => {
      set((state) => ({
        tags: [...state.tags, tag]
      }));
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.TAGS).then(result => {
          const persisted = (result[STORAGE_KEYS.TAGS] as Tag[] | undefined) ?? [];
          const updated = [...persisted, tag];
          chrome.storage.local.set({ [STORAGE_KEYS.TAGS]: updated });
        });
      }
    },
    updateTag: (id, updates) => {
      set((state) => ({
        tags: state.tags.map(tag =>
          tag.id === id ? { ...tag, ...updates } : tag
        )
      }));
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.TAGS).then(result => {
          const persisted = (result[STORAGE_KEYS.TAGS] as Tag[] | undefined) ?? [];
          const updated = persisted.map(tag =>
            tag.id === id ? { ...tag, ...updates } : tag
          );
          chrome.storage.local.set({ [STORAGE_KEYS.TAGS]: updated });
        });
      }
    },
    deleteTag: (id) => {
      set((state) => {
        const updatedTags = state.tags.filter(tag => tag.id !== id);
        const updatedChats = state.chats.map(chat => ({
          ...chat,
          tags: chat.tags.filter(tagId => tagId !== id)
        }));
        return {
          tags: updatedTags,
          chats: updatedChats
        };
      });
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.TAGS).then(result => {
          const persisted = (result[STORAGE_KEYS.TAGS] as Tag[] | undefined) ?? [];
          const updatedTags = persisted.filter(tag => tag.id !== id);
          chrome.storage.local.set({ [STORAGE_KEYS.TAGS]: updatedTags });
        });
        
        chrome.storage.local.get(STORAGE_KEYS.CHATS).then(result => {
          const persisted = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
          const updatedChats = persisted.map(chat => ({
            ...chat,
            tags: chat.tags.filter(tagId => tagId !== id)
          }));
          chrome.storage.local.set({ [STORAGE_KEYS.CHATS]: updatedChats });
        });
      }
    },
    addTagToChat: (chatId, tagId) => {
      set((state) => ({
        chats: state.chats.map(chat =>
          chat.id === chatId && !chat.tags.includes(tagId)
            ? { ...chat, tags: [...chat.tags, tagId] }
            : chat
        )
      }));
      
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.CHATS).then(result => {
          const persisted = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
          const updated = persisted.map(chat =>
            chat.id === chatId && !chat.tags.includes(tagId)
              ? { ...chat, tags: [...chat.tags, tagId] }
              : chat
          );
          chrome.storage.local.set({ [STORAGE_KEYS.CHATS]: updated });
        });
      }
    },
    removeTagFromChat: (chatId, tagId) => {
      set((state) => ({
        chats: state.chats.map(chat =>
          chat.id === chatId
            ? { ...chat, tags: chat.tags.filter(id => id !== tagId) }
            : chat
        )
      }));

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEYS.CHATS).then(result => {
          const persisted = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
          const updated = persisted.map(chat =>
            chat.id === chatId
              ? { ...chat, tags: chat.tags.filter(id => id !== tagId) }
              : chat
          );
          chrome.storage.local.set({ [STORAGE_KEYS.CHATS]: updated });
        });
      }
    },
    updateSettings: (updates) => {
      const newSettings = { ...get().settings, ...updates };
      set({ settings: newSettings });

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: newSettings });
      }
    },
  };
});
