import type { BankDeposit } from '../types';

export function totalBankBalance(deposits: BankDeposit[]): number {
  return deposits.reduce((sum, d) => sum + d.amount, 0);
}
