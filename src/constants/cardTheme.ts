/** Единый стиль карточек — как на Dashboard, читается в обеих темах */

export const CARD_ACCENT = {
  default: 'bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]',
  primary: 'bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))]',
  success: 'bg-[color-mix(in_srgb,var(--app-success)_8%,var(--app-card))]',
  secondary: 'bg-[color-mix(in_srgb,var(--app-secondary)_18%,var(--app-card))]',
  danger: 'bg-[color-mix(in_srgb,var(--app-danger)_8%,var(--app-card))]',
  warning: 'bg-[color-mix(in_srgb,var(--app-warning)_8%,var(--app-card))]',
} as const;

export const SURFACE_INSET =
  'rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)]';

export const GOAL_BANNER =
  'rounded-xl border border-[color-mix(in_srgb,var(--app-primary)_35%,var(--app-border))] bg-[var(--app-primary-soft)] px-3 py-2 text-sm text-[var(--app-text)]';

export const GOAL_BANNER_SUCCESS =
  'rounded-xl border border-[color-mix(in_srgb,var(--app-success)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-success)_12%,var(--app-card-strong))] px-3 py-2 text-sm font-medium text-[var(--app-success)]';

export const BTN_SECONDARY =
  'rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:brightness-[1.04]';

export const FILTER_IDLE =
  'rounded-lg px-3 py-1.5 text-sm bg-[var(--app-card-strong)] text-[var(--app-text-muted)] hover:brightness-[1.04]';

export const FILTER_ACTIVE_GOLD =
  'rounded-lg px-3 py-1.5 text-sm bg-[var(--app-primary-soft)] text-[var(--app-primary)] font-medium';
