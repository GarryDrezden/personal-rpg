import { useMemo } from 'react';
import { Flame } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAchievementStore } from '../store/achievementStore';
import { getBaseProgressionSnapshot } from '../game/base/baseProgressionEngine';
import { BaseStageRail } from '../components/base/BaseStageRail';
import { ManifestArtScene } from '../components/game/ManifestArtScene';
import { getBaseStageManifestAssetId } from '../game/manifestAssetUi';
import {
  GROWTH_HUB_EYEBROW,
  GROWTH_HUB_PANEL,
  GROWTH_HUB_RADIAL_GOLD,
} from '../components/growth/growthHubUi';

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

  const stageArtId = getBaseStageManifestAssetId(snapshot.currentStage.id);

  return (
    <div className="space-y-6 pb-4" data-testid="growth-camp-page">
      {embedded ? (
        <header className={`${GROWTH_HUB_PANEL} px-4 py-5 sm:px-6`}>
          <div className={GROWTH_HUB_RADIAL_GOLD} aria-hidden />
          <div className="relative flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--app-gold)]/25 bg-[#18120a]/60 text-[var(--app-gold)]/80">
              <Flame className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={GROWTH_HUB_EYEBROW}>База маршрута</p>
              <h1 className="mt-1.5 text-xl font-bold text-[var(--app-text)] sm:text-2xl">
                Лагерь героя
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
                Лагерь растёт сам, когда маршрут удержан. Вес стоит — но персонаж продолжает путь.
              </p>
            </div>
          </div>
        </header>
      ) : (
        <header>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Лагерь героя</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
            Лагерь растёт сам, когда маршрут удержан. Это визуальный долгий прогресс — не новая
            обязанность и не строительная стратегия.
          </p>
        </header>
      )}

      {stageArtId ? (
        <ManifestArtScene
          assetId={stageArtId}
          alt={snapshot.currentStage.title}
          layout="hero"
          testId="base-camp-art-scene"
        />
      ) : null}

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
          Недавний рост (14 дней): {snapshot.recentContributors.join(', ')}.
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
