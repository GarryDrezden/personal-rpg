import { useEffect, useMemo, useState, type CSSProperties } from 'react';
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
  imageStyle?: CSSProperties;
  fit?: 'default' | 'hero' | 'heroStage' | 'companion' | 'mob' | 'boss';
  loading?: 'eager' | 'lazy';
};

const FIT_CLASS: Record<NonNullable<GameAssetImageProps['fit']>, string> = {
  default: 'h-full w-full max-h-full max-w-full object-contain',
  hero: 'h-full w-full max-h-full max-w-full object-contain object-bottom',
  /**
   * Padded 1536×2048 stage canvases: enlarge past the slot so the body fills
   * height without clipping the head (~100/0.81 ≈ 123%; 118% keeps crown margin).
   */
  heroStage:
    'absolute bottom-0 left-1/2 h-[118%] w-auto max-h-none max-w-none -translate-x-1/2 object-contain object-bottom',
  companion: 'h-full w-full max-h-full max-w-full object-contain object-bottom',
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
  imageStyle,
  fit = 'default',
  loading = 'lazy',
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
  const alignClass =
    resolvedFit === 'hero' || resolvedFit === 'heroStage' ? 'items-end' : 'items-center';
  const overflowClass =
    resolvedFit === 'heroStage' ? 'overflow-hidden' : resolvedFit === 'hero' ? 'overflow-visible' : 'overflow-hidden';
  const positionClass = resolvedFit === 'heroStage' ? 'relative' : '';

  if (candidates.length === 0 || exhausted) {
    return (
      <div
        className={`relative bg-transparent ${className} ${
          showHighlight ? 'ring-2 ring-[var(--app-primary)] ring-inset' : ''
        }`}
      >
        <GameAssetPlaceholder variant={variant} status={status} label={alt} className="h-full w-full" />
        {locked && (
          <span
            className="pointer-events-none absolute left-1/2 top-[42%] z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            aria-hidden
          >
            <Lock size={22} className="text-amber-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]" />
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full ${alignClass} justify-center ${overflowClass} ${positionClass} bg-transparent ${className} ${
        showHighlight ? 'ring-2 ring-[var(--app-primary)] ring-inset' : ''
      }`}
    >
      <img
        src={activeSrc}
        alt={alt}
        loading={loading}
        draggable={false}
        onError={() => {
          warnMissingGameAsset(activeSrc);
          if (candidateIndex < candidates.length - 1) {
            setCandidateIndex((value) => value + 1);
            return;
          }
          setExhausted(true);
        }}
        className={`select-none pointer-events-none bg-transparent ${fitClass} ${variantScale} ${imageClassName}`}
        style={imageStyle}
      />
      {locked && (
        <span
          className="pointer-events-none absolute left-1/2 top-[42%] z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          aria-hidden
        >
          <Lock
            size={resolvedFit === 'hero' ? 28 : 20}
            className="text-amber-200/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          />
        </span>
      )}
    </div>
  );
}
