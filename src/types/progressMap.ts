export type ProgressPathId =
  | 'weight'
  | 'alcohol'
  | 'steps'
  | 'gym'
  | 'measurements';

export type ProgressMilestone = {
  id: string;
  title: string;
  description: string;
  value: number;
  icon: string;
};

export type ProgressPath = {
  id: ProgressPathId;
  title: string;
  description: string;
  icon: string;
  currentValue: number;
  milestones: ProgressMilestone[];
};

export type MilestoneStatus = 'completed' | 'current' | 'upcoming';

export type NearestMapGoal = {
  pathId: ProgressPathId;
  pathTitle: string;
  pathIcon: string;
  milestoneTitle: string;
  remaining: number;
  label: string;
};

export type MapSummary = {
  completedMilestones: number;
  totalMilestones: number;
  nearestGoal: NearestMapGoal | null;
  strongestPathId: ProgressPathId | null;
  strongestPathTitle: string;
  strongestPathPercent: number;
};
