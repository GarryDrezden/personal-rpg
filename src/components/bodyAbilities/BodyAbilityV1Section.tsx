import { BodyAbilitySkillBoard } from './BodyAbilitySkillBoard';

/** Body Abilities v1 — RPG skill board (manual unlock observations). */
export function BodyAbilityV1Section() {
  return (
    <section data-testid="body-abilities-v1-section">
      <BodyAbilitySkillBoard showPageHero={false} />
    </section>
  );
}
