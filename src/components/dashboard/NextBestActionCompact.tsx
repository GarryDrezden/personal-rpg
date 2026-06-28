import { useNavigate } from 'react-router-dom';
import type { NextBestAction } from '../../types/nextBestAction';

type NextBestActionCompactProps = {
  action: NextBestAction;
};

export function NextBestActionCompact({ action }: NextBestActionCompactProps) {
  const navigate = useNavigate();

  return (
    <div
      data-testid="dashboard-next-best-action-compact"
      className="flex flex-col gap-2 rounded-xl border border-[color-mix(in_srgb,var(--app-primary)_30%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-primary)_6%,var(--app-card))] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-xl" aria-hidden>
          {action.icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-primary)]">
            Следующий шаг
          </p>
          <p className="truncate text-sm font-semibold text-[var(--app-text)]">{action.title}</p>
        </div>
      </div>
      {action.targetRoute ? (
        <button
          type="button"
          onClick={() => navigate(action.targetRoute!)}
          className="shrink-0 rounded-lg bg-[var(--app-primary)] px-3 py-1.5 text-xs font-semibold text-slate-950 hover:brightness-105"
        >
          {action.actionLabel}
        </button>
      ) : null}
    </div>
  );
}
