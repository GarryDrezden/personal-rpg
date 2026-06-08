import type { AppSettings } from '../../types';
import type {
  BuiltinHabitId,
  CustomHabitDefinition,
  HabitCardColorId,
  HabitConfig,
  SecondaryQuestCategory,
} from '../../types/habits';
import { BUILTIN_HABITS } from '../../constants/builtinHabits';
import {
  HABIT_COLOR_OPTIONS,
  getHabitCardColorClass,
  getHabitColorSwatchClass,
} from '../../constants/habitColors';
import { HABIT_ICON_OPTIONS } from '../../constants/habitIcons';
import { DEFAULT_HABIT_CONFIG, resolveHabitConfig } from '../../utils/habitConfig';
import { NumberInput } from '../ui/NumberInput';

type HabitsEditorProps = {
  settings: AppSettings;
  onChange: (habitConfig: HabitConfig) => void;
};

type EditorRow =
  | { kind: 'builtin'; id: BuiltinHabitId }
  | { kind: 'custom'; habit: CustomHabitDefinition };

function ensureConfig(settings: AppSettings): HabitConfig {
  return resolveHabitConfig(settings);
}

export function HabitsEditor({ settings, onChange }: HabitsEditorProps) {
  const config = ensureConfig(settings);

  const update = (patch: Partial<HabitConfig>) => {
    onChange({ ...config, ...patch });
  };

  const rows: EditorRow[] = [
    ...BUILTIN_HABITS.filter((h) => !config.hiddenBuiltinIds.includes(h.id)).map((h) => ({
      kind: 'builtin' as const,
      id: h.id,
    })),
    ...config.customHabits.map((h) => ({ kind: 'custom' as const, habit: h })),
  ];

  const hideBuiltin = (id: BuiltinHabitId) => {
    update({
      hiddenBuiltinIds: [...config.hiddenBuiltinIds, id],
      builtinOverrides: Object.fromEntries(
        Object.entries(config.builtinOverrides).filter(([key]) => key !== id),
      ) as HabitConfig['builtinOverrides'],
    });
  };

  const restoreBuiltin = (id: BuiltinHabitId) => {
    update({
      hiddenBuiltinIds: config.hiddenBuiltinIds.filter((x) => x !== id),
    });
  };

  const updateBuiltinOverride = (
    id: BuiltinHabitId,
    patch: Partial<NonNullable<HabitConfig['builtinOverrides'][BuiltinHabitId]>>,
  ) => {
    update({
      builtinOverrides: {
        ...config.builtinOverrides,
        [id]: { ...config.builtinOverrides[id], ...patch },
      },
    });
  };

  const updateCustom = (id: string, patch: Partial<CustomHabitDefinition>) => {
    update({
      customHabits: config.customHabits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    });
  };

  const removeCustom = (id: string) => {
    update({ customHabits: config.customHabits.filter((h) => h.id !== id) });
  };

  const addCustom = () => {
    const habit: CustomHabitDefinition = {
      id: crypto.randomUUID(),
      title: 'Новая цель',
      description: '',
      category: 'bonus',
      icon: '🧘',
      cardColor: 'teal',
      points: 10,
    };
    update({ customHabits: [...config.customHabits, habit] });
  };

  const hiddenBuiltins = BUILTIN_HABITS.filter((h) => config.hiddenBuiltinIds.includes(h.id));

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--app-text-muted)]">
        Настрой средние и бонусные квесты: переименуй, выбери иконку и цвет карточки, скрой
        стандартные или добавь свои (например, Йога вместо Хобби).
      </p>

      {rows.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--app-border)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
          Нет активных второстепенных целей. Добавь свою или верни стандартную из списка ниже.
        </p>
      )}

      {rows.map((row) => {
        if (row.kind === 'builtin') {
          const template = BUILTIN_HABITS.find((h) => h.id === row.id)!;
          const override = config.builtinOverrides[row.id] ?? {};
          const title = override.title ?? template.title;
          const description = override.description ?? template.description;
          const icon = override.icon ?? template.icon;
          const cardColor = override.cardColor ?? template.cardColor;
          const points = override.points ?? settings.pointSettings[template.pointKey];

          return (
            <HabitRowEditor
              key={row.id}
              badge="Стандартная"
              title={title}
              description={description}
              icon={icon}
              cardColor={cardColor}
              points={points}
              category={template.category}
              onTitle={(v) => updateBuiltinOverride(row.id, { title: v })}
              onDescription={(v) => updateBuiltinOverride(row.id, { description: v })}
              onIcon={(v) => updateBuiltinOverride(row.id, { icon: v })}
              onColor={(v) => updateBuiltinOverride(row.id, { cardColor: v })}
              onPoints={(v) => updateBuiltinOverride(row.id, { points: v })}
              onCategory={() => {}}
              categoryLocked
              onRemove={() => hideBuiltin(row.id)}
              removeLabel="Скрыть"
            />
          );
        }

        const { habit } = row;
        return (
          <HabitRowEditor
            key={habit.id}
            badge="Своя"
            title={habit.title}
            description={habit.description}
            icon={habit.icon}
            cardColor={habit.cardColor}
            points={habit.points}
            category={habit.category}
            onTitle={(v) => updateCustom(habit.id, { title: v })}
            onDescription={(v) => updateCustom(habit.id, { description: v })}
            onIcon={(v) => updateCustom(habit.id, { icon: v })}
            onColor={(v) => updateCustom(habit.id, { cardColor: v })}
            onPoints={(v) => updateCustom(habit.id, { points: v })}
            onCategory={(v) => updateCustom(habit.id, { category: v })}
            onRemove={() => removeCustom(habit.id)}
            removeLabel="Удалить"
          />
        );
      })}

      <button
        type="button"
        onClick={addCustom}
        className="w-full rounded-xl border border-dashed border-[var(--app-border)] px-4 py-3 text-sm font-medium text-[var(--app-primary)] hover:bg-[var(--app-bg-soft)]"
      >
        + Добавить свою цель
      </button>

      {hiddenBuiltins.length > 0 && (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            Скрытые стандартные
          </p>
          <div className="flex flex-wrap gap-2">
            {hiddenBuiltins.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => restoreBuiltin(h.id)}
                className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-sm hover:brightness-[1.04]"
              >
                {h.icon} {h.title} — вернуть
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type HabitRowEditorProps = {
  badge: string;
  title: string;
  description: string;
  icon: string;
  cardColor: HabitCardColorId;
  points: number;
  category: SecondaryQuestCategory;
  categoryLocked?: boolean;
  onTitle: (v: string) => void;
  onDescription: (v: string) => void;
  onIcon: (v: string) => void;
  onColor: (v: HabitCardColorId) => void;
  onPoints: (v: number) => void;
  onCategory: (v: SecondaryQuestCategory) => void;
  onRemove: () => void;
  removeLabel: string;
};

function HabitRowEditor({
  badge,
  title,
  description,
  icon,
  cardColor,
  points,
  category,
  categoryLocked,
  onTitle,
  onDescription,
  onIcon,
  onColor,
  onPoints,
  onCategory,
  onRemove,
  removeLabel,
}: HabitRowEditorProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--app-border)] p-4 ${getHabitCardColorClass(cardColor)}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-[var(--app-card-strong)] px-2 py-0.5 text-xs font-medium text-[var(--app-text-muted)]">
          {badge} · {category === 'medium' ? 'Средняя' : 'Бонусная'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-[var(--app-danger)] hover:underline"
        >
          {removeLabel}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Название</span>
          <input
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)]"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Описание</span>
          <input
            value={description}
            onChange={(e) => onDescription(e.target.value)}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)]"
          />
        </label>
        <NumberInput label="XP за выполнение" value={points} onChange={(v) => onPoints(v ?? 0)} />
        {!categoryLocked && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Раздел</span>
            <select
              value={category}
              onChange={(e) => onCategory(e.target.value as SecondaryQuestCategory)}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)]"
            >
              <option value="medium">Средние квесты</option>
              <option value="bonus">Бонусные квесты</option>
            </select>
          </label>
        )}
      </div>

      <div className="mt-3">
        <span className="mb-2 block text-sm font-medium text-[var(--app-text)]">Иконка</span>
        <div className="flex flex-wrap gap-1.5">
          {HABIT_ICON_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onIcon(emoji)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg ${
                icon === emoji
                  ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                  : 'border-[var(--app-border)] bg-[var(--app-card-strong)]'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <span className="mb-2 block text-sm font-medium text-[var(--app-text)]">Цвет карточки</span>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              title={opt.label}
              onClick={() => onColor(opt.id)}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs ${
                cardColor === opt.id
                  ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                  : 'border-[var(--app-border)] bg-[var(--app-card-strong)]'
              }`}
            >
              <span className={`h-4 w-4 rounded-full ${getHabitColorSwatchClass(opt.id)}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_HABIT_CONFIG };
