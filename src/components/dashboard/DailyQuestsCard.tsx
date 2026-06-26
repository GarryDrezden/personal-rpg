import { Link } from 'react-router-dom';
import type { AppSettings, DailyEntry } from '../../types';
import { getWeeklySettingsForDate } from '../../utils/points';
import { getDailyQuests, getQuestCompletionStats } from '../../utils/questEngine';
import { QuestCard } from '../quests/QuestCard';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Swords } from 'lucide-react';

type DailyQuestsCardProps = {
  entry: DailyEntry | undefined;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  date: string;
};

export function DailyQuestsCard({
  entry,
  dailyEntries,
  settings,
  date,
}: DailyQuestsCardProps) {
  const entriesForQuests = entry
    ? dailyEntries.map((e) => (e.date === date ? entry : e))
    : dailyEntries;

  const quests = getDailyQuests({
    date,
    dailyEntries: entriesForQuests,
    settings,
  });
  const mainQuests = quests.filter((q) => q.category === 'main');
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
    <Card data-testid="dashboard-daily-quests">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Swords className="text-[var(--app-primary)]" size={22} />
          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Квесты дня</h2>
            <p className="text-sm text-[var(--app-text-muted)]">
              Основные {stats.mainDone}/{stats.mainTotal} · всего {stats.done}/{stats.total}
            </p>
          </div>
        </div>
        <Link
          to="/today"
          className="shrink-0 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-sm font-medium text-[var(--app-primary)] hover:brightness-[1.03]"
        >
          Открыть квесты →
        </Link>
      </div>

      <ProgressBar
        value={stats.percent}
        color={stats.percent >= 70 ? 'success' : 'gold'}
        className="mb-4 h-2"
      />

      <div className="space-y-2">
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
    </Card>
  );
}
