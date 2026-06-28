import type { JourneyStageStatus } from '../../../types/journeyMap';

type JourneyMapConnectorProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  status: JourneyStageStatus;
};

export function JourneyMapConnector({ x1, y1, x2, y2, status }: JourneyMapConnectorProps) {
  const stroke =
    status === 'current'
      ? 'rgba(250, 204, 21, 0.75)'
      : status === 'completed'
        ? 'rgba(212, 175, 55, 0.45)'
        : 'rgba(100, 116, 139, 0.35)';

  const dash = status === 'locked' ? '4 4' : undefined;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={status === 'current' ? 1.5 : 1}
      strokeDasharray={dash}
      opacity={status === 'locked' ? 0.65 : 1}
    />
  );
}
