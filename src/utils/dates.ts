import {
  addDays,
  format,
  parseISO,
  startOfWeek,
  eachDayOfInterval,
  isMonday as dfIsMonday,
} from 'date-fns';
import { ru } from 'date-fns/locale';

/** Неделя начинается с понедельника */
export function weekStart(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

export function weekDays(weekStartDate: string): string[] {
  const start = parseISO(weekStartDate);
  const end = addDays(start, 6);
  return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function isMonday(date: string): boolean {
  return dfIsMonday(parseISO(date));
}

export function formatDateRu(date: string, pattern = 'd MMM'): string {
  return format(parseISO(date), pattern, { locale: ru });
}

export function formatDateFull(date: string): string {
  return format(parseISO(date), 'd MMMM yyyy', { locale: ru });
}
