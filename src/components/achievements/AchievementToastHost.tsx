import { useAchievementStore } from '../../store/achievementStore';
import { AchievementToast } from './AchievementToast';

export function AchievementToastHost() {
  const toastQueue = useAchievementStore((s) => s.toastQueue);
  const dismissToast = useAchievementStore((s) => s.dismissToast);
  const current = toastQueue[0];

  if (!current) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 left-0 right-0 z-[60] flex justify-center px-4 md:bottom-6 md:left-auto md:right-6 md:justify-end">
      <AchievementToast achievement={current} onDismiss={dismissToast} />
    </div>
  );
}
