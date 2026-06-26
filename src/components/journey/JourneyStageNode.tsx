import type { AppThemeId } from '../../types/theme';
import type { JourneyStageProgress } from '../../types/journeyMap';
import { resolveJourneyStageText } from '../../types/journeyMap';
import { Check, Lock } from 'lucide-react';

type JourneyStageNodeProps = {
  progress: JourneyStageProgress;
  selected?: boolean;
  onClick?: () => void;
  themeId?: AppThemeId;
};

const STATUS_LABELS = {
  completed: 'Пройдено',
  current: 'Текущая глава',
  locked: 'Впереди',
} as const;

export function JourneyStageNode({
  progress,
  selected = false,
  onClick,
  themeId = 'cozy',
}: JourneyStageNodeProps) {
  const { stage, status, progressPercent } = progress;
  const text = resolveJourneyStageText(stage, themeId);
  const isDark = themeId === 'darkFantasy';

  const statusStyles = {
    completed: 'border-emerald-500/40 bg-emerald-500/10',
    current: isDark
      ? 'border-amber-400/50 bg-[color-mix(in_srgb,var(--app-secondary)_15%,var(--app-card))] shadow-[var(--app-glow)]'
      : 'border-[color-mix(in_srgb,var(--app-primary)_40%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))]',
    locked: 'border-[var(--app-border)] bg-[var(--app-bg-soft)] opacity-70',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-xl border-2 p-3 text-left transition-all ${
        statusStyles[status]
      } ${selected ? 'ring-2 ring-[var(--app-primary)] ring-offset-2 ring-offset-[var(--app-bg)]' : ''} ${
        onClick ? 'cursor-pointer hover:brightness-[1.03]' : 'cursor-default'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`text-2xl ${status === 'locked' ? 'grayscale opacity-60' : ''}`}
          aria-hidden
        >
          {stage.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--app-text-muted)]">
              Глава {stage.order}
            </span>
            {status === 'completed' ? (
              <Check size={14} className="text-emerald-500" />
            ) : null}
            {status === 'locked' ? (
              <Lock size={12} className="text-[var(--app-text-muted)]" />
            ) : null}
          </div>
          <p
            className={`mt-0.5 font-semibold ${
              status === 'locked' ? 'text-[var(--app-text-muted)]' : 'text-[var(--app-text)]'
            }`}
          >
            {text.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-[var(--app-text-muted)]">
            {text.subtitle}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                status === 'current'
                  ? 'text-[var(--app-primary)]'
                  : status === 'completed'
                    ? 'text-emerald-500'
                    : 'text-[var(--app-text-muted)]'
              }`}
            >
              {STATUS_LABELS[status]}
            </span>
            <span className="text-[10px] text-[var(--app-text-muted)]">{progressPercent}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--app-card)]">
            <div
              className={`h-full rounded-full transition-all ${
                status === 'completed'
                  ? 'bg-emerald-500'
                  : status === 'current'
                    ? 'bg-[var(--app-primary)]'
                    : 'bg-[var(--app-text-muted)]/40'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
