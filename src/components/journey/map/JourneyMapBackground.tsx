import { JOURNEY_MAP_BG_DESKTOP, JOURNEY_MAP_BG_MOBILE } from '../../../constants/journeyMapConfig';

type JourneyMapBackgroundProps = {
  variant: 'desktop' | 'mobile';
};

/** Layer 1: decorative fantasy map background only (no route, no UI). */
export function JourneyMapBackground({ variant }: JourneyMapBackgroundProps) {
  const imageUrl = variant === 'desktop' ? JOURNEY_MAP_BG_DESKTOP : JOURNEY_MAP_BG_MOBILE;

  return (
    <div
      className={`journey-map-v2__bg-layer journey-map-v2__bg-layer--${variant}`}
      aria-hidden
      style={{
        backgroundImage: `url("${imageUrl}")`,
      }}
    />
  );
}
