import { useEffect, useState } from 'react';
import type { BossCatalogStatus } from '../../utils/bossCatalog';

type BossPortraitProps = {
  imagePath: string;
  emoji: string;
  title: string;
  accent?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  catalogStatus?: BossCatalogStatus;
  className?: string;
};

const SIZE_CLASS = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
  xl: 'h-40 w-40 md:h-48 md:w-48',
};

export function BossPortrait({
  imagePath,
  emoji,
  title,
  accent = '#6366f1',
  size = 'md',
  catalogStatus,
  className = '',
}: BossPortraitProps) {
  const [failed, setFailed] = useState(false);
  const dimmed = catalogStatus === 'pending' || catalogStatus === 'failed';

  useEffect(() => {
    setFailed(false);
  }, [imagePath]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 shadow-inner ${SIZE_CLASS[size]} ${className}`}
      style={{
        borderColor: `color-mix(in srgb, ${accent} 45%, var(--app-border))`,
        background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${accent} 35%, transparent), var(--app-bg-soft))`,
      }}
    >
      {!failed ? (
        <img
          src={imagePath}
          alt={title}
          className={`h-full w-full object-cover object-center transition ${
            dimmed ? 'scale-105 opacity-35 grayscale' : ''
          }`}
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${
            dimmed ? 'opacity-40 grayscale' : ''
          }`}
        >
          <span className={size === 'sm' ? 'text-3xl' : size === 'md' ? 'text-5xl' : 'text-6xl'}>
            {emoji}
          </span>
        </div>
      )}
      {catalogStatus === 'pending' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            ???
          </span>
        </div>
      )}
      {(catalogStatus === 'defeated' || catalogStatus === 'perfect') && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wide text-white"
        >
          {catalogStatus === 'perfect' ? '★ Идеал' : 'Повержен'}
        </div>
      )}
    </div>
  );
}
