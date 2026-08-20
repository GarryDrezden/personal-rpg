import type { AppSettings, DailyEntry } from '../types';
import type { MobId } from '../types/gameAssets';
import type { AppThemeId } from '../types/theme';
import { MOB_IDS } from '../types/gameAssets';
import { isNutritionTrackingEnabled } from '../utils/nutritionEngine';
import type { ContentVariant } from './types';
import { selectForDate } from './selectVariant';

/** Food / evening-temptation obstacles. Hidden when nutrition tracking is off. */
export const FOOD_MOB_IDS: readonly MobId[] = [
  'snack_chaos',
  'sweet_whisper',
  'night_call',
];

/** Evening kitchen / night temptation — also hidden when alcohol tracking is off. */
export const ALCOHOL_FLAVOR_MOB_IDS: readonly MobId[] = ['night_call'];

function v(id: string, theme: AppThemeId, text: string): ContentVariant {
  return { id, theme, text };
}

const COZY: Record<MobId, ContentVariant[]> = {
  sofa_magnet: [
    v('cozy_sofa_1', 'cozy', 'Сонный плед тянет остаться. Короткое движение уже ослабляет его.'),
    v('cozy_sofa_2', 'cozy', 'Угол дивана сегодня громче крыльца. Любой выход из комнаты считает ход.'),
    v('cozy_sofa_3', 'cozy', 'Плед не враг — просто инерция. Даже обход двора его сдвигает.'),
    v('cozy_sofa_4', 'cozy', 'День застыл у окна. Шаг к двери уже считается.'),
  ],
  snack_chaos: [
    v('cozy_snack_1', 'cozy', 'Кладовая шепчет быстрые решения. Запись на столе возвращает выбор.'),
    v('cozy_snack_2', 'cozy', 'Кухня сегодня шумнее обычного. Спокойная отметка питания гасит хаос.'),
    v('cozy_snack_3', 'cozy', 'Банки и пакеты спорят с тарелкой. Достаточно заметить, что съедено.'),
    v('cozy_snack_4', 'cozy', 'Вечерняя полка зовёт без спроса. Журнал еды держит порядок.'),
  ],
  fog_of_fatigue: [
    v('cozy_fog_1', 'cozy', 'Туман над двором после нагрузки или короткого сна. Сегодня важнее пауза, чем рывок.'),
    v('cozy_fog_2', 'cozy', 'Двор в дымке. Сон, еда и тишина рассеивают его лучше, чем ещё одна задача.'),
    v('cozy_fog_3', 'cozy', 'Тяжёлое утро лежит на крыльце. Восстановление — честный ход.'),
    v('cozy_fog_4', 'cozy', 'Сонливость не приговор. Дом просит тепла, не подвига.'),
  ],
  empty_day: [
    v('cozy_empty_1', 'cozy', 'Тихая комната ждёт один след. Минимальная отметка уже зажигает свет.'),
    v('cozy_empty_2', 'cozy', 'День ещё без следа. Одна запись возвращает тепло.'),
    v('cozy_empty_3', 'cozy', 'Календарь дома пуст. Даже короткий день может оставить дату.'),
    v('cozy_empty_4', 'cozy', 'Пока тихо. Это не оценка — просто ещё нет отметок.'),
  ],
  impulse_of_rollback: [
    v('cozy_imp_1', 'cozy', 'Скользкая ступенька старых привычек. Один спокойный возврат держит лестницу.'),
    v('cozy_imp_2', 'cozy', '«Потом» сегодня звучит громче. Маленькое сейчас слабее откладывает день.'),
    v('cozy_imp_3', 'cozy', 'Старый сценарий тянет вниз. Простое действие на кухне или во дворе развязывает узел.'),
    v('cozy_imp_4', 'cozy', 'Инерция «с понедельника» стучится в дверь. Сегодняшняя отметка её не пускает.'),
  ],
  night_call: [
    v('cozy_night_1', 'cozy', 'Свет из кухни зовёт к автоматическим решениям. Мягкое закрытие дня гасит его.'),
    v('cozy_night_2', 'cozy', 'Поздний стол шумит. Спокойный ритуал вечера слабее ночной кладовой.'),
    v('cozy_night_3', 'cozy', 'Вечерний соблазн не враг дома. Ясное закрытие дня держит кухню тише.'),
    v('cozy_night_4', 'cozy', 'Лампа на кухне горит дольше нужного. Можно погасить её записью, а не борьбой.'),
  ],
  gray_heaviness: [
    v('cozy_gray_1', 'cozy', 'Тяжёлое одеяло — знак перегруза. Короткий день тоже ход.'),
    v('cozy_gray_2', 'cozy', 'Шум дня лёг на комнату. Минимальный набор слабее, чем ещё одна задача.'),
    v('cozy_gray_3', 'cozy', 'Тесный день. Дом не просит полный список.'),
    v('cozy_gray_4', 'cozy', 'Расфокус как пыль на столе. Одна ясная отметка уже протирает его.'),
  ],
  sweet_whisper: [
    v('cozy_sweet_1', 'cozy', 'Банка варенья — сладкий голос усталости. Запись порции держит ритм.'),
    v('cozy_sweet_2', 'cozy', 'Сладкое на полке не враг. Спокойная отметка питания возвращает стол.'),
    v('cozy_sweet_3', 'cozy', 'Хаотичная еда шепчет быстрее тарелки. Журнал делает выбор видимым.'),
    v('cozy_sweet_4', 'cozy', 'Вечерняя сладость после тесного дня. Можно заметить её без суда.'),
  ],
};

const DF: Record<MobId, ContentVariant[]> = {
  sofa_magnet: [
    v('df_sofa_1', 'darkFantasy', 'Диванный магнит тянет остаться. Любое движение в квестах его ослабляет.'),
    v('df_sofa_2', 'darkFantasy', 'Лагерь застыл. Короткий выход уже считается ходом.'),
    v('df_sofa_3', 'darkFantasy', 'Инерция держит позицию. Шаг от костра сдвигает её.'),
    v('df_sofa_4', 'darkFantasy', 'Неподвижность — малое трение дня, не приговор маршруту.'),
  ],
  snack_chaos: [
    v('df_snack_1', 'darkFantasy', 'Хаос припасов. Отметка рациона возвращает контроль лагеря.'),
    v('df_snack_2', 'darkFantasy', 'Быстрые запасы спорят с планом. Запись еды держит контур.'),
    v('df_snack_3', 'darkFantasy', 'Кладовая шумит. Спокойный учёт слабее хаоса, чем запрет.'),
    v('df_snack_4', 'darkFantasy', 'Вечерний рацион без рамки. Одна отметка ставит границу.'),
  ],
  fog_of_fatigue: [
    v('df_fog_1', 'darkFantasy', 'Туман после нагрузки или короткого сна. Пауза бьёт его точнее, чем рывок.'),
    v('df_fog_2', 'darkFantasy', 'Сумрак на перевале. Сон и еда рассеивают его.'),
    v('df_fog_3', 'darkFantasy', 'Тяжёлое утро на камне. Восстановление — удержание позиции.'),
    v('df_fog_4', 'darkFantasy', 'Сонливость закрывает след. Сегодня маршрут короче — и это нормально.'),
  ],
  empty_day: [
    v('df_empty_1', 'darkFantasy', 'Пустой день. Одна отметка уже оставляет след на карте.'),
    v('df_empty_2', 'darkFantasy', 'Контур не заполнен. Минимальный ход не даёт дыре вырасти.'),
    v('df_empty_3', 'darkFantasy', 'Дата без сигнала. Даже короткая запись держит кампанию.'),
    v('df_empty_4', 'darkFantasy', 'Тишина на маршруте. Это не оценка — просто нет данных.'),
  ],
  impulse_of_rollback: [
    v('df_imp_1', 'darkFantasy', 'Импульс отката. Один спокойный возврат держит перевал.'),
    v('df_imp_2', 'darkFantasy', '«Потом» тянет назад. Малое сейчас крепит позицию.'),
    v('df_imp_3', 'darkFantasy', 'Старый узел привычек. Простое действие развязывает его лучше клятвы.'),
    v('df_imp_4', 'darkFantasy', 'Отложенный старт. Сегодняшняя отметка не даёт следу исчезнуть.'),
  ],
  night_call: [
    v('df_night_1', 'darkFantasy', 'Ночной зов к автоматическим решениям. Ясное закрытие дня гасит его.'),
    v('df_night_2', 'darkFantasy', 'Поздний костёр шумит. Ритуал вечера слабее ночного пира.'),
    v('df_night_3', 'darkFantasy', 'Сумрак тянет к запасам. Спокойная граница вечера держит лагерь.'),
    v('df_night_4', 'darkFantasy', 'Ночь зовёт без спроса. Можно закрыть её записью, не боем.'),
  ],
  gray_heaviness: [
    v('df_gray_1', 'darkFantasy', 'Серая тягость — знак перегруза. Короткий день тоже ход.'),
    v('df_gray_2', 'darkFantasy', 'Шум дня лёг на броню. Минимальный набор слабее ещё одной задачи.'),
    v('df_gray_3', 'darkFantasy', 'Тесный день на тропе. Маршрут не просит полный список.'),
    v('df_gray_4', 'darkFantasy', 'Расфокус как туман у ворот. Одна ясная отметка уже режет его.'),
  ],
  sweet_whisper: [
    v('df_sweet_1', 'darkFantasy', 'Сладкий шёпот усталости. Запись рациона держит ритм.'),
    v('df_sweet_2', 'darkFantasy', 'Припасы шепчут быстрее плана. Учёт делает выбор видимым.'),
    v('df_sweet_3', 'darkFantasy', 'Вечерний срыв рациона — малое трение, не босс главы.'),
    v('df_sweet_4', 'darkFantasy', 'Сладость после тесного дня. Можно заметить её без суда.'),
  ],
};

export const OBSTACLE_FLAVOR = { cozy: COZY, darkFantasy: DF } as const;

export function getObstacleFlavorPool(themeId: AppThemeId, mobId: MobId): ContentVariant[] {
  const pack = themeId === 'cozy' ? COZY : DF;
  return pack[mobId] ?? pack.empty_day;
}

export function pickObstacleFlavor(params: {
  themeId: AppThemeId;
  mobId: MobId;
  date: string;
}): ContentVariant {
  return selectForDate({
    candidates: getObstacleFlavorPool(params.themeId, params.mobId),
    date: params.date,
    family: `obstacle:${params.mobId}`,
    theme: params.themeId,
  });
}

export function isFoodObstacle(mobId: MobId): boolean {
  return (FOOD_MOB_IDS as readonly string[]).includes(mobId);
}

export function isAlcoholFlavorObstacle(mobId: MobId): boolean {
  return (ALCOHOL_FLAVOR_MOB_IDS as readonly string[]).includes(mobId);
}

export function filterMobsForTracking(
  mobs: readonly MobId[],
  settings: AppSettings,
): MobId[] {
  const nutritionOn = isNutritionTrackingEnabled(settings);
  const alcoholOn = settings.enableAlcoholTracking !== false;
  return mobs.filter((id) => {
    if (!nutritionOn && isFoodObstacle(id)) return false;
    if (!alcoholOn && isAlcoholFlavorObstacle(id)) return false;
    return true;
  });
}

export function shouldBlockSofaMagnet(entry: DailyEntry, settings: AppSettings): boolean {
  const energy = entry.energyLevel ?? 3;
  const steps = entry.steps ?? 0;
  const sleep = entry.sleepQuality;
  const sleepGood = sleep === 'good';
  const paOn = settings.enablePhysicalActivityTracking !== false;
  const paMarked =
    paOn &&
    (entry.physicalActivityLevel === 'medium' ||
      entry.physicalActivityLevel === 'heavy' ||
      Boolean(entry.gym) ||
      Boolean(entry.morningExercise));
  const active = steps >= 4000 || paMarked;
  if (sleepGood && energy >= 4 && active) return true;
  if (energy >= 4 && active) return true;
  return false;
}

export function getEligibleDailyMobs(
  entry: DailyEntry,
  settings: AppSettings,
): MobId[] {
  let pool = filterMobsForTracking(MOB_IDS, settings);
  if (shouldBlockSofaMagnet(entry, settings)) {
    pool = pool.filter((id) => id !== 'sofa_magnet');
  }
  if (pool.length === 0) return ['empty_day'];
  return pool;
}
