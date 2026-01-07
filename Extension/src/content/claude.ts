// Extension/src/content/claude.ts
import { BaseScraper } from './base-scraper';
import { ScrapedMessage } from './types';

/**
 * Claude.ai DOM Scraper
 * 
 * Selectors confirmed from:
 * - revivalstack/ai-chat-exporter (2025)
 * - ryanschiang/claude-export (2024)
 * 
 * DOM Structure:
 * - User messages have class "font-user-message"
 * - Claude messages have class "font-claude-message"
 * - Need to filter out thinking blocks (transition-all class)
 * - Need to filter out artifact blocks
 */
class ClaudeScraper extends BaseScraper {
  private lastMessageCount = 0;
  private debounceTimer: number | null = null;

  // CSS classes used to identify message types and elements to exclude
  private static readonly USER_MESSAGE_CLASS = 'font-user-message';
  private static readonly CLAUDE_MESSAGE_CLASS = 'font-claude-message';
  private static readonly THINKING_BLOCK_CLASS = 'transition-all';
  private static readonly ARTIFACT_BLOCK_SELECTOR = '.artifact-block-cell';

  constructor() {
    super({
      platform: 'claude',
      selectors: {
        container: 'main',
        // Select both user and Claude messages, excluding artifact markdown
        message: '.font-claude-message:not(#markdown-artifact), .font-user-message',
        roleUser: '.font-user-message',
        roleAssistant: '.font-claude-message:not(#markdown-artifact)'
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
    
    // Query for both user and Claude messages
    const messageElements = document.querySelectorAll(this.config.selectors.message);
    
    if (messageElements.length === 0) {
      console.log('[ChatVault] Claude: No messages found on page');
      return;
    }

    // Only process if message count changed (optimization)
    if (messageElements.length === this.lastMessageCount) {
      return;
    }
    this.lastMessageCount = messageElements.length;

    messageElements.forEach((element) => {
      const isUser = element.classList.contains(ClaudeScraper.USER_MESSAGE_CLASS);
      const role: 'user' | 'assistant' = isUser ? 'user' : 'assistant';

      let content: string;

      if (isUser) {
        // For user messages, the entire div is the content
        content = element.textContent?.trim() || '';
      } else {
        // For Claude messages, we need to filter out "thinking" blocks and artifacts
        content = this.extractClaudeMessageContent(element);
      }

      if (!content.trim()) {
        return; // Skip empty messages
      }

      messages.push({
        role,
        content: content.trim(),
        timestamp: Date.now() // Claude doesn't expose timestamps in DOM
      });
    });

    if (messages.length === 0) {
      console.log('[ChatVault] Claude: No valid messages extracted');
      return;
    }

    // Extract title from page title
    let title = document.title.trim();
    if (!title || title === 'Claude') {
      // Fallback: use first user message as title
      const firstUserMsg = messages.find(m => m.role === 'user');
      title = firstUserMsg 
        ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
        : 'Untitled Chat';
    }

    console.log(`[ChatVault] Claude: Scraped ${messages.length} messages`);
    this.saveChat(title, messages);
  }

  /**
   * Extract message content from a Claude response element
   * Filters out thinking blocks and artifact blocks
   */
  private extractClaudeMessageContent(element: Element): string {
    const contentParts: string[] = [];

    // Iterate through child elements
    Array.from(element.children).forEach((child) => {
      // Skip thinking blocks (identified by transition-all class)
      if (child.className.includes(ClaudeScraper.THINKING_BLOCK_CLASS)) {
        return;
      }

      // Skip artifact blocks (identified by specific classes or child selectors)
      const isArtifactBlock = 
        (child.className.includes('pt-3') && child.className.includes('pb-3')) ||
        child.querySelector(ClaudeScraper.ARTIFACT_BLOCK_SELECTOR);
      
      if (isArtifactBlock) {
        return;
      }

      // Look for content in grid-cols-1 containers (Claude's actual message content)
      const contentGrid = child.querySelector('.grid-cols-1');
      if (contentGrid) {
        const text = contentGrid.textContent?.trim();
        if (text) {
          contentParts.push(text);
        }
      } else {
        // Fallback: get text content if no specific structure found
        const text = child.textContent?.trim();
        if (text) {
          contentParts.push(text);
        }
      }
    });

    return contentParts.join('\n\n');
  }
}

// Initialize the scraper
const scraper = new ClaudeScraper();
scraper.init();
