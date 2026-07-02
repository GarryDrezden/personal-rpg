import {
  getAssetById,
  getAssetPlaceholder,
  getManifestAssetUrl,
} from '../../game/assetManifest';
import { getManifestAssetObjectPosition } from '../../game/manifestAssetUi';
import { GameAssetImage } from './GameAssetImage';

export type ManifestArtLayout = 'onboarding' | 'hero' | 'thumbnail' | 'reward-icon' | 'reward-banner';

type ManifestArtSceneProps = {
  assetId: string;
  alt: string;
  layout?: ManifestArtLayout;
  /** @deprecated use layout */
  compact?: boolean;
  className?: string;
  testId?: string;
  imageLoading?: 'eager' | 'lazy';
  dimmed?: boolean;
  objectPosition?: string;
};

function resolveLayout(layout: ManifestArtLayout | undefined, compact?: boolean): ManifestArtLayout {
  if (layout) return layout;
  return compact ? 'thumbnail' : 'hero';
}

function frameClass(layout: ManifestArtLayout): string {
  switch (layout) {
    case 'onboarding':
      return 'aspect-[16/9] w-full max-h-[9rem] sm:max-h-[10rem]';
    case 'hero':
      return 'aspect-[16/9] w-full max-h-[11rem] sm:max-h-[12.5rem]';
    case 'thumbnail':
      return 'h-16 w-24 shrink-0';
    case 'reward-icon':
      return 'mx-auto h-14 w-14 shrink-0 rounded-lg';
    case 'reward-banner':
      return 'w-full h-[5.25rem] sm:h-[7.5rem] md:h-[10rem]';
    default:
      return 'aspect-[16/9] w-full max-h-[11rem]';
  }
}

export function ManifestArtScene({
  assetId,
  alt,
  layout,
  compact = false,
  className = '',
  testId,
  imageLoading = 'lazy',
  dimmed = false,
  objectPosition,
}: ManifestArtSceneProps) {
  const entry = getAssetById(assetId);
  const src = getManifestAssetUrl(assetId);
  const placeholder = getAssetPlaceholder(entry?.category ?? 'onboardingArt');
  const resolvedLayout = resolveLayout(layout, compact);
  const crop = objectPosition ?? getManifestAssetObjectPosition(assetId);
  const imageFitClass =
    resolvedLayout === 'reward-icon' ? 'object-cover object-center scale-110' : 'object-cover';

  if (!src) {
    if (resolvedLayout === 'reward-icon') {
      return (
        <div
          data-testid={testId}
          className={`flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] ${className}`}
        >
          <span className="text-2xl opacity-80" aria-hidden>
            {placeholder}
          </span>
          <span className="sr-only">{alt}</span>
        </div>
      );
    }

    return (
      <div
        data-testid={testId}
        className={`flex items-center justify-center rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] ${frameClass(resolvedLayout)} ${className}`}
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
      className={`relative overflow-hidden rounded-xl border border-[var(--app-border)] shadow-[0_4px_20px_rgba(0,0,0,0.28)] ${frameClass(resolvedLayout)} ${dimmed ? 'opacity-70' : ''} ${className}`}
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
        className={`absolute inset-0 ${dimmed ? 'grayscale-[0.35]' : ''}`}
        imageClassName={`h-full w-full ${imageFitClass}`}
        imageStyle={{ objectPosition: crop }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/12"
        aria-hidden
      />
      {dimmed ? (
        <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden />
      ) : null}
    </div>
  );
}
