import { useState } from 'react';
import {
  hasLegacyLocalData,
  importLegacyLocalStorage,
  markLegacyMigratedSkipped,
} from '../../storage/legacyStorageClient';
import { useAppStore } from '../../store/appStore';

export function LegacyImportBanner() {
  const [visible, setVisible] = useState(() => hasLegacyLocalData());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const init = useAppStore((s: { init: () => Promise<void> }) => s.init);

  if (!visible) return null;

  async function onImport() {
    setBusy(true);
    setMessage(null);
    try {
      const types = await importLegacyLocalStorage();
      await init();
      setMessage(
        types.length > 0
          ? `Перенесено: ${types.join(', ')}`
          : 'Локальные данные не найдены',
      );
      setVisible(false);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Не удалось перенести данные');
    } finally {
      setBusy(false);
    }
  }

  function onSkip() {
    markLegacyMigratedSkipped();
    setVisible(false);
  }

  return (
    <div className="mb-4 rounded-xl border border-[var(--app-gold)]/40 bg-[var(--app-card)]/90 p-4">
      <p className="font-medium text-[var(--app-text)]">
        Найдены данные на этом устройстве
      </p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">
        Перенести их в аккаунт? Старые данные на устройстве не удаляются.
      </p>
      {message && (
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">{message}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void onImport()}
          className="btn-primary rounded-lg px-3 py-1.5 text-sm font-semibold"
        >
          {busy ? 'Переносим…' : 'Перенести'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onSkip}
          className="rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-sm text-[var(--app-text-muted)]"
        >
          Не сейчас
        </button>
      </div>
    </div>
  );
}
