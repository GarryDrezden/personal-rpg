import { useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useCoinStore } from '../../store/coinStore';
import { todayISO } from '../../utils/dates';
import { evaluateMomentumCoinBonuses } from '../../utils/momentumCoinEngine';

export function MomentumCoinHost() {
  const { dailyEntries, settings } = useAppStore();
  const addEarnedOnce = useCoinStore((s) => s.addEarnedOnce);
  const hydrated = useCoinStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    const today = todayISO();
    const txs = evaluateMomentumCoinBonuses({ today, dailyEntries, settings });
    for (const tx of txs) {
      addEarnedOnce(tx);
    }
  }, [dailyEntries, settings, hydrated, addEarnedOnce]);

  return null;
}
