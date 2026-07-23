import { useMemo } from 'react';
import { Map } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { ProgressPathCard } from '../components/progressMap/ProgressPathCard';
import { getMapSummary, getProgressPaths, hasAnyMapData } from '../utils/progressMapEngine';

export function ProgressMapPage() {
  const { dailyEntries, measurements, settings } = useAppStore();

  const paths = useMemo(
    () => getProgressPaths({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  const summary = useMemo(() => getMapSummary(paths), [paths]);
  const hasData = hasAnyMapData(paths);

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-gold)]/75">
          Кампания
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-[#0e0c14]/85 text-[var(--app-gold)]">
            <Map size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Карта прогресса</h1>
            <p className="text-sm text-[var(--app-text-muted)]">
              Пять маршрутов — вес, ясность, шаги, тренировки и замеры
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/60">
            Точек пройдено
          </p>
          <p className="mt-1 text-lg font-bold text-[var(--app-text)]">
            {summary.completedMilestones}/{summary.totalMilestones}
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/60">
            Сильнейший путь
          </p>
          <p className="mt-1 truncate text-lg font-bold text-[var(--app-text)]">
            {summary.strongestPathTitle || '—'}
          </p>
          {summary.strongestPathPercent > 0 ? (
            <p className="text-xs text-[var(--app-text-muted)]">{summary.strongestPathPercent}%</p>
          ) : null}
        </div>
        <div className="col-span-2 rounded-xl border border-violet-500/15 bg-[#0e0c14]/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/60">
            Ближайшая цель
          </p>
          <p className="mt-1 text-lg font-bold text-[var(--app-gold)]">
            {summary.nearestGoal?.milestoneTitle ?? 'Все пройдены'}
          </p>
          {summary.nearestGoal?.label ? (
            <p className="text-xs text-[var(--app-text-muted)]">{summary.nearestGoal.label}</p>
          ) : null}
        </div>
      </div>

      {!hasData ? (
        <div className="rounded-2xl border border-dashed border-violet-500/25 bg-[#0e0c14]/50 px-4 py-6 text-center">
          <p className="text-base font-medium text-[var(--app-text)]">Маршрут только начинается</p>
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            Внеси первые данные — замер, шаги или день без алкоголя — и точки появятся на карте.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {paths.map((path) => (
          <ProgressPathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}
