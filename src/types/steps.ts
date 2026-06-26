export type StepsStatus =
  | 'none'
  | 'low'
  | 'minimum'
  | 'normal'
  | 'excellent';

export type StepsStatusInfo = {
  status: StepsStatus;
  title: string;
  description: string;
  points: number;
  percentToNormal: number;
  nextTargetLabel?: string;
  stepsToNextTarget?: number;
};
