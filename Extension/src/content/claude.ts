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

  private shouldIgnoreClaudeNode(node: Element): boolean {
    const className = node.className || '';

    for (const sel of ClaudeScraper.ARTIFACT_BLOCK_SELECTORS) {
      if (node.matches(sel) || node.querySelector(sel)) return true;
    }

    const text = (node.textContent || '').trim().toLowerCase();
    if (ClaudeScraper.THINKING_KEYWORDS.some(k => text === k || text.startsWith(k + ' '))) return true;

    if (node.tagName === 'DETAILS' || node.tagName === 'SUMMARY') return true;

    if (ClaudeScraper.UI_CHROME_SELECTORS.some(sel => node.matches(sel))) return true;

    if (className.includes('pt-3') && className.includes('pb-3')) return true;

    return false;
  }

  // CSS classes used to identify message types and elements to exclude
  private static readonly USER_MESSAGE_CLASS = 'font-user-message';
  private static readonly CLAUDE_MESSAGE_CLASS = 'font-claude-message';

  private static readonly THINKING_KEYWORDS = ['thinking', 'thoughts'];

  private static readonly ARTIFACT_BLOCK_SELECTORS = [
    '#markdown-artifact',
    '.artifact-block-cell',
    '[data-testid*="artifact" i]',
    '[aria-label*="artifact" i]',
  ] as const;

  private static readonly UI_CHROME_SELECTORS = [
    'button',
    'svg',
    '[role="button"]',
    '[aria-label^="Copy" i]',
    '[aria-label*="Copy" i]',
    '[data-testid*="copy" i]',
    '[data-testid*="tooltip" i]',
  ] as const;

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

       if (!content.trim()) return;

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

     const approxBytes = JSON.stringify(messages).length;
     if (approxBytes > 2_000_000) {
       console.warn(`[ChatVault] Claude: Large scrape payload (~${approxBytes} bytes). This may hit Chrome message size or storage limits.`);
     }

     this.saveChat(title, messages);
  }

  /**
   * Extract message content from a Claude response element
   * Filters out thinking blocks and artifact blocks
   */
  private extractClaudeMessageContent(element: Element): string {
    const blocks: string[] = [];

    const artifactSelector = ClaudeScraper.ARTIFACT_BLOCK_SELECTORS.join(',');

    const root = element.cloneNode(true) as Element;
    if (artifactSelector) root.querySelectorAll(artifactSelector).forEach((n) => n.remove());
    root.querySelectorAll(ClaudeScraper.UI_CHROME_SELECTORS.join(',')).forEach((n) => n.remove());
    root.querySelectorAll('details, summary').forEach((n) => n.remove());

    const collectText = (text: string | null | undefined) => {
      const cleaned = (text || '').replace(/\s+$/g, '').trim();
      if (!cleaned) return;
      const last = blocks[blocks.length - 1];
      if (last === cleaned) return;
      blocks.push(cleaned);
    };

    root.querySelectorAll('pre').forEach((pre) => {
      if (!(pre instanceof HTMLElement)) return;
      if (this.shouldIgnoreClaudeNode(pre)) return;
      const codeText = pre.textContent;
      if (codeText) {
        const normalized = codeText.replace(/^\n+|\n+$/g, '');
        if (normalized.trim()) blocks.push('```\n' + normalized + '\n```');
      }
      pre.remove();
    });

    root.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (this.shouldIgnoreClaudeNode(node)) return;
      collectText(node.textContent);
    });

    if (blocks.length === 0) collectText(root.textContent);

    return blocks.join('\n\n');
  }
}

// Initialize the scraper
const scraper = new ClaudeScraper();
scraper.init();
