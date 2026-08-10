import { getCozyHomeHeroPath } from '../../game/cozyHomeArt';
import { GameAssetImage } from '../game/GameAssetImage';

/** Soft stand-in or raster hero for the village home scene. */
export function CozyHomeScenePlaceholder({
  className = '',
}: {
  className?: string;
}) {
  const src = getCozyHomeHeroPath();

  return (
    <div
      className={`cozy-home-scene ${className}`}
      role="img"
      aria-label="Дом героя — тёплый деревенский дом у сада"
      data-testid="cozy-home-scene-art"
    >
      <GameAssetImage
        src={src}
        alt="Тёплый деревенский дом у сада"
        variant="artifact"
        status="unlocked"
        className="absolute inset-0"
        imageClassName="h-full w-full object-cover object-[center_58%]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,#2a2418_28%,transparent)] via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
