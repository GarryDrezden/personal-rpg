import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Coins, Gift } from 'lucide-react';

type RewardsBankCardProps = {
  availablePoints: number;
};

export function RewardsBankCard({ availablePoints }: RewardsBankCardProps) {
  return (
    <Card className="bg-gradient-to-br from-amber-100/60 to-yellow-50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20">
            <Coins className="text-gold" size={26} />
          </div>
          <div>
            <p className="text-sm text-rpg-muted">Банк наград</p>
            <p className="text-2xl font-bold text-amber-900">
              {availablePoints.toLocaleString('ru')}
            </p>
            <p className="text-xs text-rpg-muted">очков для покупки</p>
          </div>
        </div>
        <Link
          to="/rewards"
          className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50"
        >
          <Gift size={16} />
          Награды
        </Link>
      </div>
    </Card>
  );
}
