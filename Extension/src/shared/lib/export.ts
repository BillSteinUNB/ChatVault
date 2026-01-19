import { Chat } from '../types';

export function exportToJSON(chats: Chat[]): string {
  return JSON.stringify(chats, null, 2);
}

export function exportToMarkdown(chat: Chat): string {
  const date = new Date(chat.timestamp).toLocaleDateString();
  
  let markdown = `# ${chat.title}\n\n`;
  markdown += `**Platform:** ${chat.platform} | **Date:** ${date}\n\n`;
  markdown += `---\n\n`;
  
  return markdown;
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
