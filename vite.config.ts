import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { PWA_MANIFEST } from './src/constants/pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'favicon-32.png',
        'favicon-192.png',
        'apple-touch-icon.png',
      ],
      manifest: PWA_MANIFEST,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}', 'favicon-*.png', 'apple-touch-icon.png'],
        globIgnores: ['**/game-assets/**', '**/avatars/**', '**/bosses/**', 'logo.png'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'personal-rpg-api',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 5 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\/game-assets\/.+\.(?:png|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'personal-rpg-game-assets',
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
  server: {
    // Production & OSPanel: /api → PHP via .htaccess (same origin).
    // No Node proxy — backend/ is VPS-only.
  },
});
