import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths for assets
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        sidepanel: path.resolve(__dirname, 'src/sidepanel/index.html'),
        background: path.resolve(__dirname, 'src/background/service-worker.ts'),
        chatgpt: path.resolve(__dirname, 'src/content/chatgpt.ts'),
        claude: path.resolve(__dirname, 'src/content/claude.ts'),
        gemini: path.resolve(__dirname, 'src/content/gemini.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') {
            return 'service-worker.js';
          }
          if (chunk.name === 'chatgpt' || chunk.name === 'claude' || chunk.name === 'gemini') {
            return `content/${chunk.name}.js`;
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
});
