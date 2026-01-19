import { Chat, Platform } from '../types';

/**
 * Search index entry containing searchable chat data
 */
export interface SearchIndexEntry {
  chatId: string;
  title: string;
  content: string; // All messages concatenated
  platform: Platform;
  tags: string[];
  folderId: string | null;
  timestamp: number;
}

/**
 * Parsed search query with operators and free text
 */
export interface ParsedQuery {
  text: string; // Free text portion
  operators: {
    platform?: string;
    tag?: string;
    folder?: string;
    before?: Date;
    after?: Date;
    exactPhrase?: string; // For "quoted" exact phrase searches
  };
}

/**
 * Parse search query to extract operators and free text
 * Supports operators: platform:, tag:, folder:, before:, after:, and "exact phrase"
 */
export function parseSearchQuery(query: string): ParsedQuery {
  const operators: ParsedQuery['operators'] = {};
  let text = query;

  // Parse exact phrase "quoted terms"
  const exactPhraseRegex = /"([^"]+)"/g;
  const exactPhraseMatches = [...query.matchAll(exactPhraseRegex)];
  if (exactPhraseMatches.length > 0) {
    // Extract all exact phrases and use the first one
    operators.exactPhrase = exactPhraseMatches[0][1];
    // Remove quoted phrases from text and normalize whitespace
    text = text.replace(exactPhraseRegex, '').replace(/\s+/g, ' ').trim();
  }

  // Parse platform: operator
  const platformMatch = query.match(/platform:(\w+)/i);
  if (platformMatch) {
    operators.platform = platformMatch[1].toLowerCase();
    text = text.replace(platformMatch[0], '').trim();
  }

  // Parse tag: operator
  const tagMatch = query.match(/tag:(\w+)/i);
  if (tagMatch) {
    operators.tag = tagMatch[1].toLowerCase();
    text = text.replace(tagMatch[0], '').trim();
  }

  // Parse folder: operator
  const folderMatch = query.match(/folder:(\w+)/i);
  if (folderMatch) {
    operators.folder = folderMatch[1].toLowerCase();
    text = text.replace(folderMatch[0], '').trim();
  }

  // Parse before: operator (date format: YYYY-MM-DD)
  const beforeMatch = query.match(/before:(\d{4}-\d{2}-\d{2})/i);
  if (beforeMatch) {
    operators.before = new Date(beforeMatch[1]);
    text = text.replace(beforeMatch[0], '').trim();
  }

  // Parse after: operator (date format: YYYY-MM-DD)
  const afterMatch = query.match(/after:(\d{4}-\d{2}-\d{2})/i);
  if (afterMatch) {
    operators.after = new Date(afterMatch[1]);
    text = text.replace(afterMatch[0], '').trim();
  }

  return {
    text: text.trim(),
    operators,
  };
}

/**
 * Build search index from chats array
 * Currently indexes title and preview (full message content storage coming in Phase 4)
 */
export function buildSearchIndex(chats: Chat[]): SearchIndexEntry[] {
  return chats.map(chat => ({
    chatId: chat.id,
    title: chat.title,
    content: chat.preview, // Will be expanded to full messages when Phase 4 is implemented
    platform: chat.platform,
    tags: chat.tags,
    folderId: chat.folderId || null,
    timestamp: chat.timestamp,
  }));
}

/**
 * Search chats by query string with operator support
 * Returns matching chat IDs sorted by timestamp (newest first)
 * Supports operators: platform:, tag:, folder:, before:, after:, and "exact phrase"
 * Search is case-insensitive and searches in both title and content
 */
export function searchChats(query: string, index: SearchIndexEntry[]): string[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const parsed = parseSearchQuery(query);
  const searchTerms = parsed.text.toLowerCase();

  return index
    .filter(entry => {
      // Apply platform filter
      if (parsed.operators.platform && entry.platform.toLowerCase() !== parsed.operators.platform) {
        return false;
      }

      // Apply tag filter (entry must have all specified tags)
      if (parsed.operators.tag && !entry.tags.includes(parsed.operators.tag)) {
        return false;
      }

      // Apply folder filter
      const folderMatch = parsed.operators.folder ?
        entry.folderId?.toLowerCase().includes(parsed.operators.folder) :
        true;
      if (!folderMatch) {
        return false;
      }

      // Apply before date filter
      if (parsed.operators.before && new Date(entry.timestamp).getTime() >= parsed.operators.before.getTime()) {
        return false;
      }

      // Apply after date filter
      if (parsed.operators.after && new Date(entry.timestamp).getTime() <= parsed.operators.after.getTime()) {
        return false;
      }

      // Apply exact phrase filter or free text search
      if (parsed.operators.exactPhrase) {
        const exactPhrase = parsed.operators.exactPhrase.toLowerCase();
        const titleMatch = entry.title.toLowerCase().includes(exactPhrase);
        const contentMatch = entry.content.toLowerCase().includes(exactPhrase);
        return titleMatch || contentMatch;
      }

      // Apply free text search
      if (searchTerms) {
        const titleMatch = entry.title.toLowerCase().includes(searchTerms);
        const contentMatch = entry.content.toLowerCase().includes(searchTerms);
        return titleMatch || contentMatch;
      }

      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(entry => entry.chatId);
}

/**
 * Calculate search result highlights (snippet of text around matches)
 * Returns a snippet showing context around the first match
 */
export function getSearchHighlight(content: string, query: string, maxLength: number = 150): string {
  if (!content || !query) {
    return content?.substring(0, Math.min(maxLength, content.length)) || '';
  }

  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerContent.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return content.substring(0, Math.min(maxLength, content.length));
  }

  // Calculate snippet bounds around the match
  const contextLength = 50;
  let snippetStart = Math.max(0, matchIndex - contextLength);
  let snippetEnd = Math.min(content.length, matchIndex + query.length + contextLength);

  // Adjust if snippet exceeds maxLength
  if (snippetEnd - snippetStart > maxLength) {
    // Prioritize showing query with minimal context
    const queryLength = query.length;
    const totalEllipsis = snippetStart > 0 && snippetEnd < content.length ? 6 : // both sides
                       snippetStart > 0 || snippetEnd < content.length ? 3 : 0; // one side

    // Calculate available space for content
    const availableContent = maxLength - totalEllipsis - queryLength;

    if (availableContent > 0) {
      const leadingContext = Math.floor(availableContent / 2);
      const trailingContext = availableContent - leadingContext;

      snippetStart = Math.max(0, matchIndex - leadingContext);
      snippetEnd = Math.min(content.length, matchIndex + query.length + trailingContext);
    } else {
      // Show just match with ellipses if no space for context
      snippetEnd = Math.min(content.length, matchIndex + query.length);
    }
  }

  let snippet = content.substring(snippetStart, snippetEnd);

  // Add ellipsis if truncated
  if (snippetStart > 0) {
    snippet = '...' + snippet;
  }
  if (snippetEnd < content.length) {
    snippet = snippet + '...';
  }

  return snippet;
}
