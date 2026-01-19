import { supabase } from './supabase';
import { Chat } from '../types';
import { useStore } from './storage';

/**
 * PRD-56: Sync Service - Upload
 * 
 * Implements uploading local chats to Supabase cloud storage.
 * Includes single chat upload, bulk upload for initial sync,
 * and error tracking.
 */

export interface UploadResult {
  success: boolean;
  error?: string;
  chatId?: string;
}

export interface BulkUploadResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ chatId: string; error: string }>;
}

/**
 * Get the current authenticated user's ID
 * Returns null if user is not authenticated, throws on error
 */
async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Convert a Chat to the format expected by Supabase
 */
function chatToSupabaseFormat(chat: Chat) {
  return {
    id: chat.id,
    user_id: chat.id, // Will be replaced with actual user_id
    title: chat.title,
    platform: chat.platform,
    url: '', // URL not stored in current Chat type
    messages: [{ role: 'user', content: chat.preview, timestamp: chat.timestamp }], // Simplified messages
    tags: chat.tags,
    folder_id: chat.folderId ?? null,
    pinned: chat.isPinned,
    created_at: new Date(chat.timestamp).toISOString(),
    updated_at: new Date(chat.localUpdatedAt).toISOString(),
  };
}

/**
 * Upload a single chat to Supabase
 * @param chat - The chat to upload
 * @returns UploadResult with success status and optional error
 */
export async function uploadChat(chat: Chat): Promise<UploadResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
        chatId: chat.id,
      };
    }

    // Update sync state to syncing
    useStore.getState().setSyncState({ status: 'syncing' });

    const chatData = {
      ...chatToSupabaseFormat(chat),
      user_id: userId,
      synced_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('chats')
      .upsert(chatData, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('[ChatVault Sync] Failed to upload chat:', error);
      // Update sync state to error
      useStore.getState().setSyncState({
        status: 'error',
        error: error.message,
      });
      return {
        success: false,
        error: error.message,
        chatId: chat.id,
      };
    }

    // Update sync state to idle with lastSyncedAt
    useStore.getState().setSyncState({
      status: 'idle',
      lastSyncedAt: Date.now(),
    });

    return {
      success: true,
      chatId: chat.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ChatVault Sync] Unexpected error uploading chat:', error);

    // Update sync state to error
    useStore.getState().setSyncState({
      status: 'error',
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
      chatId: chat.id,
    };
  }
}

/**
 * Upload multiple chats to Supabase (bulk upload for initial sync)
 * @param chats - Array of chats to upload
 * @returns BulkUploadResult with counts and errors
 */
export async function bulkUploadChats(chats: Chat[]): Promise<BulkUploadResult> {
  const result: BulkUploadResult = {
    total: chats.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  // Update sync state to syncing
  useStore.getState().setSyncState({
    status: 'syncing',
    pendingChanges: chats.length,
  });

  for (const chat of chats) {
    const uploadResult = await uploadChat(chat);

    if (uploadResult.success) {
      result.successful++;
    } else {
      result.failed++;
      if (uploadResult.chatId && uploadResult.error) {
        result.errors.push({
          chatId: uploadResult.chatId,
          error: uploadResult.error,
        });
      }
    }

    // Update pending changes count
    const uploadedCount = result.successful + result.failed;
    useStore.getState().setSyncState({
      pendingChanges: chats.length - uploadedCount,
    });
  }

  // Update sync state based on results
  if (result.failed === 0) {
    useStore.getState().setSyncState({
      status: 'idle',
      lastSyncedAt: Date.now(),
      pendingChanges: 0,
      error: null,
    });
  } else if (result.successful === 0) {
    useStore.getState().setSyncState({
      status: 'error',
      error: `All ${result.failed} uploads failed`,
      pendingChanges: 0,
    });
  } else {
    useStore.getState().setSyncState({
      status: 'idle',
      lastSyncedAt: Date.now(),
      pendingChanges: 0,
      error: `${result.failed} of ${result.total} uploads failed`,
    });
  }

  return result;
}

/**
 * Upload all local chats that haven't been synced yet
 * @returns BulkUploadResult with counts and errors
 */
export async function uploadUnsyncedChats(): Promise<BulkUploadResult> {
  const chats = useStore.getState().chats;

  // Filter chats that haven't been synced or have local updates
  const unsyncedChats = chats.filter(chat => {
    return !chat.syncedAt || chat.localUpdatedAt > (chat.syncedAt ?? 0);
  });

  return bulkUploadChats(unsyncedChats);
}

/**
 * Track a chat save as a pending change
 * This should be called whenever a chat is saved/updated locally
 */
export function trackChatSave(chatId: string): void {
  const currentState = useStore.getState().syncState;
  useStore.getState().setSyncState({
    pendingChanges: currentState.pendingChanges + 1,
  });
}

/**
 * Clear tracked pending changes after successful sync
 */
export function clearPendingChanges(): void {
  useStore.getState().setSyncState({
    pendingChanges: 0,
  });
}
