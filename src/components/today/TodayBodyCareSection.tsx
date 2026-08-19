import { NutritionDayCard } from '../nutrition/NutritionDayCard';
import { PhysicalActivityDayCard } from './PhysicalActivityDayCard';
import { RestDayCard } from '../rest/RestDayCard';
import { MomentumFactorsCard } from '../momentum/MomentumFactorsCard';
import { TodaySection } from './TodaySection';
import type { TodayPageModel } from '../../hooks/useTodayPageModel';

type TodayBodyCareSectionProps = {
  model: TodayPageModel;
};

export function TodayBodyCareSection({ model }: TodayBodyCareSectionProps) {
  const { isCozy, entry, settings, selectedDate, patch, isEditingToday, derived } = model;

  return (
    <TodaySection
      accent="body"
      title={isCozy ? 'Забота о теле' : 'Тело и ресурс'}
      lead={
        isCozy
          ? 'Питание, движение и восстановление — из этого дом получает уют и материалы.'
          : 'Питание, движение и отдых — основа хода, не анкета.'
      }
      testId="today-section-body"
    >
      <NutritionDayCard entry={entry} settings={settings} date={selectedDate} onPatch={patch} />
      <PhysicalActivityDayCard entry={entry} settings={settings} onPatch={patch} />
      <RestDayCard entry={entry} onPatch={patch} />
      {isEditingToday ? <MomentumFactorsCard result={derived.todayMomentumResult} /> : null}
    </TodaySection>
  );
}
