import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { Settings, DEFAULT_SETTINGS } from '../types';
import { useStore } from '../lib/storage';

// Mock window.matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock chrome storage
const mockStorage: { [key: string]: any } = {};
let setStorageListenerCallback: ((changes: any, areaName: string) => void) | null = null;

const mockUseStore = useStore as any;

// Mock useStore to return a controllable state
vi.mock('../lib/storage', () => ({
  useStore: vi.fn(),
  updateSettings: vi.fn(),
}));

describe('PRD-14: Theme Provider Component', () => {
  let mockSettings: Settings;
  let mockUpdateSettings: (updates: Partial<Settings>) => void;
  let mediaQueryMock: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Clear mock storage
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    setStorageListenerCallback = null;
    mockSettings = { ...DEFAULT_SETTINGS };
    mockUpdateSettings = vi.fn((updates) => {
      mockSettings = { ...mockSettings, ...updates };
    });

    // Create a mock MediaQueryList object
    mediaQueryMock = {
      matches: false,
      addEventListener: vi.fn((event: string, callback: Function) => {
        if (event === 'change') {
          // Simulate storing the callback so tests can trigger changes
          (mediaQueryMock as any)._callback = callback;
        }
      }),
      removeEventListener: vi.fn(),
    };

    // Reset window.matchMedia mock
    mockMatchMedia.mockReturnValue(mediaQueryMock);

    // Mock useStore to return our controlled state
    mockUseStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector({ settings: mockSettings, updateSettings: mockUpdateSettings });
      }
      return mockSettings;
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('provides theme context', () => {
    mockSettings.theme = 'system';
    mockMatchMedia.mockReturnValue({ ...mediaQueryMock });

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.theme).toBe('light'); // System default
    expect(typeof result.current.setTheme).toBe('function');
  });

  it('returns light theme when system setting is light', () => {
    mockSettings.theme = 'system';
    mediaQueryMock.matches = false;
    mockMatchMedia.mockReturnValue({ ...mediaQueryMock });

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
  });

  it('returns dark theme when system setting is dark', () => {
    mockSettings.theme = 'system';
    mediaQueryMock.matches = true;
    mockMatchMedia.mockReturnValue({ ...mediaQueryMock });

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
  });

  it('respects explicit light theme setting', () => {
    mockSettings.theme = 'light';

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
  });

  it('respects explicit dark theme setting', () => {
    mockSettings.theme = 'dark';

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
  });

  it('reacts to system theme changes', () => {
    mockSettings.theme = 'system';
    mediaQueryMock.matches = false;
    mockMatchMedia.mockReturnValue({ ...mediaQueryMock });

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');

    // Simulate system theme change
    act(() => {
      mediaQueryMock.matches = true;
      if ((mediaQueryMock as any)._callback) {
        (mediaQueryMock as any)._callback({ matches: true });
      }
    });

    // Theme should update to dark
    expect(result.current.theme).toBe('dark');
  });

  it('calls updateSettings when setTheme is invoked', () => {
    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(mockUpdateSettings).toHaveBeenCalledWith({ theme: 'dark' });
  });

  it('applies dark class to document root when theme is dark', () => {
    mockSettings.theme = 'dark';

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    renderHook(() => useTheme(), { wrapper });

    const root = document.documentElement;
    expect(root.classList.contains('dark')).toBe(true);
    expect(root.classList.contains('light')).toBe(false);
  });

  it('applies light class to document root when theme is light', () => {
    mockSettings.theme = 'light';

    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    renderHook(() => useTheme(), { wrapper });

    const root = document.documentElement;
    expect(root.classList.contains('light')).toBe(true);
    expect(root.classList.contains('dark')).toBe(false);
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
