import { useCallback } from 'react';
import { AutosaveStatus } from '../ui/AutosaveStatus';
import { useAutosaveStatus } from '../../hooks/useAutosaveStatus';

type InstantSettingRowProps = {
  title: string;
  description?: string;
  hint?: string;
  checked: boolean;
  onChange: (nextValue: boolean) => Promise<void> | void;
  disabled?: boolean;
  testId?: string;
  toggleTestId?: string;
  statusTestId?: string;
  savedMessage?: string | ((nextValue: boolean) => string);
  errorMessage?: string;
};

export function InstantSettingRow({
  title,
  description,
  hint,
  checked,
  onChange,
  disabled = false,
  testId,
  toggleTestId,
  statusTestId,
  savedMessage = 'Настройка сохранена',
  errorMessage = 'Не удалось сохранить настройку',
}: InstantSettingRowProps) {
  const { status, message, showSaving, showSaved, showError } = useAutosaveStatus();

  const handleToggle = useCallback(async () => {
    const next = !checked;
    showSaving();
    try {
      await onChange(next);
      const text = typeof savedMessage === 'function' ? savedMessage(next) : savedMessage;
      showSaved(text);
    } catch {
      showError(errorMessage);
    }
  }, [checked, onChange, showSaving, showSaved, showError, savedMessage, errorMessage]);

  return (
    <div data-testid={testId}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-[var(--app-text)]">{title}</h3>
            <span className="text-xs text-[var(--app-text-muted)]">Сохраняется сразу</span>
          </div>
          {description && (
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">{description}</p>
          )}
          {hint && <p className="mt-2 text-xs text-[var(--app-text-muted)]">{hint}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          data-testid={toggleTestId ?? (testId ? `${testId}-toggle` : undefined)}
          onClick={() => void handleToggle()}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
            checked ? 'bg-[var(--app-primary)]' : 'bg-[var(--app-border)]'
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-[var(--app-card-strong)] shadow transition-transform ${
              checked ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>
      <AutosaveStatus status={status} message={message} data-testid={statusTestId} />
    </div>
  );
}
