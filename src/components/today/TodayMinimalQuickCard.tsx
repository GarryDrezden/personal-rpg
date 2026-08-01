import type { DailyEntry } from '../../types';
import { getDayMode } from '../../utils/stepsEngine';
import { useAppTheme } from '../../hooks/useAppTheme';

type TodayMinimalQuickCardProps = {
  entry: DailyEntry;
  onEnableMinimal: () => void;
  saving?: boolean;
};

/** Soft banner when minimal is active, or a compact shortcut when still normal. */
export function TodayMinimalQuickCard({
  entry,
  onEnableMinimal,
  saving = false,
}: TodayMinimalQuickCardProps) {
  const { isCozy } = useAppTheme();
  const mode = getDayMode(entry.dayMode);

  if (mode === 'minimal') {
    return (
      <div
        data-testid="today-minimal-active"
        className="today-minimal-banner today-minimal-banner--active"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
          Минимальный день
        </p>
        <p className="mt-1.5 text-sm text-[var(--app-text)]">
          {isCozy
            ? 'Мягкий ход удержан. Отметь главное — дом всё равно получит немного тепла.'
            : 'Маршрут удержан мягко. Отметь главное — и путь не прервётся.'}
        </p>
      </div>
    );
  }

  if (mode === 'recovery') return null;

  return (
    <div data-testid="today-minimal-quick" className="today-minimal-banner">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--app-text)]">Нет сил на полный день?</p>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            {isCozy
              ? 'Минимальный день — тоже забота. Дом примет маленький шаг.'
              : 'Включи минимальный день и удержи маршрут без давления.'}
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={onEnableMinimal}
          className="shrink-0 rounded-xl border border-[var(--app-gold)]/45 bg-[var(--app-primary-soft)]/55 px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] hover:brightness-105 disabled:opacity-50"
        >
          Минимальный день
        </button>
      </div>
    </div>
  );
}
