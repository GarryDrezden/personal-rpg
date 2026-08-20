import type { AppThemeId } from '../types/theme';

export type ContentTheme = AppThemeId | 'all';

export type ContentTag =
  | 'good_day'
  | 'recovery'
  | 'minimal'
  | 'physical_activity'
  | 'steps'
  | 'nutrition'
  | 'alcohol'
  | 'return'
  | 'first_day'
  | 'veteran'
  | 'low_energy'
  | 'home'
  | 'ability'
  | 'season'
  | 'mixed'
  | 'imperfect';

export type ContentVariant = {
  id: string;
  text: string;
  theme: ContentTheme;
  tags?: ContentTag[];
};

export type PairedContentVariant = {
  id: string;
  headline: string;
  detail: string;
  theme: ContentTheme;
  tags?: ContentTag[];
};
