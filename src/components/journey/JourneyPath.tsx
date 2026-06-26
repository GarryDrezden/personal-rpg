import type { AppThemeId } from '../../types/theme';
import type { JourneyStageProgress } from '../../types/journeyMap';
import { JourneyStageNode } from './JourneyStageNode';

type JourneyPathProps = {
  stages: JourneyStageProgress[];
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
  themeId?: AppThemeId;
};

export function JourneyPath({
  stages,
  selectedStageId,
  onSelectStage,
  themeId = 'cozy',
}: JourneyPathProps) {
  const sorted = [...stages].sort((a, b) => a.stage.order - b.stage.order);

  return (
    <>
      {/* Mobile: vertical path */}
      <div className="relative space-y-3 md:hidden">
        {sorted.map((progress, index) => (
          <div key={progress.stage.id} className="relative">
            {index < sorted.length - 1 ? (
              <div
                className="absolute left-[1.35rem] top-full z-0 h-3 w-0.5 bg-[var(--app-border)]"
                aria-hidden
              />
            ) : null}
            <JourneyStageNode
              progress={progress}
              selected={selectedStageId === progress.stage.id}
              onClick={onSelectStage ? () => onSelectStage(progress.stage.id) : undefined}
              themeId={themeId}
            />
          </div>
        ))}
      </div>

      {/* Desktop: grid path */}
      <div className="hidden gap-3 md:grid md:grid-cols-3">
        {sorted.map((progress) => (
          <JourneyStageNode
            key={progress.stage.id}
            progress={progress}
            selected={selectedStageId === progress.stage.id}
            onClick={onSelectStage ? () => onSelectStage(progress.stage.id) : undefined}
            themeId={themeId}
          />
        ))}
      </div>
    </>
  );
}
