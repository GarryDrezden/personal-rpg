import { useEffect, useMemo, useRef, useState } from 'react';
import type { JourneyStageProgress } from '../../types/journeyMap';
import {
  buildJourneyMapPath,
  getJourneyNodeLayout,
  JOURNEY_MAP_VIEWBOX,
  labelToSvg,
  nodeToSvg,
} from '../../constants/journeyMapLayout';
import { computeJourneyPathProgress } from './map/journeyMapProgress';
import { JourneyMapBackground } from './map/JourneyMapBackground';
import { JourneyMapPath } from './map/JourneyMapPath';
import { JourneyMapNode } from './map/JourneyMapNode';
import { JourneyMapConnector } from './map/JourneyMapConnector';
import { JourneyMapLabel } from './map/JourneyMapLabel';

type JourneyDevelopmentMapProps = {
  stages: JourneyStageProgress[];
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
};

export function JourneyDevelopmentMap({
  stages,
  selectedStageId,
  onSelectStage,
}: JourneyDevelopmentMapProps) {
  const measurePathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const sorted = useMemo(
    () => [...stages].sort((a, b) => a.stage.order - b.stage.order),
    [stages],
  );

  const layouts = useMemo(
    () => sorted.map((s, i) => getJourneyNodeLayout(s.stage.id, i)),
    [sorted],
  );

  const svgNodePoints = useMemo(() => layouts.map((l) => nodeToSvg(l)), [layouts]);

  const pathD = useMemo(() => buildJourneyMapPath(svgNodePoints), [svgNodePoints]);
  const pathProgress = useMemo(() => computeJourneyPathProgress(sorted), [sorted]);
  const progressOffset = pathLength * (1 - pathProgress);
  const fogStartPercent = Math.min(98, Math.max(18, pathProgress * 100 + 8));

  useEffect(() => {
    if (!measurePathRef.current) return;
    setPathLength(measurePathRef.current.getTotalLength());
  }, [pathD]);

  return (
    <div className="journey-dev-map" data-testid="journey-development-map">
      <div className="journey-dev-map__frame" aria-hidden />

      <div className="journey-dev-map__header">
        <div className="journey-dev-map__header-copy">
          <p className="journey-dev-map__eyebrow">Хроника пути</p>
          <h3 className="journey-dev-map__title">Карта развития</h3>
          <p className="journey-dev-map__subtitle">
            От пробуждения ядра до большого перерождения
          </p>
        </div>
      </div>

      <div className="journey-dev-map__scroll">
        <div className="journey-dev-map__canvas">
          <div className="journey-dev-map__atmosphere" aria-hidden />
          <div className="journey-dev-map__grid" aria-hidden />
          <div className="journey-dev-map__vignette" aria-hidden />

          <div className="journey-dev-map__plot">
            <svg
              viewBox={`0 0 ${JOURNEY_MAP_VIEWBOX.w} ${JOURNEY_MAP_VIEWBOX.h}`}
              className="journey-dev-map__svg"
              role="img"
              aria-label="Карта развития по главам пути"
              preserveAspectRatio="xMidYMid meet"
            >
              <JourneyMapBackground fogStartPercent={fogStartPercent} />

              <JourneyMapPath
                pathD={pathD}
                pathLength={pathLength}
                progressOffset={progressOffset}
              />

              <path ref={measurePathRef} d={pathD} fill="none" stroke="none" visibility="hidden" />

              {sorted.map((progress, index) => {
                const layout = layouts[index];
                if (!layout) return null;
                const node = nodeToSvg(layout);
                const label = labelToSvg(layout);
                return (
                  <JourneyMapConnector
                    key={`conn-${progress.stage.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={label.x}
                    y2={label.y}
                    status={progress.status}
                  />
                );
              })}

              {sorted.map((progress, index) => {
                const layout = layouts[index];
                if (!layout) return null;
                const node = nodeToSvg(layout);
                return (
                  <JourneyMapNode
                    key={progress.stage.id}
                    cx={node.x}
                    cy={node.y}
                    status={progress.status}
                    isSelected={selectedStageId === progress.stage.id}
                    stageOrder={progress.stage.order}
                  />
                );
              })}
            </svg>

            <div className="journey-dev-map__labels">
              {sorted.map((progress, index) => {
                const layout = layouts[index];
                if (!layout) return null;
                return (
                  <JourneyMapLabel
                    key={`label-${progress.stage.id}`}
                    progress={progress}
                    layout={layout}
                    isSelected={selectedStageId === progress.stage.id}
                    onSelect={
                      onSelectStage ? () => onSelectStage(progress.stage.id) : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
