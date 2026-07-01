import { useMemo } from 'react';
import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import {
  bossPinAnchorForConfig,
  getJourneyMapStageConfig,
  pinAnchorForConfig,
} from '../../../constants/journeyMapConfig';
import { JourneyMapBackground } from './JourneyMapBackground';
import { JourneyPathSvg } from './JourneyPathSvg';
import { JourneyStagePin } from './JourneyStagePin';
import { JourneyBossMini } from './JourneyBossMini';
import { JourneyChapterDetailPanel } from './JourneyChapterDetailPanel';

type JourneyMapDesktopProps = {
  stages: JourneyStageProgress[];
  themeId: AppThemeId;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
  selectedProgress?: JourneyStageProgress;
};

export function JourneyMapDesktop({
  stages,
  themeId,
  selectedStageId,
  onSelectStage,
  selectedProgress,
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
    <div className="journey-map-desktop-layout" data-testid="journey-map-desktop">
      <div className="journey-map-scene">
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
                const anchor = pinAnchorForConfig(config);
                return (
                  <JourneyStagePin
                    key={progress.stage.id}
                    progress={progress}
                    isSelected={selectedStageId === progress.stage.id}
                    onSelect={
                      onSelectStage ? () => onSelectStage(progress.stage.id) : undefined
                    }
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

      {selectedProgress ? (
        <JourneyChapterDetailPanel
          progress={selectedProgress}
          themeId={themeId}
          isCurrentChapter={selectedProgress.status === 'current'}
        />
      ) : null}
    </div>
  );
}
