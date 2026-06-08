import { create } from 'zustand';
import type { CoinTransaction } from '../types/currency';
import { loadCoinTransactions, saveCoinTransactions } from './coinStorage';

interface CoinState {
  manualTransactions: CoinTransaction[];
  hydrated: boolean;
  hydrate: () => void;
  addManualTransaction: (tx: Omit<CoinTransaction, 'id' | 'type' | 'source'>) => void;
}

export const useCoinStore = create<CoinState>((set, get) => ({
  manualTransactions: [],
  hydrated: false,

  hydrate: () => {
    set({
      manualTransactions: loadCoinTransactions(),
      hydrated: true,
    });
  },

  addManualTransaction: (tx) => {
    const item: CoinTransaction = {
      ...tx,
      id: `manual-${Date.now()}`,
      type: 'manual',
      source: 'manual',
    };
    const next = [...get().manualTransactions, item];
    saveCoinTransactions(next);
    set({ manualTransactions: next });
  },
}));
