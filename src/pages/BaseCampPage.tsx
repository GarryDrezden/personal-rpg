import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { useAchievementStore } from '../store/achievementStore';
import { getBaseProgressionSnapshot } from '../game/base/baseProgressionEngine';
import { BaseStageRail } from '../components/base/BaseStageRail';

export function BaseCampPage({ embedded = false }: { embedded?: boolean }) {
  const { dailyEntries, measurements, settings } = useAppStore();
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);

  const snapshot = useMemo(
    () =>
      getBaseProgressionSnapshot({
        dailyEntries,
        measurements,
        settings,
        unlockedAchievementIds: unlockedAchievements.map((a) => a.achievementId),
      }),
    [dailyEntries, measurements, settings, unlockedAchievements],
  );

  return (
    <div className="space-y-6 pb-4">
      {!embedded ? (
        <header>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Лагерь героя</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
            Лагерь растёт сам, когда маршрут удержан. Это визуальный долгий прогресс — не новая
            обязанность и не строительная стратегия.
          </p>
        </header>
      ) : (
        <p className="text-sm text-[var(--app-text-muted)]">
          Лагерь растёт сам, когда маршрут удержан. Вес стоит — но персонаж не стоит.
        </p>
      )}

      <section className="rounded-xl border border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
          Текущая стадия
        </p>
        <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[var(--app-text)]">
          <span aria-hidden>{snapshot.currentStage.icon}</span>
          {snapshot.currentStage.title}
        </p>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">{snapshot.flavorText}</p>
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">
          Очков маршрута: {snapshot.baseScore}
          {snapshot.nextStage
            ? ` · ${snapshot.progressPercent}% до «${snapshot.nextStage.title}»`
            : ' · максимальная стадия'}
        </p>
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">
          Недавний рост: {snapshot.recentContributors.join(', ')}.
        </p>
      </section>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          Стадии лагеря
        </h2>
        <BaseStageRail snapshot={snapshot} />
      </div>
    </div>
  );
}
