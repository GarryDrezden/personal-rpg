import { addDays, format, getISODay, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { Insight, InsightType } from '../types/insights';
import { calcDailyPoints, getWeeklySettingsForDate } from './points';
import {
  hasDayData,
  isCaloriesInLimit,
  isNoAlcohol,
  isStepsGoalDone,
} from './achievementEngine';
import { sortMeasurementsByDate } from './measurements';
import { weekDays, weekStart } from './dates';
import { hasJournalEntry } from './journalEntry';

const MIN_DAYS_FOR_INSIGHTS = 7;

const WEEKDAY_DATIVE = [
  '',
  'понедельникам',
  'вторникам',
  'средам',
  'четвергам',
  'пятницам',
  'субботам',
  'воскресеньям',
];

const WEEKDAY_ACCUSATIVE = [
  '',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

function entriesWithData(entries: DailyEntry[]): DailyEntry[] {
  return entries.filter((e) => hasDayData(e));
}

export function countDaysWithData(entries: DailyEntry[]): number {
  return entriesWithData(entries).length;
}

export function hasEnoughDataForInsights(entries: DailyEntry[]): boolean {
  return countDaysWithData(entries) >= MIN_DAYS_FOR_INSIGHTS;
}

function insight(
  id: string,
  type: InsightType,
  title: string,
  description: string,
  metric?: string,
  value?: string | number,
): Insight {
  return { id, type, title, description, metric, value };
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function weekdayStats(entries: DailyEntry[], settings: AppSettings) {
  const byDay = new Map<number, { points: number[]; caloriesOk: number; caloriesTotal: number }>();

  for (const e of entriesWithData(entries)) {
    const dow = getISODay(parseISO(e.date));
    const row = byDay.get(dow) ?? { points: [], caloriesOk: 0, caloriesTotal: 0 };
    row.points.push(calcDailyPoints(e, settings));
    if (e.calories !== null) {
      row.caloriesTotal++;
      if (isCaloriesInLimit(e, settings)) row.caloriesOk++;
    }
    byDay.set(dow, row);
  }

  return byDay;
}

function bestWeekdayInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const stats = weekdayStats(entries, settings);
  let bestDow = 0;
  let bestAvg = -Infinity;

  for (const [dow, row] of stats) {
    if (row.points.length < 2) continue;
    const a = avg(row.points);
    if (a > bestAvg) {
      bestAvg = a;
      bestDow = dow;
    }
  }

  if (bestDow === 0 || bestAvg <= 0) return null;

  return insight(
    'best_weekday',
    'positive',
    'Лучший день недели',
    `Похоже, лучше всего режим держится по ${WEEKDAY_DATIVE[bestDow]}: средний день ${Math.round(bestAvg)} очков.`,
    'средние очки',
    Math.round(bestAvg),
  );
}

function hardestWeekdayInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const stats = weekdayStats(entries, settings);
  let worstDow = 0;
  let worstRate = Infinity;

  for (const [dow, row] of stats) {
    if (row.caloriesTotal < 2) continue;
    const rate = row.caloriesOk / row.caloriesTotal;
    if (rate < worstRate) {
      worstRate = rate;
      worstDow = dow;
    }
  }

  if (worstDow === 0 || worstRate >= 0.8) return null;

  return insight(
    'hardest_weekday_calories',
    'warning',
    'Сложный день недели',
    `${WEEKDAY_ACCUSATIVE[worstDow]} чаще других проседает по калориям — стоит заранее планировать этот день.`,
    'доля дней в лимите',
    `${Math.round(worstRate * 100)}%`,
  );
}

function alcoholNextDayInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const sorted = [...entriesWithData(entries)].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((e) => [e.date, e]));

  const afterAlcohol: number[] = [];
  const afterSober: number[] = [];

  for (const e of sorted) {
    if (e.alcohol !== 'moderate' && e.alcohol !== 'heavy') continue;
    const next = format(addDays(parseISO(e.date), 1), 'yyyy-MM-dd');
    const nextEntry = byDate.get(next);
    if (!nextEntry) continue;
    afterAlcohol.push(calcDailyPoints(nextEntry, settings));
  }

  for (const e of sorted) {
    if (!isNoAlcohol(e)) continue;
    const next = format(addDays(parseISO(e.date), 1), 'yyyy-MM-dd');
    const nextEntry = byDate.get(next);
    if (!nextEntry) continue;
    afterSober.push(calcDailyPoints(nextEntry, settings));
  }

  if (afterAlcohol.length < 2 || afterSober.length < 3) return null;

  const diff = avg(afterSober) - avg(afterAlcohol);
  if (diff < 8) return null;

  return insight(
    'alcohol_next_day',
    'warning',
    'Алкоголь и следующий день',
    `Замечено: после алкоголя следующий день в среднем слабее примерно на ${Math.round(diff)} очков.`,
    'разница очков',
    Math.round(diff),
  );
}

function stepsCaloriesInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const withSteps: DailyEntry[] = [];
  const withoutSteps: DailyEntry[] = [];

  for (const e of entriesWithData(entries)) {
    if (e.calories === null) continue;
    if (isStepsGoalDone(e, settings)) withSteps.push(e);
    else if (e.steps !== null) withoutSteps.push(e);
  }

  if (withSteps.length < 3 || withoutSteps.length < 3) return null;

  const rateWith = withSteps.filter((e) => isCaloriesInLimit(e, settings)).length / withSteps.length;
  const rateWithout =
    withoutSteps.filter((e) => isCaloriesInLimit(e, settings)).length / withoutSteps.length;

  if (rateWith <= rateWithout + 0.15) return null;

  return insight(
    'steps_calories',
    'positive',
    'Шаги и калории',
    'В дни с выполненной целью по шагам калории чаще попадают в лимит — движение, похоже, помогает держать питание.',
    'дни в лимите (со шагами)',
    `${Math.round(rateWith * 100)}%`,
  );
}

function journalGoodDayInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const withJournal: DailyEntry[] = [];
  const withoutJournal: DailyEntry[] = [];

  for (const e of entriesWithData(entries)) {
    if (hasJournalEntry(e)) withJournal.push(e);
    else withoutJournal.push(e);
  }

  if (withJournal.length < 3 || withoutJournal.length < 3) return null;

  const good = (list: DailyEntry[]) =>
    list.filter((e) => calcDailyPoints(e, settings) >= 70).length / list.length;

  const rateWith = good(withJournal);
  const rateWithout = good(withoutJournal);

  if (rateWith <= rateWithout + 0.12) return null;

  return insight(
    'journal_good_day',
    'positive',
    'Дневник и хороший день',
    'Дни с отметкой дневника чаще становятся хорошими — короткая запись, похоже, помогает удерживать фокус.',
    'хорошие дни с дневником',
    `${Math.round(rateWith * 100)}%`,
  );
}

function weightWaistInsight(measurements: MeasurementEntry[]): Insight | null {
  const withBoth = sortMeasurementsByDate(measurements).filter(
    (m) =>
      m.weight !== null &&
      m.weight > 0 &&
      m.waist !== null &&
      m.waist > 0,
  );

  if (withBoth.length < 4) return null;

  const recent = withBoth.slice(-4);
  const older = withBoth.slice(0, Math.min(4, withBoth.length - 2));

  const weightDelta = recent[recent.length - 1]!.weight! - older[0]!.weight!;
  const waistDelta = recent[recent.length - 1]!.waist! - older[0]!.waist!;

  if (Math.abs(weightDelta) > 1 || waistDelta >= -0.5) return null;

  return insight(
    'weight_waist',
    'positive',
    'Вес и талия',
    'Вес может стоять на месте, но талия уже изменилась — это нормальный этап, тело перестраивается.',
    'талия',
    `${waistDelta.toFixed(1)} см`,
  );
}

function gymWeeksInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const weeks = new Set(entries.map((e) => weekStart(e.date)));
  const gymWeekPoints: number[] = [];
  const otherWeekPoints: number[] = [];

  for (const ws of weeks) {
    const days = weekDays(ws);
    const weekEntries = days.map((d) => entries.find((e) => e.date === d)).filter(Boolean) as DailyEntry[];
    if (weekEntries.filter((e) => hasDayData(e)).length < 3) continue;

    const gymTarget = getWeeklySettingsForDate(ws, settings).gymTarget;
    const gymCount = weekEntries.filter((e) => e.gym).length;
    const weekAvg = avg(
      weekEntries.filter((e) => hasDayData(e)).map((e) => calcDailyPoints(e, settings)),
    );

    if (gymCount >= gymTarget) gymWeekPoints.push(weekAvg);
    else otherWeekPoints.push(weekAvg);
  }

  if (gymWeekPoints.length < 2 || otherWeekPoints.length < 2) return null;

  const diff = avg(gymWeekPoints) - avg(otherWeekPoints);
  if (diff < 10) return null;

  return insight(
    'gym_weeks',
    'positive',
    'Норма зала',
    `В недели с выполненной нормой зала средние очки выше примерно на ${Math.round(diff)} — тренировки, похоже, подтягивают весь ритм.`,
    'разница очков',
    Math.round(diff),
  );
}

function returnAfterPauseInsight(entries: DailyEntry[]): Insight | null {
  const sorted = entriesWithData(entries).sort((a, b) => a.date.localeCompare(b.date));

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1]!.date);
    const curr = parseISO(sorted[i]!.date);
    const gap = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (gap >= 7) {
      return insight(
        'return_after_pause',
        'positive',
        'Возвращение после паузы',
        'После паузы ты вернулся к данным — это важнее идеальной серии без срывов.',
      );
    }
  }

  return null;
}

function improvingMetricInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const sorted = entriesWithData(entries).sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 14) return null;

  const mid = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, mid);
  const secondHalf = sorted.slice(mid);

  const firstAvg = avg(firstHalf.map((e) => calcDailyPoints(e, settings)));
  const secondAvg = avg(secondHalf.map((e) => calcDailyPoints(e, settings)));

  if (secondAvg <= firstAvg + 5) return null;

  return insight(
    'improving_points',
    'positive',
    'Рост очков',
    `За последнее время средний день стал выше: похоже, режим постепенно улучшается (+${Math.round(secondAvg - firstAvg)} очков).`,
    'прирост',
    Math.round(secondAvg - firstAvg),
  );
}

function dayBreakersInsight(entries: DailyEntry[], settings: AppSettings): Insight | null {
  const withData = entriesWithData(entries);
  const heavy = withData.filter((e) => e.alcohol === 'heavy').length;
  const overCal = withData.filter(
    (e) => e.calories !== null && !isCaloriesInLimit(e, settings),
  ).length;

  if (withData.length < 7) return null;

  if (heavy >= 2 && heavy / withData.length >= 0.1) {
    return insight(
      'day_breaker_alcohol',
      'suggestion',
      'Что чаще ломает день',
      'Стоит попробовать отмечать тяжёлые дни с алкоголем заранее — на следующий день обычно проще вернуться через минимальный набор.',
    );
  }

  if (overCal / withData.length >= 0.35) {
    return insight(
      'day_breaker_calories',
      'suggestion',
      'Что чаще ломает день',
      'Перебор калорий встречается чаще других слабых мест — можно заранее планировать один «страховочный» день в неделю.',
    );
  }

  return null;
}

const INSIGHT_PRIORITY: Record<InsightType, number> = {
  positive: 4,
  suggestion: 3,
  warning: 2,
  neutral: 1,
};

export function generateInsights(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): Insight[] {
  const { dailyEntries, measurements, settings } = params;

  if (!hasEnoughDataForInsights(dailyEntries)) {
    return [];
  }

  const candidates = [
    bestWeekdayInsight(dailyEntries, settings),
    hardestWeekdayInsight(dailyEntries, settings),
    alcoholNextDayInsight(dailyEntries, settings),
    stepsCaloriesInsight(dailyEntries, settings),
    journalGoodDayInsight(dailyEntries, settings),
    weightWaistInsight(measurements),
    gymWeeksInsight(dailyEntries, settings),
    returnAfterPauseInsight(dailyEntries),
    improvingMetricInsight(dailyEntries, settings),
    dayBreakersInsight(dailyEntries, settings),
  ].filter((i): i is Insight => i !== null);

  return candidates;
}

export function filterInsights(insights: Insight[], filter: import('../types/insights').InsightFilter): Insight[] {
  if (filter === 'all') return insights;
  if (filter === 'positive') return insights.filter((i) => i.type === 'positive');
  if (filter === 'warning') return insights.filter((i) => i.type === 'warning');
  return insights.filter((i) => i.type === 'suggestion');
}

export function getTopInsight(insights: Insight[]): Insight | null {
  if (insights.length === 0) return null;

  return [...insights].sort((a, b) => {
    const pa = INSIGHT_PRIORITY[a.type];
    const pb = INSIGHT_PRIORITY[b.type];
    if (pb !== pa) return pb - pa;
    return a.id.localeCompare(b.id);
  })[0]!;
}
