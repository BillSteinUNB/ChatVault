import { Chat, Folder } from './types';

export const PLATFORM_CONFIG = {
  chatgpt: { name: 'ChatGPT', color: '#10A37F', icon: 'OpenAI' },
  claude: { name: 'Claude', color: '#D97757', icon: 'Anthropic' },
  gemini: { name: 'Gemini', color: '#4285F4', icon: 'Google' },
  perplexity: { name: 'Perplexity', color: '#6B4FFF', icon: 'Perplexity' },
};

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'API documentation help',
    preview: 'How do I authenticate with the V2 endpoints using Bearer tokens?',
    platform: 'chatgpt',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    folderId: 'work',
    isPinned: true,
    tags: ['api', 'docs'],
  },
  {
    id: '2',
    title: 'Climate data analysis',
    preview: 'Analyze this CSV dataset and provide trends for the last decade.',
    platform: 'claude',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    folderId: 'research',
    isPinned: false,
    tags: ['data', 'climate'],
  },
  {
    id: '3',
    title: 'React component optimization',
    preview: 'The list is rendering too slowly. How can I implement virtual scrolling?',
    platform: 'gemini',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    folderId: 'work',
    isPinned: true,
    tags: ['react', 'performance'],
  },
  {
    id: '4',
    title: 'Marketing copy for landing page',
    preview: 'Write a hero section for a SaaS product that helps manage chats.',
    platform: 'chatgpt',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    isPinned: false,
    tags: ['marketing', 'copy'],
  },
  {
    id: '5',
    title: 'Debugging Python script',
    preview: 'Im getting a RecursionError in this function. Can you spot the base case issue?',
    platform: 'claude',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    folderId: 'dev',
    isPinned: false,
    tags: ['python', 'bug'],
  },
  {
    id: '6',
    title: 'Explain Quantum Computing',
    preview: 'Explain it like I am 5 years old. What is superposition?',
    platform: 'perplexity',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    isPinned: false,
    tags: ['learning', 'physics'],
  }
];

export const MOCK_FOLDERS: Folder[] = [
  { id: 'work', name: 'Work Projects', chats: ['1', '3'] },
  { id: 'research', name: 'Research', chats: ['2'] },
  { id: 'dev', name: 'Development', chats: ['5'] },
];