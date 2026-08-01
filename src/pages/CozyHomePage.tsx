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
import type { CozyHomeZoneId, CozyResourceId } from '../types/cozyHome';

const CHIP_CLASS: Record<CozyResourceId, string> = {
  comfort: 'cozy-chip cozy-chip--comfort',
  materials: 'cozy-chip cozy-chip--materials',
  garden: 'cozy-chip cozy-chip--garden',
  clarity: 'cozy-chip cozy-chip--clarity',
};

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
      <header className="cozy-home-hero">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-garden)]">
          Деревенский дом
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--app-text)]">Дом</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
          Тело возвращает силы — дом возвращает тепло. Летний свет, дерево и сад растут из
          уже отмеченных дней.
        </p>
      </header>

      <section aria-label="Ресурсы дома" className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span key={b.id} className={CHIP_CLASS[b.id]}>
            <span aria-hidden>{b.id === 'garden' ? '🌿' : b.id === 'comfort' ? '🕯️' : b.id === 'materials' ? '🪵' : '✨'}</span>
            {b.label} {b.value}
          </span>
        ))}
      </section>

      <section className="cozy-surface px-4 py-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--app-text)]">
            Восстановлено {progress.done} / {progress.total} улучшений
          </p>
          <p className="text-xs font-medium text-[var(--app-garden)]">{progress.percent}%</p>
        </div>
        <div className="cozy-progress-track mt-2.5">
          <div className="cozy-progress-fill transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-[var(--app-text-muted)]">
          Уют, материалы, сад и ясность приходят из питания, движения, сна, перерывов и
          спокойных дней — не из отдельного списка дел.
        </p>
      </section>

      {lastLine ? (
        <section className="cozy-surface-soft px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-garden)]">
            Что изменилось в доме
          </p>
          <p className="mt-1 text-sm text-[var(--app-text)]">{lastLine}</p>
        </section>
      ) : (
        <section className="cozy-surface-soft px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            Что изменилось в доме
          </p>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Пока тихо. Сохрани день на «Сегодня» — появятся{' '}
            {COZY_RESOURCE_LABELS.materials.toLowerCase()},{' '}
            {COZY_RESOURCE_LABELS.comfort.toLowerCase()} и ясность для первых улучшений.
          </p>
        </section>
      )}

      <section aria-label="Зоны дома" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
