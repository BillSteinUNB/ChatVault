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
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  chats: string[]; // Chat IDs
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  platforms: Record<Platform, boolean>;
}

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
  SETTINGS: 'chatvault_settings',
} as const;

/** Message types for chrome.runtime messaging */
export type MessageType = 'PING' | 'PONG' | 'SAVE_CHAT' | 'GET_CHATS' | 'GET_AUTH_STATUS' | 'SIGN_OUT';

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