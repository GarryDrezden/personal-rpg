import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import {
  COZY_HOME_ZONE_IDS,
  COZY_RESOURCE_LABELS,
  getCozyZoneConfig,
} from '../constants/cozyHomeConfig';
import {
  getCozyHomeProgress,
  getCozyHomeState,
  upgradeCozyZone,
  withCozyHomeState,
} from '../utils/cozyHomeEngine';
import { CozyHomeZoneCard, formatResourceBadges } from '../components/cozy/CozyHomeZoneCard';
import type { CozyHomeZoneId } from '../types/cozyHome';

export function CozyHomePage() {
  const { settings, saveSettings } = useAppStore();
  const [busyZone, setBusyZone] = useState<CozyHomeZoneId | null>(null);

  const home = useMemo(() => getCozyHomeState(settings), [settings]);
  const progress = useMemo(() => getCozyHomeProgress(home), [home]);
  const badges = useMemo(() => formatResourceBadges(home.resources), [home.resources]);

  const lastLine = useMemo(() => {
    if (!home.lastUpgrade) return null;
    const zone = getCozyZoneConfig(home.lastUpgrade.zoneId);
    return `${zone.title}: ${home.lastUpgrade.title}`;
  }, [home.lastUpgrade]);

  const handleUpgrade = async (zoneId: CozyHomeZoneId) => {
    setBusyZone(zoneId);
    try {
      const next = upgradeCozyZone(home, zoneId);
      await saveSettings(withCozyHomeState(settings, next));
    } finally {
      setBusyZone(null);
    }
  };

  return (
    <div className="space-y-6 pb-6" data-testid="cozy-home-page">
      <header>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Дом</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
          Тело возвращает силы — дом возвращает тепло.
        </p>
      </header>

      <section
        aria-label="Ресурсы дома"
        className="flex flex-wrap gap-2"
      >
        {badges.map((b) => (
          <span
            key={b.id}
            className="rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1 text-xs font-medium text-[var(--app-text)]"
          >
            {b.label} {b.value}
          </span>
        ))}
      </section>

      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-[var(--app-text)]">
            Восстановлено {progress.done} / {progress.total} улучшений
          </p>
          <p className="text-xs text-[var(--app-text-muted)]">{progress.percent}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--app-border)]/60">
          <div
            className="h-full rounded-full bg-[var(--app-gold)] transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">
          Ресурсы приходят из заботы о теле: питания, движения, сна, перерывов и спокойных дней.
        </p>
      </section>

      {lastLine ? (
        <section className="rounded-xl border border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
            Что изменилось в доме
          </p>
          <p className="mt-1 text-sm text-[var(--app-text)]">{lastLine}</p>
        </section>
      ) : (
        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            Что изменилось в доме
          </p>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Пока тихо. Сохрани день на «Сегодня» — появятся {COZY_RESOURCE_LABELS.materials.toLowerCase()},{' '}
            {COZY_RESOURCE_LABELS.comfort.toLowerCase()} и ясность для первых улучшений.
          </p>
        </section>
      )}

      <section
        aria-label="Зоны дома"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        {COZY_HOME_ZONE_IDS.map((zoneId) => (
          <CozyHomeZoneCard
            key={zoneId}
            home={home}
            zoneId={zoneId}
            busy={busyZone === zoneId}
            onUpgrade={(id) => void handleUpgrade(id)}
          />
        ))}
      </section>
    </div>
  );
}
