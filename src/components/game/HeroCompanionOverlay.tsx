import type { CompanionId } from '../../types/gameAssets';
import { getCompanionImageCandidates } from '../../game/assetPaths';
import { getCompanionMeta } from '../../game/assetRegistry';
import { GameAssetImage } from './GameAssetImage';

/**
 * Compact size — sits beside the hero's feet, not over the legs.
 * Dog slightly larger; raven smallest.
 */
const FEET_SIZE: Record<CompanionId, string> = {
  golden_chinchilla_cat: 'w-[4.75rem] sm:w-[5.25rem]',
  alabai: 'w-[5.75rem] sm:w-[6.5rem]',
  raven: 'w-[3.75rem] sm:w-[4.25rem]',
  fox_cub: 'w-[4.5rem] sm:w-[5rem]',
};

type HeroCompanionOverlayProps = {
  companionId: CompanionId;
  /** left / right of the hero silhouette */
  side?: 'left' | 'right';
  className?: string;
  showLabel?: boolean;
};

/**
 * Transparent companion cutout at the hero's feet, offset outside the body.
 * Parent must be `relative` and sized to the hero portrait.
 */
export function HeroCompanionOverlay({
  companionId,
  side = 'left',
  className = '',
  showLabel = false,
}: HeroCompanionOverlayProps) {
  const meta = getCompanionMeta(companionId);
  // Push fully outside the legs; slight bottom inset so paws sit on the same ground plane
  const sideClass =
    side === 'left'
      ? 'left-0 -translate-x-[105%] sm:-translate-x-[110%]'
      : 'right-0 translate-x-[105%] sm:translate-x-[110%]';

  return (
    <div
      data-testid="hero-companion-overlay"
      className={`pointer-events-none absolute bottom-[1%] z-20 flex flex-col items-center ${sideClass} ${FEET_SIZE[companionId]} ${className}`}
    >
      <GameAssetImage
        variant="companion"
        src={meta.image}
        alt={meta.title}
        fallbackCandidates={getCompanionImageCandidates(companionId).slice(1)}
        status="unlocked"
        fit="companion"
        className="h-auto w-full bg-transparent"
        imageClassName="object-contain object-bottom drop-shadow-[0_8px_12px_rgba(0,0,0,0.65)]"
      />
      {showLabel ? (
        <p className="mt-0.5 max-w-[7rem] truncate text-center text-[10px] font-semibold leading-tight text-amber-200/90">
          {meta.title}
        </p>
      ) : null}
    </div>
  );
}
