# A6 Summary: DOM Scrapers Implementation

## Overview

Implemented working DOM scrapers for ChatGPT, Claude, and Gemini chat interfaces. Each scraper extends the `BaseScraper` class and extracts chat messages with proper role identification, content extraction, and debounced processing.

---

## Final Selectors

### ChatGPT (chat.openai.com, chatgpt.com)

| Element | Selector |
|---------|----------|
| Message container | `div[data-message-author-role]` |
| User message | `div[data-message-author-role="user"]` |
| Assistant message | `div[data-message-author-role="assistant"]` |
| Text content | `div.text-base` (nested within message container) |

**Title extraction**: `document.title.replace(' - ChatGPT', '')`

### Claude (claude.ai)

| Element | Selector |
|---------|----------|
| Message selector | `.font-claude-message:not(#markdown-artifact), .font-user-message` |
| User message | `.font-user-message` |
| Assistant message | `.font-claude-message` |
| Content grid | `.grid-cols-1` (nested within Claude messages) |

**Excluded elements**:
- Thinking blocks: Elements with `transition-all` class
- Artifact blocks: `.artifact-block-cell` and elements with `pt-3 pb-3` classes

### Gemini (gemini.google.com)

| Element | Selector |
|---------|----------|
| Message elements | `user-query, model-response` (custom HTML elements) |
| User query | `user-query` (custom element) |
| Model response | `model-response` (custom element) |
| User content | `div.query-content` (nested within user-query) |
| Model content | `message-content` (nested within model-response) |
| Sidebar title | `div[data-test-id="conversation"].selected .conversation-title` |

---

## Special Handling

### ChatGPT
- **Debouncing**: 500ms delay before processing DOM mutations to avoid excessive scraping during typing/streaming
- **Deduplication**: Uses a Set to track unique text content from `div.text-base` elements to avoid duplicates
- **Optimization**: Only processes when message count changes

### Claude
- **Thinking blocks filtering**: Excludes Claude's "thinking" sections that appear during response generation
- **Artifact blocks filtering**: Excludes artifact blocks (code artifacts, documents) to capture only conversational content
- **Nested content extraction**: Navigates through Claude's complex DOM structure with `.grid-cols-1` containers

### Gemini
- **Web Components**: Uses custom HTML elements (`user-query`, `model-response`) instead of traditional CSS classes
- **No Shadow DOM issues**: Despite being Web Components, Gemini's elements are queryable with standard DOM APIs
- **Dynamic title generation**: Falls back to first 7 words of first user message if no title found in sidebar or page title
- **Sidebar integration**: Attempts to get chat title from the active conversation in the sidebar

---

## Testing Notes

### ChatGPT Testing
1. Navigate to any chat.openai.com or chatgpt.com conversation
2. Open browser console, should see: `[ChatVault] Initializing chatgpt scraper...`
3. As messages appear, should see: `[ChatVault] ChatGPT: Scraped N messages`
4. Check Network tab for `SAVE_CHAT` messages being sent to background script

### Claude Testing
1. Navigate to any claude.ai conversation
2. Open browser console, should see: `[ChatVault] Initializing claude scraper...`
3. Start a conversation or view existing one
4. Should see: `[ChatVault] Claude: Scraped N messages`
5. Verify thinking blocks are excluded from scraped content

### Gemini Testing
1. Navigate to any gemini.google.com conversation
2. Open browser console, should see: `[ChatVault] Initializing gemini scraper...`
3. Start a conversation or view existing one
4. Should see: `[ChatVault] Gemini: Scraped N messages`
5. Verify title extraction from sidebar or page title

### General Testing
- All scrapers use `chrome.runtime.sendMessage` to send data to background script
- Message format: `{ type: 'SAVE_CHAT', payload: { platform, title, messages, url, updatedAt } }`
- Each `ScrapedMessage` contains: `{ role, content, timestamp }`

---

## Known Limitations

### All Platforms
- **No real timestamps**: DOM doesn't expose message timestamps; uses `Date.now()` as fallback
- **No message IDs**: DOM doesn't consistently expose unique message identifiers
- **Streaming messages**: May capture partial content during AI response generation
- **Rate limiting**: Debouncing helps but very rapid changes may still cause multiple scrapes

### ChatGPT
- Selectors may change with UI updates (last confirmed: January 2025)
- Code blocks and complex formatting may need additional handling for perfect extraction

### Claude
- "Thinking" block detection relies on class names that may change
- Artifact content is intentionally excluded (may want to add option to include)
- Complex nested structures may have edge cases

### Gemini
- Custom elements (`user-query`, `model-response`) are stable but could change
- Sidebar title selector depends on specific DOM structure
- Auto-scroll for long conversations not implemented (user must scroll to load history)

---

## Selector Sources

Research conducted using:
1. **Greasyfork ChatGPT Conversation Exporter** (2024) - Confirmed `data-message-author-role` selector
2. **revivalstack/ai-chat-exporter** (2025) - Comprehensive selectors for ChatGPT, Claude, Gemini
3. **ryanschiang/claude-export** (2024) - Claude-specific extraction patterns
4. **GeoAnima/Gemini-Conversation-Downloader** - Gemini custom element selectors

---

## Build Verification

All scrapers compile successfully:
```
content/chatgpt.js  1.60 kB
content/claude.js   1.97 kB
content/gemini.js   2.32 kB
```

TypeScript compilation passes with no errors.
