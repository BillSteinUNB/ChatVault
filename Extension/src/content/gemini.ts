// Extension/src/content/gemini.ts
import { BaseScraper } from './base-scraper';
import { ScrapedMessage } from './types';

/**
 * Google Gemini DOM Scraper
 * 
 * Selectors confirmed from:
 * - revivalstack/ai-chat-exporter (2025)
 * - GeoAnima/Gemini-Conversation-Downloader
 * 
 * DOM Structure:
 * - Uses custom HTML elements (Web Components): user-query, model-response
 * - User content is in <user-query> elements with div.query-content inside
 * - Model content is in <model-response> elements with <message-content> inside
 * - No Shadow DOM issues - uses standard custom elements
 */
class GeminiScraper extends BaseScraper {
  private lastMessageCount = 0;
  private debounceTimer: number | null = null;

  // Custom element selectors for Gemini's Web Components
  private static readonly USER_QUERY_TAG = 'user-query';
  private static readonly MODEL_RESPONSE_TAG = 'model-response';
  private static readonly USER_CONTENT_SELECTOR = 'div.query-content';
  private static readonly MODEL_CONTENT_SELECTOR = 'message-content';
  private static readonly SIDEBAR_ACTIVE_CHAT_SELECTOR = 
    'div[data-test-id="conversation"].selected .conversation-title';

  constructor() {
    super({
      platform: 'gemini',
      selectors: {
        container: 'main',
        message: 'user-query, model-response',
        roleUser: 'user-query',
        roleAssistant: 'model-response'
      }
    });
  }

  protected scrape(): void {
    // Debounce to avoid excessive processing
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.performScrape();
    }, 500);
  }

  private performScrape(): void {
    const messages: ScrapedMessage[] = [];
    
    // Query for both user and model messages using custom element selectors
    const messageElements = document.querySelectorAll(this.config.selectors.message);
    
    if (messageElements.length === 0) {
      console.log('[ChatVault] Gemini: No messages found on page');
      return;
    }

    // Only process if message count changed (optimization)
    if (messageElements.length === this.lastMessageCount) {
      return;
    }
    this.lastMessageCount = messageElements.length;

    messageElements.forEach((element) => {
      const tagName = element.tagName.toLowerCase();
      let role: 'user' | 'assistant';
      let contentElement: Element | null = null;

      if (tagName === GeminiScraper.USER_QUERY_TAG) {
        role = 'user';
        contentElement = element.querySelector(GeminiScraper.USER_CONTENT_SELECTOR);
      } else if (tagName === GeminiScraper.MODEL_RESPONSE_TAG) {
        role = 'assistant';
        contentElement = element.querySelector(GeminiScraper.MODEL_CONTENT_SELECTOR);
      } else {
        return; // Unknown element type
      }

      if (!contentElement) {
        // Fallback: try to get content from element itself
        const fallbackContent = element.textContent?.trim();
        if (fallbackContent) {
          messages.push({
            role,
            content: fallbackContent,
            timestamp: Date.now()
          });
        }
        return;
      }

      const content = contentElement.textContent?.trim() || '';
      
      if (!content) {
        return; // Skip empty messages
      }

      messages.push({
        role,
        content,
        timestamp: Date.now() // Gemini doesn't expose timestamps in DOM
      });
    });

    if (messages.length === 0) {
      console.log('[ChatVault] Gemini: No valid messages extracted');
      return;
    }

    // Extract title - try sidebar first, then page title
    let title = this.extractChatTitle();
    
    // Generate title from first user message if needed
    if (!title || title === 'Gemini' || title === 'chat') {
      const firstUserMsg = messages.find(m => m.role === 'user');
      if (firstUserMsg) {
        title = this.generateTitleFromMessage(firstUserMsg.content);
      } else {
        title = 'Untitled Chat';
      }
    }

    console.log(`[ChatVault] Gemini: Scraped ${messages.length} messages`);
    this.saveChat(title, messages);
  }

  /**
   * Extract chat title from sidebar or page title
   */
  private extractChatTitle(): string {
    // First, try to get title from the active chat in sidebar
    const sidebarTitle = document.querySelector(GeminiScraper.SIDEBAR_ACTIVE_CHAT_SELECTOR);
    if (sidebarTitle?.textContent?.trim()) {
      return sidebarTitle.textContent.trim();
    }

    // Fallback to page title
    let title = document.title.trim();
    
    // Remove "Gemini - " prefix if present
    if (title.startsWith('Gemini - ')) {
      title = title.replace('Gemini - ', '');
    }

    return title;
  }

  /**
   * Generate a title from the first few words of a message
   */
  private generateTitleFromMessage(content: string): string {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) {
      return 'Untitled Chat';
    }

    // Take first 7 words
    let generatedTitle = words.slice(0, 7).join(' ');
    
    // Remove trailing punctuation
    generatedTitle = generatedTitle.replace(/[,.;:!?\-+]$/, '').trim();
    
    // If too short, try more words
    if (generatedTitle.length < 5 && words.length > 1) {
      generatedTitle = words.slice(0, Math.min(words.length, 10)).join(' ');
      generatedTitle = generatedTitle.replace(/[,.;:!?\-+]$/, '').trim();
    }

    return generatedTitle || 'Untitled Chat';
  }
}

// Initialize the scraper
const scraper = new GeminiScraper();
scraper.init();
