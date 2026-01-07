# Manifest Update Summary - Host Permissions & Content Scripts

## Task Completed
Updated `Extension/public/manifest.json` and `Extension/vite.config.ts` to enable content script injection on ChatGPT, Claude, and Gemini platforms.

## Changes Made

### 1. manifest.json - Host Permissions Added
```json
"host_permissions": [
  "https://chatgpt.com/*",
  "https://claude.ai/*",
  "https://gemini.google.com/*"
]
```

### 2. manifest.json - Content Scripts Declared
```json
"content_scripts": [
  {
    "matches": ["https://chatgpt.com/*"],
    "js": ["content/chatgpt.js"],
    "run_at": "document_idle"
  },
  {
    "matches": ["https://claude.ai/*"],
    "js": ["content/claude.js"],
    "run_at": "document_idle"
  },
  {
    "matches": ["https://gemini.google.com/*"],
    "js": ["content/gemini.js"],
    "run_at": "document_idle"
  }
]
```

### 3. vite.config.ts - Build Configuration Updated
Added content scripts as separate entry points:
```typescript
input: {
  // ... existing entries
  chatgpt: path.resolve(__dirname, 'src/content/chatgpt.ts'),
  claude: path.resolve(__dirname, 'src/content/claude.ts'),
  gemini: path.resolve(__dirname, 'src/content/gemini.ts'),
}
```

Output path configuration:
```typescript
entryFileNames: (chunk) => {
  if (chunk.name === 'chatgpt' || chunk.name === 'claude' || chunk.name === 'gemini') {
    return `content/${chunk.name}.js`;
  }
  // ...
}
```

## Manifest V3 Compliance

| Requirement | Status |
|-------------|--------|
| `manifest_version: 3` | Compliant |
| `host_permissions` (separate from `permissions`) | Compliant |
| No `<all_urls>` broad permission | Compliant |
| Existing permissions preserved (`storage`, `sidePanel`) | Compliant |
| `run_at: document_idle` for performance | Compliant |

## Content Scripts Status

| Platform | File | Selector Status |
|----------|------|-----------------|
| ChatGPT | `src/content/chatgpt.ts` | Skeleton (TODO: verify selectors) |
| Claude | `src/content/claude.ts` | Skeleton (TODO: verify selectors) |
| Gemini | `src/content/gemini.ts` | Skeleton (TODO: Shadow DOM handling) |

## Build Output Structure
After `npm run build`:
```
dist/
├── content/
│   ├── chatgpt.js
│   ├── claude.js
│   └── gemini.js
├── service-worker.js
├── src/popup/index.html
└── src/sidepanel/index.html
```

## Testing Checklist
- [ ] Run `npm run build` in Extension directory
- [ ] Load unpacked extension from `dist/` folder
- [ ] Visit chatgpt.com - check console for `[ChatVault] Initializing chatgpt scraper...`
- [ ] Visit claude.ai - check console for `[ChatVault] Initializing claude scraper...`
- [ ] Visit gemini.google.com - check console for `[ChatVault] Initializing gemini scraper...`
- [ ] Verify no permission errors in extension popup

## Known Issue
Pre-existing TypeScript error in `base-scraper.ts`:
- `Cannot find name 'chrome'`
- Fix: Install `@types/chrome` package

## Next Steps
1. Install `@types/chrome` for TypeScript support
2. Implement actual DOM scraping logic in each content script
3. Verify selectors against live sites (they change frequently)
4. Handle Gemini's Shadow DOM properly
5. Add debouncing to MutationObserver to avoid performance issues
