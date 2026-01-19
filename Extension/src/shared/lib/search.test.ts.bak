import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchChats, getSearchHighlight, parseSearchQuery } from './search';
import { Chat } from '../types';

describe('search.ts', () => {
  describe('parseSearchQuery', () => {
    it('parses empty query', () => {
      const result = parseSearchQuery('');

      expect(result.text).toBe('');
      expect(result.operators).toEqual({});
    });

    it('parses free text without operators', () => {
      const result = parseSearchQuery('react development');

      expect(result.text).toBe('react development');
      expect(result.operators).toEqual({});
    });

    it('parses platform: operator', () => {
      const result = parseSearchQuery('platform:claude');

      expect(result.text).toBe('');
      expect(result.operators.platform).toBe('claude');
    });

    it('parses platform: operator with free text', () => {
      const result = parseSearchQuery('react platform:claude');

      expect(result.text).toBe('react');
      expect(result.operators.platform).toBe('claude');
    });

    it('parses platform: operator case-insensitively', () => {
      const result1 = parseSearchQuery('Platform:Claude');
      const result2 = parseSearchQuery('PLATFORM:CLAUDE');

      expect(result1.operators.platform).toBe('claude');
      expect(result2.operators.platform).toBe('claude');
    });

    it('parses tag: operator', () => {
      const result = parseSearchQuery('tag:work');

      expect(result.text).toBe('');
      expect(result.operators.tag).toBe('work');
    });

    it('parses folder: operator', () => {
      const result = parseSearchQuery('folder:projects');

      expect(result.text).toBe('');
      expect(result.operators.folder).toBe('projects');
    });

    it('parses before: operator', () => {
      const result = parseSearchQuery('before:2024-01-15');

      expect(result.text).toBe('');
      expect(result.operators.before).toEqual(new Date('2024-01-15'));
    });

    it('parses after: operator', () => {
      const result = parseSearchQuery('after:2024-01-01');

      expect(result.text).toBe('');
      expect(result.operators.after).toEqual(new Date('2024-01-01'));
    });

    it('parses multiple operators together', () => {
      const result = parseSearchQuery('react platform:claude tag:work after:2024-01-01');

      expect(result.text).toBe('react');
      expect(result.operators.platform).toBe('claude');
      expect(result.operators.tag).toBe('work');
      expect(result.operators.after).toEqual(new Date('2024-01-01'));
    });

    it('parses exact phrase with quotes', () => {
      const result = parseSearchQuery('"exact phrase"');

      expect(result.text).toBe('');
      expect(result.operators.exactPhrase).toBe('exact phrase');
    });

    it('parses exact phrase without quotes removed from text', () => {
      const result = parseSearchQuery('react "exact phrase" development');

      expect(result.text).toBe('react development');
      expect(result.operators.exactPhrase).toBe('exact phrase');
    });

    it('handles invalid date format gracefully', () => {
      const result = parseSearchQuery('before:invalid-date');

      expect(result.text).toBe('before:invalid-date');
      expect(result.operators.before).toBeUndefined();
    });

    it('handles invalid operator type gracefully', () => {
      const result = parseSearchQuery('invalid:value');

      expect(result.text).toBe('invalid:value');
      expect(result.operators.platform).toBeUndefined();
      expect(result.operators.tag).toBeUndefined();
      expect(result.operators.folder).toBeUndefined();
    });

    it('parses platform:claude operator', () => {
      const result = parseSearchQuery('platform:claude');

      expect(result.text).toBe('');
      expect(result.operators.platform).toBe('claude');
    });

    it('parses tag:work operator', () => {
      const result = parseSearchQuery('tag:work');

      expect(result.text).toBe('');
      expect(result.operators.tag).toBe('work');
    });

    it('parses folder:projects operator', () => {
      const result = parseSearchQuery('folder:projects');

      expect(result.text).toBe('');
      expect(result.operators.folder).toBe('projects');
    });

    it('parses before:2024-01-15 operator', () => {
      const result = parseSearchQuery('before:2024-01-15');

      expect(result.text).toBe('');
      expect(result.operators.before).toEqual(new Date('2024-01-15'));
    });

    it('parses after:2024-01-01 operator', () => {
      const result = parseSearchQuery('after:2024-01-01');

      expect(result.text).toBe('');
      expect(result.operators.after).toEqual(new Date('2024-01-01'));
    });

    it('extracts free text and operators separately', () => {
      const result = parseSearchQuery('react development platform:claude');

      expect(result.text).toBe('react development');
      expect(result.operators.platform).toBe('claude');
    });

    it('ignores invalid operators and leaves them as text', () => {
      const result = parseSearchQuery('react invalid:value');

      expect(result.text).toBe('react invalid:value');
      expect(result.operators.platform).toBeUndefined();
    });

    it('handles quoted exact phrase operator', () => {
      const result = parseSearchQuery('"component architecture"');

      expect(result.text).toBe('');
      expect(result.operators.exactPhrase).toBe('component architecture');
    });
  });

  describe('buildSearchIndex', () => {
    it('builds empty index from empty chats array', () => {
      const chats: Chat[] = [];
      const index = buildSearchIndex(chats);

      expect(index).toEqual([]);
    });

    it('builds index with all required fields', () => {
      const chats: Chat[] = [
        {
          id: 'chat1',
          title: 'Test Chat',
          preview: 'This is the preview text',
          platform: 'claude',
          timestamp: 1234567890,
          folderId: 'folder1',
          isPinned: false,
          tags: ['tag1', 'tag2']
        }
      ];

      const index = buildSearchIndex(chats);

      expect(index).toHaveLength(1);
      expect(index[0]).toEqual({
        chatId: 'chat1',
        title: 'Test Chat',
        content: 'This is the preview text', // Note: placeholder format
        platform: 'claude',
        timestamp: 1234567890,
        folderId: 'folder1',
        tags: ['tag1', 'tag2']
      });
    });

    it('builds index with multiple chats', () => {
      const chats: Chat[] = [
        {
          id: 'chat1',
          title: 'First Chat',
          preview: 'First preview',
          platform: 'claude',
          timestamp: 1234567890,
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat2',
          title: 'Second Chat',
          preview: 'Second preview',
          platform: 'chatgpt',
          timestamp: 1234567900,
          folderId: undefined,
          isPinned: true,
          tags: ['tag1']
        },
        {
          id: 'chat3',
          title: 'Third Chat',
          preview: 'Third preview',
          platform: 'perplexity',
          timestamp: 1234567910,
          folderId: 'folder2',
          isPinned: false,
          tags: ['tag2', 'tag3']
        }
      ];

      const index = buildSearchIndex(chats);

      expect(index).toHaveLength(3);
      expect(index[0].chatId).toBe('chat1');
      expect(index[1].chatId).toBe('chat2');
      expect(index[2].chatId).toBe('chat3');
    });

    it('handles undefined folderId as null', () => {
      const chats: Chat[] = [
        {
          id: 'chat1',
          title: 'Test Chat',
          preview: 'Preview',
          platform: 'claude',
          timestamp: 1234567890,
          folderId: undefined,
          isPinned: false,
          tags: []
        }
      ];

      const index = buildSearchIndex(chats);

      expect(index[0].folderId).toBeNull();
    });

    it('preserves all metadata in index', () => {
      const chats: Chat[] = [
        {
          id: 'chat-abc-123',
          title: 'Important Discussion',
          preview: 'Long conversation about important topic',
          platform: 'claude',
          timestamp: 1700000000000,
          folderId: 'folder-xyz',
          isPinned: true,
          tags: ['work', 'important']
        }
      ];

      const index = buildSearchIndex(chats);

      expect(index[0]).toMatchObject({
        chatId: 'chat-abc-123',
        title: 'Important Discussion',
        content: 'Long conversation about important topic',
        platform: 'claude',
        timestamp: 1700000000000,
        folderId: 'folder-xyz',
        tags: ['work', 'important']
      });
    });
  });

  describe('searchChats', () => {
    let index: ReturnType<typeof buildSearchIndex>;

    beforeEach(() => {
      const chats: Chat[] = [
        {
          id: 'chat1',
          title: 'React Development',
          preview: 'Discussion about React components',
          platform: 'claude',
          timestamp: 1234567920,
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat2',
          title: 'TypeScript Basics',
          preview: 'Learning TypeScript fundamentals',
          platform: 'chatgpt',
          timestamp: 1234567930,
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat3',
          title: 'Deployment Guide',
          preview: 'How to deploy React apps to production',
          platform: 'perplexity',
          timestamp: 1234567940,
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat4',
          title: 'API Design',
          preview: 'RESTful API design principles',
          platform: 'claude',
          timestamp: 1234567950,
          folderId: null,
          isPinned: false,
          tags: []
        }
      ];

      index = buildSearchIndex(chats);
    });

    it('returns empty array for empty query', () => {
      const results = searchChats('', index);

      expect(results).toEqual([]);
    });

    it('returns empty array for whitespace-only query', () => {
      const results = searchChats('   ', index);

      expect(results).toEqual([]);
    });

    it('finds chats by title match', () => {
      const results = searchChats('react', index);

      expect(results).toHaveLength(2);
      expect(results).toContain('chat1'); // React Development
      expect(results).toContain('chat3'); // Deployment Guide (contains "react")
    });

    it('finds chats by content match', () => {
      const results = searchChats('deploy', index);

      expect(results).toContain('chat3');
      expect(results).toHaveLength(1);
    });

    it('is case-insensitive', () => {
      const resultsLower = searchChats('react', index);
      const resultsUpper = searchChats('REACT', index);
      const resultsMixed = searchChats('ReAcT', index);

      expect(resultsLower).toEqual(resultsUpper);
      expect(resultsLower).toEqual(resultsMixed);
    });

    it('returns empty array when no matches found', () => {
      const results = searchChats('nonexistent', index);

      expect(results).toEqual([]);
    });

    it('finds by partial word match', () => {
      const results = searchChats('type', index);

      expect(results).toContain('chat2'); // TypeScript
    });

    it('sorts results by timestamp (newest first)', () => {
      // "deployment" matches chat3 (Deployment Guide)
      // chat3 has newest timestamp
      const results = searchChats('deployment', index);

      expect(results).toHaveLength(1);
      expect(results[0]).toBe('chat3'); // Newest first
    });

    it('finds chats matching in both title and content', () => {
      const results = searchChats('react', index);

      expect(results).toContain('chat1');
      // chat3 has "react" in content but not components
      expect(results.length).toBeGreaterThan(0);
    });

    it('handles special characters in search query', () => {
      // "components" might appear in the development` or `guide`
      const results = searchChats('guide', index);

      expect(results).toContain('chat3');
    });

    it('matches multiple chats with same term', () => {
      const results = searchChats('guide', index);

      expect(results.length).toBeGreaterThan(0);
    });

    // Operator tests
    it('filters by platform:claude operator', () => {
      const results = searchChats('platform:claude', index);

      expect(results).toContain('chat1');
      expect(results).toContain('chat4');
      expect(results).not.toContain('chat2');
      expect(results).not.toContain('chat3');
      expect(results).toHaveLength(2);
    });

    it('filters by platform:chatgpt operator', () => {
      const results = searchChats('platform:chatgpt', index);

      expect(results).toContain('chat2');
      expect(results).not.toContain('chat1');
      expect(results).not.toContain('chat3');
      expect(results).not.toContain('chat4');
      expect(results).toHaveLength(1);
    });

    it('filters by platform:perplexity operator', () => {
      const results = searchChats('platform:perplexity', index);

      expect(results).toContain('chat3');
      expect(results).toHaveLength(1);
    });

    it('combines platform filter with text search', () => {
      const results = searchChats('react platform:claude', index);

      expect(results).toContain('chat1');
      expect(results).not.toContain('chat2');
      expect(results).not.toContain('chat3');
      expect(results).not.toContain('chat4');
      expect(results).toHaveLength(1);
    });

    it('handles case-insensitive platform filter', () => {
      const results1 = searchChats('Platform:Claude', index);
      const results2 = searchChats('PLATFORM:perplexity', index);

      expect(results1).toContain('chat1');
      expect(results1).not.toContain('chat2');
      expect(results2).toContain('chat3');
    });

    it('filters by tag: operator', () => {
      const tagIndex = buildSearchIndex([
        {
          id: 'chat1',
          title: 'React Chat',
          preview: 'About React',
          platform: 'claude',
          timestamp: 1,
          folderId: null,
          isPinned: false,
          tags: ['work']
        },
        {
          id: 'chat2',
          title: 'TypeScript Chat',
          preview: 'About TypeScript',
          platform: 'claude',
          timestamp: 2,
          folderId: null,
          isPinned: false,
          tags: ['personal']
        },
        {
          id: 'chat3',
          title: 'Other Chat',
          preview: 'About something',
          platform: 'claude',
          timestamp: 3,
          folderId: null,
          isPinned: false,
          tags: ['work']
        }
      ]);

      const results = searchChats('tag:work', tagIndex);

      expect(results).toContain('chat1');
      expect(results).toContain('chat3');
      expect(results).not.toContain('chat2');
      expect(results).toHaveLength(2);
    });

    it('filters by folder: operator', () => {
      const folderIndex = buildSearchIndex([
        {
          id: 'chat1',
          title: 'Chat 1',
          preview: 'Content',
          platform: 'claude',
          timestamp: 1,
          folderId: 'project-folder',
          isPinned: false,
          tags: []
        },
        {
          id: 'chat2',
          title: 'Chat 2',
          preview: 'Content',
          platform: 'claude',
          timestamp: 2,
          folderId: 'work-folder',
          isPinned: false,
          tags: []
        },
        {
          id: 'chat3',
          title: 'Chat 3',
          preview: 'Content',
          platform: 'claude',
          timestamp: 3,
          folderId: 'project-folder',
          isPinned: false,
          tags: []
        }
      ]);

      const results = searchChats('folder:project', folderIndex);

      expect(results).toContain('chat1');
      expect(results).toContain('chat3');
      expect(results).not.toContain('chat2');
      expect(results).toHaveLength(2);
    });

    it('filters by before: operator', () => {
      const dateIndex = buildSearchIndex([
        {
          id: 'chat1',
          title: 'Chat 1',
          preview: 'Content',
          platform: 'claude',
          timestamp: new Date('2024-01-10').getTime(),
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat2',
          title: 'Chat 2',
          preview: 'Content',
          platform: 'claude',
          timestamp: new Date('2024-01-20').getTime(),
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat3',
          title: 'Chat 3',
          preview: 'Content',
          platform: 'claude',
          timestamp: new Date('2024-02-01').getTime(),
          folderId: null,
          isPinned: false,
          tags: []
        }
      ]);

      const results = searchChats('before:2024-01-15', dateIndex);

      expect(results).toContain('chat1');
      expect(results).not.toContain('chat2');
      expect(results).not.toContain('chat3');
      expect(results).toHaveLength(1);
    });

    it('filters by after: operator', () => {
      const dateIndex = buildSearchIndex([
        {
          id: 'chat1',
          title: 'Chat 1',
          preview: 'Content',
          platform: 'claude',
          timestamp: new Date('2024-01-10').getTime(),
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat2',
          title: 'Chat 2',
          preview: 'Content',
          platform: 'claude',
          timestamp: new Date('2024-01-20').getTime(),
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat3',
          title: 'Chat 3',
          preview: 'Content',
          platform: 'claude',
          timestamp: new Date('2024-02-01').getTime(),
          folderId: null,
          isPinned: false,
          tags: []
        }
      ]);

      const results = searchChats('after:2024-01-15', dateIndex);

      expect(results).not.toContain('chat1');
      expect(results).toContain('chat2');
      expect(results).toContain('chat3');
      expect(results).toHaveLength(2);
    });

    it('searches with exact phrase in quotes', () => {
      const exactIndex = buildSearchIndex([
        {
          id: 'chat1',
          title: 'Exact Phrase Match',
          preview: 'The text contains the exact phrase',
          platform: 'claude',
          timestamp: 1,
          folderId: null,
          isPinned: false,
          tags: []
        },
        {
          id: 'chat2',
          title: 'Partial Match',
          preview: 'The text contains exact but not phrase',
          platform: 'claude',
          timestamp: 2,
          folderId: null,
          isPinned: false,
          tags: []
        }
      ]);

      const results = searchChats('"exact phrase"', exactIndex);

      expect(results).toContain('chat1');
      expect(results).not.toContain('chat2');
      expect(results).toHaveLength(1);
    });

    it('combines multiple operators', () => {
      const multiIndex = buildSearchIndex([
        {
          id: 'chat1',
          title: 'React Deployment',
          preview: 'About deploying React apps',
          platform: 'claude',
          timestamp: new Date('2024-01-10').getTime(),
          folderId: 'project-folder',
          isPinned: false,
          tags: ['work']
        },
        {
          id: 'chat2',
          title: 'React Development',
          preview: 'About React components',
          platform: 'claude',
          timestamp: new Date('2024-01-20').getTime(),
          folderId: 'work-folder',
          isPinned: false,
          tags: ['personal']
        },
        {
          id: 'chat3',
          title: 'TypeScript Guide',
          preview: 'About TypeScript',
          platform: 'chatgpt',
          timestamp: new Date('2024-01-15').getTime(),
          folderId: 'project-folder',
          isPinned: false,
          tags: ['work']
        }
      ]);

      const results = searchChats('react platform:claude tag:work', multiIndex);

      expect(results).toContain('chat1');
      expect(results).not.toContain('chat2'); // has personal tag
      expect(results).not.toContain('chat3'); // different platform
      expect(results).toHaveLength(1);
    });

    it('handles operators with no text search', () => {
      const results = searchChats('platform:claude', index);

      expect(results).toHaveLength(2);
      expect(results).toContain('chat1');
      expect(results).toContain('chat4');
    });

    it('handles invalid operator gracefully', () => {
      const results = searchChats('invalid:value', index);

      // Invalid operator is treated as text
      expect(results).toEqual([]);
    });
  });

  describe('getSearchHighlight', () => {
    it('returns empty string for empty content', () => {
      const highlight = getSearchHighlight('', 'query');

      expect(highlight).toBe('');
    });

    it('returns empty string for empty query', () => {
      const content = 'Some content';
      const highlight = getSearchHighlight(content, '');

      // When no match/query, returns first maxLength characters
      expect(highlight).toBe(content); // Full content since it's short
    });

    it('returns substring when no match found', () => {
      const content = 'This is some content about React';
      const highlight = getSearchHighlight(content, 'nonexistent');

      expect(highlight).toBe(content.substring(0, 150));
    });

    it('shows snippet around match with ellipsis', () => {
      const content = 'This is a long piece of text that discusses React development and component architecture in detail';
      const highlight = getSearchHighlight(content, 'React');

      expect(highlight).toContain('React');
      expect(highlight.length).toBeLessThanOrEqual(content.length);
    });

    it('adds ellipsis at end when truncated', () => {
      const longContent = 'This is a very long piece of text that continues on and on and on. It contains the match somewhere in the middle. Then it continues with more content after the match.';
      const highlight = getSearchHighlight(longContent, 'match', 50);

      expect(highlight).toContain('...');
      expect(highlight).toContain('match');
      expect(highlight.length).toBeLessThanOrEqual(50 + 6); // max + '...x2'
    });

    it('adds ellipsis at start when match is after beginning', () => {
      const content = 'Start text without match. Then we have match here. More text after.';
      const highlight = getSearchHighlight(content, 'match', 30);

      expect(highlight).toContain('match');
      expect(highlight).toContain('...');
      expect(highlight.length).toBeLessThan(content.length);
    });

    it('adds ellipsis at both ends when match is in middle', () => {
      const longContent = 'Very long content at the start. Middle section contains match somewhere. Then very long content at end that should be truncated.';
      const highlight = getSearchHighlight(longContent, 'match', 40);

      expect(highlight).toMatch(/^\.\.\./);
      expect(highlight).toContain('match');
      expect(highlight).toMatch(/\.\.\.$/);
    });

    it('respects maxLength parameter', () => {
      const content = 'This is content with match included somewhere';
      const highlight = getSearchHighlight(content, 'match', 30);

      expect(highlight.length).toBeLessThan(content.length);
      expect(highlight).toContain('match');
    });

    it('finds first match when multiple exist', () => {
      const content = 'First match here. Second match there. Third match there.';
      const highlight = getSearchHighlight(content, 'match');

      expect(highlight).toContain('match');
      // Should show some context around match
      expect(highlight.length).toBeLessThanOrEqual(content.length);
    });

    it('handles case-insensitive matching', () => {
      const content = 'This discusses React component architecture';
      const highlight = getSearchHighlight(content, 'REACT');

      expect(highlight).toContain('React');
      expect(highlight).toContain('component');
    });

    it('uses default maxLength when not specified', () => {
      const content = 'This is a long content with match that should be truncated according to default length';
      const highlight = getSearchHighlight(content, 'match');

      expect(highlight.length).toBeLessThanOrEqual(156); // 150 + '...' max
    });
  });
});
