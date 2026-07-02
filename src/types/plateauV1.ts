export type PlateauState = {
  manualActive?: boolean;
  manualStartedAt?: string;
  dismissedHintAt?: string;
  lastAcknowledgedAt?: string;
  completedPlateauIds?: string[];
};

export type PlateauModeLevel = 'none' | 'soft_hint' | 'active';

export type PlateauRouteHoldingSnapshot = {
  windowDays: number;
  routeHeldDays: number;
  nutritionDays: number;
  movementDays: number;
  resourceDays: number;
  minimalOrRecoveryDays: number;
  alcoholFreeDays: number;
  journalDays: number;
  bodyAbilitiesUnlockedDuringPlateau: number;
  seasonQuestsCompleted: number;
  supportiveMessage: string;
  signalLines: string[];
};

export type PlateauSnapshot = {
  mode: PlateauModeLevel;
  daysSinceBestWeight: number;
  lastBestWeightDate: string | null;
  hasWeightData: boolean;
  manualActive: boolean;
  hintDismissed: boolean;
  title: string;
  description: string;
  supportiveLine: string;
  routeHolding: PlateauRouteHoldingSnapshot;
  routeGuardianEligible: boolean;
};
