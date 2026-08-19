import { QuestCard } from '../quests/QuestCard';
import { TodaySection } from './TodaySection';
import type { TodayPageModel } from '../../hooks/useTodayPageModel';

type TodayTrackingSectionProps = {
  model: TodayPageModel;
};

export function TodayTrackingSection({ model }: TodayTrackingSectionProps) {
  const { isCozy, entry, patch, derived } = model;

  return (
    <TodaySection
      accent="path"
      title={isCozy ? 'Что отметить сегодня' : 'Ход маршрута'}
      lead={
        isCozy
          ? 'Отмечай только то, что было. Остальное можно оставить.'
          : 'Главное, среднее и бонус — без давления закрыть всё.'
      }
      testId="today-section-path"
    >
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          {derived.mainQuestsLabel}
        </h3>
        {derived.mainQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} entry={entry} weekly={derived.weekly} onPatch={patch} />
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          {isCozy ? 'Если есть силы' : 'Средние квесты'}
        </h3>
        {derived.mediumQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} entry={entry} weekly={derived.weekly} onPatch={patch} />
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          {isCozy ? 'По желанию' : 'Бонусные квесты'}
        </h3>
        {derived.bonusQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} entry={entry} weekly={derived.weekly} onPatch={patch} />
        ))}
      </div>
    </TodaySection>
  );
}
