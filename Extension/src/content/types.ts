// Extension/src/content/types.ts

export interface ScrapedMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ScraperConfig {
  platform: 'chatgpt' | 'claude' | 'gemini';
  selectors: {
    container: string;
    message: string;
    roleUser: string;
    roleAssistant: string;
  };
}
