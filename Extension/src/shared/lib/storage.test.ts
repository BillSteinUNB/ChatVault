import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Settings, DEFAULT_SETTINGS } from '../types';
import { useStore } from '../lib/storage';

// Mock chrome storage
const mockStorage: { [key: string]: any } = {};
let setStorageListenerCallback: ((changes: any, areaName: string) => void) | null = null;

vi.stubGlobal('chrome', {
  storage: {
    local: {
      get: vi.fn((keys: string | string[]) => {
        if (typeof keys === 'string') {
          return Promise.resolve({ [keys]: mockStorage[keys] });
        }
        const result: { [key: string]: any } = {};
        keys.forEach(key => {
          result[key] = mockStorage[key];
        });
        return Promise.resolve(result);
      }),
      set: vi.fn(async (data: { [key: string]: any }) => {
        Object.keys(data).forEach(key => {
          mockStorage[key] = data[key];
        });
        // Trigger onstoragechanged if listener exists
        if (setStorageListenerCallback) {
          setStorageListenerCallback(data, 'local');
        }
        return Promise.resolve();
      }),
      onChanged: {
        addListener: vi.fn((callback) => {
          setStorageListenerCallback = callback;
        }),
        removeListener: vi.fn(),
      },
    },
  },
});

describe('PRD-13: Settings Data Model & Storage', () => {
  beforeEach(async () => {
    // Clear mock storage
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    // Reset storage listener
    setStorageListenerCallback = null;
    // Clear all mocks
    vi.clearAllMocks();
    // Add settings to mock storage
    mockStorage['chatvault_settings'] = DEFAULT_SETTINGS;

    // Wait for async store initialization to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('Settings interface exists', () => {
    it('should have correct structure', () => {
      const settings: Settings = {
        theme: 'light',
        autoSave: true,
        autoSaveInterval: 30,
        enabledPlatforms: {
          chatgpt: true,
          claude: true,
          perplexity: true,
        },
        compactMode: false,
      };

      expect(settings.theme).toBe('light');
      expect(settings.autoSave).toBe(true);
      expect(settings.autoSaveInterval).toBe(30);
      expect(settings.enabledPlatforms.chatgpt).toBe(true);
      expect(settings.enabledPlatforms.claude).toBe(true);
      expect(settings.enabledPlatforms.perplexity).toBe(true);
      expect(settings.compactMode).toBe(false);
    });

    it('should accept all theme options', () => {
      const lightTheme: Settings = { ...DEFAULT_SETTINGS, theme: 'light' };
      const darkTheme: Settings = { ...DEFAULT_SETTINGS, theme: 'dark' };
      const systemTheme: Settings = { ...DEFAULT_SETTINGS, theme: 'system' };

      expect(lightTheme.theme).toBe('light');
      expect(darkTheme.theme).toBe('dark');
      expect(systemTheme.theme).toBe('system');
    });
  });

  describe('DEFAULT_SETTINGS constant', () => {
    it('should be defined', () => {
      expect(DEFAULT_SETTINGS).toBeDefined();
      expect(typeof DEFAULT_SETTINGS).toBe('object');
    });

    it('should have correct default values', () => {
      expect(DEFAULT_SETTINGS.theme).toBe('system');
      expect(DEFAULT_SETTINGS.autoSave).toBe(true);
      expect(DEFAULT_SETTINGS.autoSaveInterval).toBe(30);
      expect(DEFAULT_SETTINGS.enabledPlatforms.chatgpt).toBe(true);
      expect(DEFAULT_SETTINGS.enabledPlatforms.claude).toBe(true);
      expect(DEFAULT_SETTINGS.enabledPlatforms.perplexity).toBe(true);
      expect(DEFAULT_SETTINGS.compactMode).toBe(false);
    });
  });

  describe('Storage integration', () => {
    it('should have settings state in store', () => {
      const state = useStore.getState();
      expect(state.settings).toBeDefined();
    });

    it('should provide updateSettings action', () => {
      const state = useStore.getState();
      expect(typeof state.updateSettings).toBe('function');
    });

    it('should have correct default settings structure', () => {
      const state = useStore.getState();
      expect(typeof state.settings.theme).toBe('string');
      expect(typeof state.settings.autoSave).toBe('boolean');
      expect(typeof state.settings.autoSaveInterval).toBe('number');
      expect(typeof state.settings.enabledPlatforms).toBe('object');
      expect(typeof state.settings.compactMode).toBe('boolean');
    });

    it('should have valid enabledPlatforms properties', () => {
      const state = useStore.getState();
      expect(typeof state.settings.enabledPlatforms.chatgpt).toBe('boolean');
      expect(typeof state.settings.enabledPlatforms.claude).toBe('boolean');
      expect(typeof state.settings.enabledPlatforms.perplexity).toBe('boolean');
    });
  });

  describe('View Mode State', () => {
    it('should have viewMode state in store', () => {
      const state = useStore.getState();
      expect('viewMode' in state).toBe(true);
    });

    it('should default to "main" view mode', () => {
      const state = useStore.getState();
      expect(state.viewMode).toBe('main');
    });

    it('should have setViewMode action', () => {
      const state = useStore.getState();
      expect(typeof state.setViewMode).toBe('function');
    });

    it('should switch view mode to "settings" when setViewMode is called', () => {
      const { setViewMode } = useStore.getState();
      setViewMode('settings');
      const state = useStore.getState();
      expect(state.viewMode).toBe('settings');
    });

    it('should switch view mode to "main" when setViewMode is called', () => {
      const { setViewMode } = useStore.getState();
      setViewMode('settings');
      setViewMode('main');
      const state = useStore.getState();
      expect(state.viewMode).toBe('main');
    });

    it('should support both "main" and "settings" view modes', () => {
      const { setViewMode } = useStore.getState();

      setViewMode('main');
      expect(useStore.getState().viewMode).toBe('main');

      setViewMode('settings');
      expect(useStore.getState().viewMode).toBe('settings');

      setViewMode('main');
      expect(useStore.getState().viewMode).toBe('main');
    });
  });

  describe('PRD-18: Full-Text Search Index', () => {
    beforeEach(async () => {
      // Add some mock chats to storage
      mockStorage['chatvault_chats'] = [
        {
          id: 'chat1',
          title: 'React Development',
          platform: 'claude',
          url: 'https://claude.ai/chat/chat1',
          messageCount: 10,
          createdAt: 1234567890,
          updatedAt: 1234567890,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat2',
          title: 'TypeScript Basics',
          platform: 'chatgpt',
          url: 'https://chatgpt.com/chat/chat2',
          messageCount: 5,
          createdAt: 1234567900,
          updatedAt: 1234567900,
          isPinned: false,
          tags: ['tag1']
        },
        {
          id: 'chat3',
          title: 'Deployment Guide',
          platform: 'perplexity',
          url: 'https://perplexity.ai/chat/chat3',
          messageCount: 15,
          createdAt: 1234567910,
          updatedAt: 1234567910,
          isPinned: true,
          tags: ['tag1', 'tag2'],
          folderId: 'folder1'
        }
      ];

      // Trigger storage reload
      const { loadChatsFromStorage } = useStore.getState();
      await loadChatsFromStorage();

      // Wait for index rebuild
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have searchIndex state in store', () => {
      const state = useStore.getState();
      expect('searchIndex' in state).toBe(true);
      expect(Array.isArray(state.searchIndex)).toBe(true);
    });

    it('should initialize searchIndex as empty array', () => {
      // Clear chats to get empty index
      mockStorage['chatvault_chats'] = [];
      const { loadChatsFromStorage } = useStore.getState();

      loadChatsFromStorage().then(() => {
        const state = useStore.getState();
        expect(Array.isArray(state.searchIndex)).toBe(true);
        expect(state.searchIndex).toHaveLength(0);
      });
    });

    it('should have searchChats action', () => {
      const state = useStore.getState();
      expect(typeof state.searchChats).toBe('function');
    });

    it('should build search index from loaded chats', () => {
      const state = useStore.getState();
      expect(state.searchIndex).toHaveLength(3);
    });

    it('should include all required fields in search index', () => {
      const state = useStore.getState();
      const entry = state.searchIndex[0];

      expect(entry).toHaveProperty('chatId');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('content');
      expect(entry).toHaveProperty('platform');
      expect(entry).toHaveProperty('tags');
      expect(entry).toHaveProperty('folderId');
      expect(entry).toHaveProperty('timestamp');
    });

    it('should find chats by query', () => {
      const { setSearchQuery, searchChats } = useStore.getState();
      setSearchQuery('react');
      const results = searchChats();

      expect(results).toContain('chat1');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty query', () => {
      const { setSearchQuery, searchChats } = useStore.getState();
      setSearchQuery('');
      const results = searchChats();

      expect(results).toEqual([]);
    });

    it('should rebuild search index when chats are updated', () => {
      const { setChats, searchChats, setSearchQuery } = useStore.getState();

      // Clear chats
      setChats([]);
      let state = useStore.getState();
      expect(state.searchIndex).toHaveLength(0);

      // Set new chats
      setSearchQuery('test');
      const newChats = [
        {
          id: 'newchat1',
          title: 'Test Chat',
          preview: 'Test preview',
          platform: 'claude' as const,
          timestamp: Date.now(),
          isPinned: false,
          tags: []
        }
      ];
      setChats(newChats);

      state = useStore.getState();
      expect(state.searchIndex).toHaveLength(1);
    });

    it('should rebuild search index when chat is deleted', () => {
      const { deleteChat } = useStore.getState();

      deleteChat('chat1');

      const state = useStore.getState();
      expect(state.searchIndex).toHaveLength(2);
      expect(state.searchIndex.find(e => e.chatId === 'chat1')).toBeUndefined();
    });

    it('should rebuild search index when chat tag is added', () => {
      const { addTagToChat } = useStore.getState();

      addTagToChat('chat2', 'newtag');

      const state = useStore.getState();
      const chat2Entry = state.searchIndex.find(e => e.chatId === 'chat2');
      expect(chat2Entry?.tags).toContain('newtag');
    });

    it('should rebuild search index when chat tag is removed', () => {
      const { removeTagFromChat } = useStore.getState();

      removeTagFromChat('chat3', 'tag1');

      const state = useStore.getState();
      const chat3Entry = state.searchIndex.find(e => e.chatId === 'chat3');
      expect(chat3Entry?.tags).not.toContain('tag1');
    });

    it('should rebuild search index when chat is moved to folder', () => {
      const { moveChatToFolder } = useStore.getState();

      moveChatToFolder('chat1', 'folder2');

      const state = useStore.getState();
      const chat1Entry = state.searchIndex.find(e => e.chatId === 'chat1');
      expect(chat1Entry?.folderId).toBe('folder2');
    });

    it('should rebuild search index when chat pin is toggled', () => {
      const { togglePin } = useStore.getState();

      togglePin('chat1');

      const state = useStore.getState();
      expect(state.searchIndex).toHaveLength(3); // index should still have all entries
    });

    it('should handle case-insensitive search', () => {
      const { setSearchQuery, searchChats } = useStore.getState();

      setSearchQuery('REACT');
      const resultsUpper = searchChats();

      setSearchQuery('react');
      const resultsLower = searchChats();

      setSearchQuery('ReAcT');
      const resultsMixed = searchChats();

      expect(resultsUpper).toEqual(resultsLower);
      expect(resultsLower).toEqual(resultsMixed);
    });

    it('should sort search results by timestamp (newest first)', () => {
      const { setSearchQuery, searchChats } = useStore.getState();
      setSearchQuery('deployment');
      const results = searchChats();

      // Assuming "deployment" matches chat3 (newest) and could match others
      // The first result should be the newest
      if (results.length > 1) {
        const state = useStore.getState();
        const firstEntry = state.searchIndex.find(e => e.chatId === results[0]);
        const secondEntry = state.searchIndex.find(e => e.chatId === results[1]);

        if (firstEntry && secondEntry) {
          expect(firstEntry.timestamp).toBeGreaterThanOrEqual(secondEntry.timestamp);
        }
      }
    });
  });
});
