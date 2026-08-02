import { describe, expect, it } from 'vitest';
import type { BodyAbilityPersonalItem } from '../types/bodyAbilityPersonal';
import {
  BODY_ABILITY_MAP_FILTERS,
  filterPersonalAbilityItems,
  getBodyAbilityMapFilterLabel,
  getBodyAbilityStatusLabel,
  getFreedomMapPageCopy,
  isConfirmableAbility,
  isLongPathAbility,
  sortPersonalAbilityItems,
} from './bodyAbilityFreedomUi';

function item(
  id: string,
  status: BodyAbilityPersonalItem['user']['status'],
  difficulty: BodyAbilityPersonalItem['definition']['difficulty'] = 'early',
  unlockMode: BodyAbilityPersonalItem['definition']['unlockMode'] = 'manual',
): BodyAbilityPersonalItem {
  return {
    definition: {
      id,
      title: id,
      description: 'd',
      category: 'confidence',
      goalBands: ['under_10'],
      unlockMode,
      difficulty,
      kind: 'body_change',
      tags: [],
      scoreWeight: 1,
    },
    user: {
      abilityId: id,
      status,
      selectedAt: '2026-08-02T00:00:00.000Z',
    },
  };
}

describe('bodyAbilityFreedomUi', () => {
  const sample = [
    item('a', 'locked', 'early', 'manual'),
    item('b', 'suggested', 'middle', 'suggested_confirmation'),
    item('c', 'unlocked', 'late', 'auto'),
    item('d', 'locked', 'epic', 'auto'),
  ];

  it('exposes the four map filters', () => {
    expect(BODY_ABILITY_MAP_FILTERS).toEqual([
      'all',
      'confirmable',
      'unlocked',
      'long_path',
    ]);
  });

  it('filters confirmable / unlocked / long path', () => {
    expect(filterPersonalAbilityItems(sample, 'all')).toHaveLength(4);
    expect(filterPersonalAbilityItems(sample, 'confirmable').map((i) => i.definition.id)).toEqual([
      'a',
      'b',
    ]);
    expect(filterPersonalAbilityItems(sample, 'unlocked').map((i) => i.definition.id)).toEqual([
      'c',
    ]);
    expect(filterPersonalAbilityItems(sample, 'long_path').map((i) => i.definition.id)).toEqual([
      'c',
      'd',
    ]);
  });

  it('sorts suggested before unlocked before locked', () => {
    const sorted = sortPersonalAbilityItems(sample).map((i) => i.user.status);
    expect(sorted[0]).toBe('suggested');
    expect(sorted[1]).toBe('unlocked');
  });

  it('marks long-path and confirmable helpers', () => {
    expect(isLongPathAbility(item('x', 'locked', 'epic'))).toBe(true);
    expect(isLongPathAbility(item('y', 'locked', 'early'))).toBe(false);
    expect(isConfirmableAbility(item('s', 'suggested'))).toBe(true);
    expect(isConfirmableAbility(item('m', 'locked', 'early', 'manual'))).toBe(true);
    expect(isConfirmableAbility(item('auto', 'locked', 'early', 'auto'))).toBe(false);
  });

  it('uses cozy vs dark fantasy labels without changing state logic', () => {
    expect(getBodyAbilityMapFilterLabel('unlocked', 'cozy')).toBe('Уже светит');
    expect(getBodyAbilityMapFilterLabel('unlocked', 'darkFantasy')).toBe('Печати сняты');
    expect(getBodyAbilityStatusLabel('unlocked', 'cozy')).toBe('Открыто');
    expect(getBodyAbilityStatusLabel('unlocked', 'darkFantasy')).toBe('Печать снята');
    expect(getBodyAbilityStatusLabel('locked', 'darkFantasy')).toBe('Под печатью');
  });

  it('page copy differs by theme and keeps setup CTA wording', () => {
    const cozy = getFreedomMapPageCopy('cozy');
    const dark = getFreedomMapPageCopy('darkFantasy');
    expect(cozy.setupCta).toBe('Настроить карту тела');
    expect(dark.setupCta).toBe('Настроить карту тела');
    expect(cozy.intro).toMatch(/тепл|дом|тело/i);
    expect(dark.intro).toMatch(/печат|артефакт|путь/i);
    expect(cozy.archivedTitle).toBe('Уже открыто ранее');
    expect(dark.archivedTitle).toBe('Уже открыто ранее');
  });
});
