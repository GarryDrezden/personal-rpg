import type { AppSettings, DailyEntry } from '../../types';
import {
  formatPhysicalActivitySummary,
  getHeavyLoadRecoveryWarning,
  getMovementCredit,
  hasMarkedPhysicalActivity,
} from '../../utils/movementCreditEngine';
import { Link } from 'react-router-dom';

type MovementCreditDashboardCardProps = {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  today: string;
};

export function MovementCreditDashboardCard({
  entry,
  settings,
  dailyEntries,
  today,
}: MovementCreditDashboardCardProps) {
  if (!entry || !hasMarkedPhysicalActivity(entry)) return null;

  const credit = getMovementCredit(entry, settings);
  const summary = formatPhysicalActivitySummary(entry);
  const warning = getHeavyLoadRecoveryWarning(dailyEntries, today);
  const resourceLine =
    entry.physicalActivityLevel === 'heavy'
      ? 'Ресурс: просел'
      : entry.physicalActivityLevel === 'medium'
        ? 'Ресурс: стоит учесть восстановление'
        : null;

  return (
    <div
      data-testid="dashboard-movement-credit"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--app-text)]">
            {credit.holdsMinimumMovement ? 'Движение удержано' : 'Физическая активность'}
          </p>
          {credit.holdsMinimumMovement ? (
            <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
              Источник: физическая активность
            </p>
          ) : null}
          {summary ? (
            <p className="mt-1 text-xs text-[var(--app-text)]">{summary}</p>
          ) : null}
          {resourceLine ? (
            <p className="mt-1 text-xs text-[var(--app-warning)]">{resourceLine}</p>
          ) : null}
          {credit.suggestion ? (
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">{credit.suggestion}</p>
          ) : null}
          {warning ? (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400/90">{warning}</p>
          ) : null}
        </div>
        <Link
          to="/today"
          className="shrink-0 text-xs font-medium text-[var(--app-primary)] hover:underline"
        >
          День →
        </Link>
      </div>
    </div>
  );
}
