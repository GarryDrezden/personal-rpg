import { create } from 'zustand';

import type { CoinTransaction } from '../types/currency';

import type { Reward } from '../types';

import { loadCoinTransactions, saveCoinTransactions } from './coinStorage';

import { todayISO } from '../utils/dates';



interface CoinState {

  transactions: CoinTransaction[];

  hydrated: boolean;

  hydrate: () => void;

  syncFromRewards: (rewards: Reward[]) => void;

  addSpentForReward: (reward: Reward) => boolean;

  addEarnedOnce: (tx: CoinTransaction) => boolean;

}



function spentTxForReward(reward: Reward): CoinTransaction {

  return {

    id: `spent-${reward.id}`,

    type: 'spent',

    source: 'reward',

    amount: -reward.cost,

    title: reward.title,

    description: 'Покупка награды',

    date: (reward.purchasedAt ?? todayISO()).slice(0, 10),

    relatedId: `reward_${reward.id}`,

  };

}



export const useCoinStore = create<CoinState>((set, get) => ({

  transactions: [],

  hydrated: false,



  hydrate: () => {

    set({

      transactions: loadCoinTransactions(),

      hydrated: true,

    });

  },



  syncFromRewards: (rewards) => {

    const current = get().transactions;

    const byRelated = new Map(

      current.map((tx) => [tx.relatedId ?? tx.id, tx]),

    );



    for (const reward of rewards) {

      if (!reward.purchasedAt) continue;

      const key = `reward_${reward.id}`;

      if (!byRelated.has(key)) {

        byRelated.set(key, spentTxForReward(reward));

      }

    }



    const next = [...byRelated.values()];

    saveCoinTransactions(next);

    set({ transactions: next });

  },



  addSpentForReward: (reward) => {

    const key = `reward_${reward.id}`;

    if (get().transactions.some((tx) => tx.relatedId === key)) {

      return false;

    }

    const next = [...get().transactions, spentTxForReward({ ...reward, purchasedAt: todayISO() })];

    saveCoinTransactions(next);

    set({ transactions: next });

    return true;

    },

  addEarnedOnce: (tx) => {

    const key = tx.relatedId ?? tx.id;

    if (get().transactions.some((t) => (t.relatedId ?? t.id) === key)) {

      return false;

    }

    const next = [...get().transactions, tx];

    saveCoinTransactions(next);

    set({ transactions: next });

    return true;

  },

}));


