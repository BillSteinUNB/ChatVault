// Extension/src/content/base-scraper.ts
import { ScrapedMessage, ScraperConfig } from './types';

export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected observer: MutationObserver | null = null;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  public init(): void {
    console.log(`[ChatVault] Initializing ${this.config.platform} scraper...`);
    this.observeChanges();
  }

  protected observeChanges(): void {
    const targetNode = document.body;
    const observerConfig = { childList: true, subtree: true };

    this.observer = new MutationObserver((mutations) => {
      // Debounce logic could go here to avoid scraping on every single character change
      this.scrape();
    });

    this.observer.observe(targetNode, observerConfig);
  }

  protected abstract scrape(): void;

  protected saveChat(title: string, messages: ScrapedMessage[]): void {
    if (messages.length === 0) return;

    // Send data to background script/storage
    chrome.runtime.sendMessage({
      type: 'SAVE_CHAT',
      payload: {
        platform: this.config.platform,
        title,
        messages,
        url: window.location.href,
        updatedAt: Date.now()
      }
    });
  }
}
