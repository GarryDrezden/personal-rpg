import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import type { AppSettings } from '../../types';
import {
  COZY_RESOURCE_LABELS,
  getCozyZoneConfig,
} from '../../constants/cozyHomeConfig';
import {
  findAffordableUpgrade,
  getCozyHomeProgress,
  getCozyHomeState,
} from '../../utils/cozyHomeEngine';

type CozyHomeDashboardCardProps = {
  settings: AppSettings;
};

export function CozyHomeDashboardCard({ settings }: CozyHomeDashboardCardProps) {
  const home = useMemo(() => getCozyHomeState(settings), [settings]);
  const progress = useMemo(() => getCozyHomeProgress(home), [home]);
  const affordable = useMemo(() => findAffordableUpgrade(home), [home]);

  const resourceHint = useMemo(() => {
    const parts = (
      Object.entries(home.resources) as [keyof typeof COZY_RESOURCE_LABELS, number][]
    )
      .filter(([, n]) => n > 0)
      .map(([id, n]) => `${COZY_RESOURCE_LABELS[id]} ${n}`);
    return parts.length > 0 ? parts.join(' · ') : null;
  }, [home.resources]);

  return (
    <section
      data-testid="cozy-home-dashboard-card"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
        Дом становится теплее
      </p>
      <p className="mt-1 text-sm text-[var(--app-text)]">
        Восстановлено {progress.done} / {progress.total} улучшений.
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--app-border)]/60">
        <div
          className="h-full rounded-full bg-[var(--app-gold)]"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      {resourceHint ? (
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">{resourceHint}</p>
      ) : null}

      {affordable ? (
        <p className="mt-2 text-sm text-[var(--app-text)]">
          Можно улучшить:{' '}
          {getCozyZoneConfig(affordable.zoneId).title} —{' '}
          {affordable.nextLevel.description.toLowerCase()}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          Сегодняшние квесты принесут материалы, уют и ясность для дома.
        </p>
      )}

      <Link
        to="/home"
        className="mt-3 inline-block text-xs font-semibold text-[var(--app-primary)] hover:underline"
      >
        Открыть дом
      </Link>
    </section>
  );
}
