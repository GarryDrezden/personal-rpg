import type { FreedomScoreLevel } from '../types/freedomScore';

export const FREEDOM_SCORE_LEVELS: FreedomScoreLevel[] = [
  {
    id: 'awakening',
    min: 0,
    max: 10,
    title: 'Пробуждение',
    description: 'Система только включается. Первые данные уже делают путь видимым.',
    icon: '🌱',
  },
  {
    id: 'first_relief',
    min: 10,
    max: 25,
    title: 'Первое облегчение',
    description: 'Появляются первые признаки устойчивого движения.',
    icon: '🎒',
  },
  {
    id: 'movement_return',
    min: 25,
    max: 45,
    title: 'Возвращение движения',
    description: 'Тело постепенно возвращает себе ритм и больше свободы.',
    icon: '👟',
  },
  {
    id: 'stable_base',
    min: 45,
    max: 65,
    title: 'Сильная база',
    description: 'Режим уже держится не только на мотивации, но и на системе.',
    icon: '🛡️',
  },
  {
    id: 'new_form',
    min: 65,
    max: 85,
    title: 'Новая форма',
    description: 'Персонаж прошел большой путь и открывает новый уровень возможностей.',
    icon: '🪽',
  },
  {
    id: 'rebirth',
    min: 85,
    max: 100,
    title: 'Перерождение',
    description: 'Это уже новая глава тела, режима и движения.',
    icon: '🔥',
  },
];
