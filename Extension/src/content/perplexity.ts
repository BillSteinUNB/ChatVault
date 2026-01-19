import { BaseScraper } from './base-scraper';
import { ScrapedMessage } from './types';

/**
 * Perplexity.ai DOM Scraper
 *
 * DOM Structure Analysis:
 * - Main thread container: Thread container holds the conversation
 * - User queries: Elements with user message styling
 * - AI responses: Elements with AI response styling
 * - Source citations: Small citation elements that reference sources
 * - Follow-up suggestions: Suggested questions after responses
 *
 * Selectors (based on Perplexity's 2025 UI):
 * - Thread container: Main page content area
 * - Messages: Elements with message role classes
 * - User messages: Classes indicating user role
 * - Assistant messages: Classes indicating assistant role
 * - Citations: Small reference elements
 */
class PerplexityScraper extends BaseScraper {
  private lastMessageCount = 0;
  private debounceTimer: number | null = null;

  // CSS classes and selectors for Perplexity DOM
  private static readonly USER_MESSAGE_CLASS = 'text-gray-800';
  private static readonly ASSISTANT_MESSAGE_CLASS = 'prose';
  private static readonly CITATION_CLASS = 'cite';
  private static readonly FOLLOWUP_CLASS = 'suggestion';

  // UI elements to ignore (buttons, icons, etc.)
  private static readonly UI_CHROME_SELECTORS = [
    'button',
    'svg',
    '[role="button"]',
    '[aria-label*="Copy" i]',
    '[aria-label*="copy" i]',
    '[data-testid*="copy" i]',
    '[data-testid*="tooltip" i]',
  ] as const;

  constructor() {
    super({
      platform: 'perplexity',
      selectors: {
        container: 'main',
        chatContainer: '[class*="thread"]',
        message: '[class*="message"], [class*="prose"], div[class*="text-gray-800"]',
        roleUser: 'div[class*="text-gray-800"]',
        roleAssistant: 'div[class*="prose"]',
      }
    });
  }

  protected scrape(): void {
    // Debounce to avoid excessive processing during rapid DOM changes
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.performScrape();
    }, 500);
  }

  private performScrape(): void {
    const messages: ScrapedMessage[] = [];

    // Get all message elements using the configured selector
    const messageElements = document.querySelectorAll(this.config.selectors.message);

    if (messageElements.length === 0) {
      console.log('[ChatVault] Perplexity: No messages found on page');
      return;
    }

    // Only process if message count changed (optimization)
    if (messageElements.length === this.lastMessageCount) {
      return;
    }
    this.lastMessageCount = messageElements.length;

    messageElements.forEach((element) => {
      const isUser = this.isUserMessage(element);
      const role: 'user' | 'assistant' = isUser ? 'user' : 'assistant';

      // Extract content, preserving source citations
      const content = isUser 
        ? this.extractUserMessageContent(element)
        : this.extractAssistantMessageContent(element);

      if (!content.trim()) {
        return; // Skip empty messages
      }

      messages.push({
        role,
        content: content.trim(),
        timestamp: Date.now() // Perplexity doesn't expose timestamps in DOM
      });
    });

    if (messages.length === 0) {
      console.log('[ChatVault] Perplexity: No valid messages extracted');
      return;
    }

    // Extract title from page title
    let title = document.title.trim();
    if (!title || title === 'Perplexity') {
      // Fallback: use first user message as title
      const firstUserMsg = messages.find(m => m.role === 'user');
      title = firstUserMsg
        ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
        : 'Untitled Chat';
    }

    console.log(`[ChatVault] Perplexity: Scraped ${messages.length} messages`);
    this.saveChat(title, messages);
  }

  /**
   * Determine if an element is a user message
   */
  private isUserMessage(element: Element): boolean {
    const className = element.className || '';
    
    // Check for user message class
    if (className.includes('text-gray-800')) {
      return true;
    }

    // Check for other user-specific indicators
    if (element.matches('[class*="user"]')) {
      return true;
    }

    // Default to assistant message
    return false;
  }

  /**
   * Extract user message content
   */
  private extractUserMessageContent(element: Element): string {
    // Clone to avoid modifying the original DOM
    const clone = element.cloneNode(true) as Element;

    // Remove UI chrome elements
    clone.querySelectorAll(PerplexityScraper.UI_CHROME_SELECTORS.join(',')).forEach((n) => n.remove());

    // Get text content
    return clone.textContent?.trim() || '';
  }

  /**
   * Extract assistant message content with citations preserved
   */
  private extractAssistantMessageContent(element: Element): string {
    // Clone to avoid modifying the original DOM
    const clone = element.cloneNode(true) as Element;

    // Remove UI chrome elements but keep citations
    clone.querySelectorAll(PerplexityScraper.UI_CHROME_SELECTORS.join(',')).forEach((n) => n.remove());

    // Process citations - add them as references
    const citations: string[] = [];
    const citationElements = clone.querySelectorAll('[class*="cite"], [class*="citation"]');
    citationElements.forEach((citation, index) => {
      const citationText = citation.textContent?.trim();
      if (citationText) {
        citations.push(`[${index + 1}] ${citationText}`);
      }
    });

    // Get main content
    let content = clone.textContent?.trim() || '';

    // Append citations if any exist
    if (citations.length > 0) {
      content += '\n\n---\nSources:\n' + citations.join('\n');
    }

    return content;
  }

  /**
   * Get chat title from DOM
   * Perplexity often displays the query as the title in the thread
   */
  protected getChatTitle(): string {
    // Try page title first
    let title = document.title.trim();
    
    // Remove common suffixes
    title = title.replace(' - Perplexity', '').trim();
    title = title.replace(' | Perplexity', '').trim();
    
    if (title && title !== 'Perplexity') {
      return title;
    }

    // Fallback: try to find the first user message
    const firstUserMessage = document.querySelector(PerplexityScraper.UI_CHROME_SELECTORS.join(','));
    if (firstUserMessage) {
      const text = firstUserMessage.textContent?.trim();
      if (text) {
        return text.slice(0, 50) + (text.length > 50 ? '...' : '');
      }
    }

    // Final fallback
    return 'Untitled Chat';
  }

  /**
   * Get chat URL
   */
  protected getChatUrl(): string {
    return window.location.href;
  }
}

// Initialize the scraper
const scraper = new PerplexityScraper();
scraper.init();

// Export for testing
export { PerplexityScraper };
