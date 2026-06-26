export type CoinTransactionType =
  | 'earned'
  | 'spent'
  | 'bonus'
  | 'refund'
  | 'manual';

export type CoinTransactionSource =
  | 'daily'
  | 'weekly'
  | 'achievement'
  | 'measurement'
  | 'reward'
  | 'manual'
  | 'freedom_level'
  | 'momentum';

export type CoinTransaction = {
  id: string;
  type: CoinTransactionType;
  source: CoinTransactionSource;
  amount: number;
  title: string;
  description?: string;
  date: string;
  relatedId?: string;
};

export type CoinWalletSummary = {
  totalEarned: number;
  totalSpent: number;
  available: number;
  todayEarned: number;
  weekEarned: number;
  transactions: CoinTransaction[];
};

export type NearestRewardInfo = {
  rewardId: string;
  title: string;
  cost: number;
  missing?: number;
} | null;
