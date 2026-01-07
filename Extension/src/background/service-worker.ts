/// <reference types="chrome" />

import { PersistedChat, STORAGE_KEYS, SaveChatPayload, ExtensionMessage } from '../shared/types';

/**
 * Generate a unique ID from URL (simple hash for deduplication)
 */
function generateChatId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `chat_${Math.abs(hash).toString(36)}`;
}

/**
 * Handle SAVE_CHAT message from content scripts
 * Transforms ScrapedMessage[] to PersistedChat and stores in chrome.storage.local
 */
async function handleSaveChat(payload: SaveChatPayload): Promise<{ success: boolean; error?: string; chatId?: string }> {
  console.log('[ChatVault] Received SAVE_CHAT:', payload.platform, payload.title);
  
  try {
    const chatId = generateChatId(payload.url);
    const now = Date.now();
    
    // Create PersistedChat object (minimal data for Phase 3 - full messages in Phase 4)
    const persistedChat: PersistedChat = {
      id: chatId,
      title: payload.title || 'Untitled Chat',
      platform: payload.platform,
      url: payload.url,
      messageCount: payload.messages.length,
      createdAt: now, // Will be overwritten if existing chat
      updatedAt: payload.updatedAt || now,
      isPinned: false,
      tags: [],
      folderId: undefined,
    };
    
    // Read existing chats from storage
    const result = await chrome.storage.local.get(STORAGE_KEYS.CHATS);
    const existingChats: PersistedChat[] = (result[STORAGE_KEYS.CHATS] as PersistedChat[] | undefined) ?? [];
    
    // Check for duplicate by URL (chatId is derived from URL)
    const existingIndex = existingChats.findIndex(c => c.id === chatId);
    
    let updatedChats: PersistedChat[];
    if (existingIndex !== -1) {
      // Update existing chat - preserve createdAt, isPinned, tags, folderId
      const existing = existingChats[existingIndex];
      persistedChat.createdAt = existing.createdAt;
      persistedChat.isPinned = existing.isPinned;
      persistedChat.tags = existing.tags;
      persistedChat.folderId = existing.folderId;
      
      updatedChats = [...existingChats];
      updatedChats[existingIndex] = persistedChat;
      console.log('[ChatVault] Updated existing chat:', chatId);
    } else {
      // Add new chat at the beginning (most recent first)
      updatedChats = [persistedChat, ...existingChats];
      console.log('[ChatVault] Added new chat:', chatId);
    }
    
    // Validate storage before writing (guard against data loss)
    if (!Array.isArray(updatedChats)) {
      throw new Error('Invalid chats array - aborting to prevent data loss');
    }
    
    // Write to storage
    await chrome.storage.local.set({ [STORAGE_KEYS.CHATS]: updatedChats });
    
    console.log('[ChatVault] Storage updated. Total chats:', updatedChats.length);
    
    return { success: true, chatId };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ChatVault] SAVE_CHAT error:', errorMessage);
    
    // Check for quota exceeded
    if (errorMessage.includes('QUOTA_BYTES')) {
      return { success: false, error: 'Storage quota exceeded (10MB limit). Please delete some chats.' };
    }
    
    return { success: false, error: errorMessage };
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('[ChatVault] Extension Installed');
  // Initialize storage if needed
  chrome.storage.local.get(null, (result) => {
    if (Object.keys(result).length === 0) {
      chrome.storage.local.set({
        installedAt: Date.now(),
        settings: {
          theme: 'system',
          autoSave: true
        },
        [STORAGE_KEYS.CHATS]: [],
        [STORAGE_KEYS.FOLDERS]: [],
      });
      console.log('[ChatVault] Initialized storage with empty chats/folders');
    }
  });
});

// Allow opening side panel from action click if configured
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Message handling - supports PING, SAVE_CHAT
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  console.log('[ChatVault] Message received:', message.type);
  
  if (message.type === 'PING') {
    sendResponse({ type: 'PONG' });
    return false; // Synchronous response
  }
  
  if (message.type === 'SAVE_CHAT' && message.payload) {
    // Async handler - must return true to indicate we'll call sendResponse later
    handleSaveChat(message.payload as SaveChatPayload)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  }
  
  // Unknown message type
  console.warn('[ChatVault] Unknown message type:', message.type);
  return false;
});
