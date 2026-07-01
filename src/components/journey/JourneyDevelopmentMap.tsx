import type { AppThemeId } from '../../types/theme';
import type { JourneyStageProgress } from '../../types/journeyMap';
import { JourneyMapSection } from './map/JourneyMapSection';

type JourneyDevelopmentMapProps = {
  stages: JourneyStageProgress[];
  themeId?: AppThemeId;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
};

/** @deprecated Use JourneyMapSection directly */
export function JourneyDevelopmentMap({
  stages,
  themeId = 'darkFantasy',
  selectedStageId,
  onSelectStage,
}: JourneyDevelopmentMapProps) {
  return (
    <JourneyMapSection
      stages={stages}
      themeId={themeId}
      selectedStageId={selectedStageId}
      onSelectStage={onSelectStage}
    />
  );
}
