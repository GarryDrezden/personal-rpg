import { useMemo } from 'react';
import type { AppThemeId } from '../../../../types/theme';
import type { JourneyStageProgress } from '../../../../types/journeyMap';
import { JourneyChapterRoadItem } from './JourneyChapterRoadItem';
import { JourneyChapterDetailPanel } from '../JourneyChapterDetailPanel';

type JourneyMapV3RouteProps = {
  stages: JourneyStageProgress[];
  themeId: AppThemeId;
  selectedStageId?: string;
  onSelectStage: (stageId: string) => void;
  isMobile: boolean;
};

function RouteNode({
  order,
  status,
  isSelected,
}: {
  order: number;
  status: JourneyStageProgress['status'];
  isSelected: boolean;
}) {
  return (
    <div
      className={`journey-v3-node journey-v3-node--${status} ${
        isSelected ? 'journey-v3-node--selected' : ''
      }`}
      aria-hidden
    >
      {status === 'completed' ? (
        <span className="journey-v3-node__check">✓</span>
      ) : (
        <span className="journey-v3-node__num">{order}</span>
      )}
    </div>
  );
}

export function JourneyMapV3Route({
  stages,
  themeId,
  selectedStageId,
  onSelectStage,
  isMobile,
}: JourneyMapV3RouteProps) {
  const sorted = useMemo(
    () => [...stages].sort((a, b) => a.stage.order - b.stage.order),
    [stages],
  );

  const completedCount = sorted.filter((s) => s.status === 'completed').length;
  const currentIndex = sorted.findIndex((s) => s.status === 'current');
  const railFillPct =
    sorted.length <= 1
      ? 100
      : Math.min(
          100,
          ((currentIndex >= 0 ? currentIndex + 0.55 : completedCount) / (sorted.length - 1)) * 100,
        );

  return (
    <div className="journey-v3-route" data-testid="journey-v3-route">
      <div className="journey-v3-route__rail" aria-hidden>
        <div className="journey-v3-route__rail-track" />
        <div className="journey-v3-route__rail-fill" style={{ height: `${railFillPct}%` }} />
      </div>

      <ol className="journey-v3-route__list">
        {sorted.map((progress) => {
          const isSelected = selectedStageId === progress.stage.id;
          const detailPanel = (
            <JourneyChapterDetailPanel
              progress={progress}
              themeId={themeId}
              isCurrentChapter={progress.status === 'current'}
            />
          );

          return (
            <div key={progress.stage.id} className="journey-v3-route__row">
              <div className="journey-v3-route__node-col">
                <RouteNode
                  order={progress.stage.order}
                  status={progress.status}
                  isSelected={isSelected}
                />
              </div>
              <JourneyChapterRoadItem
                progress={progress}
                themeId={themeId}
                isSelected={isSelected}
                onSelect={() => onSelectStage(progress.stage.id)}
                showMobileDetail={isMobile && isSelected}
                mobileDetail={isMobile && isSelected ? detailPanel : undefined}
              />
            </div>
          );
        })}
      </ol>
    </div>
  );
}
