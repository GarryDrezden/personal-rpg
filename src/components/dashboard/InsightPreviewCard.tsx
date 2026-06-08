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
    <Card className="bg-[color-mix(in_srgb,var(--app-success)_8%,var(--app-card))]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-[var(--app-success)]" size={22} />
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Инсайт недели</h2>
        </div>
        <Link to="/insights" className="text-sm font-medium text-[var(--app-primary)] hover:underline">
          Аналитика →
        </Link>
      </div>

      {!hasEnoughData ? (
        <p className="text-sm text-[var(--app-text-muted)]">
          Нужно хотя бы 7 дней данных, чтобы появились первые выводы.
        </p>
      ) : insight ? (
        <>
          <p className="font-medium text-[var(--app-text)]">{insight.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
            {insight.description}
          </p>
        </>
      ) : (
        <p className="text-sm text-[var(--app-text-muted)]">
          Продолжай вносить данные — закономерности появятся по мере накопления истории.
        </p>
      )}
    </Card>
  );
}
