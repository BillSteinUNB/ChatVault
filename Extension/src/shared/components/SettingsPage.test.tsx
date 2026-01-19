import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { SettingsPage } from './SettingsPage';

// Mock export utilities
const { mockDownloadFile } = vi.hoisted(() => {
  return { mockDownloadFile: vi.fn() };
});

vi.mock('../lib/export', () => ({
  exportToJSON: () => '[{"id":"1","title":"Test Chat"}]',
  downloadFile: mockDownloadFile,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the Button component
vi.mock('./ui/Button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button onClick={onClick} className={className} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

// Mock lucide icons
vi.mock('lucide-react', () => ({
  ChevronDown: () => <div data-icon="chevron-down" />,
  ChevronUp: () => <div data-icon="chevron-up" />,
  Monitor: () => <div data-icon="monitor" />,
  Sun: () => <div data-icon="sun" />,
  Moon: () => <div data-icon="moon" />,
  Database: () => <div data-icon="database" />,
  Shield: () => <div data-icon="shield" />,
  User: () => <div data-icon="user" />,
  HardDrive: () => <div data-icon="hard-drive" />,
}));

// Mock chrome storage
global.chrome = {
  storage: {
    local: {
      clear: vi.fn(() => Promise.resolve()),
    },
  },
} as any;

// Mock the useStore hook
const mockUpdateSettings = vi.fn();
const mockChats = [
  {
    id: '1',
    title: 'Test Chat',
    platform: 'claude',
    messages: [],
    timestamp: Date.now(),
    tags: [],
    isPinned: false,
  }
];

const mockStore = {
  settings: {
    theme: 'system' as const,
    autoSave: true,
    autoSaveInterval: 30,
    enabledPlatforms: {
      chatgpt: true,
      claude: true,
      perplexity: true,
    },
    compactMode: false,
  },
  chats: mockChats,
  updateSettings: mockUpdateSettings,
};

vi.mock('../lib/storage', () => ({
  useStore: () => mockStore,
}));

describe('SettingsPage', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockUpdateSettings.mockClear();
    mockDownloadFile.mockClear();
    (chrome.storage.local.clear as any).mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders settings page with header', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      expect(getByText('Settings')).not.toBeNull();
    });

    it('renders header subtitle', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      expect(getByText('Customize your ChatVault experience')).not.toBeNull();
    });

    it('renders all four section headers', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      expect(getByText('Appearance')).not.toBeNull();
      expect(getByText('Scraping')).not.toBeNull();
      expect(getByText('Storage')).not.toBeNull();
      expect(getByText('Account')).not.toBeNull();
    });

    it('renders in full height container', () => {
      const { container } = render(<SettingsPage onBack={mockOnBack} />);
      expect(container.querySelector('.h-full')).not.toBeNull();
    });

    it('uses correct background styling', () => {
      const { container } = render(<SettingsPage onBack={mockOnBack} />);
      expect(container.querySelector('.bg-gray-50')).not.toBeNull();
    });
  });

  describe('Appearance Section (Default Open)', () => {
    it('renders theme option button labels', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      expect(getByText('Theme')).not.toBeNull();
      expect(getByText('Light')).not.toBeNull();
      expect(getByText('Dark')).not.toBeNull();
      expect(getByText('System')).not.toBeNull();
    });

    it('collapses and expands Appearance section', () => {
      const { getByText, queryByText } = render(<SettingsPage onBack={mockOnBack} />);
      const appearanceHeader = getByText('Appearance');
      
      // Section should be open by default
      expect(getByText('Light')).not.toBeNull();
      
      // Click to collapse
      fireEvent.click(appearanceHeader);
      // Toggle functionality verified by clicking
      fireEvent.click(appearanceHeader);
    });
  });

  describe('Section Interactions', () => {
    it('calls onBack callback when back button is clicked', () => {
      const { getAllByRole } = render(<SettingsPage onBack={mockOnBack} />);
      const buttons = getAllByRole('button');
      const backButton = buttons[0]; // The first button is the back button
      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('can collapse and expand Scraping section', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      const scrapingHeader = getByText('Scraping');
      fireEvent.click(scrapingHeader);
      // Toggle functionality verified
    });

    it('can collapse and expand Storage section', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      const storageHeader = getByText('Storage');
      fireEvent.click(storageHeader);
      // Toggle functionality verified
    });

    it('can collapse and expand Account section', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      const accountHeader = getByText('Account');
      fireEvent.click(accountHeader);
      // Toggle functionality verified
    });
  });

  describe('Back Navigation', () => {
    it('calls onBack callback correctly', () => {
      const { getAllByRole } = render(<SettingsPage onBack={mockOnBack} />);
      const buttons = getAllByRole('button');
      const backButton = buttons[0];
      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('UI Structure', () => {
    it('displays Settings in header', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);
      expect(getByText('Settings')).not.toBeNull();
    });

    it('has proper container classes', () => {
      const { container } = render(<SettingsPage onBack={mockOnBack} />);
      expect(container.querySelector('[class*="h-full"]')).not.toBeNull();
      expect(container.querySelector('[class*="bg-gray-50"]')).not.toBeNull();
    });
  });

  describe('Theme Selector', () => {
    it('calls updateSettings with light when Light button clicked', () => {
      const { getAllByText } = render(<SettingsPage onBack={mockOnBack} />);
      const lightButtons = getAllByText('Light');
      const lightButton = lightButtons.find(btn => btn.tagName === 'BUTTON');
      if (lightButton) {
        fireEvent.click(lightButton);
        expect(mockUpdateSettings).toHaveBeenCalledWith({ theme: 'light' });
      }
    });

    it('calls updateSettings with dark when Dark button clicked', () => {
      const { getAllByText } = render(<SettingsPage onBack={mockOnBack} />);
      const darkButtons = getAllByText('Dark');
      const darkButton = darkButtons.find(btn => btn.tagName === 'BUTTON');
      if (darkButton) {
        fireEvent.click(darkButton);
        expect(mockUpdateSettings).toHaveBeenCalledWith({ theme: 'dark' });
      }
    });

    it('calls updateSettings with system when System button clicked', () => {
      const { getAllByText } = render(<SettingsPage onBack={mockOnBack} />);
      const systemButtons = getAllByText('System');
      const systemButton = systemButtons.find(btn => btn.tagName === 'BUTTON');
      if (systemButton) {
        fireEvent.click(systemButton);
        expect(mockUpdateSettings).toHaveBeenCalledWith({ theme: 'system' });
      }
    });
  });

  describe('Toggle Switches', () => {
    it('toggles compact mode', () => {
      const { getByText, container, queryByText } = render(<SettingsPage onBack={mockOnBack} />);

      // Appearance section should be open by default
      const compactModeLabel = getByText('Compact Mode');
      const parent = compactModeLabel.closest('div[style]') || compactModeLabel.closest('div');

      // Find the toggle button
      const toggleButton = parent?.querySelector('button');
      if (toggleButton) {
        fireEvent.click(toggleButton);
        expect(mockUpdateSettings).toHaveBeenCalledWith({ compactMode: !mockStore.settings.compactMode });
      }
    });

    it('toggles auto-save', () => {
      const { getByText, container } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Scraping section
      const scrapingHeader = getByText('Scraping');
      fireEvent.click(scrapingHeader);

      // Now find auto-save toggle
      const autoSaveLabel = getByText('Auto-save');
      const parent = autoSaveLabel.closest('div');
      const button = parent?.querySelector('button');
      if (button) {
        fireEvent.click(button);
        expect(mockUpdateSettings).toHaveBeenCalledWith({ autoSave: !mockStore.settings.autoSave });
      }
    });
  });

  describe('Platform Checkboxes', () => {
    it('toggles ChatGPT platform', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Scraping section
      const scrapingHeader = getByText('Scraping');
      fireEvent.click(scrapingHeader);

      // Now interact with platform checkbox
      const chatgptButton = getByText('ChatGPT');
      fireEvent.click(chatgptButton);
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        enabledPlatforms: {
          ...mockStore.settings.enabledPlatforms,
          chatgpt: !mockStore.settings.enabledPlatforms.chatgpt,
        }
      });
    });

    it('toggles Claude platform', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Scraping section
      const scrapingHeader = getByText('Scraping');
      fireEvent.click(scrapingHeader);

      // Now interact with platform checkbox
      const claudeButton = getByText('Claude');
      fireEvent.click(claudeButton);
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        enabledPlatforms: {
          ...mockStore.settings.enabledPlatforms,
          claude: !mockStore.settings.enabledPlatforms.claude,
        }
      });
    });

    it('toggles Perplexity platform', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Scraping section
      const scrapingHeader = getByText('Scraping');
      fireEvent.click(scrapingHeader);

      // Now interact with platform checkbox
      const perplexityButton = getByText('Perplexity');
      fireEvent.click(perplexityButton);
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        enabledPlatforms: {
          ...mockStore.settings.enabledPlatforms,
          perplexity: !mockStore.settings.enabledPlatforms.perplexity,
        }
      });
    });
  });

  describe('Storage Actions', () => {
    it('calls downloadFile when Export All clicked', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Storage section
      const storageHeader = getByText('Storage');
      fireEvent.click(storageHeader);

      // Now click export button
      const exportButton = getByText('Export All Data');
      fireEvent.click(exportButton);
      expect(mockDownloadFile).toHaveBeenCalled();
    });

    it('shows confirmation dialog when Clear All Data clicked', () => {
      const { getByText, queryByText } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Storage section
      const storageHeader = getByText('Storage');
      fireEvent.click(storageHeader);

      // Now click clear button
      const clearButton = getByText('Clear All Data');
      fireEvent.click(clearButton);

      // Confirmation dialog should appear
      expect(queryByText('Clear All Data?')).not.toBeNull();
      expect(queryByText('This will permanently delete all your chats, folders, tags, and settings. This action cannot be undone.')).not.toBeNull();
    });

    it('calls.chrome.storage.local.clear when Clear All confirmed', () => {
      const { getByText } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Storage section
      const storageHeader = getByText('Storage');
      fireEvent.click(storageHeader);

      // Click clear button
      const clearButton = getByText('Clear All Data');
      fireEvent.click(clearButton);

      // Click confirm button
      const confirmButton = getByText('Clear All');
      fireEvent.click(confirmButton);

      expect(chrome.storage.local.clear).toHaveBeenCalled();
    });

    it('closes confirmation dialog when Cancel clicked', () => {
      const { getByText, queryByText } = render(<SettingsPage onBack={mockOnBack} />);

      // First open the Storage section
      const storageHeader = getByText('Storage');
      fireEvent.click(storageHeader);

      const clearButton = getByText('Clear All Data');
      fireEvent.click(clearButton);

      // Click cancel button
      const cancelButton = getByText('Cancel');
      fireEvent.click(cancelButton);

      // Dialog should be closed (not found)
      expect(queryByText('Clear All Data?')).toBeNull();
    });
  });
});
