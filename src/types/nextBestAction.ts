export type NextBestActionPriority =
  | 'momentum_recovery'
  | 'momentum_base'
  | 'momentum_steps'
  | 'recovery'
  | 'base'
  | 'steps'
  | 'calories'
  | 'clarity'
  | 'journey'
  | 'ability'
  | 'gym';

export type NextBestAction = {
  id: string;
  priority: NextBestActionPriority;
  title: string;
  description: string;
  actionLabel: string;
  targetRoute?: string;
  icon: string;
};
