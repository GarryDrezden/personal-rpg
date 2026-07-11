import { registerSW } from 'virtual:pwa-register';

/** Registers the production service worker with silent auto-update. */
export function registerPwa(): void {
  if (!import.meta.env.PROD) return;

  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('[pwa] Shell cached — app can open offline.');
    },
    onRegisteredSW(_url, registration) {
      if (registration) {
        window.setInterval(() => registration.update(), 60 * 60 * 1000);
      }
    },
  });
}
