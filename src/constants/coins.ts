import type { CoinSettings } from '../types';

export const DEFAULT_COIN_SETTINGS: CoinSettings = {
  goodDayCoins: 1,
  greatDayCoins: 2,
  heroDayBonusCoins: 1,
  ironDayBonusCoins: 2,
  week80Coins: 3,
  week100Coins: 5,
  noAlcoholWeekCoins: 3,
  gymWeekCoins: 2,
  caloriesWeekCoins: 3,
  perfectBaseWeekCoins: 7,
  measurementsMondayCoins: 1,
  minimalDayCoins: 1,
};

export function resolveCoinSettings(settings: { coinSettings?: CoinSettings }): CoinSettings {
  return { ...DEFAULT_COIN_SETTINGS, ...settings.coinSettings };
}
