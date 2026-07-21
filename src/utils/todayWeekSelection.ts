import { weekDays, weekStart } from './dates';

export type TodayPageSelection = {
  visibleWeekStart: string;
  selectedDate: string;
};

export function resolveTodayPageSelection(params: {
  today: string;
  dateParam: string | null;
  weekParam: string | null;
}): TodayPageSelection {
  const currentWeekStart = weekStart(params.today);

  const requestedWeekStart = params.weekParam
    ? weekStart(params.weekParam)
    : params.dateParam
      ? weekStart(params.dateParam)
      : currentWeekStart;

  const visibleWeekStart =
    requestedWeekStart > currentWeekStart ? currentWeekStart : requestedWeekStart;

  const visibleWeekDays = weekDays(visibleWeekStart);
  const defaultDate = visibleWeekDays.includes(params.today)
    ? params.today
    : visibleWeekDays[visibleWeekDays.length - 1]!;

  const selectedDate =
    params.dateParam && visibleWeekDays.includes(params.dateParam)
      ? params.dateParam
      : defaultDate;

  return { visibleWeekStart, selectedDate };
}

export function buildTodaySearchParams(options: {
  currentWeekStart: string;
  visibleWeekStart: string;
  date: string;
  today: string;
}): Record<string, string> {
  const params: Record<string, string> = {};
  if (options.visibleWeekStart !== options.currentWeekStart) {
    params.week = options.visibleWeekStart;
  }
  if (options.date !== options.today) {
    params.date = options.date;
  }
  return params;
}

export function buildWeekPageSearchParams(
  visibleWeekStart: string,
  currentWeekStart: string,
): Record<string, string> {
  if (visibleWeekStart === currentWeekStart) return {};
  return { week: visibleWeekStart };
}
