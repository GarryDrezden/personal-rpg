import type { AlcoholStatus, DailyEntry } from '../../types';
import type { WeeklySettings } from '../../types';
import type { DailyQuest } from '../../types/quests';
import { QUEST_STATUS_LABELS } from '../../types/quests';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getQuestStatusStyles } from '../../utils/questTheme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { NumberInput } from '../ui/NumberInput';
import { SegmentedControl } from '../ui/SegmentedControl';

type QuestCardProps = {
  quest: DailyQuest;
  entry: DailyEntry;
  weekly: WeeklySettings;
  onPatch: (partial: Partial<DailyEntry>) => void;
  compact?: boolean;
};

export function QuestCard({ quest, entry, weekly, onPatch, compact = false }: QuestCardProps) {
  const { themeId } = useAppTheme();
  const style = getQuestStatusStyles(quest.status, themeId);

  const rewards = (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="rounded-full bg-[var(--app-card-strong)] px-2 py-0.5 font-medium text-[var(--app-primary)]">
        +{quest.points} XP
      </span>
      {quest.coins != null && quest.coins > 0 && (
        <span className="rounded-full bg-[var(--app-primary-soft)] px-2 py-0.5 font-medium text-[var(--app-primary)]">
          +{quest.coins} 🪙
        </span>
      )}
    </div>
  );

  const inputBlock = () => {
    switch (quest.id) {
      case 'calories':
        return (
          <NumberInput
            label={`Калории (лимит ${weekly.caloriesLimit})`}
            value={entry.calories}
            onChange={(v) => onPatch({ calories: v })}
          />
        );
      case 'steps': {
        const steps = entry.steps ?? 0;
        const pct =
          weekly.stepsGoal > 0
            ? Math.min(100, Math.round((steps / weekly.stepsGoal) * 100))
            : 0;
        return (
          <div className="space-y-2">
            <NumberInput
              label={`Шаги (цель ${weekly.stepsGoal.toLocaleString('ru')})`}
              value={entry.steps}
              onChange={(v) => onPatch({ steps: v })}
            />
            {entry.steps !== null && (
              <ProgressBar
                value={pct}
                color={quest.status === 'done' ? 'success' : 'gold'}
                className="h-2"
              />
            )}
          </div>
        );
      }
      case 'alcohol':
        return (
          <SegmentedControl<AlcoholStatus>
            label="Алкоголь"
            value={entry.alcohol}
            options={[
              { value: 'none', label: 'Не пил' },
              { value: 'moderate', label: 'Умеренно' },
              { value: 'heavy', label: 'Много' },
            ]}
            onChange={(v) => onPatch({ alcohol: v })}
            getVariant={(v) =>
              v === 'none' ? 'success' : v === 'heavy' ? 'danger' : 'neutral'
            }
          />
        );
      default:
        return (
          <button
            type="button"
            onClick={() => {
              const key = quest.id as keyof DailyEntry;
              if (typeof entry[key] === 'boolean') {
                onPatch({ [key]: !entry[key] } as Partial<DailyEntry>);
              }
            }}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              quest.status === 'done'
                ? 'border-[color-mix(in_srgb,var(--app-success)_45%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-success)_18%,var(--app-card-strong))] text-[var(--app-success)]'
                : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text)] hover:brightness-[1.03]'
            }`}
          >
            {quest.status === 'done' ? '✓ Выполнено' : quest.actionLabel ?? 'Отметить'}
          </button>
        );
    }
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${style.card}`}
      >
        <span className="text-xl" aria-hidden>
          {quest.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--app-text)]">{quest.title}</p>
          <p className={`text-[10px] font-semibold ${style.badge} inline-block rounded px-1.5 py-0.5`}>
            {QUEST_STATUS_LABELS[quest.status]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border ${style.card}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-card-strong)] text-2xl shadow-sm">
            {quest.icon}
          </span>
          <div>
            <h3 className="font-semibold text-[var(--app-text)]">{quest.title}</h3>
            <p className="text-sm text-[var(--app-text-muted)]">{quest.description}</p>
            {rewards}
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
          {QUEST_STATUS_LABELS[quest.status]}
        </span>
      </div>
      {inputBlock()}
    </Card>
  );
}
