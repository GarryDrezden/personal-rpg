import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateRu, shiftWeekStart } from '../../utils/dates';

type WeekNavigatorProps = {
  weekStartDate: string;
  weekEndDate: string;
  currentWeekStart: string;
  onChange: (weekStart: string) => void;
};

export function WeekNavigator({
  weekStartDate,
  weekEndDate,
  currentWeekStart,
  onChange,
}: WeekNavigatorProps) {
  const isCurrentWeek = weekStartDate === currentWeekStart;
  const canGoForward = weekStartDate < currentWeekStart;

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => onChange(shiftWeekStart(weekStartDate, -1))}
        className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-[var(--app-border)] px-3 py-2 text-sm font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Прошлая
      </button>
      <p className="text-center text-sm font-medium text-[var(--app-text)]">
        {formatDateRu(weekStartDate, 'd MMM')} — {formatDateRu(weekEndDate, 'd MMM yyyy')}
        {isCurrentWeek ? (
          <span className="mt-0.5 block text-xs font-normal text-[var(--app-primary)]">
            текущая неделя
          </span>
        ) : null}
      </p>
      <button
        type="button"
        disabled={!canGoForward}
        onClick={() => onChange(shiftWeekStart(weekStartDate, 1))}
        className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-[var(--app-border)] px-3 py-2 text-sm font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Следующая
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
