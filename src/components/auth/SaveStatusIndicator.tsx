import { useSaveStatusStore } from '../../storage/saveStatusStore';

export function SaveStatusIndicator() {
  const { status, message } = useSaveStatusStore();

  if (status === 'idle') return null;

  const label =
    status === 'saving'
      ? 'Сохраняем…'
      : status === 'saved'
        ? 'Сохранено'
        : message ?? 'Ошибка сохранения';

  const color =
    status === 'error'
      ? 'text-[var(--app-danger)]'
      : status === 'saved'
        ? 'text-[var(--app-gold)]'
        : 'text-[var(--app-text-muted)]';

  return (
    <p className={`fixed bottom-20 right-4 z-50 rounded-lg border border-[var(--app-border)] bg-[var(--app-card)]/95 px-3 py-1.5 text-xs shadow-lg md:bottom-4 ${color}`}>
      {label}
    </p>
  );
}
