import { useAppTheme } from '../../hooks/useAppTheme';
import type { MomentumSummary } from '../../types/momentum';
import { getMomentumLevelThemeText } from '../../utils/momentumEngine';
import { CARD_ACCENT } from '../../constants/cardTheme';import { Card } from '../ui/Card';
import { Wind } from 'lucide-react';

type MomentumHelpCardProps = {
  summary: MomentumSummary;
  onSetRecoveryMode?: () => void;
  onSetMinimalMode?: () => void;
  onDismiss?: () => void;
};

export function MomentumHelpCard({
  summary,
  onSetRecoveryMode,
  onSetMinimalMode,
  onDismiss,
}: MomentumHelpCardProps) {
  const { isDarkFantasy, themeId } = useAppTheme();

  if (!summary.recoverySuggested && !summary.minimalModeSuggested) {
    return null;
  }

  const isLostSpeed = summary.minimalModeSuggested;
  const levelId = isLostSpeed ? 'lost_speed' : 'dip';
  const levelText = getMomentumLevelThemeText({ levelId, themeId });

  const title = levelText.title;
  const body =
    levelText.helpDescription ??
    (isLostSpeed
      ? 'Не нужно закрывать прошлое. Сегодня задача — один день без отката.'
      : 'Не нужно давить максимум. Один базовый день уже начнет возвращать ход.');
  const cardClass = isDarkFantasy
    ? 'border-violet-500/40 bg-[var(--app-card)] shadow-[0_0_24px_rgba(167,139,250,0.12)]'
    : `${CARD_ACCENT.warning} border-amber-300/50`;

  return (
    <Card className={cardClass}>
      <div className="flex items-start gap-3">
        <Wind
          className={`mt-0.5 shrink-0 ${isDarkFantasy ? 'text-violet-300' : 'text-amber-700'}`}
          size={24}
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-[var(--app-text)]">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">{body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onSetRecoveryMode && (
              <button
                type="button"
                onClick={onSetRecoveryMode}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isDarkFantasy
                    ? 'bg-violet-600/80 text-white hover:bg-violet-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Включить восстановление
              </button>
            )}
            {isLostSpeed && onSetMinimalMode && (
              <button
                type="button"
                onClick={onSetMinimalMode}
                className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-2.5 text-sm font-medium text-[var(--app-text)] hover:brightness-[1.03]"
              >
                Включить минимальный день
              </button>
            )}
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-2.5 text-sm font-medium text-[var(--app-text)] hover:brightness-[1.03]"
              >
                Оставить обычный день
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
