import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import {
  COZY_HOME_ZONE_IDS,
  getCozyZoneConfig,
} from '../constants/cozyHomeConfig';
import {
  getCozyHomeProgress,
  getCozyHomeState,
  canUpgradeCozyZone,
  upgradeCozyZone,
  withCozyHomeState,
} from '../utils/cozyHomeEngine';
import { CozyHomeScenePlaceholder } from '../components/cozy/CozyHomeScenePlaceholder';
import { CozyHomeZoneCard, formatResourceBadges } from '../components/cozy/CozyHomeZoneCard';
import { CozyBotanicalFrame } from '../components/cozy/CozyBotanicalFrame';
import type { CozyHomeZoneId, CozyResourceId } from '../types/cozyHome';
import { pickHomeStatusLine } from '../content/homeStatus';
import { todayISO } from '../utils/dates';
import { getThemedEmptyStateCopy } from '../constants/themeContentRegistry';
import { useAppTheme } from '../hooks/useAppTheme';

const RESOURCE_META: Record<
  CozyResourceId,
  { icon: string; chipClass: string }
> = {
  comfort: { icon: '🕯️', chipClass: 'cozy-resource-chip cozy-resource-chip--comfort' },
  materials: { icon: '🪵', chipClass: 'cozy-resource-chip cozy-resource-chip--materials' },
  garden: { icon: '🌿', chipClass: 'cozy-resource-chip cozy-resource-chip--garden' },
  clarity: { icon: '✨', chipClass: 'cozy-resource-chip cozy-resource-chip--clarity' },
};

export function CozyHomePage() {
  const { isCozy } = useAppTheme();
  const { settings } = useAppStore();
  const [busyZone, setBusyZone] = useState<CozyHomeZoneId | null>(null);

  const home = useMemo(() => getCozyHomeState(settings), [settings]);
  const progress = useMemo(() => getCozyHomeProgress(home), [home]);
  const badges = useMemo(() => formatResourceBadges(home.resources), [home.resources]);
  const totalResources = useMemo(
    () => badges.reduce((sum, b) => sum + b.value, 0),
    [badges],
  );
  const today = todayISO();
  const statusLine = pickHomeStatusLine({
    percent: progress.percent,
    totalResources,
    date: today,
    lastZoneId: home.lastUpgrade?.zoneId,
    lastUpgradeAt: home.lastUpgrade?.at ?? null,
  });

  const lastUpgrade = useMemo(() => {
    if (!home.lastUpgrade) return null;
    const zone = getCozyZoneConfig(home.lastUpgrade.zoneId);
    return {
      icon: zone.icon,
      title: zone.title,
      line: home.lastUpgrade.title,
      at: home.lastUpgrade.at,
    };
  }, [home.lastUpgrade]);

  const handleUpgrade = async (zoneId: CozyHomeZoneId) => {
    setBusyZone(zoneId);
    try {
      const latest = useAppStore.getState();
      const latestHome = getCozyHomeState(latest.settings);
      const check = canUpgradeCozyZone(latestHome, zoneId);
      if (!check.canUpgrade) return;
      const next = upgradeCozyZone(latestHome, zoneId);
      await latest.saveSettings(withCozyHomeState(latest.settings, next));
    } finally {
      setBusyZone(null);
    }
  };

  if (!isCozy) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="cozy-home-page space-y-5 pb-6" data-testid="cozy-home-page">
      <CozyBotanicalFrame
        intensity="hero"
        className="cozy-home-hero-frame"
        contentClassName="!p-0"
        testId="cozy-home-scene-frame"
      >
        <section
          className="cozy-home-hero-block"
          aria-label="Дом становится теплее"
          data-testid="cozy-home-scene"
        >
          <div className="cozy-home-hero-stage">
            <CozyHomeScenePlaceholder />
            <div className="cozy-home-hero-overlay">
              <p className="cozy-home-page__eyebrow">Деревенский дом</p>
              <h1 className="cozy-home-page__title">Дом</h1>
              <p className="cozy-home-page__status">{statusLine}</p>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--app-text)]">
                  Восстановлено {progress.done} / {progress.total} улучшений
                </p>
                <p className="text-xs font-medium text-[var(--app-garden)]">{progress.percent}%</p>
              </div>
              <div className="cozy-progress-track mt-2">
                <div
                  className="cozy-progress-fill transition-all"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      </CozyBotanicalFrame>

      <div className="cozy-resource-grid" aria-label="Ресурсы дома">
        {badges.map((b) => (
          <div key={b.id} className={RESOURCE_META[b.id].chipClass}>
            <span className="cozy-resource-chip__icon" aria-hidden>
              {RESOURCE_META[b.id].icon}
            </span>
            <div className="min-w-0">
              <p className="cozy-resource-chip__label">{b.label}</p>
              <p className="cozy-resource-chip__value">{b.value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="px-0.5 text-sm leading-relaxed text-[var(--app-text-muted)]">
        {progress.percent >= 100
          ? statusLine
          : progress.done === 0
            ? getThemedEmptyStateCopy('cozy', 'noUpgrades', today).description
            : 'Двор, сад и комнаты оживают по мере заботы о теле.'}
      </p>

      {totalResources === 0 ? (
        <section className="cozy-home-empty" data-testid="cozy-home-empty-resources">
          <p className="cozy-home-empty__title">
            {getThemedEmptyStateCopy('cozy', 'noResources').title}
          </p>
          <p className="cozy-home-empty__text">
            {getThemedEmptyStateCopy('cozy', 'noResources').description}
          </p>
          <Link to="/today" className="cozy-home-empty__cta">
            Открыть день
          </Link>
        </section>
      ) : null}

      <section className="cozy-home-changed">
        <p className="cozy-home-changed__label">Что изменилось в доме</p>
        {lastUpgrade ? (
          <div className="cozy-home-changed__row">
            <span className="cozy-home-changed__icon" aria-hidden>
              {lastUpgrade.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--app-text)]">
                {lastUpgrade.title}: {lastUpgrade.line}
              </p>
              {lastUpgrade.at ? (
                <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
                  {lastUpgrade.at.slice(0, 10)}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">
            Пока тихо. Сохрани день на «Сегодня» — появятся материалы, уют и ясность для
            первых улучшений.
          </p>
        )}
      </section>

      <details className="cozy-home-sources">
        <summary className="cozy-home-sources__summary">Откуда берутся ресурсы?</summary>
        <ul className="cozy-home-sources__list">
          <li>
            <span aria-hidden>🕯️</span> Питание и дневник → Уют
          </li>
          <li>
            <span aria-hidden>🪵</span> Шаги и физическая активность → Материалы
          </li>
          <li>
            <span aria-hidden>🌿</span> Прогулки и дни без алкоголя → Сад
          </li>
          <li>
            <span aria-hidden>✨</span> Сон, перерывы и ясный день → Ясность
          </li>
        </ul>
      </details>

      <section aria-label="Зоны дома">
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[var(--app-text)]">Зоны дома</h2>
            <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
              {progress.percent >= 100
                ? 'Дом восстановлен'
                : 'Комнаты, двор и сад ждут восстановления'}
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {COZY_HOME_ZONE_IDS.map((zoneId) => (
            <CozyHomeZoneCard
              key={zoneId}
              home={home}
              zoneId={zoneId}
              busy={busyZone === zoneId}
              onUpgrade={(id) => void handleUpgrade(id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
