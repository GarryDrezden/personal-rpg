import { Link } from 'react-router-dom';
import type { DailyEntry } from '../../types';
import type { WeeklySettings } from '../../types';
import { Card } from '../ui/Card';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

type Quest = {
  id: string;
  label: string;
  done: boolean;
  priority: 'main' | 'bonus';
};

function buildQuests(entry: DailyEntry | undefined, weekly: WeeklySettings): Quest[] {
  const e = entry;
  const main: Quest[] = [
    {
      id: 'calories',
      label: `Калории ≤ ${weekly.caloriesLimit}`,
      done: !!e && e.calories !== null && e.calories <= weekly.caloriesLimit,
      priority: 'main',
    },
    {
      id: 'steps',
      label: `Шаги ≥ ${weekly.stepsGoal.toLocaleString('ru')}`,
      done: !!e && e.steps !== null && e.steps >= weekly.stepsGoal,
      priority: 'main',
    },
    {
      id: 'alcohol',
      label: 'Без алкоголя',
      done: e?.alcohol === 'none',
      priority: 'main',
    },
  ];

  const bonus: Quest[] = [
    { id: 'exercise', label: 'Зарядка', done: !!e?.morningExercise, priority: 'bonus' },
    { id: 'gym', label: `Зал (${weekly.gymTarget}/нед)`, done: !!e?.gym, priority: 'bonus' },
    { id: 'journal', label: 'Дневник', done: !!e?.journal, priority: 'bonus' },
    { id: 'cooking', label: 'Готовка', done: !!e?.cooking, priority: 'bonus' },
    { id: 'hobby', label: 'Хобби', done: !!e?.hobby, priority: 'bonus' },
  ];

  return [...main, ...bonus];
}

type DailyQuestsCardProps = {
  entry: DailyEntry | undefined;
  weekly: WeeklySettings;
};

function QuestRow({ quest }: { quest: Quest }) {
  const Icon = quest.done ? CheckCircle2 : Circle;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
        quest.done ? 'bg-emerald-50/80' : 'bg-stone-50'
      }`}
    >
      <Icon
        size={20}
        className={quest.done ? 'text-emerald-600 shrink-0' : 'text-stone-300 shrink-0'}
      />
      <span className={`flex-1 text-sm ${quest.done ? 'text-emerald-900' : 'text-stone-700'}`}>
        {quest.label}
      </span>
      {quest.priority === 'main' && !quest.done && (
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
          главный
        </span>
      )}
    </div>
  );
}

export function DailyQuestsCard({ entry, weekly }: DailyQuestsCardProps) {
  const quests = buildQuests(entry, weekly);
  const mainQuests = quests.filter((q) => q.priority === 'main');
  const bonusQuests = quests.filter((q) => q.priority === 'bonus');
  const doneCount = quests.filter((q) => q.done).length;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Квесты дня</h2>
          <p className="text-sm text-rpg-muted">
            Выполнено {doneCount} из {quests.length}
          </p>
        </div>
        <Link to="/today" className="flex items-center gap-0.5 text-sm font-medium text-gold hover:underline">
          Все <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">Основные</p>
        {mainQuests.map((q) => (
          <QuestRow key={q.id} quest={q} />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">Дополнительные</p>
        {bonusQuests.map((q) => (
          <QuestRow key={q.id} quest={q} />
        ))}
      </div>
    </Card>
  );
}
