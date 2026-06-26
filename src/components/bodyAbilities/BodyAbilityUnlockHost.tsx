import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getAllBodyAbilityProgress } from '../../utils/bodyAbilityEngine';
import {
  getNewlyUnlockedBodyAbilities,
  markBodyAbilitySeen,
} from '../../utils/bodyAbilityStorage';
import { BodyAbilityUnlockModal } from './BodyAbilityUnlockModal';
import type { BodyAbilityProgress } from '../../types/bodyAbilities';

export function BodyAbilityUnlockHost() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { themeId } = useAppTheme();
  const [queue, setQueue] = useState<BodyAbilityProgress[]>([]);

  const allProgress = useMemo(
    () => getAllBodyAbilityProgress({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  useEffect(() => {
    const newly = getNewlyUnlockedBodyAbilities(allProgress);
    if (newly.length === 0) return;

    setQueue((prev) => {
      const ids = new Set(prev.map((p) => p.ability.id));
      const toAdd = newly.filter((p) => !ids.has(p.ability.id));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, [allProgress]);

  const current = queue[0] ?? null;

  const handleClose = () => {
    if (current) {
      markBodyAbilitySeen(current.ability.id);
    }
    setQueue((prev) => prev.slice(1));
  };

  return (
    <BodyAbilityUnlockModal
      abilityProgress={current}
      themeId={themeId}
      onClose={handleClose}
    />
  );
}
