import type { AssetUnlockStatus, GameAssetLayoutItem } from '../../types/gameAssets';
import type { GameAssetVariant } from './GameAssetPlaceholder';
import { GameAssetImage } from './GameAssetImage';

type GameAssetLayoutProps = {
  items: (GameAssetLayoutItem & { variant?: GameAssetVariant })[];
  className?: string;
  background?: 'none' | 'soft' | 'darkFantasy';
};

const backgroundClass: Record<NonNullable<GameAssetLayoutProps['background']>, string> = {
  none: '',
  soft: 'rounded-2xl border border-[var(--app-border)] bg-[var(--app-bg-soft)]',
  darkFantasy:
    'rounded-2xl border border-violet-500/25 bg-gradient-to-br from-[#171329] via-[#111022] to-[#090812] shadow-[var(--app-glow)]',
};

export function GameAssetLayout({
  items,
  className = '',
  background = 'soft',
}: GameAssetLayoutProps) {
  return (
    <div className={`relative aspect-[4/3] w-full ${backgroundClass[background]} ${className}`}>
      <div className="pointer-events-none absolute bottom-[10%] left-1/2 h-5 w-[50%] -translate-x-1/2 rounded-[100%] bg-black/10 blur-md" />
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.width}%`,
            height: `${item.height}%`,
            zIndex: item.zIndex ?? 1,
          }}
        >
          <GameAssetImage
            variant={item.variant ?? 'hero'}
            src={item.src}
            alt={item.alt}
            status={(item.status ?? 'unlocked') as AssetUnlockStatus}
            className="h-full w-full"
            imageClassName="object-contain object-bottom"
          />
        </div>
      ))}
    </div>
  );
}
