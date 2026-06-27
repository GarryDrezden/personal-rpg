import type { MeasurementEntry } from '../types';
import { getStartWeight } from '../game/heroProgressEngine';

export type PathSetupState =
  | { kind: 'ready' }
  | {
      kind: 'no_weight';
      title: string;
      description: string;
      ctaLabel: string;
      ctaRoute: string;
    }
  | {
      kind: 'no_target';
      title: string;
      description: string;
      ctaLabel: string;
      ctaRoute: string;
    };

export function getPathSetupState(
  measurements: MeasurementEntry[],
  targetWeight: number | null | undefined,
): PathSetupState {
  const startWeight = getStartWeight(measurements);

  if (startWeight === null) {
    return {
      kind: 'no_weight',
      title: 'Путь ещё не начался',
      description:
        'Внеси первый вес — откроется глава 1, вехи трансформации и прогресс героя.',
      ctaLabel: 'Добавить вес',
      ctaRoute: '/measurements',
    };
  }

  if (targetWeight === null || targetWeight === undefined) {
    return {
      kind: 'no_target',
      title: 'Задай цель веса',
      description:
        'Без цели система не покажет путь трансформации. Укажи целевой вес в настройках персонажа.',
      ctaLabel: 'Указать цель',
      ctaRoute: '/settings#settings-weight',
    };
  }

  return { kind: 'ready' };
}
