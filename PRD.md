# ChatVault Product Requirements Documents (PRDs)

This document contains granular PRDs optimized for AI development. Each sub-PRD is a focused, single-purpose task that can be completed without context switching.

**How to use this document:**
- Each PRD is split into sub-tasks (e.g., PRD-001A, PRD-001B)
- Complete sub-tasks in order within each PRD
- Each sub-task is self-contained with clear inputs/outputs
- Mark sub-tasks complete before moving to the next

---

# Table of Contents

1. [PRD-001: Folder System](#prd-001-folder-system) (4 parts)
2. [PRD-002: Tag System](#prd-002-tag-system) (4 parts)
3. [PRD-003: Export Functionality](#prd-003-export-functionality) (4 parts)
4. [PRD-004: Settings Page](#prd-004-settings-page) (5 parts)
5. [PRD-005: Search Enhancement](#prd-005-search-enhancement) (4 parts)
6. [PRD-006: Perplexity Scraper](#prd-006-perplexity-scraper) (2 parts)
7. [PRD-007: Fix Non-Functional UI](#prd-007-fix-non-functional-ui) (4 parts)
8. [PRD-008: Password Reset](#prd-008-password-reset) (3 parts)
9. [PRD-009: Email Verification](#prd-009-email-verification) (2 parts)
10. [PRD-010: Account Deletion](#prd-010-account-deletion) (3 parts)
11. [PRD-011: Two-Factor Auth](#prd-011-two-factor-auth) (3 parts)
12. [PRD-012: OAuth Social Login](#prd-012-oauth-social-login) (2 parts)
13. [PRD-013: User Dashboard](#prd-013-user-dashboard) (3 parts)
14. [PRD-014: Settings Page (Web)](#prd-014-settings-page-web) (4 parts)
15. [PRD-015: Contact Form Backend](#prd-015-contact-form-backend) (2 parts)
16. [PRD-016: Billing/Subscription](#prd-016-billingsubscription) (4 parts)
17. [PRD-017: Cloud Sync](#prd-017-cloud-sync) (5 parts)
18. [PRD-018: Tier Enforcement](#prd-018-tier-enforcement) (3 parts)
19. [PRD-019: Error Handling](#prd-019-error-handling) (3 parts)
20. [PRD-020: Onboarding Wizard](#prd-020-onboarding-wizard) (3 parts)
21. [PRD-021: Accessibility](#prd-021-accessibility) (4 parts)
22. [PRD-022: Unit Tests](#prd-022-unit-tests) (4 parts)
23. [PRD-023: CI/CD Pipeline](#prd-023-cicd-pipeline) (3 parts)

---

# PRD-001: Folder System

## PRD-001A: Folder Data Model & Storage

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
- [ ] Folder interface exists in types.ts
- [ ] Chat interface has folderId field
- [ ] All folder CRUD actions work in storage
- [ ] Folders persist after browser restart

### Dependencies
None

---

## PRD-001B: Create Folder Modal Component

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
- [ ] Modal opens/closes properly
- [ ] User can enter folder name
- [ ] User can select color
- [ ] Validation prevents empty names
- [ ] Folder is created on submit

### Dependencies
- PRD-001A (storage actions)

---

## PRD-001C: Folder List Component

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
- [ ] All folders display in list
- [ ] Clicking folder filters chat list
- [ ] "All Chats" shows everything
- [ ] Context menu works
- [ ] New Folder button opens modal

### Dependencies
- PRD-001A, PRD-001B

---

## PRD-001D: Move Chat to Folder

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
- [ ] User can move chat to folder via menu
- [ ] User can remove chat from folder
- [ ] Folder badge shows on chat item
- [ ] Folder filtering works correctly

### Dependencies
- PRD-001A, PRD-001C

---

# PRD-002: Tag System

## PRD-002A: Tag Data Model & Storage

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
- [ ] Tag interface exists
- [ ] All tag CRUD actions work
- [ ] Tags persist after restart

### Dependencies
None

---

## PRD-002B: Tag Input Component

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
- [ ] Autocomplete shows matching tags
- [ ] Can create new tags inline
- [ ] Tags display as chips
- [ ] Can remove tags by clicking X

### Dependencies
- PRD-002A

---

## PRD-002C: Tag Filter Component

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
- [ ] All tags display as filter chips
- [ ] Can select multiple tags
- [ ] Chat list filters correctly
- [ ] Clear all resets filter

### Dependencies
- PRD-002A, PRD-002B

---

## PRD-002D: Tag Display in Chat Item

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
- [ ] Tags display on chat items
- [ ] Can add/remove tags from chat item
- [ ] Overflow handled gracefully

### Dependencies
- PRD-002A, PRD-002B

---

# PRD-003: Export Functionality

## PRD-003A: Export Utility Functions

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
- [ ] JSON export includes all chat data
- [ ] Markdown is properly formatted
- [ ] Download function works in extension context

### Dependencies
None

---

## PRD-003B: Export Menu Component

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
- [ ] Menu shows export options
- [ ] Single chat export works
- [ ] Bulk export works
- [ ] Files download with correct names

### Dependencies
- PRD-003A

---

## PRD-003C: Wire Up Export Button in SidePanel

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
- [ ] Export button in SidePanel works
- [ ] Can export all chats
- [ ] Can export selected chat

### Dependencies
- PRD-003B

---

## PRD-003D: Export Option in Chat Context Menu

### Goal
Add export option to individual chat item menu.

### Files to Modify
- `Extension/src/shared/components/ChatItem.tsx`

### Tasks
1. Add "Export" option to chat item dropdown/context menu
2. Sub-menu with format options (JSON, Markdown)
3. On click, trigger export for that chat

### Acceptance Criteria
- [ ] Export option appears in chat menu
- [ ] Can export individual chat from menu
- [ ] Both formats available

### Dependencies
- PRD-003A, PRD-003B

---

# PRD-004: Settings Page

## PRD-004A: Settings Data Model & Storage

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
- [ ] Settings interface exists
- [ ] Default settings defined
- [ ] Settings persist after restart

### Dependencies
None

---

## PRD-004B: Theme Provider Component

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
- [ ] Theme context available throughout app
- [ ] System preference detected
- [ ] Theme applies to UI
- [ ] Theme persists

### Dependencies
- PRD-004A

---

## PRD-004C: Settings Page Layout

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
- [ ] Settings page renders
- [ ] All sections display
- [ ] Back navigation works

### Dependencies
- PRD-004A, PRD-004B

---

## PRD-004D: Settings Controls Implementation

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
- [ ] Theme changes immediately
- [ ] Toggles update settings
- [ ] Storage usage shows correctly
- [ ] Clear data works with confirmation

### Dependencies
- PRD-004C, PRD-003A (for export)

---

## PRD-004E: Wire Up Settings Button

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
- [ ] Settings button opens settings
- [ ] Can navigate back to main view
- [ ] Works in both popup and sidepanel

### Dependencies
- PRD-004C

---

# PRD-005: Search Enhancement

## PRD-005A: Full-Text Search Index

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
- [ ] Search index builds from chats
- [ ] Full-text search finds matches in content
- [ ] Search is case-insensitive

### Dependencies
None

---

## PRD-005B: Search Operators Parser

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
- [ ] Operators are parsed correctly
- [ ] Free text extracted separately
- [ ] Invalid operators ignored gracefully

### Dependencies
- PRD-005A

---

## PRD-005C: Search Filters UI

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
- [ ] Filter panel expands/collapses
- [ ] Date range filter works
- [ ] Platform filter works
- [ ] Filters combine with text search

### Dependencies
- PRD-005A, PRD-005B

---

## PRD-005D: Keyboard Shortcut for Search

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
- [ ] Cmd/Ctrl+K focuses search
- [ ] Works from anywhere in extension
- [ ] Escape unfocuses

### Dependencies
None

---

# PRD-006: Perplexity Scraper

## PRD-006A: Perplexity DOM Analysis & Scraper

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
- [ ] Scraper detects Perplexity conversations
- [ ] User queries extracted
- [ ] AI responses extracted
- [ ] Source citations preserved
- [ ] Title extracted from thread

### Dependencies
None

---

## PRD-006B: Perplexity Manifest & Integration

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
- [ ] Extension runs on Perplexity pages
- [ ] Perplexity appears in platform filter
- [ ] Perplexity chats show correct icon

### Dependencies
- PRD-006A

---

# PRD-007: Fix Non-Functional UI

## PRD-007A: View State Management

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
- [ ] View state tracked in storage
- [ ] Can switch between view modes
- [ ] Selected folder tracked

### Dependencies
None

---

## PRD-007B: Nav Icons Functionality

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
- [ ] Clicking Home shows all chats
- [ ] Clicking Star shows only pinned chats
- [ ] Active nav item highlighted
- [ ] Tooltips show on hover

### Dependencies
- PRD-007A

---

## PRD-007C: Analytics View Component

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
- [ ] Analytics view displays
- [ ] Shows correct chat counts
- [ ] Shows platform breakdown
- [ ] Shows popular tags

### Dependencies
- PRD-007A, PRD-007B

---

## PRD-007D: Dashboard Button & Tooltips

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
- [ ] Dashboard button opens web app
- [ ] All buttons have tooltips

### Dependencies
None

---

# PRD-008: Password Reset

## PRD-008A: Forgot Password Page

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
- [ ] Page renders at /forgot-password
- [ ] Can enter email and submit
- [ ] Shows success message
- [ ] Link on login page works

### Dependencies
None

---

## PRD-008B: Reset Password Page

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
- [ ] Page renders at /reset-password
- [ ] Password validation works
- [ ] Confirmation must match
- [ ] Password updates successfully
- [ ] Redirects to login after

### Dependencies
- PRD-008A

---

## PRD-008C: Auth Hook Updates

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
- [ ] requestPasswordReset method works
- [ ] updatePassword method works
- [ ] Methods return errors properly

### Dependencies
None

---

# PRD-009: Email Verification

## PRD-009A: Verification Banner Component

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
- [ ] Banner shows for unverified users
- [ ] Can resend verification email
- [ ] Can dismiss banner
- [ ] Verified users don't see banner

### Dependencies
None

---

## PRD-009B: Extension Auth Banner Update

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
- [ ] Shows verification status
- [ ] Can resend from extension
- [ ] Clear visual difference verified vs not

### Dependencies
None

---

# PRD-010: Account Deletion

## PRD-010A: Delete Account Edge Function

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
- [ ] Function deletes all user data
- [ ] Requires authentication
- [ ] Returns success/error status

### Dependencies
None

---

## PRD-010B: Delete Account Modal

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
- [ ] Modal shows with warnings
- [ ] Must type DELETE to enable button
- [ ] Account deleted on confirm
- [ ] User logged out and redirected

### Dependencies
- PRD-010A

---

## PRD-010C: Data Export Before Deletion

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
- [ ] Can download data from deletion modal
- [ ] Export includes all user data
- [ ] Works before deletion is confirmed

### Dependencies
- PRD-010B

---

# PRD-011: Two-Factor Authentication

## PRD-011A: 2FA Enrollment UI

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
- [ ] QR code displays correctly
- [ ] Manual secret shown for backup
- [ ] Verification code required
- [ ] 2FA enabled after verification

### Dependencies
None

---

## PRD-011B: 2FA Login Challenge

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
- [ ] 2FA challenge shown when required
- [ ] Can enter and verify code
- [ ] Login completes after 2FA

### Dependencies
- PRD-011A

---

## PRD-011C: Backup Codes Component

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
- [ ] Backup codes display clearly
- [ ] Can copy all codes
- [ ] Can download as file
- [ ] Can regenerate codes

### Dependencies
- PRD-011A

---

# PRD-012: OAuth Social Login

## PRD-012A: Social Login Buttons

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
- [ ] Google button shows and works
- [ ] GitHub button shows and works
- [ ] Redirects to OAuth provider
- [ ] Buttons styled correctly

### Dependencies
- GitHub Issue #7 (OAuth Setup)

---

## PRD-012B: OAuth Callback Handler

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
- [ ] Callback page handles redirect
- [ ] Session established after OAuth
- [ ] Redirects to dashboard
- [ ] Errors displayed

### Dependencies
- PRD-012A

---

# PRD-013: User Dashboard

## PRD-013A: Dashboard Page Layout

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
- [ ] Dashboard page renders
- [ ] Only accessible when logged in
- [ ] Navbar has dashboard link
- [ ] Responsive layout works

### Dependencies
None

---

## PRD-013B: Stats Cards Component

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
- [ ] Stats cards display
- [ ] Show correct values
- [ ] Consistent styling

### Dependencies
- PRD-013A

---

## PRD-013C: Recent Chats & Quick Actions

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
- [ ] Recent chats display
- [ ] Quick actions work
- [ ] Export triggers download
- [ ] Upgrade links to pricing

### Dependencies
- PRD-013A, PRD-013B

---

# PRD-014: Settings Page (Web)

## PRD-014A: Web Settings Page Layout

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
- [ ] Settings page renders
- [ ] Section navigation works
- [ ] Protected route works

### Dependencies
None

---

## PRD-014B: Profile Section

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
- [ ] Profile loads from Supabase
- [ ] Can update display name
- [ ] Changes save correctly

### Dependencies
- PRD-014A

---

## PRD-014C: Security Section

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
- [ ] Change password accessible
- [ ] 2FA toggle works
- [ ] Clear security overview

### Dependencies
- PRD-014A, PRD-008 (password), PRD-011 (2FA)

---

## PRD-014D: Data & Privacy Section

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
- [ ] Can export all data
- [ ] Delete account accessible
- [ ] Privacy policy linked

### Dependencies
- PRD-014A, PRD-010 (deletion)

---

# PRD-015: Contact Form Backend

## PRD-015A: Contact Edge Function

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
- [ ] Function receives form data
- [ ] Email sent to support
- [ ] Returns success/error

### Dependencies
- GitHub Issue #6 (Email Service)

---

## PRD-015B: Connect Contact Form to Backend

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
- [ ] Form calls real API
- [ ] Success message shows
- [ ] Errors handled

### Dependencies
- PRD-015A

---

# PRD-016: Billing/Subscription

## PRD-016A: Subscription Database Schema

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
- [ ] Subscriptions table created
- [ ] RLS policies work
- [ ] Can query user's subscription

### Dependencies
None

---

## PRD-016B: Stripe Checkout Function

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
- [ ] Function creates checkout session
- [ ] Returns checkout URL
- [ ] Handles errors

### Dependencies
- GitHub Issue #5 (Stripe Setup)

---

## PRD-016C: Stripe Webhook Handler

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
- [ ] Webhook verifies signature
- [ ] Handles subscription events
- [ ] Updates database correctly

### Dependencies
- PRD-016A, PRD-016B

---

## PRD-016D: Billing Page UI

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
- [ ] Shows current subscription
- [ ] Can initiate upgrade
- [ ] Links to Stripe portal

### Dependencies
- PRD-016A, PRD-016B, PRD-016C

---

# PRD-017: Cloud Sync

## PRD-017A: Sync State Types

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
- [ ] Sync types defined
- [ ] Chat has sync tracking fields
- [ ] Sync state in storage

### Dependencies
None

---

## PRD-017B: Supabase Chats Table

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
- [ ] Chats table created
- [ ] RLS policies work
- [ ] Indexes created

### Dependencies
None

---

## PRD-017C: Sync Service - Upload

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
- [ ] Single chat uploads
- [ ] Bulk upload works
- [ ] Errors tracked

### Dependencies
- PRD-017A, PRD-017B

---

## PRD-017D: Sync Service - Download

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
- [ ] Downloads all user chats
- [ ] Merges with local correctly
- [ ] Handles conflicts

### Dependencies
- PRD-017C

---

## PRD-017E: Sync Status UI & Triggers

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
- [ ] Sync status displays
- [ ] Manual sync works
- [ ] Auto-sync on changes
- [ ] Shows errors clearly

### Dependencies
- PRD-017C, PRD-017D

---

# PRD-018: Tier Enforcement

## PRD-018A: Tier Configuration

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
- [ ] Tier limits defined
- [ ] Helper functions work
- [ ] Easy to check limits

### Dependencies
None

---

## PRD-018B: Chat Limit Enforcement

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
- [ ] Cannot save beyond limit
- [ ] Warning at 80%
- [ ] Upgrade prompt shows
- [ ] Can dismiss prompt

### Dependencies
- PRD-018A

---

## PRD-018C: Usage Meter Component

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
- [ ] Usage meter displays
- [ ] Color changes with usage
- [ ] Shows upgrade prompt when high

### Dependencies
- PRD-018A

---

# PRD-019: Error Handling

## PRD-019A: Error Types & Utilities

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
- [ ] Error types defined
- [ ] User-friendly messages mapped
- [ ] Helper function works

### Dependencies
None

---

## PRD-019B: Error Boundary Components

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
- [ ] Catches render errors
- [ ] Shows fallback UI
- [ ] Can recover with retry

### Dependencies
- PRD-019A

---

## PRD-019C: Error Toast Component

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
- [ ] Toast displays on error
- [ ] Can dismiss manually
- [ ] Auto-dismisses
- [ ] Shows user-friendly message

### Dependencies
- PRD-019A

---

# PRD-020: Onboarding Wizard

## PRD-020A: Onboarding State & Hook

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
- [ ] Onboarding state tracks progress
- [ ] Persists between sessions
- [ ] Can skip or complete

### Dependencies
None

---

## PRD-020B: Onboarding Steps Components

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
- [ ] Each step renders correctly
- [ ] Navigation between steps works
- [ ] Install detection works (if possible)

### Dependencies
- PRD-020A

---

## PRD-020C: Onboarding Wizard Page

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
- [ ] Wizard displays steps in order
- [ ] Progress indicator updates
- [ ] Can skip at any time
- [ ] Redirects to dashboard on complete

### Dependencies
- PRD-020A, PRD-020B

---

# PRD-021: Accessibility

## PRD-021A: ARIA Labels Audit

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
- [ ] All buttons have labels
- [ ] All inputs have labels
- [ ] Modals properly labeled

### Dependencies
None

---

## PRD-021B: Keyboard Navigation

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
- [ ] Can navigate entire app with keyboard
- [ ] Focus moves logically
- [ ] Escape closes overlays

### Dependencies
None

---

## PRD-021C: Focus Visible Styles

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
- [ ] Focus visible on all elements
- [ ] Good contrast on all backgrounds
- [ ] No outline on mouse click

### Dependencies
None

---

## PRD-021D: Reduced Motion Support

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
- [ ] Animations disabled when preferred
- [ ] App still functional
- [ ] Transitions still work minimally

### Dependencies
None

---

# PRD-022: Unit Tests

## PRD-022A: Test Framework Setup

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
- [ ] Vitest runs successfully
- [ ] Tests can import React components
- [ ] Coverage reports generate

### Dependencies
None

---

## PRD-022B: Storage Utility Tests

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
- [ ] All storage actions tested
- [ ] Edge cases covered
- [ ] 80%+ coverage

### Dependencies
- PRD-022A

---

## PRD-022C: Export Utility Tests

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
- [ ] Export functions tested
- [ ] Output format verified
- [ ] Edge cases covered

### Dependencies
- PRD-022A, PRD-003A

---

## PRD-022D: Component Tests

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
- [ ] Key components tested
- [ ] User interactions tested
- [ ] Accessibility checked

### Dependencies
- PRD-022A

---

# PRD-023: CI/CD Pipeline

## PRD-023A: CI Workflow

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
- [ ] CI runs on push/PR
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Tests pass
- [ ] Build succeeds

### Dependencies
- PRD-022A

---

## PRD-023B: Web Deploy Workflow

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
- [ ] Deploys on main push
- [ ] Only runs when Web/ changes
- [ ] Deployment succeeds

### Dependencies
- PRD-023A

---

## PRD-023C: Extension Build Workflow

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
- [ ] Builds on version tag
- [ ] Creates zip artifact
- [ ] Attaches to GitHub release

### Dependencies
- PRD-023A

---

# Implementation Order

## Phase 1: Foundation (Start Here)
1. PRD-022A: Test Framework Setup
2. PRD-023A: CI Workflow
3. PRD-019A: Error Types & Utilities
4. PRD-019B: Error Boundary Components

## Phase 2: Core Extension
5. PRD-001A → PRD-001D: Folder System
6. PRD-002A → PRD-002D: Tag System
7. PRD-003A → PRD-003D: Export
8. PRD-004A → PRD-004E: Settings
9. PRD-005A → PRD-005D: Search
10. PRD-007A → PRD-007D: Fix UI

## Phase 3: Authentication
11. PRD-008A → PRD-008C: Password Reset
12. PRD-009A → PRD-009B: Email Verification
13. PRD-012A → PRD-012B: OAuth

## Phase 4: Web App
14. PRD-013A → PRD-013C: Dashboard
15. PRD-014A → PRD-014D: Settings Page
16. PRD-015A → PRD-015B: Contact Form

## Phase 5: Premium Features
17. PRD-016A → PRD-016D: Billing
18. PRD-017A → PRD-017E: Cloud Sync
19. PRD-018A → PRD-018C: Tier Enforcement
20. PRD-006A → PRD-006B: Perplexity Scraper

## Phase 6: Polish
21. PRD-011A → PRD-011C: 2FA
22. PRD-010A → PRD-010C: Account Deletion
23. PRD-020A → PRD-020C: Onboarding
24. PRD-021A → PRD-021D: Accessibility
25. PRD-022B → PRD-022D: More Tests
26. PRD-023B → PRD-023C: Deploy Workflows

---

# Summary

| PRD | Parts | Total Sub-tasks |
|-----|-------|-----------------|
| PRD-001 Folders | 4 | 4 |
| PRD-002 Tags | 4 | 4 |
| PRD-003 Export | 4 | 4 |
| PRD-004 Settings | 5 | 5 |
| PRD-005 Search | 4 | 4 |
| PRD-006 Perplexity | 2 | 2 |
| PRD-007 Fix UI | 4 | 4 |
| PRD-008 Password Reset | 3 | 3 |
| PRD-009 Email Verify | 2 | 2 |
| PRD-010 Account Delete | 3 | 3 |
| PRD-011 2FA | 3 | 3 |
| PRD-012 OAuth | 2 | 2 |
| PRD-013 Dashboard | 3 | 3 |
| PRD-014 Web Settings | 4 | 4 |
| PRD-015 Contact Form | 2 | 2 |
| PRD-016 Billing | 4 | 4 |
| PRD-017 Cloud Sync | 5 | 5 |
| PRD-018 Tier Enforce | 3 | 3 |
| PRD-019 Error Handle | 3 | 3 |
| PRD-020 Onboarding | 3 | 3 |
| PRD-021 Accessibility | 4 | 4 |
| PRD-022 Unit Tests | 4 | 4 |
| PRD-023 CI/CD | 3 | 3 |
| **TOTAL** | **78** | **78 sub-tasks** |

---

# Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-19 | Initial PRD document |
| 2.0 | 2026-01-19 | Split into 78 granular sub-tasks |
