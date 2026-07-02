import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { useCoinStore } from '../store/coinStore';
import {
  getBodyAbilityV1UnlockReaction,
  unlockBodyAbilityV1,
} from '../game/bodyAbilities/bodyAbilityV1Engine';
import type { BodyAbilityV1Def } from '../types/bodyAbilityV1';
import { todayISO } from '../utils/dates';
import { addXpTransactionOnce } from '../utils/xpTransactionStorage';

const BODY_ABILITY_V1_COIN_REWARD = 3;
const BODY_ABILITY_V1_XP_REWARD = 15;

export function useBodyAbilityV1Actions() {
  const { settings, saveSettings } = useAppStore();
  const addEarnedOnce = useCoinStore((s) => s.addEarnedOnce);

  const unlockAbility = useCallback(
    async (ability: BodyAbilityV1Def, source: 'manual' | 'hint' = 'manual') => {
      const next = unlockBodyAbilityV1(settings, ability.id, source);
      if (next === settings) {
        return { unlocked: false, reaction: '' };
      }

      await saveSettings(next);

      const relatedId = `body_ability_v1_${ability.id}`;
      addEarnedOnce({
        id: `coin-${relatedId}`,
        type: 'bonus',
        source: 'achievement',
        amount: BODY_ABILITY_V1_COIN_REWARD,
        title: `Способность: ${ability.title}`,
        description: 'Наблюдение в жизни — не диагноз.',
        date: todayISO(),
        relatedId,
      });

      addXpTransactionOnce({
        id: `xp-${relatedId}`,
        source: 'achievement',
        relatedId,
        amount: BODY_ABILITY_V1_XP_REWARD,
        title: `Способность: ${ability.title}`,
        createdAt: new Date().toISOString(),
      });

      return {
        unlocked: true,
        reaction: getBodyAbilityV1UnlockReaction(ability),
      };
    },
    [settings, saveSettings, addEarnedOnce],
  );

  return { unlockAbility };
}
