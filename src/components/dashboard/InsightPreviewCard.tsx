import { Link } from 'react-router-dom';
import type { Insight } from '../../types/insights';
import { Card } from '../ui/Card';
import { Lightbulb } from 'lucide-react';

type InsightPreviewCardProps = {
  insight: Insight | null;
  hasEnoughData: boolean;
};

export function InsightPreviewCard({ insight, hasEnoughData }: InsightPreviewCardProps) {
  return (
    <Card className="bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/40">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-teal-600" size={22} />
          <h2 className="text-lg font-semibold">Инсайт недели</h2>
        </div>
        <Link to="/insights" className="text-sm font-medium text-gold hover:underline">
          Аналитика →
        </Link>
      </div>

      {!hasEnoughData ? (
        <p className="text-sm text-rpg-muted">
          Нужно хотя бы 7 дней данных, чтобы появились первые выводы.
        </p>
      ) : insight ? (
        <>
          <p className="font-medium text-stone-900">{insight.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-stone-700">{insight.description}</p>
        </>
      ) : (
        <p className="text-sm text-rpg-muted">
          Продолжай вносить данные — закономерности появятся по мере накопления истории.
        </p>
      )}
    </Card>
  );
}
