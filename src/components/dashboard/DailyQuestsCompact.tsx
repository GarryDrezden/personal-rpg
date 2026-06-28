import { Link } from 'react-router-dom';
import type { AppSettings, DailyEntry } from '../../types';
import { getWeeklySettingsForDate } from '../../utils/points';
import { getDailyQuests, getQuestCompletionStats } from '../../utils/questEngine';
import { QuestCard } from '../quests/QuestCard';
import { ProgressBar } from '../ui/ProgressBar';

type DailyQuestsCompactProps = {
  entry: DailyEntry | undefined;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  date: string;
};

export function DailyQuestsCompact({
  entry,
  dailyEntries,
  settings,
  date,
}: DailyQuestsCompactProps) {
  const entriesForQuests = entry
    ? dailyEntries.map((e) => (e.date === date ? entry : e))
    : dailyEntries;

  const quests = getDailyQuests({
    date,
    dailyEntries: entriesForQuests,
    settings,
  });
  const mainQuests = quests.filter((q) => q.category === 'main').slice(0, 3);
  const stats = getQuestCompletionStats(quests);
  const draftEntry =
    entry ??
    ({
      id: '',
      date,
      calories: null,
      steps: null,
      alcohol: null,
      morningExercise: false,
      gym: false,
      journal: false,
      cooking: false,
      repair: false,
      plants: false,
      hobby: false,
      comment: '',
      customCompletions: {},
    } satisfies DailyEntry);

  const weekly = getWeeklySettingsForDate(date, settings);

  return (
    <div
      data-testid="dashboard-daily-quests-compact"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2.5"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--app-text)]">Квесты дня</p>
          <p className="text-xs text-[var(--app-text-muted)]">
            {stats.mainDone}/{stats.mainTotal} основных · {stats.done}/{stats.total} всего
          </p>
        </div>
        <Link
          to="/today"
          className="shrink-0 text-xs font-medium text-[var(--app-primary)] hover:underline"
        >
          Все →
        </Link>
      </div>

      <ProgressBar
        value={stats.percent}
        color={stats.percent >= 70 ? 'success' : 'gold'}
        className="mb-2 h-1.5"
      />

      <div className="space-y-1.5">
        {mainQuests.map((q) => (
          <QuestCard
            key={q.id}
            quest={q}
            entry={draftEntry}
            weekly={weekly}
            onPatch={() => {}}
            compact
          />
        ))}
      </div>
    </div>
  );
}
