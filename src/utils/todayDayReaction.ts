import type { AppSettings, DailyEntry } from '../types';
import type { AppThemeId } from '../types/theme';
import type { CozyRewardsGranted } from '../types/cozyHome';
import { getThemedTodayCopy } from '../constants/themeContentRegistry';
import { getDayMode } from './stepsEngine';
import { getDailyResource } from './resourceEngine';
import { isNutritionLogged } from './nutritionEngine';
import { isDayEmpty } from './questEngine';
import {
  getMovementCredit,
  hasMarkedPhysicalActivity,
  isHeavyPhysicalActivity,
} from './movementCreditEngine';
import { sumCozyGrantedResources } from './cozyHomeRewardsEngine';

export type TodaySaveReaction = {
  headline: string;
  detail: string;
  baseLine?: string;
  /**
   * Structured Cozy Home feedback for the save moment.
   * Set only when resources were just granted (not on reload re-display).
   */
  cozyFeedback?: CozyRewardsGranted | null;
};

export function getTodaySaveReaction(params: {
  entry: DailyEntry;
  settings: AppSettings;
  questDone: number;
  questTotal: number;
  points: number;
  themeId?: AppThemeId;
}): TodaySaveReaction {
  const { entry, settings, questDone, questTotal, points } = params;
  const themeId = params.themeId ?? settings.themeId ?? 'cozy';
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);
  const movement = getMovementCredit(entry, settings);

  const pick = (
    context: Parameters<typeof getThemedTodayCopy>[1],
    dark: { headline: string; detail: string },
  ) => getThemedTodayCopy(themeId, context, dark);

  if (mode === 'minimal') {
    return pick('minimal', {
      headline: 'Маршрут удержан.',
      detail:
        'Минимальный день — валидный ход. День не обязан быть идеальным, он должен быть сохранён.',
    });
  }

  if (mode === 'recovery') {
    return pick('recovery', {
      headline: 'Ядро стабилизируется.',
      detail: 'День восстановления сохранён. Персонаж продолжает путь — можно идти мягко.',
    });
  }

  if (isHeavyPhysicalActivity(entry) && movement.holdsMinimumMovement) {
    return pick('heavy_physical', {
      headline: 'Тело сегодня работало.',
      detail:
        'Маршрут движения удержан через физическую активность. Движение засчитано — теперь защити ресурс.',
    });
  }

  if (hasMarkedPhysicalActivity(entry) && movement.holdsMinimumMovement) {
    return pick('physical', {
      headline: 'Движение удержано.',
      detail: 'Шагов было мало, но тело сегодня работало. День не пустой.',
    });
  }

  if ((entry.steps ?? 0) > 0) {
    return pick('steps', {
      headline: 'Движение зафиксировано.',
      detail: 'Шаги отмечены — путь продолжается. Завтра можно вернуться снова.',
    });
  }

  if (resource.level === 'low' || (entry.energyLevel != null && entry.energyLevel <= 2)) {
    return pick('low_resource', {
      headline: 'Ресурс просел — маршрут жив.',
      detail: 'Туман усталости ослаб, когда день отмечен. Первый шаг сохранён.',
    });
  }

  if (isNutritionLogged({ entry, settings })) {
    return pick('nutrition', {
      headline: 'Контроль дня отмечен.',
      detail: 'Маршрут удержан. Питание в фокусе — персонаж сделал шаг вперёд.',
    });
  }

  if (entry.alcohol === 'none') {
    return pick('alcohol_free', {
      headline: 'День без алкоголя удержан.',
      detail: 'Ясность сохранена. Персонаж не отдал вечер старым цепям.',
    });
  }

  if (questDone > 0 && questTotal > 0) {
    const dark = {
      headline: 'Персонаж сделал шаг вперёд.',
      detail: `Маршрут удержан: ${questDone} из ${questTotal} квестов. Ядро стабильно.`,
    };
    if (themeId === 'cozy' && questDone >= Math.ceil(questTotal * 0.6)) {
      return pick('good_day', dark);
    }
    const reaction = pick('quests_progress', dark);
    if (themeId !== 'cozy') return reaction;
    return {
      ...reaction,
      detail: `Задачи дня: ${questDone} из ${questTotal}. Дом получил след заботы.`,
    };
  }

  if (!isDayEmpty(entry, settings) && points > 0) {
    return pick('points_saved', {
      headline: 'Маршрут удержан.',
      detail: 'День сохранён — прогресс засчитан. Можно возвращаться завтра без давления.',
    });
  }

  if (isDayEmpty(entry, settings)) {
    return pick('empty_saved', {
      headline: 'День сохранён.',
      detail:
        'Маршрут ждёт отметок — но уже зафиксирован. Можно вернуться и дополнить позже.',
    });
  }

  return pick('default', {
    headline: 'Маршрут удержан.',
    detail: 'День сохранён. Не обязан быть идеальным — достаточно, что путь продолжается.',
  });
}

export function attachCozySaveFeedback(
  reaction: TodaySaveReaction,
  rewards: CozyRewardsGranted | null | undefined,
  justGranted: boolean,
): TodaySaveReaction {
  if (!justGranted || !rewards) return { ...reaction, cozyFeedback: null };
  if (sumCozyGrantedResources(rewards.resources) <= 0) {
    return { ...reaction, cozyFeedback: null };
  }
  return { ...reaction, cozyFeedback: rewards };
}
