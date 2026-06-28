import { useEffect, useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import type { AssetUnlockStatus } from '../../types/gameAssets';
import { warnMissingGameAsset } from '../../game/assetPaths';
import {
  GameAssetPlaceholder,
  type GameAssetVariant,
} from './GameAssetPlaceholder';

type GameAssetImageProps = {
  src?: string | null;
  alt: string;
  variant?: GameAssetVariant;
  status?: AssetUnlockStatus;
  fallbackCandidates?: string[];
  className?: string;
  imageClassName?: string;
  fit?: 'default' | 'hero' | 'companion' | 'mob' | 'boss';
};

const FIT_CLASS: Record<NonNullable<GameAssetImageProps['fit']>, string> = {
  default: 'h-full w-full max-h-full max-w-full object-contain',
  hero: 'h-full w-full max-h-full max-w-full object-contain object-bottom',
  companion: 'h-full w-full max-h-full max-w-full object-contain object-center',
  mob: 'h-full w-full max-h-full max-w-full object-contain object-center',
  boss: 'h-full w-full max-h-full max-w-full object-contain object-center',
};

const VARIANT_SCALE: Partial<Record<GameAssetVariant, string>> = {
  mob: 'scale-[1.15]',
  boss: 'scale-[1.2]',
};

function resolveFit(
  fit: GameAssetImageProps['fit'],
  variant: GameAssetVariant,
): NonNullable<GameAssetImageProps['fit']> {
  if (fit && fit !== 'default') return fit;
  if (variant === 'hero') return 'hero';
  if (variant === 'companion') return 'companion';
  if (variant === 'mob') return 'mob';
  if (variant === 'boss') return 'boss';
  return 'default';
}

export function GameAssetImage({
  src,
  alt,
  variant = 'hero',
  status = 'unlocked',
  fallbackCandidates = [],
  className = '',
  imageClassName = '',
  fit = 'default',
}: GameAssetImageProps) {
  const candidates = useMemo(
    () => [src, ...fallbackCandidates].filter((value): value is string => Boolean(value)),
    [src, fallbackCandidates],
  );

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setExhausted(false);
  }, [candidates.join('|')]);

  const locked = status === 'locked';
  const current = status === 'current';
  const activeSrc = candidates[candidateIndex];
  const resolvedFit = resolveFit(fit, variant);
  const showHighlight = current && resolvedFit === 'default';
  const fitClass = FIT_CLASS[resolvedFit];
  const variantScale = VARIANT_SCALE[variant] ?? '';
  const alignClass = resolvedFit === 'hero' ? 'items-end' : 'items-center';
  const overflowClass = resolvedFit === 'hero' ? 'overflow-visible' : 'overflow-hidden';

  if (candidates.length === 0 || exhausted) {
    return (
      <div
        className={`relative bg-transparent ${className} ${locked ? 'opacity-55' : ''} ${
          showHighlight ? 'ring-2 ring-[var(--app-primary)] ring-inset' : ''
        }`}
      >
        <GameAssetPlaceholder variant={variant} status={status} label={alt} className="h-full w-full" />
        {locked && (
          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
            <Lock size={18} className="text-[var(--app-text-muted)]" />
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full ${alignClass} justify-center ${overflowClass} bg-transparent ${className} ${
        locked ? 'opacity-55 grayscale' : ''
      } ${showHighlight ? 'ring-2 ring-[var(--app-primary)] ring-inset' : ''}`}
    >
      <img
        src={activeSrc}
        alt={alt}
        draggable={false}
        onError={() => {
          warnMissingGameAsset(activeSrc);
          if (candidateIndex < candidates.length - 1) {
            setCandidateIndex((value) => value + 1);
            return;
          }
          setExhausted(true);
        }}
        className={`select-none pointer-events-none bg-transparent ${fitClass} ${variantScale} ${imageClassName} ${
          locked ? 'blur-[1px]' : ''
        }`}
      />
      {locked && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Lock size={18} className="text-[var(--app-text-muted)]" />
        </span>
      )}
    </div>
  );
}
