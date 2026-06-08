import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type {
  MapSummary,
  MilestoneStatus,
  NearestMapGoal,
  ProgressPath,
  ProgressPathId,
} from '../types/progressMap';
import { PATH_MILESTONES, PROGRESS_PATH_META } from '../constants/progressMap';
import { getMaxStreak, isNoAlcohol, sumSteps } from './achievementEngine';
import { sortMeasurementsByDate } from './measurements';

function calcWeightLost(measurements: MeasurementEntry[]): number {
  const withWeight = sortMeasurementsByDate(measurements).filter(
    (m) => m.weight !== null && m.weight > 0,
  );
  if (withWeight.length < 2) return 0;
  const start = withWeight[0]!.weight!;
  const latest = withWeight[withWeight.length - 1]!.weight!;
  return Math.max(0, start - latest);
}

function calcAlcoholStreak(dailyEntries: DailyEntry[]): number {
  return getMaxStreak(dailyEntries, (e) => !!e && isNoAlcohol(e));
}

function calcGymTotal(dailyEntries: DailyEntry[]): number {
  return dailyEntries.filter((e) => e.gym).length;
}

function calcMeasurementCount(measurements: MeasurementEntry[]): number {
  return measurements.filter(
    (m) =>
      (m.weight !== null && m.weight > 0) || (m.waist !== null && m.waist > 0),
  ).length;
}

function buildPath(id: ProgressPathId, currentValue: number): ProgressPath {
  const meta = PROGRESS_PATH_META[id];
  return {
    id,
    title: meta.title,
    description: meta.description,
    icon: meta.icon,
    currentValue,
    milestones: PATH_MILESTONES[id],
  };
}

export function getProgressPaths(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): ProgressPath[] {
  const { dailyEntries, measurements } = params;
  void params.settings;

  return [
    buildPath('weight', calcWeightLost(measurements)),
    buildPath('alcohol', calcAlcoholStreak(dailyEntries)),
    buildPath('steps', sumSteps(dailyEntries)),
    buildPath('gym', calcGymTotal(dailyEntries)),
    buildPath('measurements', calcMeasurementCount(measurements)),
  ];
}

export function getMilestoneStatus(
  currentValue: number,
  milestoneValue: number,
  milestones: { value: number }[],
): MilestoneStatus {
  if (currentValue >= milestoneValue) return 'completed';
  const next = milestones.find((m) => currentValue < m.value);
  if (next?.value === milestoneValue) return 'current';
  return 'upcoming';
}

export function getNextMilestone(path: ProgressPath) {
  return path.milestones.find((m) => path.currentValue < m.value) ?? null;
}

export function countCompletedMilestones(path: ProgressPath): number {
  return path.milestones.filter((m) => path.currentValue >= m.value).length;
}

export function getPathProgressPercent(path: ProgressPath): number {
  const total = path.milestones.length;
  if (total === 0) return 0;
  return Math.round((countCompletedMilestones(path) / total) * 100);
}

function formatRemaining(pathId: ProgressPathId, remaining: number): string {
  switch (pathId) {
    case 'weight':
      return `${remaining.toFixed(1)} кг`;
    case 'alcohol':
      return `${Math.ceil(remaining)} ${remaining === 1 ? 'день' : remaining < 5 ? 'дня' : 'дней'}`;
    case 'steps':
      return remaining.toLocaleString('ru-RU');
    case 'gym': {
      const n = Math.ceil(remaining);
      return `${n} ${n === 1 ? 'тренировка' : n < 5 ? 'тренировки' : 'тренировок'}`;
    }
    case 'measurements': {
      const n = Math.ceil(remaining);
      return `${n} ${n === 1 ? 'замер' : n < 5 ? 'замера' : 'замеров'}`;
    }
  }
}

function formatGoalPrefix(pathId: ProgressPathId, milestoneTitle: string): string {
  switch (pathId) {
    case 'weight':
      return `До ${milestoneTitle}`;
    case 'alcohol':
      return `До ${milestoneTitle} без алкоголя`;
    case 'steps':
      return `До ${milestoneTitle} шагов`;
    case 'gym':
      return `До ${milestoneTitle}`;
    case 'measurements':
      return `До ${milestoneTitle}`;
  }
}

export function buildNearestGoal(path: ProgressPath): NearestMapGoal | null {
  const next = getNextMilestone(path);
  if (!next) return null;

  const remaining = Math.max(0, next.value - path.currentValue);
  return {
    pathId: path.id,
    pathTitle: path.title,
    pathIcon: path.icon,
    milestoneTitle: next.title,
    remaining,
    label: `${formatGoalPrefix(path.id, next.title)} осталось ${formatRemaining(path.id, remaining)}`,
  };
}

export function getNearestMapGoal(paths: ProgressPath[]): NearestMapGoal | null {
  const goals = paths
    .map(buildNearestGoal)
    .filter((g): g is NearestMapGoal => g !== null);

  if (goals.length === 0) return null;

  return goals.reduce((best, goal) => {
    const path = paths.find((p) => p.id === goal.pathId)!;
    const next = getNextMilestone(path)!;
    const span = next.value - (path.milestones[path.milestones.indexOf(next) - 1]?.value ?? 0);
    const bestPath = paths.find((p) => p.id === best.pathId)!;
    const bestNext = getNextMilestone(bestPath)!;
    const bestSpan =
      bestNext.value -
      (bestPath.milestones[bestPath.milestones.indexOf(bestNext) - 1]?.value ?? 0);

    const goalRatio = span > 0 ? goal.remaining / span : 1;
    const bestRatio = bestSpan > 0 ? best.remaining / bestSpan : 1;

    return goalRatio < bestRatio ? goal : best;
  });
}

export function getMapSummary(paths: ProgressPath[]): MapSummary {
  const completedMilestones = paths.reduce(
    (sum, p) => sum + countCompletedMilestones(p),
    0,
  );
  const totalMilestones = paths.reduce((sum, p) => sum + p.milestones.length, 0);

  let strongestPath = paths[0] ?? null;
  let strongestPercent = 0;
  for (const path of paths) {
    const pct = getPathProgressPercent(path);
    if (pct > strongestPercent) {
      strongestPercent = pct;
      strongestPath = path;
    }
  }

  return {
    completedMilestones,
    totalMilestones,
    nearestGoal: getNearestMapGoal(paths),
    strongestPathId: strongestPath?.id ?? null,
    strongestPathTitle: strongestPath?.title ?? '',
    strongestPathPercent: strongestPercent,
  };
}

export function formatPathCurrentValue(path: ProgressPath): string {
  switch (path.id) {
    case 'weight':
      return path.currentValue > 0 ? `−${path.currentValue.toFixed(1)} кг` : '0 кг';
    case 'alcohol':
      return `${path.currentValue} ${path.currentValue === 1 ? 'день' : path.currentValue < 5 ? 'дня' : 'дней'}`;
    case 'steps':
      return path.currentValue.toLocaleString('ru-RU');
    case 'gym': {
      const n = path.currentValue;
      return `${n} ${n === 1 ? 'тренировка' : n < 5 ? 'тренировки' : 'тренировок'}`;
    }
    case 'measurements': {
      const n = path.currentValue;
      return `${n} ${n === 1 ? 'замер' : n < 5 ? 'замера' : 'замеров'}`;
    }
  }
}

export function hasAnyMapData(paths: ProgressPath[]): boolean {
  return paths.some((p) => p.currentValue > 0);
}
