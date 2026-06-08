import type { Insight } from '../../types/insights';
import { INSIGHT_TYPE_LABELS } from '../../types/insights';
import { CARD_ACCENT } from '../../constants/cardTheme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Lightbulb, AlertTriangle, Sparkles, MessageCircle } from 'lucide-react';

type InsightCardProps = {
  insight: Insight;
};

const typeStyles: Record<
  Insight['type'],
  { card: string; badge: 'default' | 'success' | 'gold' | 'danger'; icon: typeof Lightbulb; iconColor: string }
> = {
  positive: {
    card: CARD_ACCENT.success,
    badge: 'success',
    icon: Sparkles,
    iconColor: 'text-[var(--app-success)]',
  },
  warning: {
    card: CARD_ACCENT.warning,
    badge: 'gold',
    icon: AlertTriangle,
    iconColor: 'text-[var(--app-warning)]',
  },
  suggestion: {
    card: CARD_ACCENT.default,
    badge: 'default',
    icon: Lightbulb,
    iconColor: 'text-[var(--app-secondary)]',
  },
  neutral: {
    card: CARD_ACCENT.default,
    badge: 'default',
    icon: MessageCircle,
    iconColor: 'text-[var(--app-text-muted)]',
  },
};

export function InsightCard({ insight }: InsightCardProps) {
  const style = typeStyles[insight.type];
  const Icon = style.icon;

  return (
    <Card className={style.card}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--app-card-strong)] shadow-sm">
          <Icon size={20} className={style.iconColor} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--app-text)]">{insight.title}</h3>
            <Badge variant={style.badge}>{INSIGHT_TYPE_LABELS[insight.type]}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{insight.description}</p>
          {insight.metric && insight.value !== undefined && (
            <p className="mt-2 text-xs text-[var(--app-text-muted)]">
              {insight.metric}:{' '}
              <span className="font-medium text-[var(--app-text)]">{insight.value}</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
