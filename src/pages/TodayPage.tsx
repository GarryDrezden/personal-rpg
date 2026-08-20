import { useTodayPageModel } from '../hooks/useTodayPageModel';
import { TodayMinimalQuickCard } from '../components/today/TodayMinimalQuickCard';
import { TodayDayModePresets } from '../components/today/TodayDayModePresets';
import { TodayHeader, TodayMobileSaveBar } from '../components/today/TodayHeader';
import { TodayWeekCard } from '../components/today/TodayWeekCard';
import { TodayContextStack } from '../components/today/TodayContextStack';
import { TodayBodyCareSection } from '../components/today/TodayBodyCareSection';
import { TodayTrackingSection } from '../components/today/TodayTrackingSection';
import { TodayDayTraceSection } from '../components/today/TodayDayTraceSection';
import { TodayDaySummary } from '../components/today/TodayDaySummary';

export function TodayPage() {
  const model = useTodayPageModel();

  return (
    <div
      className="today-v2 space-y-5 overflow-x-hidden pb-32 lg:space-y-6 lg:pb-8"
      data-testid="today-v2"
    >
      <TodayHeader model={model} />
      <TodayWeekCard model={model} />
      <TodayDayModePresets
        entry={model.entry}
        onSelect={model.selectDayMode}
        disabled={model.saving}
      />
      {model.derived.dayMode !== 'recovery' ? (
        <TodayMinimalQuickCard
          entry={model.entry}
          onEnableMinimal={() => model.selectDayMode('minimal')}
          saving={model.saving}
        />
      ) : null}
      <TodayContextStack model={model} />
      <TodayBodyCareSection model={model} />
      <TodayTrackingSection model={model} />
      <TodayDayTraceSection model={model} />
      <TodayDaySummary model={model} />
      <TodayMobileSaveBar model={model} />
    </div>
  );
}
