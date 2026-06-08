import type { AchievementCategory, AchievementTier } from '../../types/achievements';
import { CATEGORY_LABELS, ACHIEVEMENT_TIERS } from '../../constants/achievements';
import { FILTER_ACTIVE_GOLD, FILTER_IDLE } from '../../constants/cardTheme';

export type StatusFilter = 'all' | 'unlocked' | 'locked';

type AchievementFiltersProps = {
  category: AchievementCategory | 'all';
  tier: AchievementTier | 'all';
  status: StatusFilter;
  onCategoryChange: (c: AchievementCategory | 'all') => void;
  onTierChange: (t: AchievementTier | 'all') => void;
  onStatusChange: (s: StatusFilter) => void;
};

const CATEGORIES: (AchievementCategory | 'all')[] = [
  'all', 'start', 'weight', 'measurements', 'calories', 'steps',
  'alcohol', 'training', 'journal', 'life', 'combo', 'boss', 'recovery', 'xp',
];

const CATEGORY_LABELS_EXT: Record<AchievementCategory | 'all', string> = {
  all: 'Все',
  ...CATEGORY_LABELS,
};

const TIERS: (AchievementTier | 'all')[] = ['all', 'bronze', 'silver', 'gold', 'epic', 'legendary'];

const FILTER_ACTIVE_DARK =
  'rounded-full px-3 py-1.5 text-xs font-medium bg-[var(--app-bg-soft)] text-[var(--app-text)]';

export function AchievementFilters({
  category,
  tier,
  status,
  onCategoryChange,
  onTierChange,
  onStatusChange,
}: AchievementFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(['all', 'unlocked', 'locked'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatusChange(s)}
            className={
              status === s
                ? 'rounded-full bg-[var(--app-primary)] px-3 py-1.5 text-xs font-medium text-slate-950'
                : FILTER_IDLE
            }
          >
            {s === 'all' ? 'Все' : s === 'unlocked' ? 'Полученные' : 'Не полученные'}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategoryChange(c)}
            className={`shrink-0 ${category === c ? FILTER_ACTIVE_GOLD : FILTER_IDLE}`}
          >
            {CATEGORY_LABELS_EXT[c]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {TIERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTierChange(t)}
            className={tier === t ? FILTER_ACTIVE_DARK : FILTER_IDLE}
          >
            {t === 'all' ? 'Все ранги' : ACHIEVEMENT_TIERS[t].label}
          </button>
        ))}
      </div>
    </div>
  );
}
