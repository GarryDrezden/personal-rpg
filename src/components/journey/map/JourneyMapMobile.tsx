import { useMemo } from 'react';
import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { getJourneyMapStageConfig, JOURNEY_MAP_BG_MOBILE } from '../../../constants/journeyMapConfig';
import { JourneyStageCard } from './JourneyStageCard';
import { JourneyBossMini } from './JourneyBossMini';

type JourneyMapMobileProps = {
  stages: JourneyStageProgress[];
  themeId: AppThemeId;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
};

function MobileNode({
  order,
  status,
  isSelected,
}: {
  order: number;
  status: JourneyStageProgress['status'];
  isSelected: boolean;
}) {
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  return (
    <div
      className={`journey-map-v2__mobile-node ${
        isCurrent ? 'journey-map-v2__mobile-node--current' : ''
      } ${isCompleted ? 'journey-map-v2__mobile-node--completed' : ''} ${
        status === 'locked' ? 'journey-map-v2__mobile-node--locked' : ''
      } ${isSelected ? 'journey-map-v2__mobile-node--selected' : ''}`}
    >
      {isCompleted ? (
        <span className="journey-map-v2__mobile-node-check">✓</span>
      ) : (
        <span className="journey-map-v2__mobile-node-num">{order}</span>
      )}
    </div>
  );
}

export function JourneyMapMobile({
  stages,
  themeId,
  selectedStageId,
  onSelectStage,
}: JourneyMapMobileProps) {
  const sorted = useMemo(() => {
    const list = [...stages].sort((a, b) => a.stage.order - b.stage.order);
    return list.sort((a, b) => {
      const cfgA = getJourneyMapStageConfig(a.stage.id);
      const cfgB = getJourneyMapStageConfig(b.stage.id);
      return cfgA.mobile.order - cfgB.mobile.order;
    });
  }, [stages]);

  const completedCount = sorted.filter((s) => s.status === 'completed').length;
  const currentIndex = sorted.findIndex((s) => s.status === 'current');
  const progressLine =
    sorted.length <= 1
      ? 100
      : Math.min(
          100,
          ((currentIndex >= 0 ? currentIndex + 0.5 : completedCount) / (sorted.length - 1)) * 100,
        );

  return (
    <div className="journey-map-v2__mobile" data-testid="journey-map-mobile">
      <div className="journey-map-v2__mobile-bg" aria-hidden>
        <img
          src={JOURNEY_MAP_BG_MOBILE}
          alt=""
          className="journey-map-v2__mobile-bg-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="journey-map-v2__mobile-fog" aria-hidden />

      <div className="journey-map-v2__mobile-route">
        <div
          className="journey-map-v2__mobile-track"
          aria-hidden
          style={{ height: `${(sorted.length - 1) * 100}%` }}
        >
          <div
            className="journey-map-v2__mobile-track-fill"
            style={{ height: `${progressLine}%` }}
          />
        </div>

        <ul className="journey-map-v2__mobile-stages">
          {sorted.map((progress, index) => {
            const config = getJourneyMapStageConfig(progress.stage.id, index);
            const side = config.mobile.side;
            const isSelected = selectedStageId === progress.stage.id;

            return (
              <li
                key={progress.stage.id}
                className={`journey-map-v2__mobile-row journey-map-v2__mobile-row--${side}`}
              >
                <div className="journey-map-v2__mobile-node-col">
                  <MobileNode
                    order={progress.stage.order}
                    status={progress.status}
                    isSelected={isSelected}
                  />
                </div>

                <div className="journey-map-v2__mobile-card-col">
                  <div className="journey-map-v2__mobile-card-wrap">
                    {config.bossId ? (
                      <div className="journey-map-v2__mobile-boss">
                        <JourneyBossMini
                          bossId={config.bossId}
                          status={progress.status}
                          isSelected={isSelected}
                          size="sm"
                        />
                      </div>
                    ) : null}
                    <JourneyStageCard
                      progress={progress}
                      themeId={themeId}
                      isSelected={isSelected}
                      onSelect={
                        onSelectStage ? () => onSelectStage(progress.stage.id) : undefined
                      }
                      variant="mobile"
                    />
                  </div>
                  <span className="journey-map-v2__mobile-terrain" aria-hidden>
                    {config.terrainType}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
