import type { Insight } from '../../types/insights';
import { INSIGHT_TYPE_LABELS } from '../../types/insights';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Lightbulb, AlertTriangle, Sparkles, MessageCircle } from 'lucide-react';

type InsightCardProps = {
  insight: Insight;
};

const typeStyles: Record<
  Insight['type'],
  { card: string; badge: 'default' | 'success' | 'gold' | 'danger'; icon: typeof Lightbulb }
> = {
  positive: {
    card: 'from-emerald-50/80 via-white to-teal-50/40 ring-emerald-200/50',
    badge: 'success',
    icon: Sparkles,
  },
  warning: {
    card: 'from-amber-50/80 via-white to-orange-50/40 ring-amber-200/50',
    badge: 'gold',
    icon: AlertTriangle,
  },
  suggestion: {
    card: 'from-sky-50/80 via-white to-indigo-50/40 ring-sky-200/50',
    badge: 'default',
    icon: Lightbulb,
  },
  neutral: {
    card: 'from-stone-50 via-white to-slate-50 ring-stone-200/50',
    badge: 'default',
    icon: MessageCircle,
  },
};

export function InsightCard({ insight }: InsightCardProps) {
  const style = typeStyles[insight.type];
  const Icon = style.icon;

  return (
    <Card className={`bg-gradient-to-br ring-1 ${style.card}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
          <Icon size={20} className="text-stone-700" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-stone-900">{insight.title}</h3>
            <Badge variant={style.badge}>{INSIGHT_TYPE_LABELS[insight.type]}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-stone-700">{insight.description}</p>
          {insight.metric && insight.value !== undefined && (
            <p className="mt-2 text-xs text-rpg-muted">
              {insight.metric}: <span className="font-medium text-stone-800">{insight.value}</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
