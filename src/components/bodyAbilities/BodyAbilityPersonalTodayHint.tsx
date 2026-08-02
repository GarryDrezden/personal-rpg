import { Link } from 'react-router-dom';
import { useAppTheme } from '../../hooks/useAppTheme';
import type { BodyAbilityDefinition } from '../../types/bodyAbilityPersonal';
import { getThemedBodyAbilityPresentation } from '../../game/bodyAbilityThemePresentation';

type BodyAbilityPersonalTodayHintProps = {
  ability: BodyAbilityDefinition;
};

/** Soft post-save / today hint — never auto-unlocks. */
export function BodyAbilityPersonalTodayHint({ ability }: BodyAbilityPersonalTodayHintProps) {
  const { themeId } = useAppTheme();
  const presentation = getThemedBodyAbilityPresentation(themeId, ability.id, ability);

  return (
    <div
      data-testid="body-ability-personal-today-hint"
      className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)]/80 px-4 py-3"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
        Карта тела
      </p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">
        Возможно, тело готово отметить новое изменение:
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--app-text)]">
        {presentation.icon} {presentation.title}
      </p>
      <Link
        to="/freedom"
        className="mt-2 inline-block text-xs font-semibold text-[var(--app-primary)] hover:underline"
      >
        Открыть карту →
      </Link>
    </div>
  );
}
