# A7 Summary: Message Passing System Implementation

## Overview

Implemented complete message passing system between content scripts, background service worker, and UI components for chat data persistence. Content scrapers send `SAVE_CHAT` messages to the background script, which persists chats to `chrome.storage.local`. UI components reactively update when storage changes.

---

## Message Flow Diagram

```
┌─────────────────────┐     SAVE_CHAT      ┌─────────────────────┐
│   Content Script    │ ─────────────────► │   Service Worker    │
│  (ChatGPT/Claude/   │                    │   (background.js)   │
│      Gemini)        │                    │                     │
└─────────────────────┘                    └──────────┬──────────┘
                                                      │
                                                      │ chrome.storage.local.set()
                                                      ▼
                                           ┌─────────────────────┐
                                           │ chrome.storage.local│
                                           │   'chatvault_chats' │
                                           └──────────┬──────────┘
                                                      │
                                     storage.onChanged event
                                                      ▼
┌─────────────────────┐                    ┌─────────────────────┐
│   Popup / SidePanel │ ◄────────────────  │    Zustand Store    │
│      (React UI)     │   state update     │   (storage.ts)      │
└─────────────────────┘                    └─────────────────────┘
```

---

## Storage Schema

### Storage Key: `chatvault_chats`

```typescript
interface PersistedChat {
  id: string;           // Generated from URL hash
  title: string;        // Chat title from scraper
  platform: Platform;   // 'chatgpt' | 'claude' | 'gemini'
  url: string;          // Full URL of the chat
  messageCount: number; // Number of messages scraped
  createdAt: number;    // Timestamp when first saved
  updatedAt: number;    // Timestamp of last update
  isPinned: boolean;    // User pinned status (default: false)
  tags: string[];       // User tags (default: [])
  folderId?: string;    // Folder assignment (optional)
}
```

### Storage Key: `chatvault_folders`

```typescript
// Reserved for future use (Phase 4+)
interface Folder {
  id: string;
  name: string;
  icon?: string;
  chats: string[]; // Chat IDs
}
```

### Storage Key: `chatvault_settings`

```typescript
// Initialized on install
interface Settings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
}
```

---

## Chat Object Transformation Logic

### Input: SAVE_CHAT Payload (from content script)

```typescript
{
  type: 'SAVE_CHAT',
  payload: {
    platform: 'chatgpt' | 'claude' | 'gemini',
    title: string,
    messages: ScrapedMessage[], // { role, content, timestamp }
    url: string,
    updatedAt: number
  }
}
```

### Transformation: Payload → PersistedChat

```typescript
// In service-worker.ts handleSaveChat()
const persistedChat: PersistedChat = {
  id: generateChatId(payload.url),      // Hash of URL
  title: payload.title || 'Untitled Chat',
  platform: payload.platform,
  url: payload.url,
  messageCount: payload.messages.length, // Only count, not content
  createdAt: now,                        // Overwritten if updating existing
  updatedAt: payload.updatedAt || now,
  isPinned: false,                       // Default, preserved on update
  tags: [],                              // Default, preserved on update
  folderId: undefined,                   // Default, preserved on update
};
```

### Transformation: PersistedChat → Chat (UI)

```typescript
// In utils.ts persistedChatToChat()
const chat: Chat = {
  id: persisted.id,
  title: persisted.title,
  preview: `${persisted.messageCount} messages`, // Placeholder for Phase 4
  platform: persisted.platform,
  timestamp: persisted.updatedAt,
  folderId: persisted.folderId,
  isPinned: persisted.isPinned,
  tags: persisted.tags,
};
```

---

## Duplicate Detection Approach (URL-based)

### ID Generation

```typescript
function generateChatId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `chat_${Math.abs(hash).toString(36)}`;
}
```

### Deduplication Logic

1. Generate `chatId` from incoming URL
2. Search existing chats array for matching `id`
3. If found: **Update** existing chat (preserve user data: `createdAt`, `isPinned`, `tags`, `folderId`)
4. If not found: **Insert** new chat at beginning of array

---

## Error Handling Strategy

### Storage Operations

| Error Type | Detection | Response |
|------------|-----------|----------|
| Storage quota exceeded | Error message contains `QUOTA_BYTES` | Return `{ success: false, error: 'Storage quota exceeded...' }` |
| Invalid data | `!Array.isArray(updatedChats)` check | Abort write, preserve existing data |
| Chrome API unavailable | `typeof chrome === 'undefined'` | Graceful fallback to empty state |
| General errors | try/catch wrapper | Log error, return failure response |

### Message Handling

- All operations wrapped in try/catch
- Async handlers return `true` to keep message channel open
- Success/failure responses always sent back to content script
- All operations logged with `[ChatVault]` prefix

### UI Resilience

- Store initialized with empty array (not mock data)
- `isLoading` state for async operations
- Fallback to empty state if storage unavailable
- Storage listener safely ignores non-chat changes

---

## Testing Checklist

### Console Log Verification Steps

#### 1. Service Worker Initialization

```
# Navigate to chrome://extensions → ChatVault → "service worker" link
# In DevTools Console, verify on install:
[ChatVault] Extension Installed
[ChatVault] Initialized storage with empty chats/folders
```

#### 2. SAVE_CHAT Message Handling

```
# Navigate to any supported chat platform (ChatGPT, Claude, Gemini)
# Open DevTools Console on the chat page
# Should see scraper initialization:
[ChatVault] Initializing chatgpt scraper...

# When messages are scraped:
[ChatVault] ChatGPT: Scraped N messages

# In service worker console:
[ChatVault] Message received: SAVE_CHAT
[ChatVault] Received SAVE_CHAT: chatgpt <title>
[ChatVault] Added new chat: chat_xxxxx
[ChatVault] Storage updated. Total chats: 1
```

#### 3. Duplicate Update Handling

```
# Refresh the same chat page or continue conversation
# In service worker console:
[ChatVault] Message received: SAVE_CHAT
[ChatVault] Received SAVE_CHAT: chatgpt <title>
[ChatVault] Updated existing chat: chat_xxxxx  # Note: "Updated" not "Added"
[ChatVault] Storage updated. Total chats: 1    # Count unchanged
```

#### 4. UI Data Loading

```
# Open extension popup or sidepanel
# In popup DevTools Console:
[ChatVault] Loaded N chats from storage
```

#### 5. Reactive UI Updates

```
# With popup/sidepanel open, visit a new chat on supported platform
# In popup DevTools Console:
[ChatVault] Storage changed, updating store with N chats
# UI should automatically show the new chat without manual refresh
```

### Manual Verification

1. **Storage Inspection**: `chrome.storage.local.get('chatvault_chats', console.log)`
2. **PING/PONG Test**: `chrome.runtime.sendMessage({ type: 'PING' }, console.log)`
3. **Clear Storage**: `chrome.storage.local.remove('chatvault_chats')`

---

## Files Modified

| File | Changes |
|------|---------|
| `src/shared/types.ts` | Added `PersistedChat`, `STORAGE_KEYS`, `MessageType`, `SaveChatPayload`, `ExtensionMessage` |
| `src/background/service-worker.ts` | Added `SAVE_CHAT` handler, `generateChatId()`, `handleSaveChat()` |
| `src/shared/lib/utils.ts` | Added `persistedChatToChat()`, `persistedChatsToChats()` |
| `src/shared/lib/storage.ts` | Replaced mock data with chrome.storage.local integration, added `onChanged` listener |

---

## Known Limitations

1. **Message content not stored**: Only `messageCount` is saved (full content storage in Phase 4)
2. **Preview is placeholder**: Shows "N messages" instead of actual message preview
3. **Folders still use mock data**: Folder persistence deferred to future phase
4. **No retry mechanism**: Content scripts fire-and-forget; failed saves not retried
5. **10MB storage limit**: Chrome's `storage.local` quota; large chat histories may hit limit

---

## Build Verification

```
npx vite build --config Extension/vite.config.ts

✓ 2419 modules transformed
✓ built in 5.25s

Output:
  service-worker.js       2.02 kB
  content/chatgpt.js      1.60 kB
  content/claude.js       1.97 kB
  content/gemini.js       2.32 kB
  assets/popup-*.js       9.23 kB
  assets/sidepanel-*.js   4.40 kB
```
