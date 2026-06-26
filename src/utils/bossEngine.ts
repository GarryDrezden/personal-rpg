import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type {
  WeeklyBoss,
  WeeklyBossCondition,
  WeeklyBossStatus,
} from '../types/boss';
import { pickBossTemplate } from '../constants/bosses';
import {
  calcDailyPoints,
  calcWeeklyBonuses,
  getWeeklySettingsForDate,
} from './points';
import { weekDays, weekStart } from './dates';
import { isStepsNormalDone } from './stepsEngine';

function isCaloriesInLimit(entry: DailyEntry, settings: AppSettings): boolean {
  if (entry.calories === null) return false;
  const weekly = getWeeklySettingsForDate(entry.date, settings);
  return entry.calories <= weekly.caloriesLimit;
}

function isStepsGoalDone(entry: DailyEntry, settings: AppSettings): boolean {
  return isStepsNormalDone(entry.steps, settings, entry.date);
}

function isNoAlcohol(entry: DailyEntry): boolean {
  return entry.alcohol === 'none';
}

const REWARD_DEFEATED = { xp: 300, coins: 5 };
const REWARD_PERFECT = { xp: 500, coins: 8 };

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

export function buildBossConditions(
  ws: string,
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): WeeklyBossCondition[] {
  const weekly = getWeeklySettingsForDate(ws, settings);
  const days = weekDays(ws);
  const weekEntries = days.map((d) => entries.find((e) => e.date === d));

  const weeklyPoints = weekTotalPoints(ws, entries, measurements, settings);
  const caloriesDays = weekEntries.filter(
    (e) => e && e.calories !== null && isCaloriesInLimit(e, settings),
  ).length;
  const stepsDays = weekEntries.filter((e) => e && isStepsGoalDone(e, settings)).length;
  const noAlcoholDays = weekEntries.filter((e) => e && isNoAlcohol(e)).length;
  const gymCount = weekEntries.filter((e) => e?.gym).length;

  return [
    {
      id: 'weekly_points',
      title: 'Очки недели',
      description: `Набрать ${weekly.weeklyPointsGoal} XP за неделю`,
      current: weeklyPoints,
      target: weekly.weeklyPointsGoal,
      completed: weeklyPoints >= weekly.weeklyPointsGoal,
      icon: '⚔️',
    },
    {
      id: 'calories_days',
      title: 'Калории в лимите',
      description: 'Минимум 5 дней в лимите',
      current: caloriesDays,
      target: 5,
      completed: caloriesDays >= 5,
      icon: '🍽️',
    },
    {
      id: 'steps_days',
      title: 'Шаги выполнены',
      description: 'Минимум 5 дней с целью по шагам',
      current: stepsDays,
      target: 5,
      completed: stepsDays >= 5,
      icon: '👟',
    },
    {
      id: 'no_alcohol_days',
      title: 'Без алкоголя',
      description: '7 трезвых дней',
      current: noAlcoholDays,
      target: 7,
      completed: noAlcoholDays >= 7,
      icon: '💧',
    },
    {
      id: 'gym_target',
      title: 'Норма зала',
      description: `Зал ${weekly.gymTarget} раз за неделю`,
      current: gymCount,
      target: weekly.gymTarget,
      completed: gymCount >= weekly.gymTarget,
      icon: '🏋️',
    },
  ];
}

function conditionProgress(c: WeeklyBossCondition): number {
  if (c.target <= 0) return c.completed ? 100 : 0;
  return Math.min(100, (c.current / c.target) * 100);
}

function isPerfectVictory(
  conditions: WeeklyBossCondition[],
  weekly: ReturnType<typeof getWeeklySettingsForDate>,
): boolean {
  const byId = Object.fromEntries(conditions.map((c) => [c.id, c]));
  const wp = byId.weekly_points;
  return (
    !!wp &&
    wp.current >= weekly.weeklyPointsGoal * 1.2 &&
    (byId.calories_days?.current ?? 0) >= 6 &&
    (byId.steps_days?.current ?? 0) >= 6 &&
    (byId.no_alcohol_days?.current ?? 0) === 7 &&
    !!byId.gym_target?.completed
  );
}

function resolveStatus(
  hpPercent: number,
  perfect: boolean,
  allDefeated: boolean,
): WeeklyBossStatus {
  if (perfect) return 'perfect';
  if (hpPercent === 0 || allDefeated) return 'defeated';
  if (hpPercent === 100) return 'not_started';
  if (hpPercent > 50) return 'in_progress';
  return 'wounded';
}

export function getWeeklyBoss(params: {
  weekStart: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  measurements?: MeasurementEntry[];
}): WeeklyBoss {
  const { weekStart: ws, dailyEntries, settings } = params;
  const measurements = params.measurements ?? [];
  const template = pickBossTemplate(ws);
  const weekly = getWeeklySettingsForDate(ws, settings);
  const conditions = buildBossConditions(ws, dailyEntries, measurements, settings);

  const avgCompletion =
    conditions.reduce((sum, c) => sum + conditionProgress(c), 0) / conditions.length;
  const hpPercent = Math.round(100 - avgCompletion);
  const allConditionsMet = conditions.every((c) => c.completed);
  const perfect = isPerfectVictory(conditions, weekly);
  const status = resolveStatus(hpPercent, perfect, allConditionsMet);

  const rewards =
    status === 'perfect'
      ? REWARD_PERFECT
      : status === 'defeated'
        ? REWARD_DEFEATED
        : { xp: REWARD_DEFEATED.xp, coins: REWARD_DEFEATED.coins };

  return {
    id: `boss-${ws}`,
    weekStart: ws,
    templateId: template.id,
    title: template.title,
    subtitle: template.subtitle,
    description: template.description,
    avatarEmoji: template.avatarEmoji,
    imagePath: template.imagePath,
    accent: template.accent,
    status,
    hpPercent: perfect || status === 'defeated' ? 0 : hpPercent,
    conditions,
    rewardXp: rewards.xp,
    rewardCoins: rewards.coins,
  };
}

export function getAllWeekStarts(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[] = [],
): string[] {
  const weeks = new Set<string>();
  for (const e of dailyEntries) weeks.add(weekStart(e.date));
  for (const m of measurements) weeks.add(weekStart(m.date));
  return [...weeks].sort();
}

export function getBossHistory(
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  measurements: MeasurementEntry[] = [],
): WeeklyBoss[] {
  return getAllWeekStarts(dailyEntries, measurements).map((ws) =>
    getWeeklyBoss({ weekStart: ws, dailyEntries, settings, measurements }),
  );
}

export function countDefeatedBosses(history: WeeklyBoss[]): number {
  return history.filter((b) => b.status === 'defeated' || b.status === 'perfect').length;
}

export function countPerfectBosses(history: WeeklyBoss[]): number {
  return history.filter((b) => b.status === 'perfect').length;
}

export function maxBossDefeatStreak(history: WeeklyBoss[]): number {
  let max = 0;
  let current = 0;
  for (const boss of history) {
    const won = boss.status === 'defeated' || boss.status === 'perfect';
    if (won) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}
