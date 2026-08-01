import type { AppSettings, DailyEntry } from '../types';
import { getDayMode } from './stepsEngine';
import { getDailyResource } from './resourceEngine';
import { isNutritionLogged } from './nutritionEngine';
import { isDayEmpty } from './questEngine';
import {
  getMovementCredit,
  hasMarkedPhysicalActivity,
  isHeavyPhysicalActivity,
} from './movementCreditEngine';
import { getCozyRewardSummaryLine } from './cozyHomeRewardsEngine';

export type TodaySaveReaction = {
  headline: string;
  detail: string;
  baseLine?: string;
  /** Cozy Home: короткая тёплая реакция на начисленные ресурсы */
  cozyLine?: string;
};

export function getTodaySaveReaction(params: {
  entry: DailyEntry;
  settings: AppSettings;
  questDone: number;
  questTotal: number;
  points: number;
}): TodaySaveReaction {
  const { entry, settings, questDone, questTotal, points } = params;
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);
  const movement = getMovementCredit(entry, settings);

  const cozyLine = getCozyRewardSummaryLine(entry.cozyRewardsGranted ?? null) ?? undefined;

  if (mode === 'minimal') {
    return {
      headline: 'Маршрут удержан.',
      detail:
        'Минимальный день — валидный ход. День не обязан быть идеальным, он должен быть сохранён.',
      cozyLine,
    };
  }

  if (mode === 'recovery') {
    return {
      headline: 'Ядро стабилизируется.',
      detail: 'День восстановления сохранён. Персонаж продолжает путь — можно идти мягко.',
      cozyLine,
    };
  }

  if (isHeavyPhysicalActivity(entry) && movement.holdsMinimumMovement) {
    return {
      headline: 'Тело сегодня работало.',
      detail:
        'Маршрут движения удержан через физическую активность. Движение засчитано — теперь защити ресурс.',
      cozyLine,
    };
  }

  if (hasMarkedPhysicalActivity(entry) && movement.holdsMinimumMovement) {
    return {
      headline: 'Движение удержано.',
      detail: 'Шагов было мало, но тело сегодня работало. День не пустой.',
      cozyLine,
    };
  }

  if ((entry.steps ?? 0) > 0) {
    return {
      headline: 'Движение зафиксировано.',
      detail: 'Шаги отмечены — путь продолжается. Завтра можно вернуться снова.',
      cozyLine,
    };
  }

  if (resource.level === 'low' || (entry.energyLevel != null && entry.energyLevel <= 2)) {
    return {
      headline: 'Ресурс просел — маршрут жив.',
      detail: 'Туман усталости ослаб, когда день отмечен. Первый шаг сохранён.',
      cozyLine,
    };
  }

  if (isNutritionLogged({ entry, settings })) {
    return {
      headline: 'Контроль дня отмечен.',
      detail: 'Маршрут удержан. Питание в фокусе — персонаж сделал шаг вперёд.',
      cozyLine,
    };
  }

  if (questDone > 0 && questTotal > 0) {
    return {
      headline: 'Персонаж сделал шаг вперёд.',
      detail: `Маршрут удержан: ${questDone} из ${questTotal} квестов. Ядро стабильно.`,
      cozyLine,
    };
  }

  if (!isDayEmpty(entry, settings) && points > 0) {
    return {
      headline: 'Маршрут удержан.',
      detail: 'День сохранён — прогресс засчитан. Можно возвращаться завтра без давления.',
      cozyLine,
    };
  }

  if (isDayEmpty(entry, settings)) {
    return {
      headline: 'День сохранён.',
      detail:
        'Маршрут ждёт отметок — но уже зафиксирован. Можно вернуться и дополнить позже.',
      cozyLine,
    };
  }

  return {
    headline: 'Маршрут удержан.',
    detail: 'День сохранён. Не обязан быть идеальным — достаточно, что путь продолжается.',
    cozyLine,
  };
}
