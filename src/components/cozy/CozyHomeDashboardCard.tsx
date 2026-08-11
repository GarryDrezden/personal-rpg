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
import { useAppTheme } from '../../hooks/useAppTheme';
import { getCozyDashboardHomeBannerPath } from '../../game/cozyHomeArt';
import { GameAssetImage } from '../game/GameAssetImage';
import { CozyBotanicalFrame } from './CozyBotanicalFrame';

type CozyHomeDashboardCardProps = {
  settings: AppSettings;
};

export function CozyHomeDashboardCard({ settings }: CozyHomeDashboardCardProps) {
  const { isCozy } = useAppTheme();
  const home = useMemo(() => getCozyHomeState(settings), [settings]);
  const progress = useMemo(() => getCozyHomeProgress(home), [home]);
  const affordable = useMemo(() => findAffordableUpgrade(home), [home]);
  const bannerSrc = getCozyDashboardHomeBannerPath();

  const resourceHint = useMemo(() => {
    const parts = (
      Object.entries(home.resources) as [keyof typeof COZY_RESOURCE_LABELS, number][]
    )
      .filter(([, n]) => n > 0)
      .map(([id, n]) => `${COZY_RESOURCE_LABELS[id]} ${n}`);
    return parts.length > 0 ? parts.join(' · ') : null;
  }, [home.resources]);

  if (!isCozy) return null;

  return (
    <CozyBotanicalFrame
      intensity="medium"
      note="дом собирает тепло"
      testId="cozy-dash-home-frame"
      contentClassName="!p-0"
    >
      <section data-testid="cozy-home-dashboard-card" className="cozy-dash-home cozy-dash-home--with-art">
        <div
          className="cozy-dash-home__art"
          data-testid="cozy-dash-home-art"
        >
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

        <div className="cozy-dash-home__body">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-garden)]">
            Дом становится теплее
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--app-text)]">
            Восстановлено {progress.done} / {progress.total} улучшений.
          </p>

          <div className="cozy-progress-track mt-2">
            <div className="cozy-progress-fill" style={{ width: `${progress.percent}%` }} />
          </div>

          {resourceHint ? (
            <p className="mt-2 text-xs text-[var(--app-text-muted)]">{resourceHint}</p>
          ) : null}

          {affordable ? (
            <p className="mt-2 text-sm text-[var(--app-text)]">
              Можно улучшить:{' '}
              <span className="font-medium">
                {getCozyZoneConfig(affordable.zoneId).title}
              </span>{' '}
              — {affordable.nextLevel.description.toLowerCase()}
            </p>
          ) : (
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Задачи дня принесут материалы, уют и ясность для дома.
            </p>
          )}

          <Link
            to="/home"
            className="mt-3 inline-block text-xs font-semibold text-[var(--app-garden)] hover:underline"
          >
            Открыть дом
          </Link>
        </div>
      </section>
    </CozyBotanicalFrame>
  );
}
