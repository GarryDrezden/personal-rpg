import { Link } from 'react-router-dom';
import type { AppSettings, DailyEntry } from '../../types';
import {
  RECOVERY_STATE_MESSAGES,
  RECOVERY_STATE_TITLES,
  type RecoveryState,
} from '../../types/recovery';
import {
  getRecoveryQuests,
  getRecoveryQuestStats,
  getRecoveryState,
  isMinimalDayCompleted,
} from '../../utils/recoveryEngine';
import { CARD_ACCENT, BTN_SECONDARY, SURFACE_INSET } from '../../constants/cardTheme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Check, HeartHandshake, Sparkles } from 'lucide-react';

type RecoveryCardProps = {
  today: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  todayEntry?: DailyEntry | null;
  showLink?: boolean;
};

function stateAccent(state: RecoveryState): string {
  switch (state) {
    case 'recovered':
      return CARD_ACCENT.success;
    case 'after_absence':
      return CARD_ACCENT.default;
    case 'after_bad_day':
      return CARD_ACCENT.warning;
    case 'minimal_day_available':
      return CARD_ACCENT.default;
    default:
      return CARD_ACCENT.default;
  }
}

export function RecoveryCard({
  today,
  dailyEntries,
  settings,
  todayEntry,
  showLink = true,
}: RecoveryCardProps) {
  const state = getRecoveryState({ today, dailyEntries, settings, todayEntry });
  const quests = getRecoveryQuests({ today, dailyEntries, settings, todayEntry });
  const stats = getRecoveryQuestStats(quests);
  const minimalDone = isMinimalDayCompleted({
    todayEntry: todayEntry ?? dailyEntries.find((e) => e.date === today) ?? null,
    settings,
  });

  const title =
    state === 'recovered' && minimalDone
      ? RECOVERY_STATE_TITLES.recovered
      : RECOVERY_STATE_TITLES[state] || 'Поддержка режима';

  const message =
    state === 'recovered' ? RECOVERY_STATE_MESSAGES.recovered : RECOVERY_STATE_MESSAGES[state];

  return (
    <Card className={`h-full ${stateAccent(state)}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {state === 'recovered' ? (
            <Sparkles className="mt-0.5 shrink-0 text-[var(--app-success)]" size={22} />
          ) : (
            <HeartHandshake className="mt-0.5 shrink-0 text-[var(--app-secondary)]" size={22} />
          )}
          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">{message}</p>
          </div>
        </div>
        {state === 'recovered' && <Badge variant="success">День удержан</Badge>}
        {minimalDone && state !== 'recovered' && <Badge variant="gold">Минимум выполнен</Badge>}
      </div>

      {quests.length > 0 && (
        <>
          <div className="mb-2 flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>Прогресс восстановления</span>
            <span>
              {stats.done}/{stats.total}
            </span>
          </div>
          <ProgressBar
            value={stats.percent}
            color={stats.percent >= 100 ? 'success' : 'gold'}
            className="mb-4 h-2"
          />

          <ul className="space-y-2">
            {quests.map((q) => (
              <li key={q.id} className={`flex items-center gap-3 px-3 py-2.5 ${SURFACE_INSET}`}>
                <span className="text-lg leading-none">{q.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--app-text)]">{q.title}</p>
                  <p className="text-xs text-[var(--app-text-muted)]">{q.description}</p>
                </div>
                {q.completed ? (
                  <Check className="shrink-0 text-[var(--app-success)]" size={18} />
                ) : (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--app-border)]" />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {minimalDone && (
        <p className="mt-3 text-sm font-medium text-[var(--app-success)]">
          +1 🪙 за минимальный день (при сохранении)
        </p>
      )}

      {showLink && state !== 'recovered' && (
        <Link to="/today" className={`mt-4 inline-flex ${BTN_SECONDARY}`}>
          Открыть квесты дня →
        </Link>
      )}
    </Card>
  );
}
