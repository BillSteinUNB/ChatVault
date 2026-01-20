# ChatVault Product Requirements Documents (PRDs)

This document contains granular PRDs optimized for AI development. Each PRD is a focused, single-purpose task that can be completed without context switching.

**How to use this document:**
- PRDs are numbered 01-78 in implementation order
- Complete PRDs in order (dependencies listed)
- Each PRD is self-contained with clear inputs/outputs
- Mark PRDs complete before moving to the next

---

# Table of Contents

## Folder System (PRD-01 to PRD-04)
1. [PRD-01: Folder Data Model & Storage](#prd-01-folder-data-model--storage)
2. [PRD-02: Create Folder Modal Component](#prd-02-create-folder-modal-component)
3. [PRD-03: Folder List Component](#prd-03-folder-list-component)
4. [PRD-04: Move Chat to Folder](#prd-04-move-chat-to-folder)

## Tag System (PRD-05 to PRD-08)
5. [PRD-05: Tag Data Model & Storage](#prd-05-tag-data-model--storage)
6. [PRD-06: Tag Input Component](#prd-06-tag-input-component)
7. [PRD-07: Tag Filter Component](#prd-07-tag-filter-component)
8. [PRD-08: Tag Display in Chat Item](#prd-08-tag-display-in-chat-item)

## Export Functionality (PRD-09 to PRD-12)
9. [PRD-09: Export Utility Functions](#prd-09-export-utility-functions)
10. [PRD-10: Export Menu Component](#prd-10-export-menu-component)
11. [PRD-11: Wire Up Export Button in SidePanel](#prd-11-wire-up-export-button-in-sidepanel)
12. [PRD-12: Export Option in Chat Context Menu](#prd-12-export-option-in-chat-context-menu)

## Settings Page (PRD-13 to PRD-17)
13. [PRD-13: Settings Data Model & Storage](#prd-13-settings-data-model--storage)
14. [PRD-14: Theme Provider Component](#prd-14-theme-provider-component)
15. [PRD-15: Settings Page Layout](#prd-15-settings-page-layout)
16. [PRD-16: Settings Controls Implementation](#prd-16-settings-controls-implementation)
17. [PRD-17: Wire Up Settings Button](#prd-17-wire-up-settings-button)

## Search Enhancement (PRD-18 to PRD-21)
18. [PRD-18: Full-Text Search Index](#prd-18-full-text-search-index)
19. [PRD-19: Search Operators Parser](#prd-19-search-operators-parser)
20. [PRD-20: Search Filters UI](#prd-20-search-filters-ui)
21. [PRD-21: Keyboard Shortcut for Search](#prd-21-keyboard-shortcut-for-search)

## Perplexity Scraper (PRD-22 to PRD-23)
22. [PRD-22: Perplexity DOM Analysis & Scraper](#prd-22-perplexity-dom-analysis--scraper)
23. [PRD-23: Perplexity Manifest & Integration](#prd-23-perplexity-manifest--integration)

## Fix Non-Functional UI (PRD-24 to PRD-27)
24. [PRD-24: View State Management](#prd-24-view-state-management)
25. [PRD-25: Nav Icons Functionality](#prd-25-nav-icons-functionality)
26. [PRD-26: Analytics View Component](#prd-26-analytics-view-component)
27. [PRD-27: Dashboard Button & Tooltips](#prd-27-dashboard-button--tooltips)

## Password Reset (PRD-28 to PRD-30)
28. [PRD-28: Forgot Password Page](#prd-28-forgot-password-page)
29. [PRD-29: Reset Password Page](#prd-29-reset-password-page)
30. [PRD-30: Auth Hook Updates](#prd-30-auth-hook-updates)

## Email Verification (PRD-31 to PRD-32)
31. [PRD-31: Verification Banner Component](#prd-31-verification-banner-component)
32. [PRD-32: Extension Auth Banner Update](#prd-32-extension-auth-banner-update)

## Account Deletion (PRD-33 to PRD-35)
33. [PRD-33: Delete Account Edge Function](#prd-33-delete-account-edge-function)
34. [PRD-34: Delete Account Modal](#prd-34-delete-account-modal)
35. [PRD-35: Data Export Before Deletion](#prd-35-data-export-before-deletion)

## Two-Factor Auth (PRD-36 to PRD-38)
36. [PRD-36: 2FA Enrollment UI](#prd-36-2fa-enrollment-ui)
37. [PRD-37: 2FA Login Challenge](#prd-37-2fa-login-challenge)
38. [PRD-38: Backup Codes Component](#prd-38-backup-codes-component)

## OAuth Social Login (PRD-39 to PRD-40)
39. [PRD-39: Social Login Buttons](#prd-39-social-login-buttons)
40. [PRD-40: OAuth Callback Handler](#prd-40-oauth-callback-handler)

## User Dashboard (PRD-41 to PRD-43)
41. [PRD-41: Dashboard Page Layout](#prd-41-dashboard-page-layout)
42. [PRD-42: Stats Cards Component](#prd-42-stats-cards-component)
43. [PRD-43: Recent Chats & Quick Actions](#prd-43-recent-chats--quick-actions)

## Settings Page - Web (PRD-44 to PRD-47)
44. [PRD-44: Web Settings Page Layout](#prd-44-web-settings-page-layout)
45. [PRD-45: Profile Section](#prd-45-profile-section)
46. [PRD-46: Security Section](#prd-46-security-section)
47. [PRD-47: Data & Privacy Section](#prd-47-data--privacy-section)

## Contact Form Backend (PRD-48 to PRD-49)
48. [PRD-48: Contact Edge Function](#prd-48-contact-edge-function)
49. [PRD-49: Connect Contact Form to Backend](#prd-49-connect-contact-form-to-backend)

## Billing/Subscription (PRD-50 to PRD-53)
50. [PRD-50: Subscription Database Schema](#prd-50-subscription-database-schema)
51. [PRD-51: Stripe Checkout Function](#prd-51-stripe-checkout-function)
52. [PRD-52: Stripe Webhook Handler](#prd-52-stripe-webhook-handler)
53. [PRD-53: Billing Page UI](#prd-53-billing-page-ui)

## Cloud Sync (PRD-54 to PRD-58)
54. [PRD-54: Sync State Types](#prd-54-sync-state-types)
55. [PRD-55: Supabase Chats Table](#prd-55-supabase-chats-table)
56. [PRD-56: Sync Service - Upload](#prd-56-sync-service---upload)
57. [PRD-57: Sync Service - Download](#prd-57-sync-service---download)
58. [PRD-58: Sync Status UI & Triggers](#prd-58-sync-status-ui--triggers)

## Tier Enforcement (PRD-59 to PRD-61)
59. [PRD-59: Tier Configuration](#prd-59-tier-configuration)
60. [PRD-60: Chat Limit Enforcement](#prd-60-chat-limit-enforcement)
61. [PRD-61: Usage Meter Component](#prd-61-usage-meter-component)

## Error Handling (PRD-62 to PRD-64)
62. [PRD-62: Error Types & Utilities](#prd-62-error-types--utilities)
63. [PRD-63: Error Boundary Components](#prd-63-error-boundary-components)
64. [PRD-64: Error Toast Component](#prd-64-error-toast-component)

## Onboarding Wizard (PRD-65 to PRD-67)
65. [PRD-65: Onboarding State & Hook](#prd-65-onboarding-state--hook)
66. [PRD-66: Onboarding Steps Components](#prd-66-onboarding-steps-components)
67. [PRD-67: Onboarding Wizard Page](#prd-67-onboarding-wizard-page)

## Accessibility (PRD-68 to PRD-71)
68. [PRD-68: ARIA Labels Audit](#prd-68-aria-labels-audit)
69. [PRD-69: Keyboard Navigation](#prd-69-keyboard-navigation)
70. [PRD-70: Focus Visible Styles](#prd-70-focus-visible-styles)
71. [PRD-71: Reduced Motion Support](#prd-71-reduced-motion-support)

## Unit Tests (PRD-72 to PRD-75)
72. [PRD-72: Test Framework Setup](#prd-72-test-framework-setup)
73. [PRD-73: Storage Utility Tests](#prd-73-storage-utility-tests)
74. [PRD-74: Export Utility Tests](#prd-74-export-utility-tests)
75. [PRD-75: Component Tests](#prd-75-component-tests)

## CI/CD Pipeline (PRD-76 to PRD-78)
76. [PRD-76: CI Workflow](#prd-76-ci-workflow)
77. [PRD-77: Web Deploy Workflow](#prd-77-web-deploy-workflow)
78. [PRD-78: Extension Build Workflow](#prd-78-extension-build-workflow)

---

- [x] PRD-01: Folder Data Model & Storage

# PRD-01: Folder Data Model & Storage

### Goal
Add folder data types and storage actions to the extension.

### Files to Modify
- `Extension/src/shared/types.ts`
- `Extension/src/shared/lib/storage.ts`

### Tasks
1. Add `Folder` interface to `types.ts`:
```typescript
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  createdAt: number;
  updatedAt: number;
}
```

2. Update `Chat` interface to add `folderId?: string`

3. Update `storage.ts` Zustand store:
   - Add `folders: Folder[]` to state
   - Add `addFolder(folder: Folder)` action
   - Add `updateFolder(id: string, updates: Partial<Folder>)` action
   - Add `deleteFolder(id: string)` action
   - Add `moveChatToFolder(chatId: string, folderId: string | null)` action

4. Add persistence: Load/save folders from `chrome.storage.local`

### Acceptance Criteria
- Folder interface exists in types.ts
- Chat interface has folderId field
- All folder CRUD actions work in storage
- Folders persist after browser restart

### Dependencies
None

---

- [x] PRD-02: Create Folder Modal Component

# PRD-02: Create Folder Modal Component

### Goal
Create a modal for creating new folders.

### Files to Create
- `Extension/src/shared/components/CreateFolderModal.tsx`

### Tasks
1. Create modal component with:
   - Text input for folder name
   - Optional color picker (6-8 preset colors)
   - Cancel and Create buttons
   - Form validation (name required, max 50 chars)

2. On submit:
   - Generate UUID for folder id
   - Call `addFolder` from storage
   - Close modal

### Component Props
```typescript
interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (folder: Folder) => void;
}
```

### Acceptance Criteria
- Modal opens/closes properly
- User can enter folder name
- User can select color
- Validation prevents empty names
- Folder is created on submit

### Dependencies
- PRD-01 (storage actions)

---

 - [x] PRD-03: Folder List Component

---

 - [x] PRD-04: Move Chat to Folder

# PRD-04: Move Chat to Folder

### Goal
Create a sidebar component displaying all folders.

### Files to Create
- `Extension/src/shared/components/FolderList.tsx`

### Files to Modify
- `Extension/src/shared/components/SidePanel.tsx`

### Tasks
1. Create `FolderList` component:
   - List all folders from storage
   - Show folder name with color indicator
   - Show chat count per folder
   - "All Chats" option at top
   - Click to filter by folder

2. Add context menu (right-click) on folder:
   - Rename folder
   - Change color
   - Delete folder

3. Integrate into SidePanel:
   - Add FolderList above chat list
   - Wire up "New Folder" button to open CreateFolderModal

### Acceptance Criteria
- All folders display in list
- Clicking folder filters chat list
- "All Chats" shows everything
- Context menu works
- New Folder button opens modal

### Dependencies
- PRD-01, PRD-02

---

- [x] PRD-04: Move Chat to Folder

# PRD-04: Move Chat to Folder

### Goal
Allow users to move chats into folders.

### Files to Create
- `Extension/src/shared/components/MoveToFolderMenu.tsx`

### Files to Modify
- `Extension/src/shared/components/ChatItem.tsx`

### Tasks
1. Create `MoveToFolderMenu` dropdown:
   - List all folders
   - "No Folder" option to remove from folder
   - Checkmark on current folder

2. Add to ChatItem:
   - Folder icon button or menu option
   - On click, show MoveToFolderMenu
   - Display folder badge if chat is in folder

3. Update ChatList filtering:
   - When a folder is selected, only show chats in that folder

### Acceptance Criteria
- User can move chat to folder via menu
- User can remove chat from folder
- Folder badge shows on chat item
- Folder filtering works correctly

### Dependencies
- PRD-01, PRD-03

---

- [x] PRD-05: Tag Data Model & Storage

# PRD-05: Tag Data Model & Storage

### Goal
Add tag data types and storage actions.

### Files to Modify
- `Extension/src/shared/types.ts`
- `Extension/src/shared/lib/storage.ts`

### Tasks
1. Add `Tag` interface to `types.ts`:
```typescript
export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}
```

2. Update storage.ts:
   - Add `tags: Tag[]` to state
   - Add `addTag(tag: Tag)` action
   - Add `updateTag(id: string, updates: Partial<Tag>)` action
   - Add `deleteTag(id: string)` action (also removes from all chats)
   - Add `addTagToChat(chatId: string, tagId: string)` action
   - Add `removeTagFromChat(chatId: string, tagId: string)` action

3. Persist tags to `chrome.storage.local`

### Acceptance Criteria
- Tag interface exists
- All tag CRUD actions work
- Tags persist after restart

### Dependencies
None

---

- [x] PRD-06: Tag Input Component

# PRD-06: Tag Input Component

### Goal
Create autocomplete input for adding tags to chats.

### Files to Create
- `Extension/src/shared/components/TagInput.tsx`

### Tasks
1. Create component with:
   - Text input field
   - Autocomplete dropdown showing matching tags
   - Option to create new tag if no match
   - Display selected tags as removable chips

2. Features:
   - Type to filter existing tags
   - Press Enter or click to add tag
   - Click X on chip to remove tag
   - New tags get random color from preset palette

### Component Props
```typescript
interface TagInputProps {
  chatId: string;
  selectedTags: string[]; // tag IDs
  onTagsChange: (tagIds: string[]) => void;
}
```

### Acceptance Criteria
- Autocomplete shows matching tags
- Can create new tags inline
- Tags display as chips
- Can remove tags by clicking X

### Dependencies
- PRD-05

---

- [x] PRD-07: Tag Filter Component

# PRD-07: Tag Filter Component

### Goal
Create filter UI for filtering chats by tags.

### Files to Create
- `Extension/src/shared/components/TagFilter.tsx`

### Files to Modify
- `Extension/src/shared/components/SidePanel.tsx`

### Tasks
1. Create `TagFilter` component:
   - Show all tags as clickable chips
   - Multi-select (can filter by multiple tags)
   - Show count of chats per tag
   - "Clear all" button

2. Integrate into SidePanel:
   - Add below search bar
   - Update ChatList to filter by selected tags
   - Use AND logic (chat must have all selected tags)

### Acceptance Criteria
- All tags display as filter chips
- Can select multiple tags
- Chat list filters correctly
- Clear all resets filter

### Dependencies
- PRD-05, PRD-06

---

- [x] PRD-08: Tag Display in Chat Item

# PRD-08: Tag Display in Chat Item

### Goal
Show tags on chat items and add ability to edit.

### Files to Modify
- `Extension/src/shared/components/ChatItem.tsx`

### Tasks
1. Display tags below chat title:
   - Show up to 3 tags as small colored chips
   - "+N more" if more than 3

2. Add tag edit trigger:
   - Small "+" button to add tags
   - Click opens TagInput in popover/modal

3. Style tags to match folder colors for consistency

### Acceptance Criteria
- Tags display on chat items
- Can add/remove tags from chat item
- Overflow handled gracefully

### Dependencies
- PRD-05, PRD-06

---

 - [x] PRD-09: Export Utility Functions

# PRD-09: Export Utility Functions

### Goal
Create pure utility functions for exporting chats to different formats.

### Files to Create
- `Extension/src/shared/lib/export.ts`

### Tasks
1. Create `exportToJSON(chats: Chat[]): string`:
   - Format chat data as pretty-printed JSON
   - Include all metadata (tags, folder, timestamps)

2. Create `exportToMarkdown(chat: Chat): string`:
   - Format single chat as markdown
   - Header with title, platform, date, URL
   - Each message as section with role header
   - Preserve code blocks

3. Create `downloadFile(content: string, filename: string, mimeType: string)`:
   - Create blob from content
   - Create download link and click it
   - Clean up

### Example Markdown Output
```markdown
# Chat Title
**Platform:** Claude | **Date:** 2024-01-15 | **URL:** [link](url)

---

## User
What is TypeScript?

## Assistant
TypeScript is a typed superset of JavaScript...
```

### Acceptance Criteria
- JSON export includes all chat data
- Markdown is properly formatted
- Download function works in extension context

### Dependencies
None

---

- [x] PRD-10: Export Menu Component

# PRD-10: Export Menu Component

### Goal
Create dropdown menu for export options.

### Files to Create
- `Extension/src/shared/components/ExportMenu.tsx`

### Tasks
1. Create dropdown with options:
   - Export as JSON
   - Export as Markdown
   - Export all chats (JSON)

2. Handle single chat vs bulk export:
   - Single chat: use passed chat prop
   - All chats: get from storage

3. Generate appropriate filenames:
   - Single: `{chat-title}-{date}.{ext}`
   - Bulk: `chatvault-backup-{date}.json`

### Component Props
```typescript
interface ExportMenuProps {
  chat?: Chat; // If provided, export single chat
  onExport?: () => void;
}
```

### Acceptance Criteria
- Menu shows export options
- Single chat export works
- Bulk export works
- Files download with correct names

### Dependencies
- PRD-09

---

- [x] PRD-11: Wire Up Export Button in SidePanel

# PRD-11: Wire Up Export Button in SidePanel

### Goal
Connect the existing Export button to functionality.

### Files to Modify
- `Extension/src/shared/components/SidePanel.tsx`

### Tasks
1. Import ExportMenu component
2. Replace non-functional Export button with ExportMenu
3. When no chat selected, show "Export All" option
4. When chat selected, show single chat options

### Acceptance Criteria
- Export button in SidePanel works
- Can export all chats
- Can export selected chat

### Dependencies
- PRD-10

---

- [x] PRD-12: Export Option in Chat Context Menu

# PRD-12: Export Option in Chat Context Menu

### Goal
Add export option to individual chat item menu.

### Files to Modify
- `Extension/src/shared/components/ChatItem.tsx`

### Tasks
1. Add "Export" option to chat item dropdown/context menu
2. Sub-menu with format options (JSON, Markdown)
3. On click, trigger export for that chat

### Acceptance Criteria
- Export option appears in chat menu
- Can export individual chat from menu
- Both formats available

### Dependencies
- PRD-09, PRD-10

---

- [x] PRD-13: Settings Data Model & Storage

# PRD-13: Settings Data Model & Storage

### Goal
Add settings interface and storage.

### Files to Modify
- `Extension/src/shared/types.ts`
- `Extension/src/shared/lib/storage.ts`

### Tasks
1. Add `Settings` interface:
```typescript
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
```

2. Add default settings constant:
```typescript
export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  autoSave: true,
  autoSaveInterval: 30,
  enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
  compactMode: false,
};
```

3. Add to storage:
   - `settings: Settings` state
   - `updateSettings(updates: Partial<Settings>)` action
   - Persist to chrome.storage.local

### Acceptance Criteria
- Settings interface exists
- Default settings defined
- Settings persist after restart

### Dependencies
None

---

- [x] PRD-14: Theme Provider Component

# PRD-14: Theme Provider Component

### Goal
Create theme context and provider for dark/light mode.

### Files to Create
- `Extension/src/shared/components/ThemeProvider.tsx`

### Files to Modify
- `Extension/src/sidepanel/main.tsx`
- `Extension/src/popup/main.tsx`

### Tasks
1. Create ThemeProvider:
   - Read theme from settings
   - Handle 'system' preference using matchMedia
   - Apply theme class to document root
   - Provide theme context

2. Create useTheme hook:
   - Returns current theme
   - Returns setTheme function

3. Wrap app in ThemeProvider

4. Update CSS/Tailwind for dark mode support

### Acceptance Criteria
- Theme context available throughout app
- System preference detected
- Theme applies to UI
- Theme persists

### Dependencies
- PRD-13

---

- [x] PRD-15: Settings Page Layout

# PRD-15: Settings Page Layout

### Goal
Create the settings page component with sections.

### Files to Create
- `Extension/src/shared/components/SettingsPage.tsx`

### Tasks
1. Create settings page with sections:
   - Header with back button
   - Appearance section
   - Scraping section
   - Storage section
   - Account section (show if logged in)

2. Each section as collapsible card or simple list

3. Navigation: Add route or view state to show settings

### Layout Structure
```
Settings
├── Appearance
│   ├── Theme: [Light] [Dark] [System]
│   └── Compact Mode: [Toggle]
├── Scraping
│   ├── Auto-save: [Toggle]
│   └── Platforms: [ChatGPT] [Claude] [Perplexity]
├── Storage
│   ├── Usage: [X MB / 10 MB]
│   ├── [Export All Data]
│   └── [Clear All Data]
└── Account (if logged in)
    ├── Email: user@example.com
    ├── Tier: Hobbyist
    └── [Sign Out]
```

### Acceptance Criteria
- Settings page renders
- All sections display
- Back navigation works

### Dependencies
- PRD-13, PRD-14

---

- [x] PRD-16: Settings Controls Implementation

# PRD-16: Settings Controls Implementation

### Goal
Make all settings controls functional.

### Files to Modify
- `Extension/src/shared/components/SettingsPage.tsx`

### Tasks
1. Theme selector:
   - Three buttons: Light, Dark, System
   - Highlight active selection
   - Call updateSettings on change

2. Toggle switches:
   - Auto-save toggle
   - Compact mode toggle
   - Platform toggles

3. Storage section:
   - Calculate storage usage from chats
   - Export button → call bulk export
   - Clear data button → confirmation dialog → clear storage

### Acceptance Criteria
- Theme changes immediately
- Toggles update settings
- Storage usage shows correctly
- Clear data works with confirmation

### Dependencies
- PRD-15, PRD-09 (for export)

---

- [x] PRD-17: Wire Up Settings Button

# PRD-17: Wire Up Settings Button

### Goal
Connect settings button in Popup to settings page.

### Files to Modify
- `Extension/src/shared/components/Popup.tsx`
- `Extension/src/sidepanel/main.tsx`

### Tasks
1. Add view state: `'main' | 'settings'`

2. Settings button onClick:
   - In Popup: open sidepanel with settings view
   - In SidePanel: switch to settings view

3. Add back button to return from settings

### Acceptance Criteria
- Settings button opens settings
- Can navigate back to main view
- Works in both popup and sidepanel

### Dependencies
- PRD-15

---

- [x] PRD-18: Full-Text Search Index

# PRD-18: Full-Text Search Index

### Goal
Create search index for fast full-text search.

### Files to Create
- `Extension/src/shared/lib/search.ts`

### Files to Modify
- `Extension/src/shared/lib/storage.ts`

### Tasks
1. Create search index structure:
```typescript
interface SearchIndexEntry {
  chatId: string;
  title: string;
  content: string; // All messages concatenated
  platform: string;
  tags: string[];
  folderId: string | null;
  timestamp: number;
}
```

2. Create `buildSearchIndex(chats: Chat[]): SearchIndexEntry[]`

3. Create `searchChats(query: string, index: SearchIndexEntry[]): string[]`:
   - Returns matching chat IDs
   - Case-insensitive search
   - Search in title and content

4. Integrate with storage:
   - Rebuild index when chats change
   - Store index in memory (not persisted)

### Acceptance Criteria
- Search index builds from chats
- Full-text search finds matches in content
- Search is case-insensitive

### Dependencies
None

---

- [x] PRD-19: Search Operators Parser

# PRD-19: Search Operators Parser

### Goal
Parse search operators like `platform:claude` and `tag:work`.

### Files to Modify
- `Extension/src/shared/lib/search.ts`

### Tasks
1. Create operator parser:
```typescript
interface ParsedQuery {
  text: string; // Free text portion
  operators: {
    platform?: string;
    tag?: string;
    folder?: string;
    before?: Date;
    after?: Date;
  };
}

function parseSearchQuery(query: string): ParsedQuery
```

2. Supported operators:
   - `platform:claude`
   - `tag:work`
   - `folder:projects`
   - `before:2024-01-15`
   - `after:2024-01-01`
   - `"exact phrase"`

3. Update search function to use parsed operators

### Acceptance Criteria
- Operators are parsed correctly
- Free text extracted separately
- Invalid operators ignored gracefully

### Dependencies
- PRD-18

---

- [x] PRD-20: Search Filters UI

# PRD-20: Search Filters UI

### Goal
Add visual date range and platform filters.

### Files to Create
- `Extension/src/shared/components/SearchFilters.tsx`

### Files to Modify
- `Extension/src/shared/components/SidePanel.tsx`

### Tasks
1. Create expandable filter panel:
   - Date range picker (from/to)
   - Platform checkboxes
   - Apply/Clear buttons

2. Show filter panel below search bar when expanded

3. Connect filters to search:
   - Combine with text query
   - Update results on filter change

### Acceptance Criteria
- Filter panel expands/collapses
- Date range filter works
- Platform filter works
- Filters combine with text search

### Dependencies
- PRD-18, PRD-19

---

- [x] PRD-21: Keyboard Shortcut for Search

# PRD-21: Keyboard Shortcut for Search

### Goal
Make Cmd+K / Ctrl+K focus search globally.

### Files to Modify
- `Extension/src/shared/components/SearchBar.tsx`
- `Extension/src/sidepanel/main.tsx`

### Tasks
1. Add global keyboard listener:
   - Cmd+K (Mac) / Ctrl+K (Windows)
   - Focus search input
   - Prevent default browser behavior

2. Add visual hint showing shortcut (already displayed, make functional)

3. Escape key to blur search

### Acceptance Criteria
- Cmd/Ctrl+K focuses search
- Works from anywhere in extension
- Escape unfocuses

### Dependencies
None

---

- [x] PRD-22: Perplexity DOM Analysis & Scraper

# PRD-22: Perplexity DOM Analysis & Scraper

### Goal
Implement scraper for Perplexity AI conversations.

### Files to Create
- `Extension/src/content/perplexity.ts`

### Files to Modify
- `Extension/vite.config.ts` (add entry point)

### Tasks
1. Analyze Perplexity DOM structure:
   - Thread container selector
   - User query elements
   - AI response elements
   - Source citations
   - Follow-up suggestions

2. Create PerplexityScraper class:
```typescript
import { BaseScraper } from './base-scraper';

export class PerplexityScraper extends BaseScraper {
  platform = 'perplexity' as const;

  protected getThreadContainer(): Element | null;
  protected getMessages(): ScrapedMessage[];
  protected getChatTitle(): string;
  protected getChatUrl(): string;
}
```

3. Handle Perplexity-specific features:
   - Source citations (preserve as references)
   - Follow-up questions
   - Dynamic content loading

4. Add entry point in vite.config.ts

### Acceptance Criteria
- Scraper detects Perplexity conversations
- User queries extracted
- AI responses extracted
- Source citations preserved
- Title extracted from thread

### Dependencies
None

---

- [x] PRD-23: Perplexity Manifest & Integration

# PRD-23: Perplexity Manifest & Integration

### Goal
Ensure manifest and config support Perplexity.

### Files to Modify
- `Extension/public/manifest.json`
- `Extension/src/shared/constants.ts`

### Tasks
1. Verify manifest has Perplexity content script:
```json
{
  "content_scripts": [{
    "matches": ["https://www.perplexity.ai/*"],
    "js": ["content/perplexity.js"]
  }]
}
```

2. Verify PLATFORM_CONFIG includes perplexity:
```typescript
export const PLATFORM_CONFIG = {
  perplexity: {
    name: 'Perplexity',
    color: '#20B2AA',
    icon: '🔍',
    urlPattern: /perplexity\.ai/
  }
};
```

3. Add Perplexity icon to chat list display

### Acceptance Criteria
- Extension runs on Perplexity pages
- Perplexity appears in platform filter
- Perplexity chats show correct icon

### Dependencies
- PRD-22

---

- [x] PRD-24: View State Management

# PRD-24: View State Management

### Goal
Add view state to switch between different views.

### Files to Modify
- `Extension/src/shared/lib/storage.ts`
- `Extension/src/shared/types.ts`

### Tasks
1. Add view types:
```typescript
type ViewMode = 'all' | 'starred' | 'analytics';

interface ViewState {
  mode: ViewMode;
  selectedFolderId?: string;
}
```

2. Add to storage:
   - `viewState: ViewState`
   - `setViewMode(mode: ViewMode)` action
   - `setSelectedFolder(folderId: string | null)` action

### Acceptance Criteria
- View state tracked in storage
- Can switch between view modes
- Selected folder tracked

### Dependencies
None

---

- [x] PRD-25: Nav Icons Functionality

# PRD-25: Nav Icons Functionality

### Goal
Wire up navigation icons in SidePanel.

### Files to Modify
- `Extension/src/shared/components/SidePanel.tsx`
- `Extension/src/shared/components/NavItem.tsx`

### Tasks
1. Update NavItem:
   - Add `active` prop for styling
   - Add `onClick` handler
   - Add tooltip

2. Wire up nav icons:
   - Home icon → setViewMode('all')
   - Star icon → setViewMode('starred'), filter to pinned
   - Chart icon → setViewMode('analytics')

3. Update ChatList rendering based on viewMode

### Acceptance Criteria
- Clicking Home shows all chats
- Clicking Star shows only pinned chats
- Active nav item highlighted
- Tooltips show on hover

### Dependencies
- PRD-24

---

- [x] PRD-26: Analytics View Component

# PRD-26: Analytics View Component

### Goal
Create simple analytics dashboard.

### Files to Create
- `Extension/src/shared/components/AnalyticsView.tsx`

### Tasks
1. Create stats display:
   - Total chats count
   - Chats per platform (simple bar or list)
   - Chats this week/month
   - Most used tags (top 5)

2. Simple styling matching existing UI

3. Show when viewMode === 'analytics'

### Acceptance Criteria
- Analytics view displays
- Shows correct chat counts
- Shows platform breakdown
- Shows popular tags

### Dependencies
- PRD-24, PRD-25

---

- [x] PRD-27: Dashboard Button & Tooltips

# PRD-27: Dashboard Button & Tooltips

### Goal
Wire up View Dashboard button and add tooltips.

### Files to Modify
- `Extension/src/shared/components/Popup.tsx`

### Tasks
1. View Dashboard button:
   - Open web app in new tab: `chrome.tabs.create({ url: 'https://chatvault.app/dashboard' })`
   - Or open sidepanel if preferred

2. Add tooltips to all icon buttons:
   - Settings → "Settings"
   - Any other icon buttons

### Acceptance Criteria
- Dashboard button opens web app
- All buttons have tooltips

### Dependencies
None

---

- [x] PRD-28: Forgot Password Page

# PRD-28: Forgot Password Page

### Goal
Create forgot password request page.

### Files to Create
- `Web/pages/ForgotPassword.tsx`

### Files to Modify
- `Web/App.tsx` (add route)
- `Web/pages/Login.tsx` (add link)

### Tasks
1. Create page with:
   - Email input field
   - Submit button
   - Success message after submission
   - Back to login link

2. On submit:
```typescript
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
});
```

3. Add route: `/forgot-password`

4. Add link to Login page: "Forgot password?"

### Acceptance Criteria
- Page renders at /forgot-password
- Can enter email and submit
- Shows success message
- Link on login page works

### Dependencies
None

---

- [x] PRD-29: Reset Password Page

# PRD-29: Reset Password Page

### Goal
Create page to set new password after clicking email link.

### Files to Create
- `Web/pages/ResetPassword.tsx`

### Files to Modify
- `Web/App.tsx` (add route)

### Tasks
1. Create page with:
   - New password input
   - Confirm password input
   - Password requirements hint
   - Submit button
   - Error/success messages

2. Validation:
   - Minimum 8 characters
   - Passwords must match

3. On submit:
```typescript
await supabase.auth.updateUser({ password: newPassword });
// Redirect to login on success
```

4. Add route: `/reset-password`

### Acceptance Criteria
- Page renders at /reset-password
- Password validation works
- Confirmation must match
- Password updates successfully
- Redirects to login after

### Dependencies
- PRD-28

---

- [x] PRD-30: Auth Hook Updates

# PRD-30: Auth Hook Updates

### Goal
Add reset password methods to useAuth hook.

### Files to Modify
- `Web/hooks/useAuth.ts`

### Tasks
1. Add methods:
```typescript
const requestPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  return { error };
};

const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error };
};
```

2. Return methods from hook

### Acceptance Criteria
- requestPasswordReset method works
- updatePassword method works
- Methods return errors properly

### Dependencies
None

---

- [x] PRD-31: Verification Banner Component

# PRD-31: Verification Banner Component

### Goal
Show banner prompting unverified users to verify email.

### Files to Create
- `Web/components/VerificationBanner.tsx`

### Files to Modify
- `Web/App.tsx` or layout component

### Tasks
1. Create banner:
   - Yellow/warning styling
   - Message: "Please verify your email address"
   - Resend verification button
   - Dismiss button (dismisses for session)

2. Check verification status:
```typescript
const isVerified = user?.email_confirmed_at != null;
```

3. Resend verification:
```typescript
await supabase.auth.resend({ type: 'signup', email: user.email });
```

4. Show banner when logged in but not verified

### Acceptance Criteria
- Banner shows for unverified users
- Can resend verification email
- Can dismiss banner
- Verified users don't see banner

### Dependencies
None

---

- [x] PRD-32: Extension Auth Banner Update

# PRD-32: Extension Auth Banner Update

### Goal
Show verification status in extension.

### Files to Modify
- `Extension/src/shared/components/AuthBanner.tsx`

### Tasks
1. Add verification status display:
   - If not verified, show warning icon and "Verify email" message
   - If verified, show checkmark

2. Add resend button for unverified users

3. Update styling to indicate verification state

### Acceptance Criteria
- Shows verification status
- Can resend from extension
- Clear visual difference verified vs not

### Dependencies
None

---

- [x] PRD-33: Delete Account Edge Function

# PRD-33: Delete Account Edge Function

### Goal
Create secure backend function for account deletion.

### Files to Create
- `supabase/functions/delete-account/index.ts`

### Tasks
1. Create Supabase edge function:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Get user from auth header
  // Delete user's chats
  // Delete user's profile
  // Delete auth user
});
```

2. Ensure cascading deletes in schema

### Acceptance Criteria
- Function deletes all user data
- Requires authentication
- Returns success/error status

### Dependencies
None

---

- [x] PRD-34: Delete Account Modal

# PRD-34: Delete Account Modal

### Goal
Create confirmation modal for account deletion.

### Files to Create
- `Web/components/DeleteAccountModal.tsx`

### Tasks
1. Create modal with:
   - Warning message about permanent deletion
   - List what will be deleted
   - Input requiring user to type "DELETE" to confirm
   - Cancel and Delete buttons
   - Delete button disabled until "DELETE" typed

2. On confirm:
   - Show loading state
   - Call edge function
   - Clear local storage
   - Redirect to home

### Acceptance Criteria
- Modal shows with warnings
- Must type DELETE to enable button
- Account deleted on confirm
- User logged out and redirected

### Dependencies
- PRD-33

---

- [x] PRD-35: Data Export Before Deletion

# PRD-35: Data Export Before Deletion

### Goal
Allow users to export data before deleting account.

### Files to Modify
- `Web/components/DeleteAccountModal.tsx`

### Tasks
1. Add "Download my data" button to modal
2. Export includes:
   - All chats (JSON)
   - Profile data
   - Tags and folders
3. Use existing export utilities or create web version

### Acceptance Criteria
- Can download data from deletion modal
- Export includes all user data
- Works before deletion is confirmed

### Dependencies
- PRD-34

---

- [x] PRD-36: 2FA Enrollment UI

# PRD-36: 2FA Enrollment UI

### Goal
Create UI for enabling 2FA with QR code.

### Files to Create
- `Web/components/Enable2FAModal.tsx`

### Tasks
1. Create modal with steps:
   - Step 1: Explain 2FA, show QR code
   - Step 2: Enter verification code
   - Step 3: Show backup codes

2. Supabase MFA enrollment:
```typescript
// Start enrollment
const { data } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
// data.totp.qr_code - QR code data URL
// data.totp.secret - Manual entry code

// Verify enrollment
await supabase.auth.mfa.challengeAndVerify({ factorId: data.id, code: userCode });
```

3. Display QR code using data URL

### Acceptance Criteria
- QR code displays correctly
- Manual secret shown for backup
- Verification code required
- 2FA enabled after verification

### Dependencies
None

---

- [x] PRD-37: 2FA Login Challenge

# PRD-37: 2FA Login Challenge

### Goal
Handle 2FA challenge during login.

### Files to Create
- `Web/components/TwoFactorChallenge.tsx`

### Files to Modify
- `Web/pages/Login.tsx`

### Tasks
1. Create challenge component:
   - 6-digit code input
   - Submit button
   - "Use backup code" link

2. Update login flow:
   - After password auth, check if MFA required
   - If yes, show TwoFactorChallenge
   - Complete MFA verification

```typescript
// Check for MFA
const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
if (data.nextLevel === 'aal2') {
  // Show 2FA challenge
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const challenge = await supabase.auth.mfa.challenge({ factorId: factors[0].id });
  // User enters code
  await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code });
}
```

### Acceptance Criteria
- 2FA challenge shown when required
- Can enter and verify code
- Login completes after 2FA

### Dependencies
- PRD-36

---

- [x] PRD-38: Backup Codes Component

# PRD-38: Backup Codes Component

### Goal
Display and manage backup codes.

### Files to Create
- `Web/components/BackupCodes.tsx`

### Tasks
1. Display backup codes:
   - Show codes in grid
   - Copy all button
   - Download as text file
   - Warning to store safely

2. Regenerate codes option

3. Show in:
   - After 2FA enrollment
   - Settings security section

### Acceptance Criteria
- Backup codes display clearly
- Can copy all codes
- Can download as file
- Can regenerate codes

### Dependencies
- PRD-36

---

- [x] PRD-39: Social Login Buttons

# PRD-39: Social Login Buttons

### Goal
Create Google and GitHub login buttons.

### Files to Create
- `Web/components/SocialLoginButtons.tsx`

### Files to Modify
- `Web/pages/Login.tsx`
- `Web/pages/Signup.tsx`

### Tasks
1. Create button component:
```typescript
interface SocialLoginButtonsProps {
  onError?: (error: Error) => void;
}
```

2. Styled buttons:
   - Google button with Google icon
   - GitHub button with GitHub icon
   - Proper brand colors

3. On click:
```typescript
const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  });
};
```

4. Add to Login and Signup pages with "or" divider

### Acceptance Criteria
- Google button shows and works
- GitHub button shows and works
- Redirects to OAuth provider
- Buttons styled correctly

### Dependencies
- GitHub Issue #7 (OAuth Setup)

---

- [x] PRD-40: OAuth Callback Handler

# PRD-40: OAuth Callback Handler

### Goal
Handle OAuth redirect after authentication.

### Files to Create
- `Web/pages/AuthCallback.tsx`

### Files to Modify
- `Web/App.tsx`

### Tasks
1. Create callback page:
   - Show loading state
   - Handle OAuth response
   - Redirect to dashboard on success
   - Show error if auth failed

2. Supabase handles token exchange automatically, just need to:
   - Wait for session
   - Redirect user

```typescript
useEffect(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      navigate('/dashboard');
    }
  });
}, []);
```

3. Add route: `/auth/callback`

### Acceptance Criteria
- Callback page handles redirect
- Session established after OAuth
- Redirects to dashboard
- Errors displayed

### Dependencies
- PRD-39

---

- [x] PRD-41: Dashboard Page Layout

# PRD-41: Dashboard Page Layout

### Goal
Create basic dashboard page structure.

### Files to Create
- `Web/pages/Dashboard.tsx`

### Files to Modify
- `Web/App.tsx` (add route)
- `Web/components/layout/Navbar.tsx` (add link)

### Tasks
1. Create page layout:
   - Page title
   - Grid layout for cards
   - Responsive (2 cols desktop, 1 mobile)

2. Add protected route (redirect if not logged in)

3. Add Dashboard link to Navbar (show when logged in)

### Acceptance Criteria
- Dashboard page renders
- Only accessible when logged in
- Navbar has dashboard link
- Responsive layout works

### Dependencies
None

---

- [x] PRD-42: Stats Cards Component

# PRD-42: Stats Cards Component

### Goal
Create stat card components for dashboard.

### Files to Create
- `Web/components/dashboard/StatsCard.tsx`

### Files to Modify
- `Web/pages/Dashboard.tsx`

### Tasks
1. Create StatsCard component:
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
}
```

2. Add stats cards to dashboard:
   - Total Chats
   - Chats This Week
   - Storage Used
   - Current Tier

3. Style cards with consistent look

### Acceptance Criteria
- Stats cards display
- Show correct values
- Consistent styling

### Dependencies
- PRD-41

---

- [x] PRD-43: Recent Chats & Quick Actions

# PRD-43: Recent Chats & Quick Actions

### Goal
Add recent chats list and action buttons.

### Files to Create
- `Web/components/dashboard/RecentChats.tsx`
- `Web/components/dashboard/QuickActions.tsx`

### Files to Modify
- `Web/pages/Dashboard.tsx`

### Tasks
1. RecentChats component:
   - Show last 5 chats
   - Title, platform icon, date
   - "View all" link

2. QuickActions component:
   - "Open Extension" button
   - "Export All Data" button
   - "Upgrade" button (if free tier)

### Acceptance Criteria
- Recent chats display
- Quick actions work
- Export triggers download
- Upgrade links to pricing

### Dependencies
- PRD-41, PRD-42

---

- [x] PRD-44: Web Settings Page Layout

# PRD-44: Web Settings Page Layout

### Goal
Create settings page structure for web app.

### Files to Create
- `Web/pages/Settings.tsx`

### Files to Modify
- `Web/App.tsx` (add route)

### Tasks
1. Create settings page layout:
   - Sidebar navigation for sections
   - Content area for active section
   - Sections: Profile, Security, Subscription, Data & Privacy

2. Add protected route

3. Tab/section navigation

### Acceptance Criteria
- Settings page renders
- Section navigation works
- Protected route works

### Dependencies
None

---

- [x] PRD-45: Profile Section

# PRD-45: Profile Section

### Goal
Create profile editing section.

### Files to Create
- `Web/components/settings/ProfileSection.tsx`
- `Web/hooks/useProfile.ts`

### Tasks
1. Create useProfile hook:
   - Fetch profile from Supabase
   - Update profile method

2. Profile section UI:
   - Display name input
   - Email (read-only)
   - Save button

### Acceptance Criteria
- Profile loads from Supabase
- Can update display name
- Changes save correctly

### Dependencies
- PRD-44

---

- [x] PRD-46: Security Section

# PRD-46: Security Section

### Goal
Create security settings section.

### Files to Create
- `Web/components/settings/SecuritySection.tsx`

### Tasks
1. Security section UI:
   - Change password button (opens modal)
   - 2FA status and toggle
   - Active sessions list (future)

2. Integrate with existing auth components

### Acceptance Criteria
- Change password accessible
- 2FA toggle works
- Clear security overview

### Dependencies
- PRD-44, PRD-28 (password), PRD-36 (2FA)

---

- [x] PRD-47: Data & Privacy Section

# PRD-47: Data & Privacy Section

### Goal
Create data management section.

### Files to Create
- `Web/components/settings/DataPrivacySection.tsx`

### Tasks
1. Data section UI:
   - Export all data button
   - Delete account button
   - Link to privacy policy

2. Wire up export and delete functionality

### Acceptance Criteria
- Can export all data
- Delete account accessible
- Privacy policy linked

### Dependencies
- PRD-44, PRD-33 (deletion)

---

- [x] PRD-48: Contact Edge Function

# PRD-48: Contact Edge Function

### Goal
Create backend function to send contact form emails.

### Files to Create
- `supabase/functions/contact/index.ts`

### Tasks
1. Create edge function:
```typescript
serve(async (req) => {
  const { name, email, message } = await req.json();

  // Validate inputs
  // Send email via SendGrid/Resend/SES
  // Return success/error
});
```

2. Email content:
   - To: support@chatvault.app
   - Subject: Contact Form: [name]
   - Body: message with reply-to email

### Acceptance Criteria
- Function receives form data
- Email sent to support
- Returns success/error

### Dependencies
- GitHub Issue #6 (Email Service)

---

- [x] PRD-49: Connect Contact Form to Backend

# PRD-49: Connect Contact Form to Backend

### Goal
Replace stub with real API call.

### Files to Modify
- `Web/pages/Contact.tsx`

### Files to Create
- `Web/services/contact.ts`

### Tasks
1. Create contact service:
```typescript
export async function submitContactForm(data: ContactForm) {
  const response = await supabase.functions.invoke('contact', { body: data });
  return response;
}
```

2. Update Contact.tsx:
   - Replace setTimeout stub
   - Call real API
   - Handle errors

### Acceptance Criteria
- Form calls real API
- Success message shows
- Errors handled

### Dependencies
- PRD-48

---

- [x] PRD-50: Subscription Database Schema

# PRD-50: Subscription Database Schema

### Goal
Add subscription tracking to database.

### Files to Modify
- `supabase-schema.sql`

### Tasks
1. Create subscriptions table:
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL DEFAULT 'hobbyist',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

2. Add RLS policies

### Acceptance Criteria
- Subscriptions table created
- RLS policies work
- Can query user's subscription

### Dependencies
None

---

- [x] PRD-51: Stripe Checkout Function

# PRD-51: Stripe Checkout Function

### Goal
Create function to start Stripe checkout.

### Files to Create
- `supabase/functions/create-checkout/index.ts`

### Tasks
1. Create edge function:
```typescript
serve(async (req) => {
  const { priceId, userId, email } = await req.json();

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${origin}/billing?success=true`,
    cancel_url: `${origin}/billing?canceled=true`,
    metadata: { userId }
  });

  return new Response(JSON.stringify({ url: session.url }));
});
```

### Acceptance Criteria
- Function creates checkout session
- Returns checkout URL
- Handles errors

### Dependencies
- GitHub Issue #5 (Stripe Setup)

---

- [x] PRD-52: Stripe Webhook Handler

# PRD-52: Stripe Webhook Handler

### Goal
Handle Stripe webhook events.

### Files to Create
- `supabase/functions/stripe-webhook/index.ts`

### Tasks
1. Create webhook handler:
```typescript
serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  switch (event.type) {
    case 'checkout.session.completed':
      // Create subscription record
      break;
    case 'customer.subscription.updated':
      // Update tier
      break;
    case 'customer.subscription.deleted':
      // Downgrade to free
      break;
  }
});
```

### Acceptance Criteria
- Webhook verifies signature
- Handles subscription events
- Updates database correctly

### Dependencies
- PRD-50, PRD-51

---

- [x] PRD-53: Billing Page UI

# PRD-53: Billing Page UI

### Goal
Create billing management page.

### Files to Create
- `Web/pages/Billing.tsx`
- `Web/hooks/useSubscription.ts`

### Files to Modify
- `Web/App.tsx`

### Tasks
1. Create useSubscription hook:
   - Fetch subscription from Supabase
   - Return tier, status, end date

2. Billing page:
   - Current plan display
   - Upgrade buttons (to Power User, Team)
   - Manage subscription link (Stripe portal)

### Acceptance Criteria
- Shows current subscription
- Can initiate upgrade
- Links to Stripe portal

### Dependencies
- PRD-50, PRD-51, PRD-52

---

- [x] PRD-54: Sync State Types

# PRD-54: Sync State Types

### Goal
Add sync-related types and state.

### Files to Modify
- `Extension/src/shared/types.ts`
- `Extension/src/shared/lib/storage.ts`

### Tasks
1. Add sync types:
```typescript
type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  pendingChanges: number;
  error: string | null;
}
```

2. Add to chat type:
```typescript
interface Chat {
  // existing fields...
  syncedAt?: number;
  localUpdatedAt: number;
}
```

3. Add sync state to storage

### Acceptance Criteria
- Sync types defined
- Chat has sync tracking fields
- Sync state in storage

### Dependencies
None

---

- [x] PRD-55: Supabase Chats Table

# PRD-55: Supabase Chats Table

### Goal
Create cloud storage schema for chats.

### Files to Modify
- `supabase-schema.sql`

### Tasks
1. Create chats table:
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  url TEXT,
  messages JSONB NOT NULL,
  tags TEXT[],
  folder_id UUID,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chats_user_id ON chats(user_id);
```

2. Add RLS policies:
   - Users can only access their own chats
   - Insert/update/delete restricted to owner

### Acceptance Criteria
- Chats table created
- RLS policies work
- Indexes created

### Dependencies
None

---

- [x] PRD-56: Sync Service - Upload

# PRD-56: Sync Service - Upload

### Goal
Implement uploading local chats to cloud.

### Files to Create
- `Extension/src/shared/lib/sync.ts`

### Tasks
1. Create upload function:
```typescript
async function uploadChat(chat: Chat): Promise<void> {
  const { error } = await supabase
    .from('chats')
    .upsert({
      id: chat.id,
      user_id: userId,
      title: chat.title,
      // ... other fields
      updated_at: new Date().toISOString()
    });
}
```

2. Create bulk upload for initial sync

3. Track upload errors

### Acceptance Criteria
- Single chat uploads
- Bulk upload works
- Errors tracked

### Dependencies
- PRD-54, PRD-55

---

- [x] PRD-57: Sync Service - Download

# PRD-57: Sync Service - Download

### Goal
Implement downloading cloud chats to local.

### Files to Modify
- `Extension/src/shared/lib/sync.ts`

### Tasks
1. Create download function:
```typescript
async function downloadChats(): Promise<Chat[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId);
  return data;
}
```

2. Merge with local chats:
   - New cloud chats → add locally
   - Updated cloud chats → update if newer
   - Deleted cloud chats → remove locally

### Acceptance Criteria
- Downloads all user chats
- Merges with local correctly
- Handles conflicts

### Dependencies
- PRD-56

---

- [x] PRD-58: Sync Status UI & Triggers

# PRD-58: Sync Status UI & Triggers

### Goal
Add sync status indicator and trigger sync.

### Files to Create
- `Extension/src/shared/components/SyncStatus.tsx`

### Files to Modify
- `Extension/src/shared/components/AuthBanner.tsx`
- `Extension/src/background/service-worker.ts`

### Tasks
1. Create SyncStatus component:
   - Show sync status icon (synced, syncing, error)
   - Click to manual sync
   - Tooltip with last sync time

2. Add to AuthBanner (when logged in)

3. Trigger sync:
   - On login
   - On chat save
   - Periodically (every 5 min)
   - Manual trigger

### Acceptance Criteria
- Sync status displays
- Manual sync works
- Auto-sync on changes
- Shows errors clearly

### Dependencies
- PRD-56, PRD-57

---

- [x] PRD-59: Tier Configuration

# PRD-59: Tier Configuration

### Goal
Define tier limits and create utility functions.

### Files to Create
- `Extension/src/shared/lib/tier.ts`

### Tasks
1. Define tier limits:
```typescript
export const TIER_LIMITS = {
  hobbyist: {
    maxChats: 50,
    cloudSync: false,
    vectorSearch: false,
  },
  power_user: {
    maxChats: Infinity,
    cloudSync: true,
    vectorSearch: true,
  },
  team: {
    maxChats: Infinity,
    cloudSync: true,
    vectorSearch: true,
    teamMembers: 5,
  }
};

export function canSaveChat(tier: string, chatCount: number): boolean;
export function canUseFeature(tier: string, feature: string): boolean;
```

### Acceptance Criteria
- Tier limits defined
- Helper functions work
- Easy to check limits

### Dependencies
None

---

- [x] PRD-60: Chat Limit Enforcement

# PRD-60: Chat Limit Enforcement

### Goal
Enforce chat limits when saving.

### Files to Modify
- `Extension/src/shared/lib/storage.ts`

### Files to Create
- `Extension/src/shared/components/UpgradePrompt.tsx`

### Tasks
1. Check limit before saving:
```typescript
const saveChat = (chat: Chat) => {
  if (!canSaveChat(userTier, chats.length)) {
    // Show upgrade prompt
    return false;
  }
  // Save chat
};
```

2. Create UpgradePrompt component:
   - "You've reached the limit"
   - Link to upgrade
   - Dismiss option

3. Show warning at 80% (40/50)

### Acceptance Criteria
- Cannot save beyond limit
- Warning at 80%
- Upgrade prompt shows
- Can dismiss prompt

### Dependencies
- PRD-59

---

- [x] PRD-61: Usage Meter Component

# PRD-61: Usage Meter Component

### Goal
Show usage progress in UI.

### Files to Create
- `Extension/src/shared/components/UsageMeter.tsx`

### Files to Modify
- `Extension/src/shared/components/SidePanel.tsx`

### Tasks
1. Create UsageMeter:
   - Progress bar (X / 50)
   - Color: green < 50%, yellow 50-80%, red > 80%
   - "Upgrade" link when > 80%

2. Add to SidePanel footer or settings

### Acceptance Criteria
- Usage meter displays
- Color changes with usage
- Shows upgrade prompt when high

### Dependencies
- PRD-59

---

- [x] PRD-62: Error Types & Utilities

# PRD-62: Error Types & Utilities

### Goal
Create error handling utilities.

### Files to Create
- `Extension/src/shared/lib/errors.ts`

### Tasks
1. Define error types:
```typescript
export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'STORAGE_FULL'
  | 'SYNC_CONFLICT'
  | 'SCRAPE_FAILED'
  | 'UNKNOWN';

export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  recoverable: boolean;
  retryAction?: () => Promise<void>;
}
```

2. Error message mapping:
```typescript
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  NETWORK_ERROR: "Can't connect. Check your internet.",
  STORAGE_FULL: "Storage full. Delete chats or upgrade.",
  // ...
};
```

3. Create `createAppError(code, originalError)` helper

### Acceptance Criteria
- Error types defined
- User-friendly messages mapped
- Helper function works

### Dependencies
None

---

- [x] PRD-63: Error Boundary Components

# PRD-63: Error Boundary Components

### Goal
Create React error boundaries.

### Files to Create
- `Extension/src/shared/components/ErrorBoundary.tsx`
- `Web/components/ErrorBoundary.tsx`

### Tasks
1. Create ErrorBoundary:
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console/Sentry
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

2. Create ErrorFallback UI:
   - Friendly error message
   - "Try Again" button
   - "Report Issue" link

### Acceptance Criteria
- Catches render errors
- Shows fallback UI
- Can recover with retry

### Dependencies
- PRD-62

---

- [x] PRD-64: Error Toast Component

# PRD-64: Error Toast Component

### Goal
Create toast notifications for errors.

### Files to Create
- `Extension/src/shared/components/ErrorToast.tsx`

### Files to Modify
- `Extension/src/shared/lib/storage.ts` (add error state)

### Tasks
1. Create toast component:
   - Slides in from bottom/top
   - Error icon and message
   - Dismiss button
   - Auto-dismiss after 5s

2. Add error state to global store

3. Show toast on errors:
   - Sync errors
   - Save errors
   - Network errors

### Acceptance Criteria
- Toast displays on error
- Can dismiss manually
- Auto-dismisses
- Shows user-friendly message

### Dependencies
- PRD-62

---

- [x] PRD-65: Onboarding State & Hook

# PRD-65: Onboarding State & Hook

### Goal
Track onboarding progress.

### Files to Create
- `Web/hooks/useOnboarding.ts`

### Tasks
1. Create onboarding state:
```typescript
interface OnboardingState {
  completed: boolean;
  currentStep: number;
  skipped: boolean;
}
```

2. Persist to localStorage or Supabase

3. Create hook with:
   - Current step
   - nextStep() / prevStep()
   - complete()
   - skip()

### Acceptance Criteria
- Onboarding state tracks progress
- Persists between sessions
- Can skip or complete

### Dependencies
None

---

- [x] PRD-66: Onboarding Steps Components

# PRD-66: Onboarding Steps Components

### Goal
Create individual step components.

### Files to Create
- `Web/components/onboarding/WelcomeStep.tsx`
- `Web/components/onboarding/InstallStep.tsx`
- `Web/components/onboarding/ConnectStep.tsx`
- `Web/components/onboarding/CompleteStep.tsx`

### Tasks
1. WelcomeStep:
   - Value proposition
   - "Get Started" button

2. InstallStep:
   - Link to Chrome Web Store
   - Detect if installed

3. ConnectStep:
   - Instructions to visit ChatGPT/Claude
   - "I've saved a chat" button

4. CompleteStep:
   - Celebration message
   - "Go to Dashboard" button

### Acceptance Criteria
- Each step renders correctly
- Navigation between steps works
- Install detection works (if possible)

### Dependencies
- PRD-65

---

- [x] PRD-67: Onboarding Wizard Page

# PRD-67: Onboarding Wizard Page

### Goal
Combine steps into wizard page.

### Files to Create
- `Web/pages/Onboarding.tsx`

### Files to Modify
- `Web/App.tsx`

### Tasks
1. Create wizard wrapper:
   - Progress indicator
   - Step container
   - Skip button

2. Route logic:
   - Show onboarding after signup if not completed
   - Can access from settings to restart

3. Add route: `/onboarding`

### Acceptance Criteria
- Wizard displays steps in order
- Progress indicator updates
- Can skip at any time
- Redirects to dashboard on complete

### Dependencies
- PRD-65, PRD-66

---

- [x] PRD-68: ARIA Labels Audit

# PRD-68: ARIA Labels Audit

### Goal
Add ARIA labels to all interactive elements.

### Files to Modify
- Multiple component files in `Extension/src/shared/components/`
- Multiple component files in `Web/components/`

### Tasks
1. Audit all buttons:
   - Add `aria-label` to icon-only buttons
   - Ensure button text is descriptive

2. Audit all inputs:
   - Add `aria-label` or associated `<label>`
   - Add `aria-describedby` for hints

3. Audit modals:
   - Add `role="dialog"`
   - Add `aria-modal="true"`
   - Add `aria-labelledby`

### Acceptance Criteria
- All buttons have labels
- All inputs have labels
- Modals properly labeled

### Dependencies
None

---

- [ ] PRD-69: Keyboard Navigation

# PRD-69: Keyboard Navigation

### Goal
Ensure full keyboard accessibility.

### Files to Modify
- Multiple component files

### Tasks
1. Focus management:
   - Modal opens → focus first element
   - Modal closes → return focus to trigger
   - Dropdown opens → focus first option

2. Tab order:
   - Ensure logical tab sequence
   - Add `tabIndex` where needed
   - Skip hidden elements

3. Keyboard handlers:
   - Escape to close modals/dropdowns
   - Enter/Space to activate buttons
   - Arrow keys for menus

### Acceptance Criteria
- Can navigate entire app with keyboard
- Focus moves logically
- Escape closes overlays

### Dependencies
None

---

- [ ] PRD-70: Focus Visible Styles

# PRD-70: Focus Visible Styles

### Goal
Add clear focus indicators.

### Files to Modify
- `Extension/src/index.css` or equivalent
- `Web/index.css`

### Tasks
1. Add focus-visible styles:
```css
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Remove default outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

2. Ensure contrast on all backgrounds

3. Test with keyboard navigation

### Acceptance Criteria
- Focus visible on all elements
- Good contrast on all backgrounds
- No outline on mouse click

### Dependencies
None

---

- [ ] PRD-71: Reduced Motion Support

# PRD-71: Reduced Motion Support

### Goal
Respect user's motion preferences.

### Files to Modify
- CSS files and animation components

### Tasks
1. Add media query:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

2. Update Framer Motion:
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Use reduced or no animations
```

### Acceptance Criteria
- Animations disabled when preferred
- App still functional
- Transitions still work minimally

### Dependencies
None

---

- [ ] PRD-72: Test Framework Setup

# PRD-72: Test Framework Setup

### Goal
Set up Vitest testing framework.

### Files to Create
- `vitest.config.ts`
- `Extension/src/setupTests.ts`
- `Web/src/setupTests.ts`

### Files to Modify
- `package.json`

### Tasks
1. Install dependencies:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

2. Create vitest.config.ts:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

3. Add scripts to package.json:
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Acceptance Criteria
- Vitest runs successfully
- Tests can import React components
- Coverage reports generate

### Dependencies
None

---

- [ ] PRD-73: Storage Utility Tests

# PRD-73: Storage Utility Tests

### Goal
Test storage/state management functions.

### Files to Create
- `Extension/src/shared/lib/__tests__/storage.test.ts`

### Tasks
1. Test chat CRUD:
   - addChat
   - updateChat
   - deleteChat
   - pinChat

2. Test folder CRUD (if implemented)

3. Test tag CRUD (if implemented)

4. Mock chrome.storage.local

### Acceptance Criteria
- All storage actions tested
- Edge cases covered
- 80%+ coverage

### Dependencies
- PRD-72

---

- [ ] PRD-74: Export Utility Tests

# PRD-74: Export Utility Tests

### Goal
Test export functions.

### Files to Create
- `Extension/src/shared/lib/__tests__/export.test.ts`

### Tasks
1. Test exportToJSON:
   - Single chat
   - Multiple chats
   - Includes all fields

2. Test exportToMarkdown:
   - Format is correct
   - Code blocks preserved
   - Special characters escaped

3. Test downloadFile:
   - Blob created correctly
   - Mock download behavior

### Acceptance Criteria
- Export functions tested
- Output format verified
- Edge cases covered

### Dependencies
- PRD-72, PRD-09

---

- [ ] PRD-75: Component Tests

# PRD-75: Component Tests

### Goal
Test key React components.

### Files to Create
- `Extension/src/shared/components/__tests__/ChatItem.test.tsx`
- `Web/components/__tests__/Login.test.tsx`

### Tasks
1. ChatItem tests:
   - Renders title and preview
   - Pin button works
   - Delete button works
   - Tags display

2. Login tests:
   - Form renders
   - Validation works
   - Submit calls auth

3. Use React Testing Library patterns

### Acceptance Criteria
- Key components tested
- User interactions tested
- Accessibility checked

### Dependencies
- PRD-72

---

- [ ] PRD-76: CI Workflow

# PRD-76: CI Workflow

### Goal
Create GitHub Actions CI workflow.

### Files to Create
- `.github/workflows/ci.yml`

### Tasks
1. Create workflow:
```yaml
name: CI

on: [push, pull_request]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

2. Add lint script if missing
3. Add type-check script if missing

### Acceptance Criteria
- CI runs on push/PR
- Linting passes
- Type checking passes
- Tests pass
- Build succeeds

### Dependencies
- PRD-72

---

- [ ] PRD-77: Web Deploy Workflow

# PRD-77: Web Deploy Workflow

### Goal
Auto-deploy web app on main branch.

### Files to Create
- `.github/workflows/deploy-web.yml`

### Tasks
1. Create workflow (example for Vercel):
```yaml
name: Deploy Web

on:
  push:
    branches: [main]
    paths: ['Web/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

2. Or configure for Netlify/S3

### Acceptance Criteria
- Deploys on main push
- Only runs when Web/ changes
- Deployment succeeds

### Dependencies
- PRD-76

---

- [ ] PRD-78: Extension Build Workflow

# PRD-78: Extension Build Workflow

### Goal
Build extension on version tags.

### Files to Create
- `.github/workflows/build-extension.yml`

### Tasks
1. Create workflow:
```yaml
name: Build Extension

on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: cd Extension && npm run build
      - run: cd Extension && zip -r ../extension.zip dist/
      - uses: softprops/action-gh-release@v1
        with:
          files: extension.zip
```

2. Creates GitHub release with zip

### Acceptance Criteria
- Builds on version tag
- Creates zip artifact
- Attaches to GitHub release

### Dependencies
- PRD-76

---

# Implementation Order

## Phase 1: Foundation (Start Here)
1. PRD-72: Test Framework Setup
2. PRD-76: CI Workflow
3. PRD-62: Error Types & Utilities
4. PRD-63: Error Boundary Components

## Phase 2: Core Extension
5. PRD-01 to PRD-04: Folder System
6. PRD-05 to PRD-08: Tag System
7. PRD-09 to PRD-12: Export
8. PRD-13 to PRD-17: Settings
9. PRD-18 to PRD-21: Search
10. PRD-24 to PRD-27: Fix UI

## Phase 3: Authentication
11. PRD-28 to PRD-30: Password Reset
12. PRD-31 to PRD-32: Email Verification
13. PRD-39 to PRD-40: OAuth

## Phase 4: Web App
14. PRD-41 to PRD-43: Dashboard
15. PRD-44 to PRD-47: Settings Page
16. PRD-48 to PRD-49: Contact Form

## Phase 5: Premium Features
17. PRD-50 to PRD-53: Billing
18. PRD-54 to PRD-58: Cloud Sync
19. PRD-59 to PRD-61: Tier Enforcement
20. PRD-22 to PRD-23: Perplexity Scraper

## Phase 6: Polish
21. PRD-36 to PRD-38: 2FA
22. PRD-33 to PRD-35: Account Deletion
23. PRD-65 to PRD-67: Onboarding
24. PRD-68 to PRD-71: Accessibility
25. PRD-73 to PRD-75: More Tests
26. PRD-77 to PRD-78: Deploy Workflows

---

# Summary

| Category | PRDs | Count |
|----------|------|-------|
| Folder System | PRD-01 to PRD-04 | 4 |
| Tag System | PRD-05 to PRD-08 | 4 |
| Export | PRD-09 to PRD-12 | 4 |
| Settings | PRD-13 to PRD-17 | 5 |
| Search | PRD-18 to PRD-21 | 4 |
| Perplexity | PRD-22 to PRD-23 | 2 |
| Fix UI | PRD-24 to PRD-27 | 4 |
| Password Reset | PRD-28 to PRD-30 | 3 |
| Email Verify | PRD-31 to PRD-32 | 2 |
| Account Delete | PRD-33 to PRD-35 | 3 |
| 2FA | PRD-36 to PRD-38 | 3 |
| OAuth | PRD-39 to PRD-40 | 2 |
| Dashboard | PRD-41 to PRD-43 | 3 |
| Web Settings | PRD-44 to PRD-47 | 4 |
| Contact Form | PRD-48 to PRD-49 | 2 |
| Billing | PRD-50 to PRD-53 | 4 |
| Cloud Sync | PRD-54 to PRD-58 | 5 |
| Tier Enforce | PRD-59 to PRD-61 | 3 |
| Error Handle | PRD-62 to PRD-64 | 3 |
| Onboarding | PRD-65 to PRD-67 | 3 |
| Accessibility | PRD-68 to PRD-71 | 4 |
| Unit Tests | PRD-72 to PRD-75 | 4 |
| CI/CD | PRD-76 to PRD-78 | 3 |
| **TOTAL** | **PRD-01 to PRD-78** | **78** |

---

# Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-19 | Initial PRD document |
| 2.0 | 2026-01-19 | Split into 78 granular sub-tasks |
| 3.0 | 2026-01-19 | Renamed to sequential numbering (PRD-01 to PRD-78) |
