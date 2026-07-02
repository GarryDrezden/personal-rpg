import {
  getAssetById,
  getAssetPlaceholder,
  getManifestAssetUrl,
} from '../../game/assetManifest';
import { GameAssetImage } from './GameAssetImage';

type ManifestArtSceneProps = {
  assetId: string;
  alt: string;
  compact?: boolean;
  className?: string;
  testId?: string;
  imageLoading?: 'eager' | 'lazy';
};

export function ManifestArtScene({
  assetId,
  alt,
  compact = false,
  className = '',
  testId,
  imageLoading = 'lazy',
}: ManifestArtSceneProps) {
  const entry = getAssetById(assetId);
  const src = getManifestAssetUrl(assetId);
  const placeholder = getAssetPlaceholder(entry?.category ?? 'onboardingArt');

  if (!src) {
    return (
      <div
        data-testid={testId}
        className={`flex items-center justify-center rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] ${
          compact ? 'aspect-[2.35/1] max-h-24' : 'aspect-[16/9] min-h-[7rem]'
        } ${className}`}
      >
        <span className="text-3xl opacity-80" aria-hidden>
          {placeholder}
        </span>
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <div
      data-testid={testId}
      className={`relative overflow-hidden rounded-xl border border-[var(--app-border)] shadow-[0_4px_20px_rgba(0,0,0,0.28)] ${
        compact ? 'aspect-[2.35/1] max-h-28' : 'aspect-[16/9] min-h-[7.25rem]'
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#12101c] via-[#0e0c16] to-[#08070f]"
        aria-hidden
      />
      <GameAssetImage
        src={src}
        alt={alt}
        variant="artifact"
        loading={imageLoading}
        className="absolute inset-0"
        imageClassName="h-full w-full object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15"
        aria-hidden
      />
    </div>
  );
}
