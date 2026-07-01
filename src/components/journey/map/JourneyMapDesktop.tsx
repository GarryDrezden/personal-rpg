import { useMemo } from 'react';
import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import {
  bossPinAnchorForConfig,
  getJourneyMapStageConfig,
  markerAnchorForConfig,
} from '../../../constants/journeyMapConfig';
import { JourneyMapBackground } from './JourneyMapBackground';
import { JourneyPathSvg } from './JourneyPathSvg';
import { JourneyStageMarker } from './JourneyStageMarker';
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

  return (
    <div className="journey-map-v2__desktop-scene" data-testid="journey-map-desktop">
      <JourneyMapBackground variant="desktop" />
      <div className="journey-map-v2__atmosphere" aria-hidden />
      <div className="journey-map-v2__vignette" aria-hidden />

      <div className="journey-map-v2__plot">
        <div className="journey-map-v2__coord-layer">
          <JourneyPathSvg
            stages={sorted}
            configs={configs}
            selectedStageId={selectedStageId}
          />

          <div className="journey-map-v2__ui-layer">
            {sorted.map((progress, index) => {
              const config = configs[index]!;
              const anchor = markerAnchorForConfig(config);
              return (
                <JourneyStageMarker
                  key={progress.stage.id}
                  progress={progress}
                  themeId={themeId}
                  isSelected={selectedStageId === progress.stage.id}
                  onSelect={onSelectStage ? () => onSelectStage(progress.stage.id) : undefined}
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
              const bossAnchor = bossPinAnchorForConfig(config);
              if (!bossAnchor || !config.bossId) return null;
              return (
                <div
                  key={`boss-${progress.stage.id}`}
                  className="journey-map-v2__boss-pin"
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
                    size="xs"
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
