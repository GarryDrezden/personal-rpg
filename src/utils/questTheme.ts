import type { AppThemeId } from '../types/theme';
import type { QuestStatus } from '../types/quests';

type QuestStyle = {
  card: string;
  badge: string;
  bar: 'gold' | 'success' | 'danger';
};

const COZY: Record<QuestStatus, QuestStyle> = {
  done: {
    card: 'border-[color-mix(in_srgb,var(--app-success)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-success)_12%,var(--app-card))]',
    badge: 'bg-[color-mix(in_srgb,var(--app-success)_18%,var(--app-card-strong))] text-[var(--app-success)]',
    bar: 'success',
  },
  failed: {
    card: 'border-[color-mix(in_srgb,var(--app-danger)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-danger)_10%,var(--app-card))]',
    badge: 'bg-[color-mix(in_srgb,var(--app-danger)_16%,var(--app-card-strong))] text-[var(--app-danger)]',
    bar: 'danger',
  },
  pending: {
    card: 'border-[var(--app-border)] bg-[var(--app-bg-soft)]',
    badge: 'bg-[var(--app-card-strong)] text-[var(--app-text-muted)]',
    bar: 'gold',
  },
  neutral: {
    card: 'border-[color-mix(in_srgb,var(--app-secondary)_25%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]',
    badge: 'bg-[color-mix(in_srgb,var(--app-secondary)_14%,var(--app-card-strong))] text-[var(--app-secondary)]',
    bar: 'gold',
  },
  partial: {
    card: 'border-[color-mix(in_srgb,var(--app-warning)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-warning)_10%,var(--app-card))]',
    badge: 'bg-[color-mix(in_srgb,var(--app-warning)_16%,var(--app-card-strong))] text-[var(--app-warning)]',
    bar: 'gold',
  },
};

const DARK: Record<QuestStatus, QuestStyle> = {
  done: {
    card: 'border-[color-mix(in_srgb,var(--app-success)_40%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-success)_14%,var(--app-card))] shadow-[0_0_16px_rgba(52,211,153,0.12)]',
    badge: 'bg-[color-mix(in_srgb,var(--app-success)_20%,var(--app-card-strong))] text-[var(--app-success)]',
    bar: 'success',
  },
  failed: {
    card: 'border-[color-mix(in_srgb,var(--app-danger)_40%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-danger)_12%,var(--app-card))]',
    badge: 'bg-[color-mix(in_srgb,var(--app-danger)_18%,var(--app-card-strong))] text-[var(--app-danger)]',
    bar: 'danger',
  },
  pending: {
    card: 'border-[var(--app-border)] bg-[var(--app-card)]',
    badge: 'bg-[var(--app-card-strong)] text-[var(--app-text-muted)]',
    bar: 'gold',
  },
  neutral: {
    card: 'border-[color-mix(in_srgb,var(--app-secondary)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-secondary)_10%,var(--app-card))]',
    badge: 'bg-[color-mix(in_srgb,var(--app-secondary)_18%,var(--app-card-strong))] text-[var(--app-secondary)]',
    bar: 'gold',
  },
  partial: {
    card: 'border-[color-mix(in_srgb,var(--app-warning)_40%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-warning)_12%,var(--app-card))] shadow-[0_0_14px_rgba(251,146,60,0.1)]',
    badge: 'bg-[color-mix(in_srgb,var(--app-warning)_18%,var(--app-card-strong))] text-[var(--app-warning)]',
    bar: 'gold',
  },
};

export function getQuestStatusStyles(
  status: QuestStatus,
  themeId: AppThemeId,
): QuestStyle {
  const map = themeId === 'darkFantasy' ? DARK : COZY;
  return map[status];
}
