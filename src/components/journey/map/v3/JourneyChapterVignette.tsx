import { getChapterBiomeVisual } from '../../../../constants/journeyChapterVisuals';
import type { JourneyTerrainType } from '../../../../constants/journeyMapConfig';

type JourneyChapterVignetteProps = {
  terrainType: JourneyTerrainType;
  chapterNumber: number;
  status: 'completed' | 'current' | 'locked';
};

export function JourneyChapterVignette({
  terrainType,
  chapterNumber,
  status,
}: JourneyChapterVignetteProps) {
  const biome = getChapterBiomeVisual(terrainType, chapterNumber);

  return (
    <div
      className={`journey-v3-vignette journey-v3-vignette--${status}`}
      aria-hidden
      style={{
        backgroundImage: `${biome.vignetteOverlay}, ${biome.gradient}`,
      }}
    >
      <div
        className="journey-v3-vignette__art"
        style={{
          backgroundImage: `url("${biome.assetPath}")`,
        }}
      />
      <span className="journey-v3-vignette__tag" style={{ color: biome.accent }}>
        {biome.loreTag}
      </span>
    </div>
  );
}
