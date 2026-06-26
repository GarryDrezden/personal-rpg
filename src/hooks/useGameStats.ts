import { useAppStore } from '../store/appStore';

import { useCoinStore } from '../store/coinStore';

import { useDerivedStats } from '../store/selectors';

import { todayISO } from '../utils/dates';



export function useGameStats(today = todayISO()) {

  const { dailyEntries, measurements, rewards, settings } = useAppStore();

  const coinTransactions = useCoinStore((s) => s.transactions);



  return useDerivedStats(

    dailyEntries,

    measurements,

    rewards,

    settings,

    today,

    coinTransactions,

  );

}


