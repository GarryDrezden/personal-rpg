import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { BODY_ABILITY_BRANCHES } from '../constants/bodyAbilities';
import { BodyAbilityBranchCard } from '../components/bodyAbilities/BodyAbilityBranchCard';
import { BodyAbilityCard } from '../components/bodyAbilities/BodyAbilityCard';
import { BodyAbilitySkillBoard } from '../components/bodyAbilities/BodyAbilitySkillBoard';
import {
  getAllBodyAbilityProgress,
  getBodyAbilityBranchSummaries,
  getBranchEmptyHint,
  hasEnoughDataForBodyAbilities,
} from '../utils/bodyAbilityEngine';
import { getPlateauSnapshot } from '../game/plateau/plateauEngine';
import type { BodyAbilityBranch } from '../types/bodyAbilities';

export function BodyAbilitiesPage({ embedded = false }: { embedded?: boolean }) {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { themeId } = useAppTheme();

  const engineParams = useMemo(
    () => ({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  const branchSummaries = useMemo(
    () => getBodyAbilityBranchSummaries(engineParams),
    [engineParams],
  );

  const allProgress = useMemo(
    () => getAllBodyAbilityProgress(engineParams),
    [engineParams],
  );

  const plateauSnapshot = useMemo(
    () => getPlateauSnapshot(engineParams),
    [engineParams],
  );
  const hasData = hasEnoughDataForBodyAbilities({ dailyEntries, measurements });
  const hasWeightMeasurements = measurements.some(
    (m) => m.weight !== null && m.weight > 0,
  );

  const grouped = useMemo(() => {
    const map = new Map<BodyAbilityBranch, typeof allProgress>();
    for (const branch of BODY_ABILITY_BRANCHES) {
      map.set(
        branch.branch,
        allProgress.filter((p) => p.ability.branch === branch.branch),
      );
    }
    return map;
  }, [allProgress]);

  const unlockedLegacyCount = allProgress.filter((p) => p.unlocked).length;

  return (
    <div className="space-y-10 pb-4">
      <BodyAbilitySkillBoard showPageHero={!embedded} />

      {plateauSnapshot.mode !== 'none' && unlockedLegacyCount > 0 ? (
        <p className="rounded-xl border border-[var(--app-gold)]/20 bg-[var(--app-primary-soft)]/30 px-4 py-3 text-sm text-[var(--app-text-muted)]">
          На перевале особенно важны не-весовые признаки прогресса — персонаж продолжает путь.
        </p>
      ) : null}

      <section className="space-y-6 border-t border-[var(--app-border)]/50 pt-8">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
            Прогресс по данным
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
            Дополнительные способности открываются по шагам, весу и учёту — когда порог
            достигнут. Это отдельный слой от наблюдений в жизни выше.
          </p>
        </div>

        {!hasData ? (
          <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-6 text-center text-sm text-[var(--app-text-muted)]">
            Пока мало записей для автоматического прогресса. Минимальный день с весом, шагами
            или калориями поможет маршруту увидеть больше.
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {branchSummaries.map((summary) => (
            <BodyAbilityBranchCard key={summary.branch} summary={summary} />
          ))}
        </div>

        <div className="space-y-8">
          {BODY_ABILITY_BRANCHES.map((branchMeta) => {
            const items = grouped.get(branchMeta.branch) ?? [];
            const branchSummary = branchSummaries.find((s) => s.branch === branchMeta.branch);
            const emptyHint = getBranchEmptyHint(branchMeta.branch);

            return (
              <div key={branchMeta.branch} id={`branch-${branchMeta.branch}`}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {branchMeta.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--app-text)]">
                      {branchMeta.title}
                    </h3>
                    {branchSummary ? (
                      <p className="text-xs text-[var(--app-text-muted)]">
                        {branchSummary.unlockedCount} / {branchSummary.totalCount} открыто
                      </p>
                    ) : null}
                  </div>
                </div>

                {branchMeta.branch === 'lightness' && !hasWeightMeasurements && emptyHint ? (
                  <p className="mb-3 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
                    {emptyHint}
                  </p>
                ) : null}

                {branchMeta.branch === 'endurance' &&
                !dailyEntries.some((e) => e.steps !== null && e.steps > 0) &&
                emptyHint ? (
                  <p className="mb-3 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
                    {emptyHint}
                  </p>
                ) : null}

                <div className="grid gap-3 md:grid-cols-2">
                  {items.map((progress) => (
                    <BodyAbilityCard
                      key={progress.ability.id}
                      progress={progress}
                      themeId={themeId}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
