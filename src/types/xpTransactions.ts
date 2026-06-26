export type XpTransactionSource = 'daily' | 'achievement' | 'freedom_level';

export type XpTransaction = {
  id: string;
  source: XpTransactionSource;
  relatedId: string;
  amount: number;
  title: string;
  createdAt: string;
};
