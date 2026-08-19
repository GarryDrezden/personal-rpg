import { WeekDayPicker } from '../quests/WeekDayPicker';
import { WeekNavigator } from '../quests/WeekNavigator';
import { Card } from '../ui/Card';
import type { TodayPageModel } from '../../hooks/useTodayPageModel';

type TodayWeekCardProps = {
  model: TodayPageModel;
};

export function TodayWeekCard({ model }: TodayWeekCardProps) {
  const {
    visibleWeekStart,
    visibleWeekDays,
    currentWeekStart,
    selectedDate,
    today,
    dailyEntries,
    selectWeek,
    selectDay,
  } = model;

  return (
    <Card>
      <WeekNavigator
        weekStartDate={visibleWeekStart}
        weekEndDate={visibleWeekDays[6]!}
        currentWeekStart={currentWeekStart}
        onChange={selectWeek}
      />
      <p className="mb-3 text-sm font-medium text-[var(--app-text)]">День недели</p>
      <WeekDayPicker
        weekStartDate={visibleWeekStart}
        selectedDate={selectedDate}
        today={today}
        dailyEntries={dailyEntries}
        onChange={selectDay}
      />
    </Card>
  );
}
