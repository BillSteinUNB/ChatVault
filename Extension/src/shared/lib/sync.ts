import { supabase } from './supabase';
import { Chat, Platform } from '../types';
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

/**
 * PRD-57: Sync Service - Download
 *
 * Implements downloading cloud chats from Supabase and merging with local chats.
 * Handles new chats, updated chats, and deleted chats.
 */

export interface DownloadResult {
  success: boolean;
  error?: string;
  stats: {
    downloaded: number;
    updated: number;
    deleted: number;
    skipped: number;
  };
}

export interface SupabaseChat {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  url: string | null;
  messages: Array<{ role: string; content: string; timestamp?: number }>;
  tags: string[];
  folder_id: string | null;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Convert Supabase chat format to local Chat format
 */
function supabaseChatToChat(supabaseChat: SupabaseChat): Chat {
  // Extract timestamp from updated_at
  const updatedAt = new Date(supabaseChat.updated_at).getTime();
  const createdAt = new Date(supabaseChat.created_at).getTime();

  // Build preview from first user message or first message
  let preview = '';
  if (supabaseChat.messages && supabaseChat.messages.length > 0) {
    const firstUserMessage = supabaseChat.messages.find(m => m.role === 'user');
    preview = firstUserMessage?.content ?? supabaseChat.messages[0].content ?? '';
    // Truncate preview if too long
    if (preview.length > 200) {
      preview = preview.substring(0, 200) + '...';
    }
  }

  return {
    id: supabaseChat.id,
    title: supabaseChat.title,
    preview,
    platform: supabaseChat.platform as Platform,
    timestamp: createdAt,
    folderId: supabaseChat.folder_id ?? undefined,
    isPinned: supabaseChat.pinned,
    tags: supabaseChat.tags ?? [],
    syncedAt: updatedAt,
    localUpdatedAt: updatedAt,
  };
}

/**
 * Download all chats for the current user from Supabase
 * @returns Promise resolving to array of SupabaseChat or null on error
 */
async function downloadChatsFromCloud(): Promise<SupabaseChat[] | null> {
  try {
    const userId = await getUserId();

    if (!userId) {
      console.error('[ChatVault Sync] User not authenticated');
      return null;
    }

    // Update sync state to syncing
    useStore.getState().setSyncState({ status: 'syncing' });

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[ChatVault Sync] Failed to download chats:', error);
      useStore.getState().setSyncState({
        status: 'error',
        error: error.message,
      });
      return null;
    }

    return (data ?? []) as SupabaseChat[];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ChatVault Sync] Unexpected error downloading chats:', error);

    useStore.getState().setSyncState({
      status: 'error',
      error: errorMessage,
    });

    return null;
  }
}

/**
 * Merge cloud chats with local chats
 * Strategy:
 * - New cloud chats (not in local) → add locally
 * - Updated cloud chats (newer than local) → update local
 * - Deleted cloud chats (not in cloud but in local) → remove locally
 * - Older cloud chats → skip (keep local version)
 *
 * @param cloudChats - Chats downloaded from Supabase
 * @returns Promise resolving to merged Chat array
 */
async function mergeChats(cloudChats: SupabaseChat[]): Promise<Chat[]> {
  const localChats = useStore.getState().chats;

  // Create maps for efficient lookup
  const localChatsMap = new Map(localChats.map(chat => [chat.id, chat]));
  const cloudChatsMap = new Map(cloudChats.map(chat => [chat.id, chat]));

  const mergedChats: Chat[] = [];
  const chatsToDelete: string[] = [];

  const stats = {
    downloaded: 0,
    updated: 0,
    deleted: 0,
    skipped: 0,
  };

  // Process cloud chats
  for (const cloudChat of cloudChats) {
    const localChat = localChatsMap.get(cloudChat.id);

    if (!localChat) {
      // New cloud chat → add locally
      const newChat = supabaseChatToChat(cloudChat);
      mergedChats.push(newChat);
      stats.downloaded++;
    } else {
      const cloudUpdatedAt = new Date(cloudChat.updated_at).getTime();
      const localUpdatedAt = localChat.localUpdatedAt;

      if (cloudUpdatedAt > localUpdatedAt) {
        // Cloud chat is newer → update local
        const updatedChat = supabaseChatToChat(cloudChat);
        mergedChats.push(updatedChat);
        stats.updated++;
      } else {
        // Local chat is newer or same → keep local
        mergedChats.push(localChat);
        stats.skipped++;
      }
    }
  }

  // Find chats that exist locally but not in cloud (deleted from cloud)
  for (const [localChatId, localChat] of localChatsMap) {
    if (!cloudChatsMap.has(localChatId)) {
      // Chat was deleted from cloud → remove locally
      chatsToDelete.push(localChatId);
      stats.deleted++;
    }
  }

  // Delete chats that were removed from cloud
  if (chatsToDelete.length > 0) {
    const deleteChat = useStore.getState().deleteChat;
    for (const chatId of chatsToDelete) {
      deleteChat(chatId);
    }
  }

  // Update local storage with merged chats
  const store = useStore.getState();

  // Create the final chat list with all updates applied
  const finalChats = [...mergedChats];

  // Update the store with the merged chats
  store.setChats(finalChats);

  console.log('[ChatVault Sync] Merge stats:', stats);

  return mergedChats;
}

/**
 * Download chats from cloud and merge with local chats
 * This is the main entry point for the download sync process
 *
 * @returns Promise resolving to DownloadResult with success status and statistics
 */
export async function downloadChats(): Promise<DownloadResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
        stats: { downloaded: 0, updated: 0, deleted: 0, skipped: 0 },
      };
    }

    // Download chats from cloud
    const cloudChats = await downloadChatsFromCloud();

    if (!cloudChats) {
      return {
        success: false,
        error: 'Failed to download chats from cloud',
        stats: { downloaded: 0, updated: 0, deleted: 0, skipped: 0 },
      };
    }

    // Merge cloud chats with local chats
    const mergedChats = await mergeChats(cloudChats);

    // Calculate statistics
    const localChatsBefore = useStore.getState().chats.length;
    const stats = {
      downloaded: mergedChats.filter(c => !useStore.getState().chats.find(lc => lc.id === c.id)).length,
      updated: mergedChats.filter(c => {
        const local = useStore.getState().chats.find(lc => lc.id === c.id);
        return local && c.localUpdatedAt > local.localUpdatedAt;
      }).length,
      deleted: localChatsBefore - mergedChats.length,
      skipped: mergedChats.length - (mergedChats.length - localChatsBefore),
    };

    // Update sync state to idle with lastSyncedAt
    useStore.getState().setSyncState({
      status: 'idle',
      lastSyncedAt: Date.now(),
      pendingChanges: 0,
      error: null,
    });

    return {
      success: true,
      stats,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ChatVault Sync] Unexpected error during download sync:', error);

    useStore.getState().setSyncState({
      status: 'error',
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
      stats: { downloaded: 0, updated: 0, deleted: 0, skipped: 0 },
    };
  }
}

/**
 * Perform a full bidirectional sync:
 * 1. Upload local changes to cloud
 * 2. Download cloud changes and merge with local
 *
 * This ensures both local and cloud are up to date
 *
 * @returns Promise resolving to combined upload and download results
 */
export async function fullSync(): Promise<{
  upload: BulkUploadResult;
  download: DownloadResult;
}> {
  console.log('[ChatVault Sync] Starting full sync...');

  // First, upload any pending local changes
  const uploadResult = await uploadUnsyncedChats();

  // Then, download any changes from cloud
  const downloadResult = await downloadChats();

  console.log('[ChatVault Sync] Full sync complete:', { uploadResult, downloadResult });

  return {
    upload: uploadResult,
    download: downloadResult,
  };
}
