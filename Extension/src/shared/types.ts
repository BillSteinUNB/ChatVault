export type ViewMode = 'all' | 'starred' | 'analytics';

export interface ViewState {
  mode: ViewMode;
  selectedFolderId?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  pendingChanges: number;
  error: string | null;
}

export type Platform = 'chatgpt' | 'claude' | 'perplexity';

export interface Chat {
  id: string;
  title: string;
  preview: string;
  platform: Platform;
  timestamp: number;
  folderId?: string;
  isPinned: boolean;
  tags: string[];
  syncedAt?: number;
  localUpdatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  autoSaveInterval: number;
  enabledPlatforms: {
    chatgpt: boolean;
    claude: boolean;
    perplexity: boolean;
  };
  compactMode: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  autoSave: true,
  autoSaveInterval: 30,
  enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
  compactMode: false,
};

export interface Stats {
  totalChats: number;
  totalFolders: number;
  mostUsedPlatform: Platform;
  savedTime: string;
}

/**
 * PersistedChat: Storage schema for chats saved to chrome.storage.local
 * Maps to UI Chat type via persistedChatToChat() utility
 */
export interface PersistedChat {
  id: string;
  title: string;
  platform: Platform;
  url: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  tags: string[];
  folderId?: string;
}

/** Storage key constants */
export const STORAGE_KEYS = {
  CHATS: 'chatvault_chats',
  FOLDERS: 'chatvault_folders',
  TAGS: 'chatvault_tags',
  SETTINGS: 'chatvault_settings',
} as const;

/** Message types for chrome.runtime messaging */
export type MessageType = 'PING' | 'PONG' | 'SAVE_CHAT' | 'GET_CHATS' | 'GET_AUTH_STATUS' | 'RESEND_VERIFICATION' | 'SIGN_OUT' | 'CHAT_LIMIT_REACHED';

export interface SaveChatPayload {
  platform: Platform;
  title: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
  url: string;
  updatedAt: number;
}

export interface ExtensionMessage {
  type: MessageType;
  payload?: SaveChatPayload | unknown;
}