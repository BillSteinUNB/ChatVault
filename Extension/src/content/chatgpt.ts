// Extension/src/content/chatgpt.ts
import { BaseScraper } from './base-scraper';
import { ScrapedMessage } from './types';

/**
 * ChatGPT DOM Scraper
 * 
 * Selectors confirmed from:
 * - Greasyfork ChatGPT Conversation Exporter (2024)
 * - revivalstack/ai-chat-exporter (2025)
 * 
 * DOM Structure:
 * - Messages are in elements with data-message-author-role attribute
 * - Role is "user" or "assistant"
 * - Content is within the element's textContent
 */
class ChatGPTScraper extends BaseScraper {
  private lastMessageCount = 0;
  private debounceTimer: number | null = null;

  constructor() {
    super({
      platform: 'chatgpt',
      selectors: {
        container: 'main',
        message: 'div[data-message-author-role]',
        roleUser: 'div[data-message-author-role="user"]',
        roleAssistant: 'div[data-message-author-role="assistant"]'
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
    
    // Get all message elements using the confirmed selector
    const messageElements = document.querySelectorAll(this.config.selectors.message);
    
    if (messageElements.length === 0) {
      console.log('[ChatVault] ChatGPT: No messages found on page');
      return;
    }

    // Only process if message count changed (optimization)
    if (messageElements.length === this.lastMessageCount) {
      return;
    }
    this.lastMessageCount = messageElements.length;

    messageElements.forEach((element, index) => {
      const role = element.getAttribute('data-message-author-role');
      
      if (!role || (role !== 'user' && role !== 'assistant')) {
        return; // Skip unknown roles
      }

      // Extract text content, cleaning up whitespace
      const content = this.extractMessageContent(element);
      
      if (!content.trim()) {
        return; // Skip empty messages
      }

      messages.push({
        role: role as 'user' | 'assistant',
        content: content.trim(),
        timestamp: Date.now() // ChatGPT doesn't expose timestamps in DOM
      });
    });

    if (messages.length === 0) {
      console.log('[ChatVault] ChatGPT: No valid messages extracted');
      return;
    }

    // Extract title from page title (remove " - ChatGPT" suffix)
    let title = document.title.replace(' - ChatGPT', '').trim();
    if (!title || title === 'ChatGPT') {
      // Fallback: use first user message as title
      const firstUserMsg = messages.find(m => m.role === 'user');
      title = firstUserMsg 
        ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
        : 'Untitled Chat';
    }

    console.log(`[ChatVault] ChatGPT: Scraped ${messages.length} messages`);
    this.saveChat(title, messages);
  }

  /**
   * Extract message content from a message element
   * Handles ChatGPT's nested structure with text divs
   */
  private extractMessageContent(element: Element): string {
    // ChatGPT puts message content in div.text-base elements
    // But the simpler approach is to use textContent directly
    // which handles most formatting
    
    const textDivs = element.querySelectorAll('div.text-base');
    
    if (textDivs.length > 0) {
      // Collect unique text content from text-base divs
      const seenContent = new Set<string>();
      let content = '';
      
      textDivs.forEach(div => {
        const text = div.textContent?.trim() || '';
        if (text && !seenContent.has(text)) {
          seenContent.add(text);
          content += text + '\n';
        }
      });
      
      return content.trim();
    }
    
    // Fallback: use entire element's textContent
    return element.textContent?.trim() || '';
  }
}

// Initialize the scraper
const scraper = new ChatGPTScraper();
scraper.init();
