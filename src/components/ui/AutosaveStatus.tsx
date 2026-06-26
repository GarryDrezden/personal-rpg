export type AutosaveStatusState = 'idle' | 'saving' | 'saved' | 'error';

type AutosaveStatusProps = {
  status: AutosaveStatusState;
  message?: string;
  savedMessage?: string;
  errorMessage?: string;
  className?: string;
  'data-testid'?: string;
};

export function AutosaveStatus({
  status,
  message,
  savedMessage = 'Сохранено',
  errorMessage = 'Не удалось сохранить',
  className = '',
  'data-testid': dataTestId,
}: AutosaveStatusProps) {
  if (status === 'idle') return null;

  let text = message;
  if (!text) {
    if (status === 'saving') text = 'Сохраняется…';
    else if (status === 'saved') text = savedMessage;
    else text = errorMessage;
  }

  const colorClass =
    status === 'error'
      ? 'text-[var(--app-danger)]'
      : status === 'saving'
        ? 'text-[var(--app-text-muted)]'
        : 'text-[var(--app-success)]';

  return (
    <p
      role="status"
      aria-live="polite"
      data-testid={dataTestId}
      className={`min-h-[1.25rem] text-sm ${colorClass} ${className}`}
    >
      {text}
    </p>
  );
}
