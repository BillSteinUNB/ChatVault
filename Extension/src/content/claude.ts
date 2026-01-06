// Extension/src/content/claude.ts
import { BaseScraper } from './base-scraper';

class ClaudeScraper extends BaseScraper {
  constructor() {
    super({
      platform: 'claude',
      selectors: {
        container: '.flex-1.overflow-y-auto', 
        message: '.font-claude-message', // Placeholder selector
        roleUser: '.font-user-message',
        roleAssistant: '.font-claude-message'
      }
    });
  }

  protected scrape(): void {
    // TODO: Implement actual DOM traversal for Claude
    console.log('[ChatVault] Claude Scrape triggered (Skeleton)');
  }
}

const scraper = new ClaudeScraper();
scraper.init();
