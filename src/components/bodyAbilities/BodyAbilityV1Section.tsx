import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import {
  BODY_ABILITY_V1_CATEGORIES,
  BODY_ABILITIES_V1,
} from '../../game/bodyAbilities/bodyAbilityConfig';
import {
  getBodyAbilityV1Items,
  getBodyAbilityV1Summary,
} from '../../game/bodyAbilities/bodyAbilityV1Engine';
import type { BodyAbilityV1Category } from '../../types/bodyAbilityV1';
import { useBodyAbilityV1Actions } from '../../hooks/useBodyAbilityV1Actions';
import { BodyAbilityV1Card } from './BodyAbilityV1Card';

export function BodyAbilityV1Section() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { unlockAbility } = useBodyAbilityV1Actions();
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);

  const params = useMemo(
    () => ({ settings, dailyEntries, measurements }),
    [settings, dailyEntries, measurements],
  );

  const items = useMemo(() => getBodyAbilityV1Items(params), [params]);
  const summary = useMemo(() => getBodyAbilityV1Summary(params), [params]);

  const byCategory = useMemo(() => {
    const map = new Map<BodyAbilityV1Category, typeof items>();
    for (const cat of Object.keys(BODY_ABILITY_V1_CATEGORIES) as BodyAbilityV1Category[]) {
      map.set(
        cat,
        items.filter((i) => i.ability.category === cat),
      );
    }
    return map;
  }, [items]);

  const handleUnlock = async (abilityId: string) => {
    const ability = BODY_ABILITIES_V1.find((a) => a.id === abilityId);
    if (!ability) return;
    setUnlockingId(abilityId);
    try {
      const result = await unlockAbility(ability, 'manual');
      if (result.unlocked) setReaction(result.reaction);
    } finally {
      setUnlockingId(null);
    }
  };

  return (
    <section data-testid="body-abilities-v1-section" className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Наблюдения в жизни</h2>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          Вес стоит, но персонаж не стоит. Отмечай способности, которые заметил сам — это
          наблюдение, а не медицинский диагноз.
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--app-primary)]">
          Открыто: {summary.unlockedCount} / {summary.totalCount}
        </p>
      </div>

      {reaction ? (
        <p
          role="status"
          className="rounded-xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/50 px-4 py-3 text-sm text-[var(--app-text)]"
        >
          {reaction}
        </p>
      ) : null}

      {(
        Object.entries(BODY_ABILITY_V1_CATEGORIES) as [
          BodyAbilityV1Category,
          (typeof BODY_ABILITY_V1_CATEGORIES)[BodyAbilityV1Category],
        ][]
      ).map(([category, meta]) => {
        const categoryItems = byCategory.get(category) ?? [];
        if (categoryItems.length === 0) return null;
        return (
          <div key={category}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
              {meta.label}
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {categoryItems.map((item) => (
                <BodyAbilityV1Card
                  key={item.ability.id}
                  item={item}
                  unlocking={unlockingId === item.ability.id}
                  onUnlock={() => void handleUnlock(item.ability.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
