import type { Reward } from '../types';

export const DEFAULT_REWARDS: Omit<Reward, 'id' | 'purchasedAt'>[] = [
  {
    title: 'Кофе вне дома',
    description: 'Чашка кофе в любимом кафе без угрызений',
    cost: 200,
    category: 'Отдых',
    hidden: false,
    moneyGoal: null,
  },
  {
    title: 'Вечер игры',
    description: 'Вечер за игрой без чувства вины',
    cost: 300,
    category: 'Отдых',
    hidden: false,
    moneyGoal: null,
  },
  {
    title: 'Покупка для цветов',
    description: 'Что-то полезное для домашних растений',
    cost: 500,
    category: 'Хобби',
    hidden: false,
    moneyGoal: null,
  },
  {
    title: 'Покупка для хобби',
    description: 'Материалы или инструмент для любимого дела',
    cost: 1000,
    category: 'Хобби',
    hidden: false,
    moneyGoal: null,
  },
  {
    title: 'Поездка выходного дня',
    description: 'Небольшая поездка или вылазка на природу',
    cost: 2000,
    category: 'Приключения',
    hidden: false,
    moneyGoal: null,
  },
  {
    title: 'Крупная покупка',
    description: 'Что-то давно желаемое, но не обязательное',
    cost: 3000,
    category: 'Крупное',
    hidden: false,
    moneyGoal: null,
  },
];
