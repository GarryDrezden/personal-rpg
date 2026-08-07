import type { CSSProperties, ReactNode } from 'react';
import type { HeroStateLevel } from '../../types/avatarStages';
import type { AppThemeId } from '../../types/theme';
import { getHeroStateLabel } from '../../game/avatar/avatarStageEngine';
import {
  getAvatarHeroStateOverlayPath,
} from '../../constants/avatarAssetManifest';
import { gameAsset } from '../../game/assetBase';

type HeroStateChromeProps = {
  themeId: AppThemeId;
  heroState: HeroStateLevel;
  children: ReactNode;
  /** Accessible text besides color. */
  showLabel?: boolean;
  /** Soft state overlay SVG — off on dashboard scene to avoid a boxed frame. */
  showOverlay?: boolean;
  className?: string;
};

const STATE_FILTER: Record<HeroStateLevel, string> = {
  depleted: 'saturate(0.82) brightness(0.92)',
  steady: 'none',
  energized: 'saturate(1.05) brightness(1.02)',
  strong: 'saturate(1.08) brightness(1.04)',
};

const STATE_GLOW: Record<HeroStateLevel, string> = {
  depleted: 'transparent',
  steady: 'transparent',
  energized: 'color-mix(in srgb, var(--app-primary) 28%, transparent)',
  strong: 'color-mix(in srgb, var(--app-gold) 35%, transparent)',
};

/**
 * Hero State presentation layer — never swaps body silhouette art.
 */
export function HeroStateChrome({
  themeId,
  heroState,
  children,
  showLabel = true,
  showOverlay = true,
  className = '',
}: HeroStateChromeProps) {
  const label = getHeroStateLabel(heroState);
  const overlaySrc = gameAsset(getAvatarHeroStateOverlayPath(themeId, heroState));
  const style: CSSProperties = {
    filter: STATE_FILTER[heroState],
  };

  return (
    <div
      className={`relative ${className}`}
      data-testid="hero-state-chrome"
      data-hero-state={heroState}
    >
      <div
        className="pointer-events-none absolute inset-x-[8%] bottom-[4%] z-0 h-[18%] rounded-[100%] blur-xl"
        style={{ background: STATE_GLOW[heroState] }}
        aria-hidden
      />
      <div className="relative z-10 h-full w-full" style={style}>
        {children}
      </div>
      {showOverlay ? (
        <img
          src={overlaySrc}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain opacity-90"
          data-testid="hero-state-overlay"
        />
      ) : null}
      {showLabel ? (
        <p
          className="relative z-30 mt-1 text-center text-[11px] font-medium text-[var(--app-text-muted)]"
          data-testid="hero-state-chrome-label"
        >
          Состояние: {label}
        </p>
      ) : (
        <span className="sr-only">Состояние героя: {label}</span>
      )}
    </div>
  );
}
