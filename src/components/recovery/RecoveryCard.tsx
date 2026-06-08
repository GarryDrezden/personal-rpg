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
      return 'from-emerald-50 via-white to-teal-50 ring-emerald-200/70';
    case 'after_absence':
      return 'from-sky-50 via-white to-indigo-50 ring-sky-200/70';
    case 'after_bad_day':
      return 'from-amber-50 via-white to-orange-50 ring-amber-200/70';
    case 'minimal_day_available':
      return 'from-stone-50 via-white to-slate-50 ring-stone-200/70';
    default:
      return 'from-stone-50 to-white ring-stone-200/50';
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
    state === 'recovered'
      ? RECOVERY_STATE_MESSAGES.recovered
      : RECOVERY_STATE_MESSAGES[state];

  return (
    <Card className={`bg-gradient-to-br shadow-sm ring-1 ${stateAccent(state)}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {state === 'recovered' ? (
            <Sparkles className="mt-0.5 shrink-0 text-emerald-600" size={22} />
          ) : (
            <HeartHandshake className="mt-0.5 shrink-0 text-teal-600" size={22} />
          )}
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-stone-700">{message}</p>
          </div>
        </div>
        {state === 'recovered' && (
          <Badge variant="success">День удержан</Badge>
        )}
        {minimalDone && state !== 'recovered' && (
          <Badge variant="gold">Минимум выполнен</Badge>
        )}
      </div>

      {quests.length > 0 && (
        <>
          <div className="mb-2 flex items-center justify-between text-xs text-rpg-muted">
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
              <li
                key={q.id}
                className="flex items-center gap-3 rounded-xl border border-rpg-border/80 bg-white/80 px-3 py-2.5"
              >
                <span className="text-lg leading-none">{q.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{q.title}</p>
                  <p className="text-xs text-rpg-muted">{q.description}</p>
                </div>
                {q.completed ? (
                  <Check className="shrink-0 text-success" size={18} />
                ) : (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-stone-300" />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {minimalDone && (
        <p className="mt-3 text-sm font-medium text-emerald-700">
          +1 🪙 за минимальный день (при сохранении)
        </p>
      )}

      {showLink && state !== 'recovered' && (
        <Link
          to="/today"
          className="mt-4 inline-flex rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
        >
          Открыть квесты дня →
        </Link>
      )}
    </Card>
  );
}
