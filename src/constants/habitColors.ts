import type { HabitCardColorId } from '../types/habits';
import { CARD_ACCENT } from './cardTheme';

export const HABIT_COLOR_OPTIONS: { id: HabitCardColorId; label: string }[] = [
  { id: 'default', label: 'Нейтральный' },
  { id: 'primary', label: 'Золотой' },
  { id: 'success', label: 'Зелёный' },
  { id: 'secondary', label: 'Фиолетовый' },
  { id: 'warning', label: 'Оранжевый' },
  { id: 'danger', label: 'Розовый' },
  { id: 'violet', label: 'Лиловый' },
  { id: 'teal', label: 'Бирюзовый' },
];

const COLOR_CLASS: Record<HabitCardColorId, string> = {
  default: CARD_ACCENT.default,
  primary: CARD_ACCENT.primary,
  success: CARD_ACCENT.success,
  secondary: CARD_ACCENT.secondary,
  warning: CARD_ACCENT.warning,
  danger: CARD_ACCENT.danger,
  violet: 'bg-[color-mix(in_srgb,#8b5cf6_12%,var(--app-card))]',
  teal: 'bg-[color-mix(in_srgb,#14b8a6_12%,var(--app-card))]',
};

const COLOR_SWATCH: Record<HabitCardColorId, string> = {
  default: 'bg-[var(--app-secondary)]',
  primary: 'bg-[var(--app-primary)]',
  success: 'bg-[var(--app-success)]',
  secondary: 'bg-[var(--app-secondary)]',
  warning: 'bg-[var(--app-warning)]',
  danger: 'bg-[var(--app-danger)]',
  violet: 'bg-violet-500',
  teal: 'bg-teal-500',
};

export function getHabitCardColorClass(colorId?: HabitCardColorId): string {
  if (!colorId) return '';
  return COLOR_CLASS[colorId] ?? COLOR_CLASS.default;
}

export function getHabitColorSwatchClass(colorId: HabitCardColorId): string {
  return COLOR_SWATCH[colorId] ?? COLOR_SWATCH.default;
}
