export type Platform = 'chatgpt' | 'claude' | 'gemini' | 'perplexity';

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