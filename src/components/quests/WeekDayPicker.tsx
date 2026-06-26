import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { DailyEntry } from '../../types';
import { weekDays } from '../../utils/dates';

type WeekDayPickerProps = {
  weekStartDate: string;
  selectedDate: string;
  today: string;
  dailyEntries: DailyEntry[];
  onChange: (date: string) => void;
};

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
    Object.values(entry.customCompletions ?? {}).some(Boolean) ||
    entry.comment.trim().length > 0
  );
}

export function WeekDayPicker({
  weekStartDate,
  selectedDate,
  today,
  dailyEntries,
  onChange,
}: WeekDayPickerProps) {
  const days = weekDays(weekStartDate);

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {days.map((date) => {
        const selected = date === selectedDate;
        const isToday = date === today;
        const entry = dailyEntries.find((e) => e.date === date);
        const filled = hasDayData(entry);
        const weekday = format(parseISO(date), 'EEEEE', { locale: ru });
        const dayNum = format(parseISO(date), 'd');

        return (
          <button
            key={date}
            type="button"
            onClick={() => onChange(date)}
            className={`flex min-h-[3.25rem] flex-col items-center justify-center rounded-xl border-2 px-1 py-2 text-center transition-colors ${
              selected
                ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] text-[var(--app-primary)]'
                : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text)] hover:brightness-[1.04]'
            }`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
              {weekday}
            </span>
            <span className="text-sm font-bold">{dayNum}</span>
            {isToday && (
              <span className="mt-0.5 text-[9px] font-semibold uppercase text-[var(--app-primary)]">
                сегодня
              </span>
            )}
            {!isToday && filled && (
              <span
                className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--app-success)]"
                title="Есть данные"
              />
            )}
            {!isToday && !filled && (
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-transparent" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
