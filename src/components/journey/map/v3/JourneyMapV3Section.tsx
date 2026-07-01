import { useMemo, useState, useEffect } from 'react';
import type { AppThemeId } from '../../../../types/theme';
import type { JourneyStageProgress } from '../../../../types/journeyMap';
import { JourneyMapV3Route } from './JourneyMapV3Route';
import { JourneyChapterDetailPanel } from '../JourneyChapterDetailPanel';

type JourneyMapV3SectionProps = {
  stages: JourneyStageProgress[];
  themeId: AppThemeId;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
};

function useMediaMobile(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = () => setMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return mobile;
}

export function JourneyMapV3Section({
  stages,
  themeId,
  selectedStageId,
  onSelectStage,
}: JourneyMapV3SectionProps) {
  const isMobile = useMediaMobile();

  const selectedProgress = useMemo(() => {
    if (!selectedStageId) return stages.find((s) => s.status === 'current') ?? stages[0];
    return stages.find((s) => s.stage.id === selectedStageId) ?? stages[0];
  }, [stages, selectedStageId]);

  const handleSelect = (id: string) => {
    onSelectStage?.(id);
  };

  return (
    <section className="journey-v3" data-testid="journey-map-v3">
      <div className="journey-v3__layout">
        <div className="journey-v3__road-column">
          <header className="journey-v3__section-head">
            <p className="journey-v3__eyebrow">Хроника пути</p>
            <h2 className="journey-v3__section-title">Маршрут из 9 глав</h2>
          </header>

          <JourneyMapV3Route
            stages={stages}
            themeId={themeId}
            selectedStageId={selectedStageId}
            onSelectStage={handleSelect}
            isMobile={isMobile}
          />
        </div>

        {!isMobile && selectedProgress ? (
          <aside className="journey-v3__detail-column">
            <div className="journey-v3__detail-sticky">
              <JourneyChapterDetailPanel
                progress={selectedProgress}
                themeId={themeId}
                isCurrentChapter={selectedProgress.status === 'current'}
              />
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
