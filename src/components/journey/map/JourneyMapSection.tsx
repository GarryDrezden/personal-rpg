import { useMemo } from 'react';
import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { JourneyMapDesktop } from './JourneyMapDesktop';
import { JourneyMapMobile } from './JourneyMapMobile';
import { JourneyChapterDetailPanel } from './JourneyChapterDetailPanel';

type JourneyMapSectionProps = {
  stages: JourneyStageProgress[];
  themeId: AppThemeId;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
};

export function JourneyMapSection({
  stages,
  themeId,
  selectedStageId,
  onSelectStage,
}: JourneyMapSectionProps) {
  const selectedProgress = useMemo(() => {
    if (!selectedStageId) return stages.find((s) => s.status === 'current') ?? stages[0];
    return stages.find((s) => s.stage.id === selectedStageId) ?? stages[0];
  }, [stages, selectedStageId]);

  return (
    <section className="journey-map-v2" data-testid="journey-development-map">
      <div className="journey-map-v2__frame" aria-hidden />

      <header className="journey-map-v2__header">
        <p className="journey-map-v2__eyebrow">Хроника пути</p>
        <h3 className="journey-map-v2__title">Карта развития</h3>
        <p className="journey-map-v2__subtitle">
          От пробуждения ядра до большого перерождения
        </p>
      </header>

      <div className="journey-map-v2__body">
        <div className="journey-map-v2__desktop-only">
          <JourneyMapDesktop
            stages={stages}
            themeId={themeId}
            selectedStageId={selectedStageId}
            onSelectStage={onSelectStage}
            selectedProgress={selectedProgress}
          />
        </div>

        <div className="journey-map-v2__mobile-only">
          <JourneyMapMobile
            stages={stages}
            themeId={themeId}
            selectedStageId={selectedStageId}
            onSelectStage={onSelectStage}
          />
          {selectedProgress ? (
            <div className="journey-map-v2__mobile-detail">
              <JourneyChapterDetailPanel
                progress={selectedProgress}
                themeId={themeId}
                isCurrentChapter={selectedProgress.status === 'current'}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
