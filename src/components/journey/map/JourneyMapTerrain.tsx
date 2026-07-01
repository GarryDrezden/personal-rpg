import type { ReactNode } from 'react';
import { JOURNEY_MAP_VIEWBOX, type JourneyMapStageConfig } from '../../../constants/journeyMapConfig';

type JourneyMapTerrainProps = {
  configs: JourneyMapStageConfig[];
  fogStartPercent: number;
};

const TERRAIN_GLYPH: Record<
  JourneyMapStageConfig['terrainType'],
  (x: number, y: number) => ReactNode
> = {
  forest: (x, y) => (
    <g transform={`translate(${x}, ${y})`} opacity={0.35}>
      <path d="M0 -10 L6 4 L-6 4 Z" fill="rgba(34, 197, 94, 0.25)" stroke="rgba(74, 222, 128, 0.2)" />
      <path d="M-8 -6 L-2 6 L-14 6 Z" fill="rgba(34, 197, 94, 0.18)" />
      <path d="M8 -4 L14 8 L2 8 Z" fill="rgba(34, 197, 94, 0.18)" />
    </g>
  ),
  mountain: (x, y) => (
    <g transform={`translate(${x}, ${y})`} opacity={0.4}>
      <path d="M-14 8 L0 -14 L14 8 Z" fill="rgba(71, 85, 105, 0.5)" stroke="rgba(148, 163, 184, 0.25)" />
      <path d="M-6 8 L4 -6 L14 8 Z" fill="rgba(51, 65, 85, 0.45)" />
    </g>
  ),
  lake: (x, y) => (
    <ellipse
      cx={x}
      cy={y}
      rx={22}
      ry={10}
      fill="rgba(56, 189, 248, 0.12)"
      stroke="rgba(125, 211, 252, 0.2)"
      opacity={0.55}
    />
  ),
  ruins: (x, y) => (
    <g transform={`translate(${x}, ${y})`} opacity={0.35}>
      <rect x={-10} y={-4} width={8} height={14} fill="rgba(100, 116, 139, 0.35)" />
      <rect x={2} y={-10} width={10} height={20} fill="rgba(71, 85, 105, 0.4)" />
    </g>
  ),
  plateau: (x, y) => (
    <path
      d={`M ${x - 18} ${y + 6} L ${x} ${y - 4} L ${x + 20} ${y + 4} L ${x + 14} ${y + 10} L ${x - 12} ${y + 10} Z`}
      fill="rgba(51, 65, 85, 0.3)"
      stroke="rgba(148, 163, 184, 0.15)"
      opacity={0.45}
    />
  ),
  fortress: (x, y) => (
    <g transform={`translate(${x}, ${y})`} opacity={0.38}>
      <rect x={-12} y={-8} width={24} height={16} fill="rgba(30, 41, 59, 0.55)" stroke="rgba(212, 175, 55, 0.2)" />
      <rect x={-4} y={-14} width={8} height={8} fill="rgba(51, 65, 85, 0.6)" />
    </g>
  ),
  mist: (x, y) => (
    <ellipse
      cx={x}
      cy={y}
      rx={28}
      ry={12}
      fill="rgba(148, 163, 184, 0.08)"
      stroke="rgba(203, 213, 225, 0.12)"
      opacity={0.5}
    />
  ),
};

/** Decorative terrain, contours, compass — rendered inside the map SVG. */
export function JourneyMapTerrain({ configs, fogStartPercent }: JourneyMapTerrainProps) {
  const { w, h } = JOURNEY_MAP_VIEWBOX;
  const fogX = (fogStartPercent / 100) * w;

  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="jmap-v2-fog" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0)" />
          <stop offset="35%" stopColor="rgba(15, 23, 42, 0.55)" />
          <stop offset="100%" stopColor="rgba(8, 12, 20, 0.82)" />
        </linearGradient>
        <radialGradient id="jmap-v2-lake-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
          <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
        </radialGradient>
      </defs>

      {/* Elevation contours */}
      <path
        d={`M 0 ${h * 0.75} Q ${w * 0.2} ${h * 0.6} ${w * 0.4} ${h * 0.68} T ${w * 0.65} ${h * 0.58} T ${w} ${h * 0.72}`}
        fill="none"
        stroke="rgba(148, 163, 184, 0.09)"
        strokeWidth={1.5}
      />
      <path
        d={`M 0 ${h * 0.85} Q ${w * 0.28} ${h * 0.78} ${w * 0.52} ${h * 0.82} T ${w} ${h * 0.8}`}
        fill="none"
        stroke="rgba(148, 163, 184, 0.06)"
        strokeWidth={1}
      />

      {/* Large mountain ranges */}
      <path
        d={`M ${w * 0.02} ${h * 0.42} L ${w * 0.14} ${h * 0.18} L ${w * 0.26} ${h * 0.38} L ${w * 0.1} ${h * 0.5} Z`}
        fill="rgba(30, 41, 59, 0.4)"
        stroke="rgba(100, 116, 139, 0.12)"
        strokeWidth={1}
      />
      <path
        d={`M ${w * 0.55} ${h * 0.22} L ${w * 0.7} ${h * 0.06} L ${w * 0.86} ${h * 0.2} L ${w * 0.76} ${h * 0.38} Z`}
        fill="rgba(15, 23, 42, 0.5)"
        stroke="rgba(100, 116, 139, 0.1)"
        strokeWidth={1}
      />

      {/* Central lake */}
      <ellipse cx={w * 0.38} cy={h * 0.62} rx={w * 0.08} ry={h * 0.05} fill="url(#jmap-v2-lake-glow)" />

      {configs.map((config) => {
        const x = (config.desktop.nodeX / 100) * w;
        const y = (config.desktop.nodeY / 100) * h;
        const offsetY = config.desktop.cardSide === 'top' ? 28 : -28;
        const render = TERRAIN_GLYPH[config.terrainType];
        return (
          <g key={`terrain-${config.id}`}>{render(x, y + offsetY)}</g>
        );
      })}

      {/* Runic marks */}
      {[0.1, 0.5, 0.9].map((xp) => (
        <g key={xp} transform={`translate(${w * xp}, ${h * 0.9})`} opacity={0.18}>
          <path d="M-6 0 L0 -8 L6 0 L0 8 Z" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth={0.8} />
        </g>
      ))}

      {/* Fog over future territory */}
      <rect
        x={Math.max(0, fogX - w * 0.08)}
        y={0}
        width={w - Math.max(0, fogX - w * 0.08)}
        height={h}
        fill="url(#jmap-v2-fog)"
        pointerEvents="none"
      />

      {/* Compass rose */}
      <g transform={`translate(${w - 88}, ${h - 92})`} opacity={0.45}>
        <circle r={34} fill="rgba(15, 23, 42, 0.35)" stroke="rgba(148, 163, 184, 0.35)" strokeWidth={1} />
        <circle r={26} fill="none" stroke="rgba(212, 175, 55, 0.25)" strokeWidth={0.75} />
        <path d="M0 -26 L5 0 L0 26 L-5 0 Z" fill="rgba(203, 213, 225, 0.55)" />
        <path d="M-26 0 L0 -5 L26 0 L0 5 Z" fill="rgba(100, 116, 139, 0.45)" />
        <text y={46} textAnchor="middle" fill="rgba(203, 213, 225, 0.5)" fontSize={10} fontWeight={600}>
          N
        </text>
      </g>
    </g>
  );
}
