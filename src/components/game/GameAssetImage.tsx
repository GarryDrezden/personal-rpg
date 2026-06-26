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
};

export function GameAssetImage({
  src,
  alt,
  variant = 'hero',
  status = 'unlocked',
  fallbackCandidates = [],
  className = '',
  imageClassName = '',
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

  if (candidates.length === 0 || exhausted) {
    return (
      <div
        className={`relative ${className} ${locked ? 'opacity-55' : ''} ${
          current ? 'ring-2 ring-[var(--app-primary)] ring-offset-2 ring-offset-[var(--app-card)]' : ''
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
      className={`relative flex items-center justify-center overflow-hidden ${className} ${
        locked ? 'opacity-55 grayscale' : ''
      } ${current ? 'ring-2 ring-[var(--app-primary)] ring-offset-2 ring-offset-[var(--app-card)]' : ''}`}
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
        className={`h-full w-full select-none object-contain pointer-events-none ${imageClassName} ${
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
