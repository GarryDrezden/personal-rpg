import type {
  BodyAbilityDefinition,
  BodyAbilityDifficulty,
  BodyAbilityProfile,
  BodyAbilityInterest,
} from '../types/bodyAbilityPersonal';
import { BODY_ABILITY_BANK } from '../constants/bodyAbilityBank';

const DIFFICULTY_TARGETS: Record<BodyAbilityDifficulty, number> = {
  early: 0.3,
  middle: 0.4,
  late: 0.2,
  epic: 0.1,
};

const UNIVERSAL_FALLBACK_TAGS = new Set(['universal']);

const CATEGORY_HIDDEN_TOPIC: Partial<
  Record<BodyAbilityInterest, BodyAbilityProfile['hiddenTopics'][number]>
> = {
  alcohol_evening: 'alcohol',
  appearance: 'appearance',
  nutrition_control: 'nutrition',
  measurements: 'measurements',
  stairs_routes: 'stairs',
  sport_training: 'sport',
  daily_life: 'daily_life_limitations',
};

function isHiddenByTopics(
  ability: BodyAbilityDefinition,
  hidden: BodyAbilityProfile['hiddenTopics'],
): boolean {
  if (ability.hiddenByTopics?.some((t) => hidden.includes(t))) return true;
  const byCategory = CATEGORY_HIDDEN_TOPIC[ability.category];
  if (byCategory && hidden.includes(byCategory)) return true;
  if (ability.tags.includes('weight') && hidden.includes('weight')) return true;
  return false;
}

function isExcludedByBaseline(
  ability: BodyAbilityDefinition,
  baseline: BodyAbilityProfile['baselineEasy'],
): boolean {
  if (!ability.excludedByBaselineEasy?.length) return false;
  return ability.excludedByBaselineEasy.some((b) => baseline.includes(b));
}

function scoreAbility(
  ability: BodyAbilityDefinition,
  profile: BodyAbilityProfile,
): number {
  let score = ability.scoreWeight;

  if (ability.goalBands.includes(profile.goalBand)) score += 2;

  const interestHit =
    profile.interests.includes(ability.category) ||
    (ability.secondaryCategories ?? []).some((c) => profile.interests.includes(c));
  if (interestHit) score += 3;

  if (ability.pathTypes?.some((p) => profile.pathTypes.includes(p))) score += 2;

  if (ability.tags.includes('milestone') || ability.tags.includes('weight')) {
    score -= 0.4;
  }

  if (ability.tags.includes('beginner') && profile.baselineEasy.includes('walk_10k')) {
    score -= 2;
  }

  return score;
}

function pickWithDiversity(
  ranked: BodyAbilityDefinition[],
  targetCount: number,
): BodyAbilityDefinition[] {
  const selected: BodyAbilityDefinition[] = [];
  const categoryCounts = new Map<BodyAbilityInterest, number>();
  const difficultyCounts: Record<BodyAbilityDifficulty, number> = {
    early: 0,
    middle: 0,
    late: 0,
    epic: 0,
  };
  let weightMilestones = 0;

  const difficultyCap = (d: BodyAbilityDifficulty) =>
    Math.max(1, Math.round(targetCount * DIFFICULTY_TARGETS[d]));

  for (const ability of ranked) {
    if (selected.length >= targetCount) break;

    if (
      (ability.tags.includes('weight') || ability.tags.includes('milestone')) &&
      weightMilestones >= 4
    ) {
      continue;
    }

    const catCount = categoryCounts.get(ability.category) ?? 0;
    if (catCount >= 5 && selected.length < targetCount - 2) {
      continue;
    }

    if (difficultyCounts[ability.difficulty] >= difficultyCap(ability.difficulty) + 1) {
      continue;
    }

    selected.push(ability);
    categoryCounts.set(ability.category, catCount + 1);
    difficultyCounts[ability.difficulty] += 1;
    if (ability.tags.includes('weight') || ability.tags.includes('milestone')) {
      weightMilestones += 1;
    }
  }

  if (selected.length < targetCount) {
    for (const ability of ranked) {
      if (selected.length >= targetCount) break;
      if (selected.some((s) => s.id === ability.id)) continue;
      if (
        (ability.tags.includes('weight') || ability.tags.includes('milestone')) &&
        weightMilestones >= 5
      ) {
        continue;
      }
      selected.push(ability);
      if (ability.tags.includes('weight') || ability.tags.includes('milestone')) {
        weightMilestones += 1;
      }
    }
  }

  return selected;
}

export function selectPersonalBodyAbilities(
  profile: BodyAbilityProfile,
  bank: BodyAbilityDefinition[] = BODY_ABILITY_BANK,
  options?: {
    targetCount?: number;
    minCount?: number;
    maxCount?: number;
  },
): BodyAbilityDefinition[] {
  const minCount = options?.minCount ?? 20;
  const maxCount = options?.maxCount ?? 30;
  const targetCount = Math.min(
    maxCount,
    Math.max(minCount, options?.targetCount ?? 24),
  );

  const filtered = bank.filter((ability) => {
    if (!ability.goalBands.includes(profile.goalBand)) return false;
    if (isHiddenByTopics(ability, profile.hiddenTopics)) return false;
    if (isExcludedByBaseline(ability, profile.baselineEasy)) return false;
    return true;
  });

  const ranked = [...filtered].sort(
    (a, b) => scoreAbility(b, profile) - scoreAbility(a, profile),
  );

  let selected = pickWithDiversity(ranked, targetCount);

  if (selected.length < minCount) {
    const fallback = bank
      .filter((ability) => {
        if (selected.some((s) => s.id === ability.id)) return false;
        if (isHiddenByTopics(ability, profile.hiddenTopics)) return false;
        if (isExcludedByBaseline(ability, profile.baselineEasy)) return false;
        return (
          ability.tags.some((t) => UNIVERSAL_FALLBACK_TAGS.has(t)) ||
          ability.category === 'confidence' ||
          ability.category === 'sleep_resource'
        );
      })
      .sort((a, b) => scoreAbility(b, profile) - scoreAbility(a, profile));

    for (const ability of fallback) {
      if (selected.length >= minCount) break;
      selected.push(ability);
    }
  }

  if (selected.length > maxCount) {
    selected = selected.slice(0, maxCount);
  }

  return selected;
}
