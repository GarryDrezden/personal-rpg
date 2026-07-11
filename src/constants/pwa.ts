import type { ManifestOptions } from 'vite-plugin-pwa';

export const PWA_APP_NAME = 'Личная RPG';
export const PWA_SHORT_NAME = 'Личная RPG';
export const PWA_DESCRIPTION =
  'Личная RPG — мягкая игра про тело, привычки и долгий путь без давления.';

/** Web app manifest (also used by vite-plugin-pwa). */
export const PWA_MANIFEST: Partial<ManifestOptions> = {
  name: PWA_APP_NAME,
  short_name: PWA_SHORT_NAME,
  description: PWA_DESCRIPTION,
  lang: 'ru',
  dir: 'ltr',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  theme_color: '#d97706',
  background_color: '#f8fafc',
  categories: ['health', 'lifestyle', 'games'],
  icons: [
    {
      src: 'favicon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'logo-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: 'logo-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};
