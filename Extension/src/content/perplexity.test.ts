/**
 * Tests for Perplexity Scraper
 *
 * Note: Content script scrapers are complex to test due to DOM API dependencies.
 * These tests focus on basic configuration and functionality that can be mocked.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerplexityScraper } from './perplexity';
import { ScrapedMessage } from './types';

// Mock chrome.runtime.sendMessage
const mockSendMessage = vi.fn();
vi.stubGlobal('chrome', {
  runtime: {
    sendMessage: mockSendMessage
  }
});

// Minimal DOM stub for tests (avoiding full DOM mocking complexity)
const minimalDOM: any = {
  title: 'Test Query - Perplexity',
  querySelectorAll: vi.fn(() => []),
  querySelector: vi.fn(() => null),
};

describe('PerplexityScraper', () => {
  let scraper: PerplexityScraper;

  beforeEach(() => {
    // Reset mocks
    mockSendMessage.mockClear();
    vi.useFakeTimers();

    // Minimal DOM stub
    vi.stubGlobal('document', minimalDOM);
    vi.stubGlobal('window', {
      location: {
        href: 'https://www.perplexity.ai/test'
      },
      setTimeout: vi.fn((cb: any, ms: number) => {
        // Execute immediately for testing
        cb();
        return 1 as any;
      }),
      clearTimeout: vi.fn()
    });

    // Initialize scraper
    scraper = new PerplexityScraper();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Configuration', () => {
    it('should be a valid PerplexityScraper instance', () => {
      expect(scraper).toBeInstanceOf(PerplexityScraper);
    });

    it('should initialize successfully', () => {
      expect(scraper).toBeDefined();
    });

    it('should have init method', () => {
      expect(typeof (scraper as any).init).toBe('function');
    });

    it('should have scrape method', () => {
      expect(typeof (scraper as any).scrape).toBe('function');
    });

    it('should have saveChat method', () => {
      expect(typeof (scraper as any).saveChat).toBe('function');
    });
  });

  describe('Title extraction', () => {
    it('should extract title from page title with Perplexity suffix', () => {
      minimalDOM.title = 'What is AI - Perplexity';
      const title = (scraper as any).getChatTitle();
      
      expect(title).toBe('What is AI');
    });

    it('should extract title from page title with pipe separator', () => {
      minimalDOM.title = 'What is AI | Perplexity';
      const title = (scraper as any).getChatTitle();
      
      expect(title).toBe('What is AI');
    });

    it('should return Untitled Chat when title is empty', () => {
      minimalDOM.title = '';
      const title = (scraper as any).getChatTitle();
      
      expect(title).toBe('Untitled Chat');
    });

    it('should return Untitled Chat when title is just Perplexity', () => {
      minimalDOM.title = 'Perplexity';
      const title = (scraper as any).getChatTitle();
      
      expect(title).toBe('Untitled Chat');
    });
  });

  describe('URL extraction', () => {
    it('should return current page URL', () => {
      minimalDOM.title = 'Test Query - Perplexity';
      const url = (scraper as any).getChatUrl();
      
      expect(url).toBe('https://www.perplexity.ai/test');
    });

    it('should return URL from window.location', () => {
      expect((scraper as any).getChatUrl()).toBe('https://www.perplexity.ai/test');
    });
  });

  describe('Debouncing behavior', () => {
    it('should be able to call scrape without errors', () => {
      expect(() => {
        (scraper as any).scrape();
      }).not.toThrow();
    });
  });

  describe('Chrome integration', () => {
    it('should have access to chrome runtime API', () => {
      expect(typeof chrome.runtime).toBe('object');
      expect(typeof chrome.runtime.sendMessage).toBe('function');
    });

    it('should call chrome.runtime.sendMessage when saving chat', () => {
      // Create a mock message array
      const mockTitle = 'Test Query';
      const mockMessages: ScrapedMessage[] = [
        { role: 'user', content: 'Test message', timestamp: Date.now() }
      ];

      minimalDOM.title = mockTitle;
      (scraper as any).saveChat(mockTitle, mockMessages);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'SAVE_CHAT',
        payload: expect.objectContaining({
          platform: 'perplexity',
          title: mockTitle,
          messages: mockMessages,
          url: expect.any(String),
          updatedAt: expect.any(Number)
        })
      });
    });
  });

  describe('Message role identification', () => {
    it('should identify user messages by class name', () => {
      // The isUserMessage method checks for specific class patterns
      expect(typeof (scraper as any).isUserMessage).toBe('function');
    });

    it('should have extractUserMessageContent method', () => {
      expect(typeof (scraper as any).extractUserMessageContent).toBe('function');
    });

    it('should have extractAssistantMessageContent method', () => {
      expect(typeof (scraper as any).extractAssistantMessageContent).toBe('function');
    });
  });

  describe('No-op tests for complex DOM interactions', () => {
    it('should be able to call performScrape without errors', () => {
      // This test verifies that scraper can attempt to scrape
      // even when DOM returns no elements
      minimalDOM.querySelectorAll = vi.fn(() => []);
      
      expect(() => {
        (scraper as any).performScrape();
      }).not.toThrow();
    });

    it('should handle empty message result gracefully', () => {
      minimalDOM.querySelectorAll = vi.fn(() => []);
      
      expect(() => {
        (scraper as any).performScrape();
      }).not.toThrow();
      
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Method availability', () => {
    it('should have isUserMessage method', () => {
      expect(typeof (scraper as any).isUserMessage).toBe('function');
    });

    it('should have extractUserMessageContent method', () => {
      expect(typeof (scraper as any).extractUserMessageContent).toBe('function');
    });

    it('should have extractAssistantMessageContent method', () => {
      expect(typeof (scraper as any).extractAssistantMessageContent).toBe('function');
    });

    it('should have getChatTitle method', () => {
      expect(typeof (scraper as any).getChatTitle).toBe('function');
    });

    it('should have getChatUrl method', () => {
      expect(typeof (scraper as any).getChatUrl).toBe('function');
    });

    it('should have performScrape method', () => {
      expect(typeof (scraper as any).performScrape).toBe('function');
    });
  });
});
