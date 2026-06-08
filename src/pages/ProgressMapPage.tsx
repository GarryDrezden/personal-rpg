import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { ProgressPathCard } from '../components/progressMap/ProgressPathCard';
import { Card } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { getMapSummary, getProgressPaths, hasAnyMapData } from '../utils/progressMapEngine';
import { Map } from 'lucide-react';

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
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-card-strong)] text-[var(--app-secondary)]">
            <Map size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Карта прогресса</h1>
            <p className="text-[var(--app-text-muted)]">
              Пять маршрутов — вес, ясность, шаги, тренировки и замеры
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Точек пройдено"
          value={`${summary.completedMilestones}/${summary.totalMilestones}`}
        />
        <StatTile
          label="Сильнейший путь"
          value={summary.strongestPathTitle || '—'}
          sub={summary.strongestPathPercent > 0 ? `${summary.strongestPathPercent}%` : undefined}
        />
        <div className="col-span-2">
          <StatTile
            label="Ближайшая цель"
            value={summary.nearestGoal?.milestoneTitle ?? 'Все пройдены'}
            sub={summary.nearestGoal?.label}
          />
        </div>
      </div>

      {!hasData && (
        <Card className="border-dashed text-center">
          <p className="text-lg font-medium text-[var(--app-text)]">Маршрут только начинается</p>
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            Внеси первые данные — замер, шаги или день без алкоголя — и точки появятся на карте.
          </p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {paths.map((path) => (
          <ProgressPathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}
