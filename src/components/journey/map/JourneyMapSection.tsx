import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { JourneyMapV3Section } from './v3/JourneyMapV3Section';

type JourneyMapSectionProps = {
  stages: JourneyStageProgress[];
  themeId: AppThemeId;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
};

/** Journey Map v3 — vertical chapter road. */
export function JourneyMapSection({
  stages,
  themeId,
  selectedStageId,
  onSelectStage,
}: JourneyMapSectionProps) {
  return (
    <JourneyMapV3Section
      stages={stages}
      themeId={themeId}
      selectedStageId={selectedStageId}
      onSelectStage={onSelectStage}
    />
  );
}
