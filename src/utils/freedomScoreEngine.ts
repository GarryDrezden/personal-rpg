import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { BodyAbilityProgress } from '../types/bodyAbilities';
import type {
  FreedomScoreBreakdownItem,
  FreedomScoreLevel,
  FreedomScoreResult,
} from '../types/freedomScore';
import { FREEDOM_SCORE_LEVELS } from '../constants/freedomScore';
import { isCaloriesInLimit } from './achievementEngine';
import {
  getWeightLossKg,
  getWaistLossCm,
  getAllBodyAbilityProgress,
} from './bodyAbilityEngine';
import { isStepsMinimumDone, isStepsNormalDone, getDayMode } from './stepsEngine';
import {
  calculateMomentumHistory,
  getAverageMomentumLastDays,
  momentumPointsFromAverage,
} from './momentumEngine';
import { todayISO } from './dates';

function linearPoints(value: number, maxValue: number, maxPoints: number): number {
  if (maxValue <= 0) return 0;
  return Math.min(maxPoints, (value / maxValue) * maxPoints);
}

function buildBreakdownItem(
  id: string,
  title: string,
  description: string,
  value: number,
  maxValue: number,
  maxPoints: number,
): FreedomScoreBreakdownItem {
  const points = Math.round(linearPoints(value, maxValue, maxPoints) * 10) / 10;
  return {
    id,
    title,
    description,
    value,
    maxValue,
    points,
    maxPoints,
  };
}

function resolveFreedomLevel(score: number): FreedomScoreLevel {
  const sorted = [...FREEDOM_SCORE_LEVELS].sort((a, b) => b.min - a.min);
  return sorted.find((l) => score >= l.min) ?? FREEDOM_SCORE_LEVELS[0]!;
}

export function calculateFreedomScore(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  bodyAbilityProgress?: BodyAbilityProgress[];
}): FreedomScoreResult {
  const { dailyEntries, measurements, settings } = params;

  const bodyAbilities =
    params.bodyAbilityProgress ??
    getAllBodyAbilityProgress({ dailyEntries, measurements, settings });

  const weightLossKg = getWeightLossKg(measurements);
  const waistLossCm = getWaistLossCm(measurements);
  const stepsMinimumDays = dailyEntries.filter((e) =>
    isStepsMinimumDone(e.steps, settings, e.date),
  ).length;
  const stepsNormalDays = dailyEntries.filter((e) =>
    isStepsNormalDone(e.steps, settings, e.date),
  ).length;
  const calorieTrackingDays = dailyEntries.filter(
    (e) => e.calories !== null && e.calories !== undefined,
  ).length;
  const calorieLimitDays = dailyEntries.filter((e) => isCaloriesInLimit(e, settings)).length;
  const noAlcoholDays = dailyEntries.filter((e) => e.alcohol === 'none').length;
  const gymDays = dailyEntries.filter((e) => e.gym).length;
  const recoveryDays = dailyEntries.filter((e) => {
    const mode = getDayMode(e.dayMode);
    return mode === 'recovery' || mode === 'minimal';
  }).length;
  const unlockedAbilities = bodyAbilities.filter((p) => p.unlocked).length;

  const breakdown: FreedomScoreBreakdownItem[] = [
    buildBreakdownItem(
      'weight',
      'Снижение веса',
      'Лучший достигнутый результат по весу',
      weightLossKg,
      50,
      25,
    ),
    buildBreakdownItem(
      'waist',
      'Талия',
      'Лучшее уменьшение обхвата талии',
      waistLossCm,
      30,
      10,
    ),
    buildBreakdownItem(
      'steps_minimum',
      'База шагов',
      'Дни с минимумом движения',
      stepsMinimumDays,
      60,
      15,
    ),
    buildBreakdownItem(
      'steps_normal',
      'Норма шагов',
      'Дни с нормой движения',
      stepsNormalDays,
      30,
      8,
    ),
    buildBreakdownItem(
      'calorie_tracking',
      'Учёт калорий',
      'Дни с внесёнными калориями',
      calorieTrackingDays,
      60,
      10,
    ),
    buildBreakdownItem(
      'calorie_limit',
      'Дни в лимите',
      'Дни в рамках калорийного лимита',
      calorieLimitDays,
      30,
      8,
    ),
    buildBreakdownItem(
      'clarity',
      'Ясность',
      'Дни без алкоголя',
      noAlcoholDays,
      30,
      10,
    ),
    buildBreakdownItem(
      'gym',
      'Тренировки',
      'Отмеченные тренировки',
      gymDays,
      30,
      6,
    ),
    buildBreakdownItem(
      'recovery',
      'Восстановление',
      'Recovery и minimal дни без отката',
      recoveryDays,
      10,
      4,
    ),
    buildBreakdownItem(
      'abilities',
      'Способности тела',
      'Открытые способности',
      unlockedAbilities,
      20,
      4,
    ),
  ];

  const momentumHistory = calculateMomentumHistory({ dailyEntries, settings });
  const avgMomentum14 = getAverageMomentumLastDays(
    momentumHistory,
    todayISO(),
    14,
  );
  const momentumPoints = momentumPointsFromAverage(avgMomentum14);

  breakdown.push({
    id: 'momentum',
    title: 'Инерция режима',
    description:
      'Показывает, насколько устойчиво система держит ход в последние дни.',
    value: Math.round(avgMomentum14),
    maxValue: 100,
    maxPoints: 5,
    points: momentumPoints,
  });

  const rawScore = breakdown.reduce((sum, item) => sum + item.points, 0);
  const score = Math.min(100, Math.round(rawScore));
  const level = resolveFreedomLevel(score);

  return {
    score,
    level,
    title: level.title,
    description: level.description,
    breakdown,
  };
}

export function hasFreedomScoreData(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
}): boolean {
  const { dailyEntries, measurements } = params;
  if (measurements.some((m) => m.weight !== null && m.weight > 0)) return true;
  if (dailyEntries.some((e) => e.calories !== null || (e.steps ?? 0) > 0)) return true;
  return false;
}

export function getTopBreakdownItems(
  breakdown: FreedomScoreBreakdownItem[],
  limit = 5,
): FreedomScoreBreakdownItem[] {
  return [...breakdown]
    .filter((b) => b.maxPoints > 0)
    .sort((a, b) => b.points - a.points || b.maxPoints - a.maxPoints)
    .slice(0, limit);
}
