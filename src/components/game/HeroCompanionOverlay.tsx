import type { CompanionId } from '../../types/gameAssets';
import { getCompanionImageCandidates } from '../../game/assetPaths';
import { getCompanionMeta } from '../../game/assetRegistry';
import { GameAssetImage } from './GameAssetImage';

/** Relative size at hero feet — dog larger, raven smaller. */
const FEET_SIZE: Record<CompanionId, string> = {
  golden_chinchilla_cat: 'w-[40%] max-w-[5.75rem] sm:max-w-[6.25rem]',
  alabai: 'w-[52%] max-w-[7.25rem] sm:max-w-[8rem]',
  raven: 'w-[34%] max-w-[4.75rem] sm:max-w-[5.25rem]',
  fox_cub: 'w-[38%] max-w-[5.5rem] sm:max-w-[6rem]',
};

type HeroCompanionOverlayProps = {
  companionId: CompanionId;
  /** left = у левой ноги, right = у правой */
  side?: 'left' | 'right';
  className?: string;
  showLabel?: boolean;
};

/**
 * Transparent companion cutout layered at the hero's feet.
 * Parent must be `relative` and size to the hero portrait.
 */
export function HeroCompanionOverlay({
  companionId,
  side = 'left',
  className = '',
  showLabel = false,
}: HeroCompanionOverlayProps) {
  const meta = getCompanionMeta(companionId);
  const sideClass = side === 'left' ? 'left-[-4%] sm:left-[-6%]' : 'right-[-4%] sm:right-[-6%]';

  return (
    <div
      data-testid="hero-companion-overlay"
      className={`pointer-events-none absolute bottom-0 z-20 flex flex-col items-center ${sideClass} ${FEET_SIZE[companionId]} ${className}`}
    >
      <GameAssetImage
        variant="companion"
        src={meta.image}
        alt={meta.title}
        fallbackCandidates={getCompanionImageCandidates(companionId).slice(1)}
        status="unlocked"
        fit="companion"
        className="h-auto w-full bg-transparent"
        imageClassName="object-contain object-bottom drop-shadow-[0_6px_10px_rgba(0,0,0,0.55)]"
      />
      {showLabel ? (
        <p className="mt-0.5 max-w-[7rem] truncate text-center text-[10px] font-semibold leading-tight text-amber-200/90">
          {meta.title}
        </p>
      ) : null}
    </div>
  );
}
