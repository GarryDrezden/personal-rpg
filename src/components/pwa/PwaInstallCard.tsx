import { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { Card } from '../ui/Card';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
}

export function PwaInstallCard() {
  const [installed, setInstalled] = useState(isStandaloneMode);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    setIosHint(isIosSafari() && !isStandaloneMode());

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (installed) {
    return (
      <Card>
        <h2 className="mb-2 font-semibold text-[var(--app-text)]">Приложение</h2>
        <p className="text-sm text-[var(--app-text-muted)]">
          Личная RPG открыта с домашнего экрана — как отдельное приложение.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-2 flex items-center gap-2">
        <Smartphone className="h-5 w-5 text-[var(--app-gold)]" strokeWidth={1.5} aria-hidden />
        <h2 className="font-semibold text-[var(--app-text)]">Установить на телефон</h2>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-[var(--app-text-muted)]">
        Можно добавить Личную RPG на домашний экран — откроется в отдельном окне, без адресной
        строки браузера.
      </p>
      {deferredPrompt ? (
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gold px-4 font-semibold text-slate-950 hover:bg-amber-600"
        >
          <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Установить приложение
        </button>
      ) : iosHint ? (
        <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">
          На iPhone: «Поделиться» → «На экран Домой» в Safari.
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">
          В Chrome или Edge: меню браузера → «Установить приложение» или «Добавить на главный экран».
        </p>
      )}
    </Card>
  );
}
