import { useMemo } from 'react';
import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import {
  bossAnchorForConfig,
  cardAnchorForConfig,
  getJourneyMapStageConfig,
  JOURNEY_MAP_BG_DESKTOP,
} from '../../../constants/journeyMapConfig';
import { computeJourneyPathProgress } from './journeyMapProgress';
import { JourneyPathSvg } from './JourneyPathSvg';
import { JourneyStageCard } from './JourneyStageCard';
import { JourneyBossMini } from './JourneyBossMini';

type JourneyMapDesktopProps = {
  stages: JourneyStageProgress[];
  themeId: AppThemeId;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
};

export function JourneyMapDesktop({
  stages,
  themeId,
  selectedStageId,
  onSelectStage,
}: JourneyMapDesktopProps) {
  const sorted = useMemo(
    () => [...stages].sort((a, b) => a.stage.order - b.stage.order),
    [stages],
  );

  const configs = useMemo(
    () => sorted.map((s, i) => getJourneyMapStageConfig(s.stage.id, i)),
    [sorted],
  );

  const pathProgress = useMemo(() => computeJourneyPathProgress(sorted), [sorted]);
  const fogStartPercent = Math.min(98, Math.max(18, pathProgress * 100 + 8));

  return (
    <div className="journey-map-v2__desktop-scene" data-testid="journey-map-desktop">
      <div className="journey-map-v2__scene-bg" aria-hidden>
        <img
          src={JOURNEY_MAP_BG_DESKTOP}
          alt=""
          className="journey-map-v2__scene-bg-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="journey-map-v2__atmosphere" aria-hidden />
      <div className="journey-map-v2__grid" aria-hidden />
      <div className="journey-map-v2__vignette" aria-hidden />

      <div className="journey-map-v2__plot">
        <div className="journey-map-v2__coord-layer">
          <JourneyPathSvg
            stages={sorted}
            configs={configs}
            selectedStageId={selectedStageId}
            fogStartPercent={fogStartPercent}
          />

          <div className="journey-map-v2__overlay">
            {sorted.map((progress, index) => {
              const config = configs[index]!;
              const anchor = cardAnchorForConfig(config);
              return (
                <JourneyStageCard
                  key={progress.stage.id}
                  progress={progress}
                  themeId={themeId}
                  isSelected={selectedStageId === progress.stage.id}
                  onSelect={onSelectStage ? () => onSelectStage(progress.stage.id) : undefined}
                  variant="desktop"
                  style={{
                    left: `${anchor.left}%`,
                    top: `${anchor.top}%`,
                    transform: anchor.transform,
                    zIndex:
                      progress.status === 'current'
                        ? 30
                        : selectedStageId === progress.stage.id
                          ? 25
                          : 20,
                  }}
                />
              );
            })}

            {sorted.map((progress, index) => {
              const config = configs[index]!;
              const bossAnchor = bossAnchorForConfig(config);
              if (!bossAnchor || !config.bossId) return null;
              return (
                <div
                  key={`boss-${progress.stage.id}`}
                  className="journey-map-v2__boss-anchor"
                  style={{
                    left: `${bossAnchor.left}%`,
                    top: `${bossAnchor.top}%`,
                    transform: bossAnchor.transform,
                    zIndex: progress.status === 'current' ? 28 : 18,
                  }}
                >
                  <JourneyBossMini
                    bossId={config.bossId}
                    status={progress.status}
                    isSelected={selectedStageId === progress.stage.id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
