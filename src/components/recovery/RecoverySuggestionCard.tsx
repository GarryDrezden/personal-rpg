import { useAppTheme } from '../../hooks/useAppTheme';
import { CARD_ACCENT } from '../../constants/cardTheme';
import { Card } from '../ui/Card';
import { HeartHandshake } from 'lucide-react';

type RecoverySuggestionCardProps = {
  onAccept: () => void;
  onDismiss: () => void;
};

export function RecoverySuggestionCard({ onAccept, onDismiss }: RecoverySuggestionCardProps) {
  const { isDarkFantasy } = useAppTheme();

  const cardClass = isDarkFantasy
    ? 'border-violet-500/40 bg-[var(--app-card)] shadow-[0_0_24px_rgba(167,139,250,0.12)]'
    : `${CARD_ACCENT.warning} border-amber-300/50`;

  return (
    <Card className={cardClass}>
      <div className="flex items-start gap-3">
        <HeartHandshake
          className={`mt-0.5 shrink-0 ${isDarkFantasy ? 'text-violet-300' : 'text-amber-700'}`}
          size={24}
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-[var(--app-text)]">
            Включить день восстановления?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">
            Вчера было тяжеловато. Можно не давить на максимум: удержим базу — калории, без
            алкоголя, минимум шагов и короткий дневник.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onAccept}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isDarkFantasy
                  ? 'bg-violet-600/80 text-white hover:bg-violet-600'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              Включить восстановление
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-2.5 text-sm font-medium text-[var(--app-text)] hover:brightness-[1.03]"
            >
              Оставить обычный день
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
