import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
  server: {
    // Production & OSPanel: /api → PHP via .htaccess (same origin).
    // No Node proxy — backend/ is VPS-only.
  },
});
