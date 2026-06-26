import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { BODY_ABILITY_BRANCHES } from '../constants/bodyAbilities';
import { BodyAbilityBranchCard } from '../components/bodyAbilities/BodyAbilityBranchCard';
import { BodyAbilityCard } from '../components/bodyAbilities/BodyAbilityCard';
import {
  getAllBodyAbilityProgress,
  getBodyAbilityBranchSummaries,
  getBodyAbilityStats,
  getBranchEmptyHint,
  hasEnoughDataForBodyAbilities,
} from '../utils/bodyAbilityEngine';
import type { BodyAbilityBranch } from '../types/bodyAbilities';

export function BodyAbilitiesPage() {
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

  const stats = useMemo(() => getBodyAbilityStats(engineParams), [engineParams]);
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

  return (
    <div className="space-y-8 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Способности тела</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
          Это не просто цифры. Каждый устойчивый шаг возвращает персонажу движение, контроль и
          ясность.
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--app-primary)]">
          Открыто способностей: {stats.unlocked} / {stats.total}
        </p>
      </header>

      {!hasData ? (
        <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-6 text-center text-sm text-[var(--app-text-muted)]">
          Пока мало данных для открытия способностей. Начни с простого: внеси вес, калории или
          шаги за сегодняшний день.
        </p>
      ) : null}

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Ветки
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {branchSummaries.map((summary) => (
            <BodyAbilityBranchCard key={summary.branch} summary={summary} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
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
                  <h2 className="text-lg font-semibold text-[var(--app-text)]">
                    {branchMeta.title}
                  </h2>
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
                  <BodyAbilityCard key={progress.ability.id} progress={progress} themeId={themeId} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
