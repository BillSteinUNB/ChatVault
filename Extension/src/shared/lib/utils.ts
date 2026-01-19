import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';
import { Chat, PersistedChat } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(timestamp, { addSuffix: true });
}

/**
 * Maps PersistedChat (storage schema) to Chat (UI schema)
 * PersistedChat has: url, messageCount, createdAt, updatedAt
 * Chat expects: preview, timestamp, syncedAt, localUpdatedAt
 */
export function persistedChatToChat(persisted: PersistedChat): Chat {
  return {
    id: persisted.id,
    title: persisted.title,
    preview: `${persisted.messageCount} messages`, // Placeholder until Phase 4 adds real preview
    platform: persisted.platform,
    timestamp: persisted.updatedAt,
    folderId: persisted.folderId,
    isPinned: persisted.isPinned,
    tags: persisted.tags,
    localUpdatedAt: persisted.updatedAt,
    syncedAt: undefined, // Will be populated when cloud sync is implemented
  };
}

/**
 * Maps array of PersistedChats to Chats for UI consumption
 */
export function persistedChatsToChats(persisted: PersistedChat[]): Chat[] {
  return persisted.map(persistedChatToChat);
}
