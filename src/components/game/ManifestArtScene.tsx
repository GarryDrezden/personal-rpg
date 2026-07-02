import {
  getAssetById,
  getAssetPlaceholder,
  getManifestAssetUrl,
} from '../../game/assetManifest';
import { getManifestAssetObjectPosition } from '../../game/manifestAssetUi';
import { GameAssetImage } from './GameAssetImage';

export type ManifestArtLayout =
  | 'onboarding'
  | 'hero'
  | 'thumbnail'
  | 'reward-icon'
  | 'reward-banner'
  | 'empty-state'
  | 'empty-state-tall'
  | 'artifact-icon'
  | 'boss-compact'
  | 'boss-codex'
  | 'boss-codex-compact'
  | 'body-ability-medallion';

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
      return 'aspect-[16/9] w-full max-h-[22rem] sm:max-h-[25rem]';
    case 'thumbnail':
      return 'h-16 w-24 shrink-0';
    case 'reward-icon':
      return 'mx-auto h-14 w-14 shrink-0 rounded-lg';
    case 'reward-banner':
      return 'w-full h-[5.25rem] sm:h-[7.5rem] md:h-[10rem]';
    case 'empty-state':
      return 'w-full h-[7rem] sm:h-[8rem]';
    case 'empty-state-tall':
      return 'w-full h-[21rem] sm:h-[24rem]';
    case 'artifact-icon':
      return 'h-12 w-12 shrink-0 rounded-lg';
    case 'boss-compact':
      return 'h-14 w-[5.25rem] shrink-0';
    case 'boss-codex':
      return 'aspect-video w-full max-h-[13.75rem] sm:max-h-[16.25rem]';
    case 'boss-codex-compact':
      return 'aspect-video w-full max-h-[11rem]';
    case 'body-ability-medallion':
      return 'h-32 w-32 shrink-0 sm:h-40 sm:w-40 rounded-full';
    default:
      return 'aspect-[16/9] w-full max-h-[22rem] sm:max-h-[25rem]';
  }
}

function frameRadiusClass(layout: ManifestArtLayout): string {
  return layout === 'body-ability-medallion' ? 'rounded-full' : 'rounded-xl';
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
    resolvedLayout === 'reward-icon' ||
    resolvedLayout === 'artifact-icon' ||
    resolvedLayout === 'body-ability-medallion'
      ? 'object-cover object-center scale-110'
      : 'object-cover';

  if (!src) {
    if (resolvedLayout === 'reward-icon' || resolvedLayout === 'artifact-icon') {
      return (
        <div
          data-testid={testId}
          className={`flex ${
            resolvedLayout === 'artifact-icon' ? 'h-12 w-12' : 'h-14 w-14'
          } items-center justify-center rounded-lg border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] ${className}`}
        >
          <span className={`${resolvedLayout === 'artifact-icon' ? 'text-xl' : 'text-2xl'} opacity-80`} aria-hidden>
            {placeholder}
          </span>
          <span className="sr-only">{alt}</span>
        </div>
      );
    }

    return (
      <div
        data-testid={testId}
        className={`flex items-center justify-center border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] ${frameRadiusClass(resolvedLayout)} ${frameClass(resolvedLayout)} ${className}`}
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
      className={`relative overflow-hidden border border-[var(--app-border)] shadow-[0_4px_20px_rgba(0,0,0,0.28)] ${frameRadiusClass(resolvedLayout)} ${frameClass(resolvedLayout)} ${dimmed ? 'opacity-70' : ''} ${className}`}
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
