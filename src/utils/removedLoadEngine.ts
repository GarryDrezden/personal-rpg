import type { MeasurementEntry } from '../types';
import type { RemovedLoadResult, RemovedLoadVisual } from '../types/removedLoad';
import { sortMeasurementsByDate } from './measurements';
import { getWeightLossKg } from './bodyAbilityEngine';

export const REMOVED_LOAD_VISUALS: RemovedLoadVisual[] = [
  {
    id: 'stone',
    kg: 1,
    title: 'Первый камень из рюкзака',
    description: 'Небольшой, но заметный сброс — первый сигнал, что груз можно уменьшать.',
    icon: '🪨',
  },
  {
    id: 'canister',
    kg: 5,
    title: 'Большая канистра воды',
    description: 'Примерно столько веса уже не нужно нести каждый шаг.',
    icon: '🧴',
  },
  {
    id: 'backpack',
    kg: 10,
    title: 'Тяжёлый походный рюкзак',
    description: 'Серьёзный груз снят с плеч персонажа.',
    icon: '🎒',
  },
  {
    id: 'two_canisters',
    kg: 20,
    title: 'Две большие канистры',
    description: 'Два крупных блока лишней нагрузки больше не участвуют в каждом движении.',
    icon: '🛢️',
  },
  {
    id: 'heavy_load',
    kg: 30,
    title: 'Серьёзный груз',
    description: 'Груз, который больше не нужно нести каждый день.',
    icon: '⛓️',
  },
  {
    id: 'huge_load',
    kg: 50,
    title: 'Огромный груз',
    description: 'Огромный груз, снятый с персонажа — новая глава движения.',
    icon: '🔥',
  },
];

function getNearestVisual(removedKg: number): RemovedLoadVisual | null {
  if (removedKg <= 0) return null;
  const achieved = REMOVED_LOAD_VISUALS.filter((v) => removedKg >= v.kg);
  if (achieved.length > 0) return achieved[achieved.length - 1]!;
  return REMOVED_LOAD_VISUALS[0] ?? null;
}

export function calculateRemovedLoad(measurements: MeasurementEntry[]): RemovedLoadResult {
  const withWeight = sortMeasurementsByDate(measurements).filter(
    (m) => m.weight !== null && m.weight > 0,
  );

  const removedKg = Math.round(getWeightLossKg(measurements) * 10) / 10;
  const nearestVisual = getNearestVisual(removedKg);

  if (withWeight.length === 0 || removedKg <= 0) {
    return {
      removedKg: 0,
      title: 'Груз пока на месте',
      description:
        'Груз пока не уменьшился по данным весов. Но путь может расти через учёт, шаги и ясность.',
      visuals: REMOVED_LOAD_VISUALS,
      nearestVisual: null,
    };
  }

  return {
    removedKg,
    title: 'Снятый груз',
    description: 'Столько веса уже не нужно нести каждый шаг.',
    visuals: REMOVED_LOAD_VISUALS,
    nearestVisual,
  };
}

export function hasRemovedLoadData(measurements: MeasurementEntry[]): boolean {
  return measurements.some((m) => m.weight !== null && m.weight > 0);
}
