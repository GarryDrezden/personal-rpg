import type { CSSProperties } from 'react';
import { GameAssetImage } from './GameAssetImage';

export type CozyArtLayout = 'reward-banner' | 'boss-compact';

type CozyArtSceneProps = {
  src: string;
  alt: string;
  layout?: CozyArtLayout;
  className?: string;
  testId?: string;
  objectPosition?: string;
  dimmed?: boolean;
};

function frameClass(layout: CozyArtLayout): string {
  switch (layout) {
    case 'reward-banner':
      return 'w-full h-[5.25rem] sm:h-[7.5rem] md:h-[10rem]';
    case 'boss-compact':
      return 'h-14 w-[5.25rem] shrink-0';
    default:
      return 'w-full h-[5.25rem] sm:h-[7.5rem] md:h-[10rem]';
  }
}

/**
 * Theme-scoped cozy raster art with the same frame sizes as ManifestArtScene.
 */
export function CozyArtScene({
  src,
  alt,
  layout = 'reward-banner',
  className = '',
  testId,
  objectPosition = 'center',
  dimmed = false,
}: CozyArtSceneProps) {
  const imageStyle: CSSProperties = { objectPosition };
  const cover = layout === 'reward-banner';

  return (
    <div
      data-testid={testId}
      className={`relative overflow-hidden border border-[var(--app-border)] ${
        layout === 'boss-compact' ? 'rounded-xl bg-transparent shadow-none' : 'rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
      } ${frameClass(layout)} ${dimmed ? 'opacity-70' : ''} ${className}`}
    >
      {cover ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--app-bg-soft)_80%,#efe4d2)]"
            aria-hidden
          />
          <GameAssetImage
            src={src}
            alt={alt}
            variant="artifact"
            status="unlocked"
            className="absolute inset-0"
            imageClassName="h-full w-full object-cover"
            imageStyle={imageStyle}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5"
            aria-hidden
          />
        </>
      ) : (
        <GameAssetImage
          src={src}
          alt={alt}
          variant="boss"
          status="unlocked"
          fit="boss"
          className="absolute inset-0"
          imageClassName="h-full w-full object-contain object-center"
        />
      )}
    </div>
  );
}
