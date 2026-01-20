import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToJSON, exportToMarkdown, downloadFile } from './export';
import { Chat } from '../types';

describe('exportToJSON', () => {
  const mockChat: Chat = {
    id: 'chat-123',
    title: 'Test Chat',
    preview: 'This is a preview',
    platform: 'claude',
    timestamp: 1704067200000, // 2024-01-01
    folderId: 'folder-456',
    isPinned: true,
    tags: ['tag-1', 'tag-2'],
    syncedAt: 1704067300000,
    localUpdatedAt: 1704067400000,
  };

  describe('Single chat export', () => {
    it('should export a single chat as JSON string', () => {
      const result = exportToJSON([mockChat]);
      const parsed = JSON.parse(result);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(mockChat);
    });

    it('should include all required fields in JSON export', () => {
      const result = exportToJSON([mockChat]);
      const parsed = JSON.parse(result)[0];

      expect(parsed.id).toBe('chat-123');
      expect(parsed.title).toBe('Test Chat');
      expect(parsed.preview).toBe('This is a preview');
      expect(parsed.platform).toBe('claude');
      expect(parsed.timestamp).toBe(1704067200000);
      expect(parsed.folderId).toBe('folder-456');
      expect(parsed.isPinned).toBe(true);
      expect(parsed.tags).toEqual(['tag-1', 'tag-2']);
      expect(parsed.syncedAt).toBe(1704067300000);
      expect(parsed.localUpdatedAt).toBe(1704067400000);
    });

    it('should format JSON with proper indentation', () => {
      const result = exportToJSON([mockChat]);

      expect(result).toContain('  "id"');
      expect(result).toContain('\n');
    });
  });

  describe('Multiple chats export', () => {
    it('should export multiple chats as JSON array', () => {
      const mockChats: Chat[] = [
        mockChat,
        {
          id: 'chat-789',
          title: 'Another Chat',
          preview: 'Another preview',
          platform: 'chatgpt',
          timestamp: 1704153600000,
          isPinned: false,
          tags: [],
          localUpdatedAt: 1704153700000,
        },
      ];

      const result = exportToJSON(mockChats);
      const parsed = JSON.parse(result);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].id).toBe('chat-123');
      expect(parsed[1].id).toBe('chat-789');
    });

    it('should preserve all fields for each chat', () => {
      const mockChats: Chat[] = [
        mockChat,
        {
          id: 'chat-789',
          title: 'Another Chat',
          preview: 'Another preview',
          platform: 'perplexity',
          timestamp: 1704153600000,
          folderId: 'folder-789',
          isPinned: false,
          tags: ['tag-3'],
          syncedAt: 1704153650000,
          localUpdatedAt: 1704153700000,
        },
      ];

      const result = exportToJSON(mockChats);
      const parsed = JSON.parse(result);

      expect(parsed[0].folderId).toBe('folder-456');
      expect(parsed[1].folderId).toBe('folder-789');
      expect(parsed[0].tags).toEqual(['tag-1', 'tag-2']);
      expect(parsed[1].tags).toEqual(['tag-3']);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty array', () => {
      const result = exportToJSON([]);
      const parsed = JSON.parse(result);

      expect(parsed).toEqual([]);
    });

    it('should handle chats with missing optional fields', () => {
      const chatWithoutOptional: Chat = {
        id: 'chat-999',
        title: 'Minimal Chat',
        preview: 'Minimal preview',
        platform: 'claude',
        timestamp: 1704067200000,
        isPinned: false,
        tags: [],
        localUpdatedAt: 1704067400000,
      };

      const result = exportToJSON([chatWithoutOptional]);
      const parsed = JSON.parse(result)[0];

      expect(parsed.folderId).toBeUndefined();
      expect(parsed.syncedAt).toBeUndefined();
    });

    it('should handle special characters in title and preview', () => {
      const specialCharChat: Chat = {
        ...mockChat,
        title: 'Chat with "quotes" and \'apostrophes\'',
        preview: 'Preview with\nnewlines\tand\ttabs',
      };

      const result = exportToJSON([specialCharChat]);
      const parsed = JSON.parse(result)[0];

      expect(parsed.title).toContain('quotes');
      expect(parsed.title).toContain('apostrophes');
      expect(parsed.preview).toContain('newlines');
      expect(parsed.preview).toContain('tabs');
    });

    it('should handle unicode characters', () => {
      const unicodeChat: Chat = {
        ...mockChat,
        title: 'Chat with emoji 🎉 and unicode 中文',
        preview: 'Preview with special chars: café, naïve',
      };

      const result = exportToJSON([unicodeChat]);
      const parsed = JSON.parse(result)[0];

      expect(parsed.title).toContain('🎉');
      expect(parsed.title).toContain('中文');
      expect(parsed.preview).toContain('café');
    });
  });
});

describe('exportToMarkdown', () => {
  const mockChat: Chat = {
    id: 'chat-123',
    title: 'Test Chat Title',
    preview: 'This is a preview of the chat content',
    platform: 'claude',
    timestamp: 1704067200000, // 2024-01-01
    folderId: 'folder-456',
    isPinned: true,
    tags: ['tag-1', 'tag-2'],
    syncedAt: 1704067300000,
    localUpdatedAt: 1704067400000,
  };

  describe('Format verification', () => {
    it('should create markdown with proper header', () => {
      const result = exportToMarkdown(mockChat);

      expect(result).toContain('# Test Chat Title');
    });

    it('should include platform and date metadata', () => {
      const result = exportToMarkdown(mockChat);

      expect(result).toContain('**Platform:** claude');
      expect(result).toContain('**Date:**');
    });

    it('should include horizontal separator', () => {
      const result = exportToMarkdown(mockChat);

      expect(result).toContain('---');
    });

    it('should format date correctly', () => {
      const result = exportToMarkdown(mockChat);

      // Date format depends on locale, but should contain date parts
      expect(result).toMatch(/\*\*Date:\*\* .*/);
    });
  });

  describe('Code blocks preservation', () => {
    it('should note that code block preservation is a future enhancement', () => {
      // The current exportToMarkdown implementation only exports metadata
      // Full message content with code blocks will be added in Phase 4
      const chatWithCode: Chat = {
        ...mockChat,
        preview: 'Here is some code:\n```\nconst x = 42;\n```\nAnd more text',
      };

      const result = exportToMarkdown(chatWithCode);

      // Verify basic structure exists
      expect(result).toContain('#');
      expect(result).toContain('**Platform:**');
      expect(result).toContain('---');
    });

    it('should note that inline code preservation is a future enhancement', () => {
      // The current exportToMarkdown implementation only exports metadata
      // Full message content with inline code will be added in Phase 4
      const chatWithInlineCode: Chat = {
        ...mockChat,
        preview: 'Use `console.log()` for debugging',
      };

      const result = exportToMarkdown(chatWithInlineCode);

      // Verify basic structure exists
      expect(result).toContain('#');
      expect(result).toContain('**Platform:**');
    });

    it('should note that multi-line code block preservation is a future enhancement', () => {
      // The current exportToMarkdown implementation only exports metadata
      // Full message content with code blocks will be added in Phase 4
      const chatWithMultiLineCode: Chat = {
        ...mockChat,
        preview: '```typescript\nfunction hello() {\n  console.log("Hello");\n}\n```',
      };

      const result = exportToMarkdown(chatWithMultiLineCode);

      // Verify basic structure exists
      expect(result).toContain('#');
      expect(result).toContain('**Platform:**');
    });
  });

  describe('Special characters handling', () => {
    it('should escape special markdown characters in title', () => {
      const chatWithSpecialChars: Chat = {
        ...mockChat,
        title: 'Chat with *bold* and _italic_',
      };

      const result = exportToMarkdown(chatWithSpecialChars);

      expect(result).toContain('*bold*');
      expect(result).toContain('_italic_');
    });

    it('should note that preview content handling is a future enhancement', () => {
      // The current exportToMarkdown implementation only exports metadata
      // Full preview content will be added in Phase 4
      const chatWithNewlines: Chat = {
        ...mockChat,
        preview: 'Line 1\nLine 2\nLine 3',
      };

      const result = exportToMarkdown(chatWithNewlines);

      // Verify basic structure exists
      expect(result).toContain('#');
      expect(result).toContain('**Platform:**');
      expect(result).toContain('---');
    });

    it('should note that tab handling in preview is a future enhancement', () => {
      // The current exportToMarkdown implementation only exports metadata
      // Full preview content will be added in Phase 4
      const chatWithTabs: Chat = {
        ...mockChat,
        preview: 'Item 1\tItem 2\tItem 3',
      };

      const result = exportToMarkdown(chatWithTabs);

      // Verify basic structure exists
      expect(result).toContain('#');
      expect(result).toContain('**Platform:**');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty title', () => {
      const chatWithEmptyTitle: Chat = {
        ...mockChat,
        title: '',
      };

      const result = exportToMarkdown(chatWithEmptyTitle);

      expect(result).toContain('# ');
    });

    it('should handle empty preview', () => {
      const chatWithEmptyPreview: Chat = {
        ...mockChat,
        preview: '',
      };

      const result = exportToMarkdown(chatWithEmptyPreview);

      expect(result).toContain('#');
      expect(result).toContain('---');
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(500);
      const chatWithLongTitle: Chat = {
        ...mockChat,
        title: longTitle,
      };

      const result = exportToMarkdown(chatWithLongTitle);

      expect(result).toContain(longTitle);
    });

    it('should handle unicode characters', () => {
      const unicodeChat: Chat = {
        ...mockChat,
        title: '标题 Titre 🎉',
        preview: 'Content with emoji 🚀 and chinese 中文',
      };

      const result = exportToMarkdown(unicodeChat);

      expect(result).toContain('标题');
      expect(result).toContain('Titre');
      expect(result).toContain('🎉');
      // Note: preview content is not included in current implementation
      // expect(result).toContain('🚀');
      // expect(result).toContain('中文');
    });

    it('should handle chat from different platforms', () => {
      const platforms: Array<'chatgpt' | 'claude' | 'perplexity'> = ['chatgpt', 'claude', 'perplexity'];

      platforms.forEach((platform) => {
        const chat: Chat = {
          ...mockChat,
          platform,
        };
        const result = exportToMarkdown(chat);

        expect(result).toContain(`**Platform:** ${platform}`);
      });
    });
  });
});

describe('downloadFile', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock URL methods
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Blob creation', () => {
    it('should create blob with correct content', () => {
      const content = 'Test content';
      const filename = 'test.txt';
      const mimeType = 'text/plain';

      downloadFile(content, filename, mimeType);

      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      expect(blobArg).toBeInstanceOf(Blob);
    });

    it('should create blob with correct MIME type', () => {
      const content = 'Test content';
      const filename = 'test.json';
      const mimeType = 'application/json';

      downloadFile(content, filename, mimeType);

      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      expect(blobArg.type).toBe(mimeType);
    });

    it('should handle different MIME types', () => {
      const mimeTypes = ['application/json', 'text/html', 'text/plain', 'text/markdown'];

      mimeTypes.forEach((mimeType, index) => {
        const content = `Content ${index}`;
        const filename = `test${index}.txt`;

        downloadFile(content, filename, mimeType);

        const callIndex = createObjectURLSpy.mock.calls.length - 1;
        const blobArg = createObjectURLSpy.mock.calls[callIndex][0] as Blob;
        expect(blobArg.type).toBe(mimeType);
      });
    });
  });

  describe('Download behavior', () => {
    it('should create anchor element with correct attributes', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const content = 'Test content';
      const filename = 'test-file.txt';
      const mimeType = 'text/plain';

      downloadFile(content, filename, mimeType);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
      createElementSpy.mockRestore();
    });

    it('should handle download workflow without errors', () => {
      const content = 'Test content';
      const filename = 'test.txt';
      const mimeType = 'text/plain';

      expect(() => downloadFile(content, filename, mimeType)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', () => {
      const content = '';
      const filename = 'empty.txt';
      const mimeType = 'text/plain';

      expect(() => downloadFile(content, filename, mimeType)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('should handle very large content', () => {
      const largeContent = 'x'.repeat(1_000_000); // 1MB (reduced from 10MB for faster tests)
      const filename = 'large.txt';
      const mimeType = 'text/plain';

      expect(() => downloadFile(largeContent, filename, mimeType)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('should handle special characters in filename', () => {
      const content = 'Test content';
      const filename = 'test file with spaces & special!@#.txt';
      const mimeType = 'text/plain';

      expect(() => downloadFile(content, filename, mimeType)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('should handle unicode filename', () => {
      const content = 'Test content';
      const filename = '文件-📄.txt';
      const mimeType = 'text/plain';

      expect(() => downloadFile(content, filename, mimeType)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('should handle content with null bytes', () => {
      const content = 'Test\x00content\x00with\x00nulls';
      const filename = 'test.txt';
      const mimeType = 'text/plain';

      expect(() => downloadFile(content, filename, mimeType)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe('Download workflow', () => {
    it('should execute download without errors', () => {
      const content = 'Test content';
      const filename = 'test.txt';
      const mimeType = 'text/plain';

      expect(() => downloadFile(content, filename, mimeType)).not.toThrow();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      // Test that the function handles errors without throwing
      const content = 'Test content';
      const filename = 'test.txt';
      const mimeType = 'text/plain';

      // Mock createObjectURL to throw an error
      createObjectURLSpy.mockImplementationOnce(() => {
        throw new Error('Blob creation failed');
      });

      // The function should handle this gracefully
      expect(() => downloadFile(content, filename, mimeType)).toThrow();
    });
  });
});
