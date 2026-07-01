import { useEffect, useRef, useState } from 'react';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import {
  buildJourneyMapPath,
  cardAnchorForConfig,
  getJourneyMapStageConfig,
  JOURNEY_MAP_VIEWBOX,
  nodeToSvg,
  percentToSvg,
  type JourneyMapStageConfig,
} from '../../../constants/journeyMapConfig';
import { computeJourneyPathProgress } from './journeyMapProgress';
import { JourneyMapPath } from './JourneyMapPath';
import { JourneyMapNode } from './JourneyMapNode';
import { JourneyMapConnector } from './JourneyMapConnector';
import { JourneyMapTerrain } from './JourneyMapTerrain';

type JourneyPathSvgProps = {
  stages: JourneyStageProgress[];
  configs: JourneyMapStageConfig[];
  selectedStageId?: string;
  fogStartPercent: number;
};

export function JourneyPathSvg({
  stages,
  configs,
  selectedStageId,
  fogStartPercent,
}: JourneyPathSvgProps) {
  const measurePathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const sorted = [...stages].sort((a, b) => a.stage.order - b.stage.order);
  const svgNodePoints = configs.map((c) => nodeToSvg(c));
  const pathD = buildJourneyMapPath(svgNodePoints);
  const pathProgress = computeJourneyPathProgress(sorted);
  const progressOffset = pathLength * (1 - pathProgress);

  useEffect(() => {
    if (!measurePathRef.current) return;
    setPathLength(measurePathRef.current.getTotalLength());
  }, [pathD]);

  return (
    <svg
      viewBox={`0 0 ${JOURNEY_MAP_VIEWBOX.w} ${JOURNEY_MAP_VIEWBOX.h}`}
      className="journey-map-v2__svg"
      role="img"
      aria-label="Маршрут по главам пути"
      preserveAspectRatio="none"
    >
      <JourneyMapTerrain configs={configs} fogStartPercent={fogStartPercent} />

      <JourneyMapPath pathD={pathD} pathLength={pathLength} progressOffset={progressOffset} />

      <path ref={measurePathRef} d={pathD} fill="none" stroke="none" visibility="hidden" />

      {sorted.map((progress, index) => {
        const config = configs[index] ?? getJourneyMapStageConfig(progress.stage.id, index);
        const node = nodeToSvg(config);
        const cardAnchor = cardAnchorForConfig(config);
        const card = percentToSvg(cardAnchor.left, cardAnchor.top);
        return (
          <JourneyMapConnector
            key={`conn-${progress.stage.id}`}
            x1={node.x}
            y1={node.y}
            x2={card.x}
            y2={card.y}
            status={progress.status}
          />
        );
      })}

      {sorted.map((progress, index) => {
        const config = configs[index] ?? getJourneyMapStageConfig(progress.stage.id, index);
        const node = nodeToSvg(config);
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
  );
}
