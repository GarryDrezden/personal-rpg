import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry } from '../types';
import type { RecoveryQuest, RecoveryState } from '../types/recovery';
import { calcDailyPoints, getWeeklySettingsForDate } from './points';

function hasDayData(entry: DailyEntry | undefined): boolean {
  if (!entry) return false;
  return (
    entry.calories !== null ||
    entry.steps !== null ||
    entry.alcohol !== null ||
    entry.morningExercise ||
    entry.gym ||
    entry.journal ||
    entry.cooking ||
    entry.repair ||
    entry.plants ||
    entry.hobby ||
    entry.comment.trim().length > 0
  );
}

export const MINIMAL_DAY_STEPS = 5000;
export const BAD_DAY_POINTS_THRESHOLD = 40;
export const CALORIE_OVER_LIMIT_MARGIN = 700;

export function isBadDay(entry: DailyEntry, settings: AppSettings): boolean {
  if (!hasDayData(entry)) return false;

  const points = calcDailyPoints(entry, settings);
  if (points < BAD_DAY_POINTS_THRESHOLD) return true;
  if (entry.alcohol === 'heavy') return true;

  if (entry.calories !== null) {
    const weekly = getWeeklySettingsForDate(entry.date, settings);
    if (entry.calories > weekly.caloriesLimit + CALORIE_OVER_LIMIT_MARGIN) return true;
  }

  return false;
}

export function isMinimalDayCompleted(params: {
  todayEntry: DailyEntry | null;
  settings: AppSettings;
}): boolean {
  const { todayEntry } = params;
  if (!todayEntry) return false;

  const hasCalories = todayEntry.calories !== null;
  const hasSteps = (todayEntry.steps ?? 0) >= MINIMAL_DAY_STEPS;
  const sober = todayEntry.alcohol === 'none';
  const hasJournal =
    todayEntry.journal || todayEntry.comment.trim().length > 0;

  return hasCalories && hasSteps && sober && hasJournal;
}

function resolveTodayEntry(
  today: string,
  dailyEntries: DailyEntry[],
  todayEntry?: DailyEntry | null,
): DailyEntry | null {
  if (todayEntry) return todayEntry;
  return dailyEntries.find((e) => e.date === today) ?? null;
}

function entriesWithToday(
  today: string,
  dailyEntries: DailyEntry[],
  todayEntry?: DailyEntry | null,
): DailyEntry[] {
  if (!todayEntry) return dailyEntries;
  const others = dailyEntries.filter((e) => e.date !== today);
  return [...others, todayEntry];
}

export function getDaysSinceLastEntry(
  today: string,
  dailyEntries: DailyEntry[],
): number {
  const withData = dailyEntries
    .filter((e) => hasDayData(e) && e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (withData.length === 0) {
    const onlyToday = dailyEntries.find((e) => e.date === today && hasDayData(e));
    return onlyToday ? 0 : Number.POSITIVE_INFINITY;
  }

  const last = withData[0]!;
  return Math.max(0, differenceInCalendarDays(parseISO(today), parseISO(last.date)) - 1);
}

function getYesterdayEntry(
  today: string,
  dailyEntries: DailyEntry[],
): DailyEntry | undefined {
  const yesterday = format(addDays(parseISO(today), -1), 'yyyy-MM-dd');
  return dailyEntries.find((e) => e.date === yesterday);
}

function detectRecoveryTrigger(
  today: string,
  entries: DailyEntry[],
  settings: AppSettings,
): RecoveryState {
  const gap = getDaysSinceLastEntry(today, entries);
  if (gap >= 7) return 'after_absence';

  const yesterday = getYesterdayEntry(today, entries);
  if (yesterday && isBadDay(yesterday, settings)) return 'after_bad_day';

  if (gap >= 3 && gap <= 6) return 'minimal_day_available';

  return 'normal';
}

export function getRecoveryState(params: {
  today: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  todayEntry?: DailyEntry | null;
}): RecoveryState {
  const { today, dailyEntries, settings, todayEntry } = params;
  const entries = entriesWithToday(today, dailyEntries, todayEntry);
  const todayResolved = resolveTodayEntry(today, entries, todayEntry);
  const trigger = detectRecoveryTrigger(today, entries, settings);

  if (todayResolved && isMinimalDayCompleted({ todayEntry: todayResolved, settings })) {
    return 'recovered';
  }

  return trigger;
}

function hasAnyMetric(entry: DailyEntry | null): boolean {
  if (!entry) return false;
  return (
    entry.calories !== null ||
    entry.steps !== null ||
    entry.alcohol !== null ||
    entry.morningExercise ||
    entry.gym ||
    entry.journal ||
    entry.cooking ||
    entry.repair ||
    entry.plants ||
    entry.hobby
  );
}

export function getRecoveryQuests(params: {
  today: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  todayEntry?: DailyEntry | null;
}): RecoveryQuest[] {
  const { today, dailyEntries, todayEntry } = params;
  const state = getRecoveryState(params);
  const entries = entriesWithToday(today, dailyEntries, todayEntry);
  const entry = resolveTodayEntry(today, entries, todayEntry);

  if (state === 'recovered') {
    return [
      {
        id: 'minimal_calories',
        title: 'Калории внесены',
        description: 'Минимальный день начинается с учёта',
        icon: '🍽️',
        completed: true,
      },
      {
        id: 'minimal_steps',
        title: `${MINIMAL_DAY_STEPS.toLocaleString('ru')} шагов`,
        description: 'Движение без перегруза',
        icon: '👟',
        completed: true,
      },
      {
        id: 'minimal_sober',
        title: 'День без алкоголя',
        description: 'Трезвость как опора',
        icon: '💧',
        completed: true,
      },
      {
        id: 'minimal_journal',
        title: 'Строка в дневнике',
        description: 'Короткая заметка о дне',
        icon: '✍️',
        completed: true,
      },
    ];
  }

  if (state === 'after_bad_day' || state === 'minimal_day_available') {
    return [
      {
        id: 'recovery_calories',
        title: 'Внести калории',
        description: 'Зафиксировать питание за день',
        icon: '🍽️',
        completed: entry != null && entry.calories !== null,
      },
      {
        id: 'recovery_steps',
        title: `Сделать ${MINIMAL_DAY_STEPS.toLocaleString('ru')} шагов`,
        description: 'Небольшая активность уже считается',
        icon: '👟',
        completed: (entry?.steps ?? 0) >= MINIMAL_DAY_STEPS,
      },
      {
        id: 'recovery_sober',
        title: 'День без алкоголя',
        description: 'Отметить трезвый день',
        icon: '💧',
        completed: entry?.alcohol === 'none',
      },
      {
        id: 'recovery_journal',
        title: 'Написать одну строку в дневник',
        description: 'Комментарий или отметка дневника',
        icon: '✍️',
        completed: !!(entry?.journal || entry?.comment.trim()),
      },
    ];
  }

  if (state === 'after_absence') {
    return [
      {
        id: 'return_any',
        title: 'Заполнить хотя бы один показатель',
        description: 'Калории, шаги, зал или привычки',
        icon: '📝',
        completed: hasAnyMetric(entry),
      },
      {
        id: 'return_food_or_steps',
        title: 'Внести калории или шаги',
        description: 'Достаточно одного из двух',
        icon: '🚶',
        completed:
          entry?.calories !== null ||
          entry?.steps !== null,
      },
      {
        id: 'return_comment',
        title: 'Оставить короткий комментарий',
        description: 'Одна фраза о сегодняшнем дне',
        icon: '💬',
        completed: (entry?.comment.trim().length ?? 0) > 0,
      },
    ];
  }

  return [];
}

export function getRecoveryQuestStats(quests: RecoveryQuest[]): {
  done: number;
  total: number;
  percent: number;
} {
  const total = quests.length;
  const done = quests.filter((q) => q.completed).length;
  return {
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export function shouldShowRecoveryCard(params: {
  today: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  todayEntry?: DailyEntry | null;
}): boolean {
  const state = getRecoveryState(params);
  const entries = entriesWithToday(
    params.today,
    params.dailyEntries,
    params.todayEntry,
  );
  const todayResolved = resolveTodayEntry(
    params.today,
    entries,
    params.todayEntry,
  );

  if (todayResolved?.dayMode && todayResolved.dayMode !== 'normal') return true;

  if (state !== 'normal') return true;
  return isMinimalDayCompleted({
    todayEntry: todayResolved,
    settings: params.settings,
  });
}
