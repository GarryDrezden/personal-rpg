import type { AppSettings, DailyEntry } from '../types';
import { getDayMode } from './stepsEngine';
import { getDailyResource } from './resourceEngine';
import { isNutritionLogged } from './nutritionEngine';
import { isDayEmpty } from './questEngine';

export type TodaySaveReaction = {
  headline: string;
  detail: string;
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

  if (mode === 'minimal') {
    return {
      headline: 'Маршрут удержан.',
      detail: 'Минимальный день — валидный ход. День не обязан быть идеальным, он должен быть сохранён.',
    };
  }

  if (mode === 'recovery') {
    return {
      headline: 'Ядро стабилизируется.',
      detail: 'День восстановления сохранён. Персонаж продолжает путь — можно идти мягко.',
    };
  }

  if ((entry.steps ?? 0) > 0) {
    return {
      headline: 'Движение зафиксировано.',
      detail: 'Шаги отмечены — путь продолжается. Завтра можно вернуться снова.',
    };
  }

  if (resource.level === 'low' || (entry.energyLevel != null && entry.energyLevel <= 2)) {
    return {
      headline: 'Ресурс просел — маршрут жив.',
      detail: 'Туман усталости ослаб, когда день отмечен. Первый шаг сохранён.',
    };
  }

  if (isNutritionLogged({ entry, settings })) {
    return {
      headline: 'Контроль дня отмечен.',
      detail: 'Маршрут удержан. Питание в фокусе — персонаж сделал шаг вперёд.',
    };
  }

  if (questDone > 0 && questTotal > 0) {
    return {
      headline: 'Персонаж сделал шаг вперёд.',
      detail: `Маршрут удержан: ${questDone} из ${questTotal} квестов. Ядро стабильно.`,
    };
  }

  if (!isDayEmpty(entry, settings) && points > 0) {
    return {
      headline: 'Маршрут удержан.',
      detail: 'День сохранён — прогресс засчитан. Можно возвращаться завтра без давления.',
    };
  }

  if (isDayEmpty(entry, settings)) {
    return {
      headline: 'День сохранён.',
      detail: 'Маршрут ждёт отметок — но уже зафиксирован. Можно вернуться и дополнить позже.',
    };
  }

  return {
    headline: 'Маршрут удержан.',
    detail: 'День сохранён. Не обязан быть идеальным — достаточно, что путь продолжается.',
  };
}
