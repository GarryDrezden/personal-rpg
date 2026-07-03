import type { AchievementCategory, AchievementTier } from '../../types/achievements';
import { ACHIEVEMENT_TIERS } from '../../constants/achievements';
import {
  DISPLAY_CATEGORY_LABELS,
  TROPHY_FILTER_ACTIVE,
  TROPHY_FILTER_ACTIVE_MUTED,
  TROPHY_FILTER_IDLE,
  TROPHY_SECTION,
} from './achievementsUi';

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
  'all',
  'start',
  'weight',
  'measurements',
  'calories',
  'steps',
  'alcohol',
  'training',
  'journal',
  'life',
  'combo',
  'boss',
  'recovery',
  'momentum',
  'xp',
];

const CATEGORY_LABELS_EXT: Record<AchievementCategory | 'all', string> = {
  all: 'Все',
  ...DISPLAY_CATEGORY_LABELS,
};

const TIERS: (AchievementTier | 'all')[] = [
  'all',
  'bronze',
  'silver',
  'gold',
  'epic',
  'legendary',
];

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'Все',
  unlocked: 'Полученные',
  locked: 'В пути',
};

function filterClass(active: boolean, tone: 'gold' | 'muted' = 'gold') {
  if (!active) return TROPHY_FILTER_IDLE;
  return tone === 'gold' ? TROPHY_FILTER_ACTIVE : TROPHY_FILTER_ACTIVE_MUTED;
}

export function AchievementFilters({
  category,
  tier,
  status,
  onCategoryChange,
  onTierChange,
  onStatusChange,
}: AchievementFiltersProps) {
  return (
    <section className={`${TROPHY_SECTION} space-y-3 px-4 py-4 sm:px-5`}>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/45">
          Фильтры коллекции
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['all', 'unlocked', 'locked'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              className={filterClass(status === s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategoryChange(c)}
            className={`shrink-0 ${filterClass(category === c, 'muted')}`}
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
            className={filterClass(tier === t, 'muted')}
          >
            {t === 'all' ? 'Все ранги' : ACHIEVEMENT_TIERS[t].label}
          </button>
        ))}
      </div>
    </section>
  );
}
