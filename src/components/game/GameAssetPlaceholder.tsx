import { Crown, Gem, Lock, PawPrint, Shield, User, Zap } from 'lucide-react';
import type { AssetUnlockStatus } from '../../types/gameAssets';

export type GameAssetVariant = 'hero' | 'companion' | 'mob' | 'boss' | 'artifact';

type GameAssetPlaceholderProps = {
  variant?: GameAssetVariant;
  status?: AssetUnlockStatus;
  label?: string;
  className?: string;
};

const variantMeta: Record<
  GameAssetVariant,
  { icon: typeof User; defaultLabel: string; accent: string }
> = {
  hero: {
    icon: User,
    defaultLabel: 'Герой',
    accent: 'from-violet-500/20 via-[var(--app-primary)]/10 to-transparent',
  },
  companion: {
    icon: PawPrint,
    defaultLabel: 'Спутник',
    accent: 'from-amber-500/15 via-[var(--app-primary)]/10 to-transparent',
  },
  mob: {
    icon: Zap,
    defaultLabel: 'Моб',
    accent: 'from-rose-500/15 via-violet-500/10 to-transparent',
  },
  boss: {
    icon: Crown,
    defaultLabel: 'Босс',
    accent: 'from-violet-600/25 via-indigo-500/10 to-transparent',
  },
  artifact: {
    icon: Gem,
    defaultLabel: 'Артефакт',
    accent: 'from-amber-400/20 via-violet-500/10 to-transparent',
  },
};

export function GameAssetPlaceholder({
  variant = 'hero',
  status = 'unlocked',
  label,
  className = '',
}: GameAssetPlaceholderProps) {
  const meta = variantMeta[variant];
  const Icon = meta.icon;
  const locked = status === 'locked';
  const current = status === 'current';

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-b ${meta.accent} ${
        locked
          ? 'border-[var(--app-border)] opacity-60'
          : current
            ? 'border-[var(--app-primary)] shadow-[0_0_24px_color-mix(in_srgb,var(--app-primary)_25%,transparent)]'
            : 'border-[color-mix(in_srgb,var(--app-primary)_35%,var(--app-border))]'
      } ${className}`}
      aria-hidden
    >
      <div
        className={`flex items-center justify-center rounded-full border ${
          variant === 'boss'
            ? 'h-14 w-14 border-violet-400/40 bg-violet-950/30'
            : variant === 'mob'
              ? 'h-12 w-12 border-rose-400/30 bg-[var(--app-card)]'
              : 'h-12 w-12 border-[color-mix(in_srgb,var(--app-primary)_40%,var(--app-border))] bg-[var(--app-card)]'
        }`}
      >
        {locked ? (
          <Lock className="text-[var(--app-text-muted)]" size={variant === 'boss' ? 22 : 18} />
        ) : variant === 'boss' ? (
          <Shield className="text-violet-300" size={22} />
        ) : (
          <Icon className="text-[var(--app-primary)]" size={variant === 'hero' ? 24 : 20} />
        )}
      </div>
      <p className="mt-2 px-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
        {label ?? meta.defaultLabel}
      </p>
      {!locked && (
        <div className="pointer-events-none absolute inset-x-4 bottom-3 h-2 rounded-full bg-black/10 blur-md" />
      )}
    </div>
  );
}
