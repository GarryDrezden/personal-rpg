import type { AchievementCategory } from '../../types/achievements';
import { CATEGORY_LABELS } from '../../constants/achievements';

export const TROPHY_PANEL =
  'relative overflow-hidden rounded-2xl border border-[var(--app-gold)]/20 bg-gradient-to-br from-[#18120a]/40 via-[#14101f]/95 to-[#08070f]';

export const TROPHY_SECTION =
  'relative overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/92 to-[#08070f]/95';

export const TROPHY_CARD =
  'relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/92 to-[#08070f]/95 transition-shadow';

export const TROPHY_CARD_EARNED =
  'border-[var(--app-gold)]/35 shadow-[0_0_24px_rgba(212,165,55,0.08)]';

export const TROPHY_CARD_CLOSE =
  'border-violet-400/30 shadow-[0_0_20px_rgba(139,92,246,0.07)]';

export const TROPHY_CARD_LOCKED =
  'border-violet-500/12 opacity-90';

export const TROPHY_CARD_COMPACT = 'p-3';

export const TROPHY_FILTER_IDLE =
  'rounded-full border border-violet-500/15 bg-[#0e0c14]/60 px-3 py-1.5 text-xs font-medium text-[var(--app-text-muted)]/75 transition hover:border-violet-400/25 hover:text-[var(--app-text-muted)]';

export const TROPHY_FILTER_ACTIVE =
  'rounded-full border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/30 px-3 py-1.5 text-xs font-semibold text-[var(--app-text)]';

export const TROPHY_FILTER_ACTIVE_MUTED =
  'rounded-full border border-violet-400/25 bg-violet-950/35 px-3 py-1.5 text-xs font-semibold text-violet-100/85';

export const HERO_TITLE = 'Коллекция героя';

export const HERO_SUPPORTING =
  'Достижения отмечают важные следы маршрута: старт, возвраты, движение, ясность и восстановление.';

/** UI-only labels — data category `boss` shown as «Испытания». */
export const DISPLAY_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  ...CATEGORY_LABELS,
  boss: 'Испытания',
};

export const COLLECTION_CATEGORIES: AchievementCategory[] = [
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

export const CLOSE_UNLOCK_MIN_PERCENT = 1;
