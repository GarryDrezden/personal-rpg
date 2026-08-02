import type {
  BodyAbilityDefinition,
  BodyAbilityDifficulty,
  BodyAbilityInterest,
  BodyAbilityKind,
  BodyAbilityProfile,
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

export type SelectionRejectReason =
  | 'goalBand'
  | 'hiddenTopics'
  | 'baselineEasy';

export type ExplainedSelectedAbility = {
  abilityId: string;
  title: string;
  finalScore: number;
  matchedGoalBand: boolean;
  matchedInterests: BodyAbilityInterest[];
  matchedPathTypes: string[];
  difficulty: BodyAbilityDifficulty;
  category: BodyAbilityInterest;
  kind: BodyAbilityKind;
  unlockMode: BodyAbilityDefinition['unlockMode'];
  whySelected: string[];
  viaFallback: boolean;
};

export type BodyAbilitySelectionExplanation = {
  selected: ExplainedSelectedAbility[];
  rejectedExamples: Array<{
    abilityId: string;
    title: string;
    reason: SelectionRejectReason;
  }>;
  stats: {
    count: number;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
    byKind: Record<string, number>;
    byUnlockMode: Record<string, number>;
    weightMilestoneCount: number;
    subjectiveCount: number;
    habitRouteCount: number;
    universalCount: number;
  };
};

/** True when ability must leave the active grid due to hiddenTopics. */
export function isBodyAbilityHiddenByTopics(
  ability: BodyAbilityDefinition,
  hidden: BodyAbilityProfile['hiddenTopics'],
): boolean {
  if (ability.hiddenByTopics?.some((t) => hidden.includes(t))) return true;
  const byCategory = CATEGORY_HIDDEN_TOPIC[ability.category];
  if (byCategory && hidden.includes(byCategory)) return true;
  if (ability.tags.includes('weight') && hidden.includes('weight')) return true;
  return false;
}

function isHiddenByTopics(
  ability: BodyAbilityDefinition,
  hidden: BodyAbilityProfile['hiddenTopics'],
): boolean {
  return isBodyAbilityHiddenByTopics(ability, hidden);
}

function isExcludedByBaseline(
  ability: BodyAbilityDefinition,
  baseline: BodyAbilityProfile['baselineEasy'],
): boolean {
  if (!ability.excludedByBaselineEasy?.length) return false;
  return ability.excludedByBaselineEasy.some((b) => baseline.includes(b));
}

function matchedInterests(
  ability: BodyAbilityDefinition,
  profile: BodyAbilityProfile,
): BodyAbilityInterest[] {
  const hits: BodyAbilityInterest[] = [];
  if (profile.interests.includes(ability.category)) hits.push(ability.category);
  for (const c of ability.secondaryCategories ?? []) {
    if (profile.interests.includes(c) && !hits.includes(c)) hits.push(c);
  }
  return hits;
}

function isWeightMilestone(ability: BodyAbilityDefinition): boolean {
  return (
    ability.kind === 'milestone' ||
    ability.tags.includes('weight') ||
    ability.tags.includes('milestone')
  );
}

function isUniversal(ability: BodyAbilityDefinition): boolean {
  return ability.tags.some((t) => UNIVERSAL_FALLBACK_TAGS.has(t));
}

function athleticBaseline(profile: BodyAbilityProfile): boolean {
  const need = ['walk_10k', 'walk_15k', 'stairs_ok', 'training_ok'] as const;
  return need.filter((b) => profile.baselineEasy.includes(b)).length >= 3;
}

function scoreAbility(
  ability: BodyAbilityDefinition,
  profile: BodyAbilityProfile,
): { score: number; reasons: string[] } {
  let score = ability.scoreWeight;
  const reasons: string[] = [`baseWeight:${ability.scoreWeight}`];

  if (ability.goalBands.includes(profile.goalBand)) {
    score += 2;
    reasons.push('goalBand');
  }

  const interests = matchedInterests(ability, profile);
  if (interests.length) {
    score += 3 + Math.min(2, interests.length - 1);
    reasons.push(`interests:${interests.join('+')}`);
  }

  const paths = (ability.pathTypes ?? []).filter((p) => profile.pathTypes.includes(p));
  if (paths.length) {
    score += 2 + Math.min(1.5, (paths.length - 1) * 0.5);
    reasons.push(`pathTypes:${paths.join('+')}`);
  }

  if (isWeightMilestone(ability)) {
    if (profile.interests.includes('measurements') || profile.pathTypes.includes('shape_tuning')) {
      score += 1.2;
      reasons.push('milestoneBoost');
    } else {
      score -= 0.6;
      reasons.push('milestoneSoftPenalty');
    }
  }

  if (isUniversal(ability)) {
    score -= 1.5;
    reasons.push('universalPenalty');
  }

  if (ability.tags.includes('beginner') && profile.baselineEasy.includes('walk_10k')) {
    score -= 3;
    reasons.push('beginnerVsWalkBaseline');
  }

  if (athleticBaseline(profile)) {
    if (
      ability.kind === 'functional_change' ||
      ability.tags.includes('functional_limitation') ||
      ability.category === 'stairs_routes' ||
      ability.category === 'daily_life'
    ) {
      score -= 2.5;
      reasons.push('athleticBaselineSoftDownrank');
    }
    if (
      ability.category === 'sport_training' ||
      ability.category === 'strength' ||
      ability.pathTypes?.includes('athlete_return')
    ) {
      score += 1.5;
      reasons.push('athleticBoost');
    }
  }

  if (
    profile.pathTypes.includes('appearance_focus') &&
    (ability.category === 'appearance' || ability.tags.includes('clothes'))
  ) {
    score += 1;
    reasons.push('appearanceFocus');
  }

  return { score, reasons };
}

function categoryCap(targetCount: number): number {
  return Math.max(3, Math.floor(targetCount * 0.25));
}

function weightCap(targetCount: number): number {
  return Math.max(2, Math.floor(targetCount * 0.2));
}

function universalCap(): number {
  return 3;
}

type Ranked = {
  ability: BodyAbilityDefinition;
  score: number;
  reasons: string[];
};

function pickWithQuality(
  ranked: Ranked[],
  profile: BodyAbilityProfile,
  targetCount: number,
): { selected: Ranked[]; viaFallbackIds: Set<string> } {
  const selected: Ranked[] = [];
  const viaFallbackIds = new Set<string>();
  const categoryCounts = new Map<BodyAbilityInterest, number>();
  const difficultyCounts: Record<BodyAbilityDifficulty, number> = {
    early: 0,
    middle: 0,
    late: 0,
    epic: 0,
  };
  const kindCounts: Record<BodyAbilityKind, number> = {
    body_change: 0,
    functional_change: 0,
    route_mastery: 0,
    milestone: 0,
  };
  let weightMilestones = 0;
  let universalCount = 0;

  const difficultyCap = (d: BodyAbilityDifficulty) =>
    Math.max(1, Math.round(targetCount * DIFFICULTY_TARGETS[d]) + 1);

  const tryAdd = (row: Ranked, asFallback = false): boolean => {
    const { ability } = row;
    if (selected.some((s) => s.ability.id === ability.id)) return false;
    if (isHiddenByTopics(ability, profile.hiddenTopics)) return false;
    if (isExcludedByBaseline(ability, profile.baselineEasy)) return false;

    const catCount = categoryCounts.get(ability.category) ?? 0;
    if (catCount >= categoryCap(targetCount)) return false;

    if (isWeightMilestone(ability) && weightMilestones >= weightCap(targetCount)) {
      return false;
    }

    if (isUniversal(ability) && universalCount >= universalCap()) return false;

    if (difficultyCounts[ability.difficulty] >= difficultyCap(ability.difficulty)) {
      return false;
    }

    // Keep route_mastery from dominating the map.
    if (
      ability.kind === 'route_mastery' &&
      kindCounts.route_mastery >= Math.ceil(targetCount * 0.45)
    ) {
      return false;
    }

    selected.push(row);
    categoryCounts.set(ability.category, catCount + 1);
    difficultyCounts[ability.difficulty] += 1;
    kindCounts[ability.kind] += 1;
    if (isWeightMilestone(ability)) weightMilestones += 1;
    if (isUniversal(ability)) universalCount += 1;
    if (asFallback) viaFallbackIds.add(ability.id);
    return true;
  };

  // Pass 1: interest-matched first
  for (const row of ranked) {
    if (selected.length >= targetCount) break;
    if (!matchedInterests(row.ability, profile).length) continue;
    tryAdd(row);
  }

  // Pass 2: remaining ranked
  for (const row of ranked) {
    if (selected.length >= targetCount) break;
    tryAdd(row);
  }

  // Ensure minimum early / subjective / epic / interest coverage with second soft pass
  const ensure = (
    predicate: (a: BodyAbilityDefinition) => boolean,
    min: number,
  ) => {
    let have = selected.filter((s) => predicate(s.ability)).length;
    if (have >= min) return;
    for (const row of ranked) {
      if (have >= min || selected.length >= targetCount + 2) break;
      if (!predicate(row.ability)) continue;
      if (tryAdd(row)) have += 1;
    }
  };

  ensure((a) => a.difficulty === 'early', 3);
  ensure(
    (a) => a.unlockMode === 'suggested_confirmation' || a.unlockMode === 'manual',
    3,
  );
  ensure((a) => a.difficulty === 'epic' || a.difficulty === 'late', 2);
  ensure((a) => matchedInterests(a, profile).length > 0, 3);

  // Trim if we overshot while ensuring
  while (selected.length > targetCount) {
    // Drop lowest-score universal first, else lowest score
    let dropIdx = -1;
    let dropScore = Infinity;
    selected.forEach((s, idx) => {
      const penalty = isUniversal(s.ability) ? -10 : 0;
      const score = s.score + penalty;
      if (score < dropScore) {
        dropScore = score;
        dropIdx = idx;
      }
    });
    if (dropIdx < 0) break;
    selected.splice(dropIdx, 1);
  }

  return { selected, viaFallbackIds };
}

function fallbackFill(
  selected: Ranked[],
  viaFallbackIds: Set<string>,
  profile: BodyAbilityProfile,
  bank: BodyAbilityDefinition[],
  minCount: number,
): Ranked[] {
  if (selected.length >= minCount) return selected;

  const fallback = bank
    .filter((ability) => {
      if (selected.some((s) => s.ability.id === ability.id)) return false;
      if (isHiddenByTopics(ability, profile.hiddenTopics)) return false;
      if (isExcludedByBaseline(ability, profile.baselineEasy)) return false;
      // Never reintroduce baseline-excluded or functional limitations via fallback.
      if (ability.tags.includes('functional_limitation')) return false;
      if (ability.kind === 'functional_change' && athleticBaseline(profile)) return false;
      return (
        isUniversal(ability) ||
        ability.category === 'confidence' ||
        ability.category === 'sleep_resource' ||
        ability.category === 'nutrition_control'
      );
    })
    .map((ability) => {
      const { score, reasons } = scoreAbility(ability, profile);
      return { ability, score, reasons: [...reasons, 'fallbackPool'] };
    })
    .sort((a, b) => b.score - a.score);

  const next = [...selected];
  for (const row of fallback) {
    if (next.length >= minCount) break;
    if (isUniversal(row.ability)) {
      const universals = next.filter((s) => isUniversal(s.ability)).length;
      if (universals >= universalCap()) continue;
    }
    next.push(row);
    viaFallbackIds.add(row.ability.id);
  }
  return next;
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
  return explainBodyAbilitySelection(profile, bank, options).selected.map((s) => {
    const def = bank.find((b) => b.id === s.abilityId);
    return def!;
  });
}

export function explainBodyAbilitySelection(
  profile: BodyAbilityProfile,
  bank: BodyAbilityDefinition[] = BODY_ABILITY_BANK,
  options?: {
    targetCount?: number;
    minCount?: number;
    maxCount?: number;
  },
): BodyAbilitySelectionExplanation {
  const minCount = options?.minCount ?? 20;
  const maxCount = options?.maxCount ?? 30;
  const targetCount = Math.min(
    maxCount,
    Math.max(minCount, options?.targetCount ?? 24),
  );

  const rejectedExamples: BodyAbilitySelectionExplanation['rejectedExamples'] = [];
  const filtered: BodyAbilityDefinition[] = [];

  for (const ability of bank) {
    if (!ability.goalBands.includes(profile.goalBand)) {
      if (rejectedExamples.filter((r) => r.reason === 'goalBand').length < 8) {
        rejectedExamples.push({
          abilityId: ability.id,
          title: ability.title,
          reason: 'goalBand',
        });
      }
      continue;
    }
    if (isHiddenByTopics(ability, profile.hiddenTopics)) {
      if (rejectedExamples.filter((r) => r.reason === 'hiddenTopics').length < 8) {
        rejectedExamples.push({
          abilityId: ability.id,
          title: ability.title,
          reason: 'hiddenTopics',
        });
      }
      continue;
    }
    if (isExcludedByBaseline(ability, profile.baselineEasy)) {
      if (rejectedExamples.filter((r) => r.reason === 'baselineEasy').length < 8) {
        rejectedExamples.push({
          abilityId: ability.id,
          title: ability.title,
          reason: 'baselineEasy',
        });
      }
      continue;
    }
    filtered.push(ability);
  }

  const ranked: Ranked[] = filtered
    .map((ability) => {
      const { score, reasons } = scoreAbility(ability, profile);
      return { ability, score, reasons };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.ability.id.localeCompare(b.ability.id);
    });

  let { selected, viaFallbackIds } = pickWithQuality(ranked, profile, targetCount);
  selected = fallbackFill(selected, viaFallbackIds, profile, bank, minCount);

  if (selected.length > maxCount) {
    selected = selected
      .sort((a, b) => b.score - a.score || a.ability.id.localeCompare(b.ability.id))
      .slice(0, maxCount);
  }

  // Stable order by score then id
  selected.sort((a, b) => b.score - a.score || a.ability.id.localeCompare(b.ability.id));

  const explained: ExplainedSelectedAbility[] = selected.map((row) => {
    const interests = matchedInterests(row.ability, profile);
    const paths = (row.ability.pathTypes ?? []).filter((p) =>
      profile.pathTypes.includes(p),
    );
    return {
      abilityId: row.ability.id,
      title: row.ability.title,
      finalScore: Number(row.score.toFixed(2)),
      matchedGoalBand: row.ability.goalBands.includes(profile.goalBand),
      matchedInterests: interests,
      matchedPathTypes: paths,
      difficulty: row.ability.difficulty,
      category: row.ability.category,
      kind: row.ability.kind,
      unlockMode: row.ability.unlockMode,
      whySelected: row.reasons,
      viaFallback: viaFallbackIds.has(row.ability.id),
    };
  });

  const byCategory: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};
  const byKind: Record<string, number> = {};
  const byUnlockMode: Record<string, number> = {};
  let weightMilestoneCount = 0;
  let subjectiveCount = 0;
  let habitRouteCount = 0;
  let universalCount = 0;

  for (const row of selected) {
    const a = row.ability;
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
    byDifficulty[a.difficulty] = (byDifficulty[a.difficulty] ?? 0) + 1;
    byKind[a.kind] = (byKind[a.kind] ?? 0) + 1;
    byUnlockMode[a.unlockMode] = (byUnlockMode[a.unlockMode] ?? 0) + 1;
    if (isWeightMilestone(a)) weightMilestoneCount += 1;
    if (a.unlockMode === 'suggested_confirmation' || a.unlockMode === 'manual') {
      subjectiveCount += 1;
    }
    if (a.kind === 'route_mastery') habitRouteCount += 1;
    if (isUniversal(a)) universalCount += 1;
  }

  return {
    selected: explained,
    rejectedExamples,
    stats: {
      count: explained.length,
      byCategory,
      byDifficulty,
      byKind,
      byUnlockMode,
      weightMilestoneCount,
      subjectiveCount,
      habitRouteCount,
      universalCount,
    },
  };
}
