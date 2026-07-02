import type { TodaySaveReaction } from '../../utils/todayDayReaction';

type TodaySaveReactionCardProps = {
  reaction: TodaySaveReaction;
  onDismiss?: () => void;
};

export function TodaySaveReactionCard({ reaction, onDismiss }: TodaySaveReactionCardProps) {
  return (
    <div
      data-testid="today-save-reaction"
      className="rounded-2xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/55 px-4 py-4 shadow-[0_0_20px_rgba(250,204,21,0.08)]"
      role="status"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-gold)]">
        Реакция дня
      </p>
      <p className="mt-2 text-base font-semibold text-[var(--app-text)]">{reaction.headline}</p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{reaction.detail}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 text-xs font-medium text-[var(--app-primary)] hover:underline"
        >
          Понятно
        </button>
      ) : null}
    </div>
  );
}
