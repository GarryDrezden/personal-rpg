import { addDays, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { UnlockedAchievement } from '../types/achievements';
import type { CoinTransaction } from '../types/currency';
import type { WeeklyReport, WeeklyReportStatus } from '../types/weeklyReport';
import { WEEKLY_REPORT_SUMMARIES } from '../types/weeklyReport';
import {
  calcDailyPoints,
  calcWeeklyBonuses,
  getWeeklySettingsForDate,
} from './points';
import {
  isCaloriesInLimit,
  isNoAlcohol,
  isStepsGoalDone,
} from './achievementEngine';
import { formatDateRu, weekDays, weekStart } from './dates';

function weekDailyPoints(
  ws: string,
  entries: DailyEntry[],
  settings: AppSettings,
): number {
  return weekDays(ws).reduce((sum, d) => {
    const e = entries.find((x) => x.date === d);
    return sum + (e ? calcDailyPoints(e, settings) : 0);
  }, 0);
}

function weekTotalPoints(
  ws: string,
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): number {
  return (
    weekDailyPoints(ws, entries, settings) +
    calcWeeklyBonuses(ws, entries, measurements, settings).total
  );
}

function resolveStatus(
  pointsPercent: number,
  noAlcoholDays: number,
  caloriesInLimitDays: number,
): WeeklyReportStatus {
  if (pointsPercent >= 120 && noAlcoholDays === 7 && caloriesInLimitDays >= 6) {
    return 'perfect';
  }
  if (pointsPercent >= 100) return 'strong';
  if (pointsPercent >= 80) return 'good';
  if (pointsPercent >= 50) return 'normal';
  return 'weak';
}

function weekCoinsEarned(
  ws: string,
  weekEnd: string,
  transactions: CoinTransaction[],
): number {
  return transactions
    .filter(
      (tx) =>
        tx.amount > 0 &&
        tx.date >= ws &&
        tx.date <= weekEnd,
    )
    .reduce((sum, tx) => sum + tx.amount, 0);
}

function weekAchievementUnlocks(
  ws: string,
  weekEnd: string,
  unlocked: UnlockedAchievement[],
): number {
  return unlocked.filter((a) => a.unlockedAt >= ws && a.unlockedAt <= weekEnd).length;
}

function weekMeasurementDelta(
  ws: string,
  measurements: MeasurementEntry[],
  field: 'weight' | 'waist',
): number | undefined {
  const days = weekDays(ws);
  const inWeek = measurements
    .filter((m) => days.includes(m.date) && m[field] !== null && (m[field] as number) > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (inWeek.length < 2) return undefined;

  const first = inWeek[0]![field] as number;
  const last = inWeek[inWeek.length - 1]![field] as number;
  return Math.round((last - first) * 10) / 10;
}

function findBestDay(
  ws: string,
  entries: DailyEntry[],
  settings: AppSettings,
): { date?: string; points?: number } {
  let bestDate: string | undefined;
  let bestPoints = -Infinity;

  for (const d of weekDays(ws)) {
    const e = entries.find((x) => x.date === d);
    if (!e) continue;
    const pts = calcDailyPoints(e, settings);
    if (pts > bestPoints) {
      bestPoints = pts;
      bestDate = d;
    }
  }

  if (!bestDate || bestPoints === -Infinity) return {};
  return { date: bestDate, points: bestPoints };
}

function detectBestHabit(metrics: {
  noAlcoholDays: number;
  caloriesInLimitDays: number;
  stepsGoalDays: number;
  gymCount: number;
  gymTarget: number;
  totalSteps: number;
}): string {
  const candidates: { label: string; score: number }[] = [
    { label: 'Трезвость', score: metrics.noAlcoholDays },
    { label: 'Контроль калорий', score: metrics.caloriesInLimitDays },
    { label: 'Шаги', score: metrics.stepsGoalDays },
    {
      label: 'Тренировки',
      score: metrics.gymTarget > 0 ? metrics.gymCount / metrics.gymTarget : metrics.gymCount,
    },
    { label: 'Активность', score: metrics.totalSteps / 70_000 },
  ];

  const best = candidates.reduce((a, b) => (b.score > a.score ? b : a));
  if (best.score <= 0) return 'Внесение данных';
  return best.label;
}

function buildAdvice(
  status: WeeklyReportStatus,
  metrics: {
    pointsPercent: number;
    caloriesInLimitDays: number;
    stepsGoalDays: number;
    noAlcoholDays: number;
    gymCount: number;
    gymTarget: number;
  },
): string {
  const tips: string[] = [];

  if (metrics.caloriesInLimitDays < 5) {
    tips.push('Попробуй чаще вносить калории — это самый быстрый рычаг недели.');
  }
  if (metrics.stepsGoalDays < 5) {
    tips.push('Добавь прогулки: 5 дней с целью по шагам сильно поднимают неделю.');
  }
  if (metrics.noAlcoholDays < 7) {
    tips.push('Трезвые дни дают и XP, и монеты — поставь фокус на 7/7.');
  }
  if (metrics.gymCount < metrics.gymTarget) {
    tips.push(`Зал ${metrics.gymCount}/${metrics.gymTarget}: один-два захода закроют недельный бонус.`);
  }
  if (metrics.pointsPercent < 80) {
    tips.push('Минимальный день (калории, 5000 шагов, дневник) поможет не терять ритм.');
  }

  if (status === 'perfect' || status === 'strong') {
    return 'Сохрани темп и не разгоняйся слишком резко — стабильность важнее рывка.';
  }
  if (tips.length === 0) {
    return 'Продолжай в том же духе: закрепи сильные привычки на следующей неделе.';
  }
  return tips[0]!;
}

export function getAllReportWeekStarts(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
): string[] {
  const weeks = new Set<string>();
  for (const e of dailyEntries) weeks.add(weekStart(e.date));
  for (const m of measurements) weeks.add(weekStart(m.date));
  return [...weeks].sort().reverse();
}

export function previousWeekStart(today: string): string {
  return weekStart(addDays(parseISO(today), -7));
}

export function generateWeeklyReport(params: {
  weekStart: string;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  unlockedAchievements: UnlockedAchievement[];
  coinTransactions: CoinTransaction[];
}): WeeklyReport {
  const {
    weekStart: ws,
    dailyEntries,
    measurements,
    settings,
    unlockedAchievements,
    coinTransactions,
  } = params;

  const days = weekDays(ws);
  const weekEnd = days[6]!;
  const weekly = getWeeklySettingsForDate(ws, settings);
  const weekEntries = days.map((d) => dailyEntries.find((e) => e.date === d));

  const points = weekTotalPoints(ws, dailyEntries, measurements, settings);
  const pointsGoal = weekly.weeklyPointsGoal;
  const pointsPercent =
    pointsGoal > 0 ? Math.round((points / pointsGoal) * 100) : 0;

  const caloriesInLimitDays = weekEntries.filter(
    (e) => e && isCaloriesInLimit(e, settings),
  ).length;
  const stepsGoalDays = weekEntries.filter(
    (e) => e && isStepsGoalDone(e, settings),
  ).length;
  const noAlcoholDays = weekEntries.filter((e) => e && isNoAlcohol(e)).length;
  const gymCount = weekEntries.filter((e) => e?.gym).length;
  const totalSteps = weekEntries.reduce((s, e) => s + (e?.steps ?? 0), 0);
  const averageSteps = Math.round(totalSteps / 7);

  const status = resolveStatus(pointsPercent, noAlcoholDays, caloriesInLimitDays);
  const bestDay = findBestDay(ws, dailyEntries, settings);
  const bestHabit = detectBestHabit({
    noAlcoholDays,
    caloriesInLimitDays,
    stepsGoalDays,
    gymCount,
    gymTarget: weekly.gymTarget,
    totalSteps,
  });

  return {
    weekStart: ws,
    weekEnd,
    status,
    points,
    pointsGoal,
    pointsPercent,
    xpEarned: points,
    coinsEarned: weekCoinsEarned(ws, weekEnd, coinTransactions),
    caloriesInLimitDays,
    stepsGoalDays,
    noAlcoholDays,
    gymCount,
    gymTarget: weekly.gymTarget,
    totalSteps,
    averageSteps,
    bestDayDate: bestDay.date,
    bestDayPoints: bestDay.points,
    weightChange: weekMeasurementDelta(ws, measurements, 'weight'),
    waistChange: weekMeasurementDelta(ws, measurements, 'waist'),
    unlockedAchievementsCount: weekAchievementUnlocks(ws, weekEnd, unlockedAchievements),
    bestHabit,
    summary: WEEKLY_REPORT_SUMMARIES[status],
    advice: buildAdvice(status, {
      pointsPercent,
      caloriesInLimitDays,
      stepsGoalDays,
      noAlcoholDays,
      gymCount,
      gymTarget: weekly.gymTarget,
    }),
  };
}

export function generateAllWeeklyReports(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  unlockedAchievements: UnlockedAchievement[];
  coinTransactions: CoinTransaction[];
}): WeeklyReport[] {
  const weeks = getAllReportWeekStarts(params.dailyEntries, params.measurements);
  return weeks.map((ws) =>
    generateWeeklyReport({ ...params, weekStart: ws }),
  );
}

export function formatReportForCopy(report: WeeklyReport): string {
  const lines = [
    `📊 Отчёт за неделю ${formatDateRu(report.weekStart)} — ${formatDateRu(report.weekEnd)}`,
    '',
    `${report.summary}`,
    '',
    `Статус: ${report.status}`,
    `Очки: ${report.points} / ${report.pointsGoal} (${report.pointsPercent}%)`,
    `XP: ${report.xpEarned}`,
    `Монеты: ${report.coinsEarned}`,
    `Калории в лимите: ${report.caloriesInLimitDays}/7`,
    `Шаги (цель): ${report.stepsGoalDays}/7`,
    `Без алкоголя: ${report.noAlcoholDays}/7`,
    `Зал: ${report.gymCount}/${report.gymTarget}`,
    `Шагов всего: ${report.totalSteps.toLocaleString('ru')}`,
    `Лучшая привычка: ${report.bestHabit}`,
  ];

  if (report.bestDayDate && report.bestDayPoints !== undefined) {
    lines.push(
      `Лучший день: ${formatDateRu(report.bestDayDate)} (${report.bestDayPoints} XP)`,
    );
  }
  if (report.weightChange !== undefined) {
    lines.push(`Вес за неделю: ${report.weightChange > 0 ? '+' : ''}${report.weightChange} кг`);
  }
  if (report.waistChange !== undefined) {
    lines.push(`Талия за неделю: ${report.waistChange > 0 ? '+' : ''}${report.waistChange} см`);
  }
  if (report.unlockedAchievementsCount > 0) {
    lines.push(`Достижений: ${report.unlockedAchievementsCount}`);
  }

  lines.push('', `💡 ${report.advice}`);
  return lines.join('\n');
}
