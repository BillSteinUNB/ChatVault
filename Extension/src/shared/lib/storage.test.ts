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
});
