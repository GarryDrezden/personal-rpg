import type { AlcoholStatus, DailyEntry } from '../../types';
import type { WeeklySettings } from '../../types';
import type { DailyQuest } from '../../types/quests';
import { QUEST_STATUS_LABELS } from '../../types/quests';
import { getHabitCardColorClass } from '../../constants/habitColors';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAppStore } from '../../store/appStore';
import { getQuestStatusStyles } from '../../utils/questTheme';
import { isBuiltinHabitId } from '../../utils/habitConfig';
import {
  getDayMode,
  getStepsBarColor,
  getStepsProgressPercent,
  getStepsThresholds,
} from '../../utils/stepsEngine';
import { RECOVERY_STEPS_THRESHOLDS, MINIMAL_DAY_STEPS_THRESHOLD } from '../../constants/steps';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';
import { SegmentedControl } from '../ui/SegmentedControl';
import { StepsProgressBar } from '../steps/StepsProgressBar';

type QuestCardProps = {
  quest: DailyQuest;
  entry: DailyEntry;
  weekly: WeeklySettings;
  onPatch: (partial: Partial<DailyEntry>) => void;
  compact?: boolean;
};

function toggleHabit(
  quest: DailyQuest,
  entry: DailyEntry,
  onPatch: (partial: Partial<DailyEntry>) => void,
) {
  if (quest.isCustom) {
    const next = { ...(entry.customCompletions ?? {}) };
    next[quest.id] = !next[quest.id];
    onPatch({ customCompletions: next });
    return;
  }
  if (isBuiltinHabitId(quest.id)) {
    onPatch({ [quest.id]: !entry[quest.id] } as Partial<DailyEntry>);
  }
}

export function QuestCard({ quest, entry, onPatch, compact = false }: QuestCardProps) {
  const { themeId } = useAppTheme();
  const { settings } = useAppStore();
  const style = getQuestStatusStyles(quest.status, themeId);
  const accentClass = quest.cardColor ? getHabitCardColorClass(quest.cardColor) : '';

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
      case 'nutrition':
        return null;
      case 'calories':
        return null;
      case 'steps': {
        const dayMode = getDayMode(entry.dayMode);
        const thresholds = getStepsThresholds(settings, entry.date);
        const stepsInfo = quest.stepsInfo;
        const pct = getStepsProgressPercent(entry.steps, settings, entry.date, dayMode);
        const barColor = getStepsBarColor(
          stepsInfo?.status ?? 'none',
          entry.steps,
          settings,
          entry.date,
          dayMode,
        );

        const goalLabel =
          dayMode === 'minimal'
            ? `мин. ${MINIMAL_DAY_STEPS_THRESHOLD.toLocaleString('ru')}`
            : dayMode === 'recovery'
              ? `восст. ${RECOVERY_STEPS_THRESHOLDS.normal.toLocaleString('ru')}`
              : `норма ${thresholds.normal.toLocaleString('ru')} · отлично ${thresholds.excellent.toLocaleString('ru')}`;

        const markers =
          dayMode === 'normal'
            ? [
                {
                  percent: (thresholds.minimum / thresholds.excellent) * 100,
                  label: '7k',
                },
                {
                  percent: (thresholds.normal / thresholds.excellent) * 100,
                  label: '11.5k',
                },
                { percent: 100, label: '14k+' },
              ]
            : undefined;

        return (
          <div className="space-y-2">
            <NumberInput
              label={`Шаги (${goalLabel})`}
              value={entry.steps}
              onChange={(v) => onPatch({ steps: v })}
            />
            {entry.steps !== null && stepsInfo && (
              <>
                <p className="text-sm font-medium text-[var(--app-text)]">{stepsInfo.title}</p>
                {stepsInfo.stepsToNextTarget != null && stepsInfo.stepsToNextTarget > 0 && (
                  <p className="text-xs text-[var(--app-text-muted)]">
                    До {stepsInfo.nextTargetLabel} осталось{' '}
                    {stepsInfo.stepsToNextTarget.toLocaleString('ru')}
                  </p>
                )}
                {stepsInfo.status === 'excellent' && (
                  <p className="text-xs text-[var(--app-success)]">
                    Максимальный бонус получен
                  </p>
                )}
                <StepsProgressBar value={pct} color={barColor} markers={markers} />
              </>
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
            onClick={() => toggleHabit(quest, entry, onPatch)}
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
        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${accentClass || style.card}`}
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
    <Card className={`border ${accentClass || style.card}`}>
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
