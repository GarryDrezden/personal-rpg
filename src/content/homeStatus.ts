import type { CozyHomeZoneId } from '../types/cozyHome';
import type { ContentVariant } from './types';
import { selectForDate } from './selectVariant';

export type HomeProgressBand = 'empty' | 'early' | 'mid' | 'late' | 'near' | 'complete';

export function homeProgressBand(percent: number, totalResources: number): HomeProgressBand {
  if (percent >= 100) return 'complete';
  if (percent <= 0 && totalResources <= 0) return 'empty';
  if (percent <= 25) return 'early';
  if (percent <= 50) return 'mid';
  if (percent <= 75) return 'late';
  return 'near';
}

function line(id: string, text: string): ContentVariant {
  return { id, text, theme: 'cozy' };
}

const BAND: Record<HomeProgressBand, ContentVariant[]> = {
  empty: [
    line('home_empty_1', 'Сегодня дом ждёт маленького следа.'),
    line('home_empty_2', 'Комнаты ещё тихие. Первый сохранённый день уже начнёт ремонт.'),
    line('home_empty_3', 'Крыльцо помнит, что сюда можно вернуться.'),
    line('home_empty_4', 'Дом не пустой — он просто ещё без отметок.'),
  ],
  early: [
    line('home_early_1', 'Появились первые материалы. Дом ещё не собран, но уже не молчит.'),
    line('home_early_2', 'Свет в одной комнате уже меняет ощущение входа.'),
    line('home_early_3', 'Забота о теле начинает складываться в доски, сад и порядок.'),
    line('home_early_4', 'Ремонт только начат. Это нормально: дом собирается неделями.'),
    line('home_early_5', 'На столе появились первые запасы. Дальше — спокойно, без гонки.'),
  ],
  mid: [
    line('home_mid_1', 'Половина пути по дому уже видна. Двор и комнаты отвечают неравномерно — так и должно быть.'),
    line('home_mid_2', 'Каждая отметка дня приносит немного света и порядка.'),
    line('home_mid_3', 'Дом перестал быть только планом. Есть зоны, которые уже держат тепло.'),
    line('home_mid_4', 'Мастерская и сад ещё ждут своего часа — это долгий ритм, не гонка.'),
    line('home_mid_5', 'Пространство узнаётся. Можно улучшать то, что уже по карману.'),
  ],
  late: [
    line('home_late_1', 'Большая часть дома уже отвечает. Остались заметные куски, не мелочи.'),
    line('home_late_2', 'Тепло держится само в нескольких комнатах. Дальше — бережно.'),
    line('home_late_3', 'Дом стал местом, куда хочется вернуться. Поздние улучшения не торопят.'),
    line('home_late_4', 'Порядок на кухне и свет в окнах уже есть. Сад и мастерская добираются.'),
  ],
  near: [
    line('home_near_1', 'Дом уже отвечает теплом — осталось бережно довести зоны до порядка.'),
    line('home_near_2', 'Почти живой дом. Последние улучшения собираются постепенно.'),
    line('home_near_3', 'Окна, крыльцо и комнаты почти собраны. Не нужно дожимать рывком.'),
    line('home_near_4', 'Финиш дома — не гонка. Заметный кусок ещё может подождать запасов.'),
  ],
  complete: [
    line('home_done_1', 'Дом восстановлен.'),
    line('home_done_2', 'Дом живой. Можно жить в нём дальше, без нового финала.'),
    line('home_done_3', 'Все зоны в порядке. Это не конец пути — это тёплое место опоры.'),
    line('home_done_4', 'Дом держит тепло сам. Ремонт собран; дни продолжаются.'),
    line('home_done_5', 'Живой дом. Будущие главы придут позже — сейчас пространство целое.'),
  ],
};

const ZONE_DONE: Record<CozyHomeZoneId, ContentVariant[]> = {
  porch: [
    line('zone_porch_1', 'Крыльцо сегодня стало яснее — в дом снова проще войти.'),
    line('zone_porch_2', 'Вход ожил. Даже короткая остановка у двери это чувствует.'),
  ],
  hallway: [
    line('zone_hall_1', 'Прихожая собралась. Свет и порядок встречают сразу за дверью.'),
    line('zone_hall_2', 'Коридор больше не копит хлам дня.'),
  ],
  kitchen: [
    line('zone_kit_1', 'На кухне стало спокойнее. Стол снова место выбора, не шума.'),
    line('zone_kit_2', 'Кухня получила заметный кусок порядка.'),
  ],
  bedroom: [
    line('zone_bed_1', 'В комнате сна прибавилось тишины.'),
    line('zone_bed_2', 'Спальня держит тепло мягче.'),
  ],
  yard: [
    line('zone_yard_1', 'Двор снова связан с домом. Тропинка не заросла.'),
    line('zone_yard_2', 'Во дворе появилось больше воздуха.'),
  ],
  garden: [
    line('zone_gard_1', 'Сад выдохнул. Ростки держатся без спешки.'),
    line('zone_gard_2', 'Грядка получила внимание — этого достаточно.'),
  ],
  workshop: [
    line('zone_work_1', 'Мастерская собрала ещё один спокойный инструмент.'),
    line('zone_work_2', 'Верстак стал понятнее. Долгий проект сдвинулся.'),
  ],
  pet_corner: [
    line('zone_pet_1', 'Угол спутника стал теплее и спокойнее.'),
    line('zone_pet_2', 'Место у окна для спутника собрано бережнее.'),
  ],
};

const LONG_PROJECT: ContentVariant[] = [
  line('long_1', 'Это собирается постепенно — заметный кусок дома, не мелочь дня.'),
  line('long_2', 'Требует времени и запасов. Можно копить спокойно.'),
  line('long_3', 'Долгий проект: дом меняется кусками, не за одну неделю.'),
  line('long_4', 'Не гонка. Когда запасы сойдутся, зона сдвинется сама.'),
];

export function pickHomeStatusLine(params: {
  percent: number;
  totalResources: number;
  date: string;
  lastZoneId?: CozyHomeZoneId | null;
  lastUpgradeAt?: string | null;
}): string {
  const recentZone =
    params.lastZoneId &&
    params.lastUpgradeAt &&
    params.lastUpgradeAt.slice(0, 10) === params.date
      ? params.lastZoneId
      : null;
  if (recentZone) {
    return selectForDate({
      candidates: ZONE_DONE[recentZone],
      date: params.date,
      family: `homeZone:${recentZone}`,
      theme: 'cozy',
    }).text;
  }
  const band = homeProgressBand(params.percent, params.totalResources);
  return selectForDate({
    candidates: BAND[band],
    date: params.date,
    family: `homeStatus:${band}`,
    theme: 'cozy',
  }).text;
}

export function pickLongProjectLine(date: string, zoneId: CozyHomeZoneId): string {
  return selectForDate({
    candidates: LONG_PROJECT,
    date,
    family: 'home:longProject',
    theme: 'cozy',
    extra: zoneId,
  }).text;
}

export const HOME_STATUS_POOLS = BAND;
export const HOME_ZONE_RECENT_POOLS = ZONE_DONE;
export const LONG_PROJECT_POOL = LONG_PROJECT;
