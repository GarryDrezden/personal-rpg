import { Card } from '../ui/Card';
import { TodaySection } from './TodaySection';
import type { TodayPageModel } from '../../hooks/useTodayPageModel';

type TodayDayTraceSectionProps = {
  model: TodayPageModel;
};

export function TodayDayTraceSection({ model }: TodayDayTraceSectionProps) {
  const { entry, patch } = model;

  return (
    <TodaySection
      accent="trace"
      title={model.isCozy ? 'След дня' : 'Дневник'}
      lead="Одна строка уже считается записью."
      testId="today-section-trace"
    >
      <Card>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--app-text)]">Заметки дня</span>
          <textarea
            value={entry.comment}
            onChange={(event) => patch({ comment: event.target.value })}
            rows={3}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-3 text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
            placeholder="Что получилось, что было сложно…"
          />
        </label>
      </Card>
    </TodaySection>
  );
}
