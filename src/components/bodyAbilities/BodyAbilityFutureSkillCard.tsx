import type { BodyAbilityV1Def } from '../../types/bodyAbilityV1';
import { BODY_ABILITY_V1_CATEGORIES } from '../../game/bodyAbilities/bodyAbilityConfig';
import { BodyAbilityArtMedallion } from './BodyAbilityArtMedallion';

type BodyAbilityFutureSkillCardProps = {
  ability: BodyAbilityV1Def;
};

export function BodyAbilityFutureSkillCard({ ability }: BodyAbilityFutureSkillCardProps) {
  const categoryMeta = BODY_ABILITY_V1_CATEGORIES[ability.category];

  return (
    <article
      data-testid={`body-ability-future-${ability.id}`}
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-violet-500/10 bg-gradient-to-br from-[#0e0c14]/80 via-[#0a0810]/85 to-[#060508]/90 px-3 py-3 opacity-90"
    >
      <span className="absolute right-2.5 top-2 text-[8px] font-medium tracking-wide text-violet-300/25">
        {categoryMeta.label}
      </span>

      <div className="flex flex-1 flex-col items-center text-center">
        <BodyAbilityArtMedallion
          abilityId={ability.id}
          title={ability.title}
          category={ability.category}
          visualState="locked"
          size="compact"
          forceGlyph
        />

        <h3 className="mt-2 text-sm font-medium leading-snug text-[var(--app-text-muted)]/85">
          {ability.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[var(--app-text-muted)]/45">
          {ability.description}
        </p>
      </div>

      <p className="mt-2 shrink-0 border-t border-violet-500/8 pt-2 text-center text-[10px] leading-snug text-[var(--app-text-muted)]/40">
        Дальняя способность. Проявится позже на маршруте.
      </p>
    </article>
  );
}
