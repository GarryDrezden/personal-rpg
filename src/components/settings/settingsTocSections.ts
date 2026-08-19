export const SETTINGS_SECTION_IDS = {
  theme: 'settings-theme',
  sidebar: 'settings-sidebar',
  pwa: 'settings-pwa',
  bodyMap: 'settings-body-map',
  experimental: 'settings-experimental',
  weight: 'settings-weight',
  gameHero: 'settings-game-hero',
  avatar: 'settings-avatar',
  nutrition: 'settings-nutrition',
  defaults: 'settings-defaults',
  weeks: 'settings-weeks',
  coins: 'settings-coins',
  xp: 'settings-xp',
  habits: 'settings-habits',
  backup: 'settings-backup',
} as const;

export type SettingsSectionId = (typeof SETTINGS_SECTION_IDS)[keyof typeof SETTINGS_SECTION_IDS];

/** Visible TOC chips. Experimental sleep stays on the page but is not in the TOC (unchanged). */
export const SETTINGS_TOC_SECTIONS = [
  { id: SETTINGS_SECTION_IDS.theme, label: 'Внешний вид' },
  { id: SETTINGS_SECTION_IDS.sidebar, label: 'Меню' },
  { id: SETTINGS_SECTION_IDS.pwa, label: 'Приложение' },
  { id: SETTINGS_SECTION_IDS.bodyMap, label: 'Карта тела' },
  { id: SETTINGS_SECTION_IDS.weight, label: 'Персонаж' },
  { id: SETTINGS_SECTION_IDS.gameHero, label: 'Герой RPG' },
  { id: SETTINGS_SECTION_IDS.avatar, label: 'Аватар' },
  { id: SETTINGS_SECTION_IDS.nutrition, label: 'Питание' },
  { id: SETTINGS_SECTION_IDS.defaults, label: 'Цели' },
  { id: SETTINGS_SECTION_IDS.weeks, label: 'Недели' },
  { id: SETTINGS_SECTION_IDS.coins, label: 'Монеты' },
  { id: SETTINGS_SECTION_IDS.xp, label: 'Баллы' },
  { id: SETTINGS_SECTION_IDS.habits, label: 'Второст. цели' },
  { id: SETTINGS_SECTION_IDS.backup, label: 'Данные' },
] as const;
