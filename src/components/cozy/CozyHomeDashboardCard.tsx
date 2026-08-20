import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import type { AppSettings } from '../../types';
import {
  getCozyHomeProgress,
  getCozyHomeState,
  getCozyUpgradeHintLine,
} from '../../utils/cozyHomeEngine';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getCozyDashboardHomeBannerPath } from '../../game/cozyHomeArt';
import { GameAssetImage } from '../game/GameAssetImage';

type CozyHomeDashboardCardProps = {
  settings: AppSettings;
};

export function CozyHomeDashboardCard({ settings }: CozyHomeDashboardCardProps) {
  const { isCozy } = useAppTheme();
  const home = useMemo(() => getCozyHomeState(settings), [settings]);
  const progress = useMemo(() => getCozyHomeProgress(home), [home]);
  const hint = useMemo(() => getCozyUpgradeHintLine(home), [home]);
  const bannerSrc = getCozyDashboardHomeBannerPath();
  const isComplete = progress.done >= progress.total;

  if (!isCozy) return null;

  return (
    <section
      data-testid="cozy-home-dashboard-card"
      className="cozy-dash-home cozy-dash-home--with-art"
    >
        <div className="cozy-dash-home__art" data-testid="cozy-dash-home-art">
          <GameAssetImage
            src={bannerSrc}
            alt="Дом героя"
            variant="artifact"
            status="unlocked"
            className="absolute inset-0"
            imageClassName="h-full w-full object-cover object-[center_52%]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[color-mix(in_srgb,#2a2418_35%,transparent)] to-transparent"
            aria-hidden
          />
        </div>

        <div className="space-y-2 px-4 pb-4 pt-3 sm:px-5 sm:pb-4 sm:pt-3.5">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-garden)]">
              {isComplete ? 'Дом восстановлен' : 'Дом становится теплее'}
            </p>
            <p className="text-sm font-medium leading-snug text-[var(--app-text)]">
              {isComplete
                ? 'Все зоны в порядке.'
                : `Восстановлено ${progress.done} / ${progress.total} улучшений.`}
            </p>
          </div>

          <div
            className="cozy-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percent}
            aria-label="Восстановление дома"
          >
            <div className="cozy-progress-fill" style={{ width: `${progress.percent}%` }} />
          </div>

          <p className="text-sm leading-relaxed text-[var(--app-text)]">{hint}</p>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Link
              to="/home"
              className="text-sm font-semibold text-[var(--app-garden)] hover:underline"
            >
              Открыть дом
            </Link>
            <p className="cozy-hand-accent text-xs text-[var(--app-text-muted)]">
              {isComplete ? 'дом хранит тепло' : 'дом собирает тепло'}
            </p>
          </div>
        </div>
    </section>
  );
}
