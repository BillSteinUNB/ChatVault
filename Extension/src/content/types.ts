// Extension/src/content/types.ts

export interface ScrapedMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ScraperConfig {
  platform: 'chatgpt' | 'claude' | 'perplexity';
  selectors: {
    container: string;
    chatContainer: string;
    message: string;
    roleUser: string;
    roleAssistant: string;
  };
}
