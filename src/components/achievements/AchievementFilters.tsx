import type { AchievementCategory, AchievementTier } from '../../types/achievements';
import { CATEGORY_LABELS, ACHIEVEMENT_TIERS } from '../../constants/achievements';

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
  'alcohol', 'training', 'journal', 'life', 'combo', 'xp',
];

const CATEGORY_LABELS_EXT: Record<AchievementCategory | 'all', string> = {
  all: 'Все',
  ...CATEGORY_LABELS,
};

const TIERS: (AchievementTier | 'all')[] = ['all', 'bronze', 'silver', 'gold', 'epic', 'legendary'];

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
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              status === s ? 'bg-gold text-white' : 'bg-stone-100 text-stone-600'
            }`}
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
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              category === c ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'
            }`}
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
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              tier === t ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'
            }`}
          >
            {t === 'all' ? 'Все ранги' : ACHIEVEMENT_TIERS[t].label}
          </button>
        ))}
      </div>
    </div>
  );
}
