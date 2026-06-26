import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCoinStore } from '../../store/coinStore';
import { calculateFreedomScore } from '../../utils/freedomScoreEngine';
import { getNewFreedomLevelUnlock } from '../../utils/freedomUnlockStorage';
import { confirmFreedomLevelUnlock } from '../../utils/freedomRewardEngine';
import { FreedomLevelUnlockModal } from './FreedomLevelUnlockModal';
import type { FreedomLevelUnlock } from '../../types/freedomUnlock';

export function FreedomLevelUnlockHost() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { themeId } = useAppTheme();
  const addEarnedOnce = useCoinStore((s) => s.addEarnedOnce);
  const [pending, setPending] = useState<FreedomLevelUnlock | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const freedomScore = useMemo(
    () => calculateFreedomScore({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  useEffect(() => {
    const unlock = getNewFreedomLevelUnlock({
      currentLevelId: freedomScore.level.id,
      currentScore: freedomScore.score,
    });

    if (!unlock) {
      setPending(null);
      return;
    }

    if (dismissedId === unlock.levelId) {
      return;
    }

    setPending(unlock);
  }, [freedomScore.level.id, freedomScore.score, dismissedId]);

  const handleClose = () => {
    if (pending) {
      confirmFreedomLevelUnlock(pending, addEarnedOnce);
      setDismissedId(pending.levelId);
      setPending(null);
    }
  };

  return (
    <FreedomLevelUnlockModal unlock={pending} themeId={themeId} onClose={handleClose} />
  );
}
