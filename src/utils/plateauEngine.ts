import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { PlateauResult } from '../types/plateau';
import { getPlateauSnapshot } from '../game/plateau/plateauEngine';

export { getPlateauSnapshot } from '../game/plateau/plateauEngine';
export {
  PLATEAU_SOFT_DAYS,
  PLATEAU_STRONG_DAYS,
  dismissPlateauSoftHint,
  setManualPlateauActive,
  getPlateauRouteHoldingSnapshot,
  getDaysSinceBestWeight,
} from '../game/plateau/plateauEngine';

const empty: PlateauResult = {
  status: 'none',
  title: '',
  description: '',
  daysChecked: 0,
  weightChangeKg: 0,
  positiveSignals: [],
  suggestions: [],
};

/** Legacy Freedom/Week card — backed by Plateau Mode v1 snapshot. */
export function detectPlateau(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  days?: number;
}): PlateauResult {
  const snapshot = getPlateauSnapshot(params);

  if (snapshot.mode === 'none') {
    return empty;
  }

  const positiveSignals = snapshot.routeHolding.signalLines;
  const suggestions = [
    snapshot.supportiveLine,
    'На перевале особенно важны не-весовые признаки: способности тела, сезон, ресурс.',
  ];

  if (snapshot.mode === 'active' && snapshot.routeHolding.routeHeldDays >= 3) {
    return {
      status: 'plateau_but_system_active',
      title: snapshot.title,
      description: snapshot.description,
      daysChecked: snapshot.daysSinceBestWeight,
      weightChangeKg: 0,
      positiveSignals,
      suggestions,
    };
  }

  return {
    status: 'possible_plateau',
    title: snapshot.title,
    description: snapshot.description,
    daysChecked: snapshot.daysSinceBestWeight,
    weightChangeKg: 0,
    positiveSignals,
    suggestions: [
      'Можно удержать маршрут минимальным днём.',
      'Отметь перевал вручную, если это про твой путь сейчас.',
      snapshot.supportiveLine,
    ],
  };
}
