import type { DailyEntry, DayMode } from '../../types';
import { getDayMode } from '../../utils/stepsEngine';
import { useAppTheme } from '../../hooks/useAppTheme';

type TodayDayModePresetsProps = {
  entry: DailyEntry;
  onSelect: (mode: DayMode) => void;
  disabled?: boolean;
};

const PRESETS: {
  value: DayMode;
  label: string;
  hint: string;
  cozyHint: string;
}[] = [
  {
    value: 'normal',
    label: 'Обычный',
    hint: 'Полный ход дня',
    cozyHint: 'Обычная забота о теле и доме',
  },
  {
    value: 'minimal',
    label: 'Минимальный',
    hint: 'Удержать маршрут мягко',
    cozyHint: 'Маленький шаг — дом всё равно теплеет',
  },
  {
    value: 'recovery',
    label: 'Восстановление',
    hint: 'Сниженная нагрузка',
    cozyHint: 'Мягкий день без давления',
  },
];

export function TodayDayModePresets({
  entry,
  onSelect,
  disabled = false,
}: TodayDayModePresetsProps) {
  const { isCozy } = useAppTheme();
  const current = getDayMode(entry.dayMode);

  return (
    <div
      data-testid="today-day-presets"
      className={`today-presets${current === 'minimal' ? ' today-presets--minimal' : ''}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="today-presets__eyebrow">Как идём сегодня</p>
          <p className="today-presets__title">Быстрый режим дня</p>
        </div>
        {current === 'minimal' ? (
          <span className="today-presets__badge">Минимальный день</span>
        ) : null}
      </div>
      <p className="today-presets__lead">
        {isCozy
          ? 'Выбери темп — не анкета, а настроение хода. Потом отметь главное и сохрани.'
          : 'Выбери темп дня. Не нужно заполнять всё — достаточно удержать маршрут.'}
      </p>

      <div className="today-presets__grid">
        {PRESETS.map((preset) => {
          const active = current === preset.value;
          const featured = preset.value === 'minimal';
          return (
            <button
              key={preset.value}
              type="button"
              disabled={disabled}
              data-testid={`today-preset-${preset.value}`}
              onClick={() => onSelect(preset.value)}
              className={[
                'today-presets__item',
                active ? 'today-presets__item--active' : '',
                featured ? 'today-presets__item--featured' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="today-presets__item-label">{preset.label}</span>
              <span className="today-presets__item-hint">
                {isCozy ? preset.cozyHint : preset.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
