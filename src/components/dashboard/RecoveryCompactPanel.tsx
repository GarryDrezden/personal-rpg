import { Link } from 'react-router-dom';
import type { AppSettings, DailyEntry } from '../../types';
import {
  RECOVERY_STATE_MESSAGES,
  RECOVERY_STATE_TITLES,
} from '../../types/recovery';
import {
  getRecoveryState,
  isMinimalDayCompleted,
} from '../../utils/recoveryEngine';
import type { MomentumSummary } from '../../types/momentum';
import { getMomentumLevelThemeText } from '../../utils/momentumEngine';
import { useAppTheme } from '../../hooks/useAppTheme';
import { HeartHandshake, Wind } from 'lucide-react';

type RecoveryCompactPanelProps =
  | {
      variant: 'momentum';
      summary: MomentumSummary;
      onSetRecoveryMode?: () => void;
      onSetMinimalMode?: () => void;
      onDismiss?: () => void;
    }
  | {
      variant: 'recovery';
      today: string;
      dailyEntries: DailyEntry[];
      settings: AppSettings;
      todayEntry?: DailyEntry | null;
    };

export function RecoveryCompactPanel(props: RecoveryCompactPanelProps) {
  const { isDarkFantasy, themeId } = useAppTheme();

  if (props.variant === 'momentum') {
    const { summary, onSetRecoveryMode, onSetMinimalMode, onDismiss } = props;
    if (!summary.recoverySuggested && !summary.minimalModeSuggested) return null;

    const isLostSpeed = summary.minimalModeSuggested;
    const levelText = getMomentumLevelThemeText({
      levelId: isLostSpeed ? 'lost_speed' : 'dip',
      themeId,
    });

    return (
      <div
        data-testid="dashboard-recovery-compact"
        className={`flex flex-col gap-2 rounded-xl border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between ${
          isDarkFantasy
            ? 'border-violet-500/35 bg-[color-mix(in_srgb,#7c3aed_8%,var(--app-card))]'
            : 'border-amber-300/50 bg-amber-50/80'
        }`}
      >
        <div className="flex min-w-0 items-start gap-2">
          <Wind className="mt-0.5 shrink-0 text-violet-300" size={18} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--app-text)]">{levelText.title}</p>
            <p className="line-clamp-2 text-xs text-[var(--app-text-muted)]">
              {levelText.helpDescription ??
                'Один базовый день уже начнёт возвращать ход.'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {onSetRecoveryMode ? (
            <button
              type="button"
              onClick={onSetRecoveryMode}
              className="rounded-lg bg-violet-600/85 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-600"
            >
              Включить восстановление
            </button>
          ) : null}
          {isLostSpeed && onSetMinimalMode ? (
            <button
              type="button"
              onClick={onSetMinimalMode}
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-xs font-medium"
            >
              Включить минимальный день
            </button>
          ) : null}
          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg border border-[var(--app-border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--app-text-muted)]"
            >
              Оставить обычный день
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const state = getRecoveryState({
    today: props.today,
    dailyEntries: props.dailyEntries,
    settings: props.settings,
    todayEntry: props.todayEntry,
  });
  const minimalDone = isMinimalDayCompleted({
    todayEntry: props.todayEntry ?? props.dailyEntries.find((e) => e.date === props.today) ?? null,
    settings: props.settings,
  });

  const title =
    state === 'recovered' && minimalDone
      ? RECOVERY_STATE_TITLES.recovered
      : RECOVERY_STATE_TITLES[state] || 'Поддержка режима';
  const message = RECOVERY_STATE_MESSAGES[state === 'recovered' ? 'recovered' : state];

  return (
    <div
      data-testid="dashboard-recovery-compact"
      className="flex flex-col gap-2 rounded-xl border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-card-strong)_80%,var(--app-card))] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-2">
        <HeartHandshake className="mt-0.5 shrink-0 text-[var(--app-secondary)]" size={18} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--app-text)]">{title}</p>
          <p className="line-clamp-2 text-xs text-[var(--app-text-muted)]">{message}</p>
        </div>
      </div>
      {state !== 'recovered' ? (
        <Link
          to="/today"
          className="shrink-0 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-xs font-medium text-[var(--app-primary)]"
        >
          Квесты →
        </Link>
      ) : null}
    </div>
  );
}
