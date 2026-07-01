import type { JourneyStageStatus } from '../../../types/journeyMap';

type JourneyMapNodeProps = {
  cx: number;
  cy: number;
  status: JourneyStageStatus;
  isSelected: boolean;
  stageOrder: number;
};

export function JourneyMapNode({ cx, cy, status, isSelected, stageOrder }: JourneyMapNodeProps) {
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  const baseR = isCurrent ? 20 : isCompleted ? 11 : 10;
  const outerR = isCurrent ? 30 : isSelected ? 16 : 0;

  return (
    <g className={isLocked ? 'journey-map-node--locked' : ''}>
      {isCurrent ? (
        <>
          <circle cx={cx} cy={cy} r={28} fill="none" stroke="rgba(250, 204, 21, 0.35)" strokeWidth={1.5}>
            <animate attributeName="r" values="24;30;24" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle
            cx={cx}
            cy={cy}
            r={outerR}
            fill="none"
            stroke="rgba(250, 204, 21, 0.55)"
            strokeWidth={2}
          />
        </>
      ) : null}

      {isCompleted ? (
        <circle
          cx={cx}
          cy={cy}
          r={baseR + 4}
          fill="rgba(212, 175, 55, 0.15)"
          className="journey-map-node__completed-halo"
        />
      ) : null}

      <circle
        cx={cx}
        cy={cy}
        r={baseR}
        className={`journey-map-node__core ${
          isCompleted
            ? 'journey-map-node__core--completed'
            : isCurrent
              ? 'journey-map-node__core--current'
              : 'journey-map-node__core--locked'
        }`}
      />

      {isCurrent ? (
        <circle cx={cx} cy={cy} r={6} fill="#fffbeb" opacity={0.9} />
      ) : isCompleted ? (
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="#0f172a"
          fontSize={11}
          fontWeight={700}
        >
          ✓
        </text>
      ) : (
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fill="rgba(148, 163, 184, 0.7)"
          fontSize={9}
          fontWeight={600}
        >
          {stageOrder}
        </text>
      )}
    </g>
  );
}
