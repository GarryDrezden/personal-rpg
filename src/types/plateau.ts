export type PlateauStatus =
  | 'none'
  | 'possible_plateau'
  | 'plateau_but_system_active'
  | 'plateau_and_system_low';

export type PlateauResult = {
  status: PlateauStatus;
  title: string;
  description: string;
  daysChecked: number;
  weightChangeKg: number;
  positiveSignals: string[];
  suggestions: string[];
};
