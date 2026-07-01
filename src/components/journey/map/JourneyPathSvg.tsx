import { useEffect, useRef, useState } from 'react';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import {
  buildJourneyMapPath,
  getJourneyMapStageConfig,
  JOURNEY_MAP_VIEWBOX,
  nodeToSvg,
  type JourneyMapStageConfig,
} from '../../../constants/journeyMapConfig';
import { computeJourneyPathProgress } from './journeyMapProgress';
import { JourneyMapPath } from './JourneyMapPath';
import { JourneyMapNode } from './JourneyMapNode';

type JourneyPathSvgProps = {
  stages: JourneyStageProgress[];
  configs: JourneyMapStageConfig[];
  selectedStageId?: string;
};

/** Layer 2: SVG route, nodes, and path progress only. */
export function JourneyPathSvg({ stages, configs, selectedStageId }: JourneyPathSvgProps) {
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
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="jmap-fog-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0)" />
          <stop offset="55%" stopColor="rgba(15, 23, 42, 0.35)" />
          <stop offset="100%" stopColor="rgba(8, 12, 20, 0.55)" />
        </linearGradient>
      </defs>

      <rect
        x={(pathProgress * JOURNEY_MAP_VIEWBOX.w * 0.92) | 0}
        y={0}
        width={JOURNEY_MAP_VIEWBOX.w}
        height={JOURNEY_MAP_VIEWBOX.h}
        fill="url(#jmap-fog-gradient)"
        pointerEvents="none"
      />

      <JourneyMapPath pathD={pathD} pathLength={pathLength} progressOffset={progressOffset} />

      <path ref={measurePathRef} d={pathD} fill="none" stroke="none" visibility="hidden" />

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
