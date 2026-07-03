import type { AchievementCategory } from '../../types/achievements';
import {
  COLLECTION_CATEGORIES,
  DISPLAY_CATEGORY_LABELS,
  TROPHY_SECTION,
} from './achievementsUi';
import { ProgressBar } from '../ui/ProgressBar';

type CategoryStat = {
  category: AchievementCategory;
  unlocked: number;
  total: number;
};

type AchievementCategoryGridProps = {
  stats: CategoryStat[];
  activeCategory: AchievementCategory | 'all';
  onSelect: (category: AchievementCategory) => void;
};

export function AchievementCategoryGrid({
  stats,
  activeCategory,
  onSelect,
}: AchievementCategoryGridProps) {
  const statMap = new Map(stats.map((s) => [s.category, s]));

  return (
    <section className={`${TROPHY_SECTION} px-4 py-4 sm:px-5 sm:py-5`}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,rgba(88,28,135,0.08),transparent_50%)]"
        aria-hidden
      />
      <div className="relative">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-200/55">
          Разделы коллекции
        </h2>
        <p className="mt-1 text-xs text-[var(--app-text-muted)]/55">
          Выберите раздел — ниже откроется соответствующая часть трофеев.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {COLLECTION_CATEGORIES.map((category) => {
            const stat = statMap.get(category);
            if (!stat) return null;
            const percent =
              stat.total > 0 ? Math.round((stat.unlocked / stat.total) * 100) : 0;
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelect(category)}
                className={`rounded-xl border px-3 py-2.5 text-left transition ${
                  isActive
                    ? 'border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/20'
                    : 'border-violet-500/12 bg-[#0e0c14]/50 hover:border-violet-400/25'
                }`}
              >
                <div className="text-sm font-semibold text-[var(--app-text)]">
                  {DISPLAY_CATEGORY_LABELS[category]}
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--app-text-muted)]/65">
                  {stat.unlocked} / {stat.total}
                </div>
                <ProgressBar value={percent} color="gold" className="mt-2 h-1" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
