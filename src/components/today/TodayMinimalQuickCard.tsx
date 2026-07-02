import type { DailyEntry } from '../../types';
import { getDayMode } from '../../utils/stepsEngine';
import { Card } from '../ui/Card';

type TodayMinimalQuickCardProps = {
  entry: DailyEntry;
  onEnableMinimal: () => void;
  saving?: boolean;
};

export function TodayMinimalQuickCard({
  entry,
  onEnableMinimal,
  saving = false,
}: TodayMinimalQuickCardProps) {
  const mode = getDayMode(entry.dayMode);
  if (mode === 'minimal') {
    return (
      <Card
        data-testid="today-minimal-active"
        className="border-[var(--app-gold)]/30 bg-[var(--app-primary-soft)]/40"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
          Минимальный день
        </p>
        <p className="mt-2 text-sm text-[var(--app-text)]">
          Маршрут удержан мягко. Отметь главное — и путь не прервётся.
        </p>
      </Card>
    );
  }

  return (
    <Card data-testid="today-minimal-quick" className="border-dashed border-[var(--app-border)]">
      <p className="text-sm font-medium text-[var(--app-text)]">Быстрый ход</p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">
        Сегодня можно удержать маршрут минимально. Отметь главное — и путь не прервётся.
      </p>
      <button
        type="button"
        disabled={saving}
        onClick={onEnableMinimal}
        className="mt-3 w-full rounded-xl border border-[var(--app-gold)]/40 bg-[var(--app-primary-soft)]/50 px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] hover:brightness-105 disabled:opacity-50"
      >
        Включить минимальный день
      </button>
    </Card>
  );
}
