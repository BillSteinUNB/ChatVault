// Extension/src/content/gemini.ts
import { BaseScraper } from './base-scraper';

class GeminiScraper extends BaseScraper {
  constructor() {
    super({
      platform: 'gemini',
      selectors: {
        container: 'conversation-container', 
        message: 'message-content',
        roleUser: '.user-query',
        roleAssistant: '.model-response'
      }
    });
  }

  protected scrape(): void {
    // TODO: Implement actual DOM traversal for Gemini (likely involves Shadow DOM)
    console.log('[ChatVault] Gemini Scrape triggered (Skeleton)');
  }
}

const scraper = new GeminiScraper();
scraper.init();
