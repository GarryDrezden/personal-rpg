import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { JourneyMapDesktop } from './JourneyMapDesktop';
import { JourneyMapMobile } from './JourneyMapMobile';

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
          />
        </div>

        <div className="journey-map-v2__mobile-only">
          <JourneyMapMobile
            stages={stages}
            themeId={themeId}
            selectedStageId={selectedStageId}
            onSelectStage={onSelectStage}
          />
        </div>
      </div>
    </section>
  );
}
