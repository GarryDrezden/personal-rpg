import { JOURNEY_MAP_VIEWBOX } from '../../../constants/journeyMapLayout';

type JourneyMapBackgroundProps = {
  fogStartPercent: number;
};

/** Decorative terrain, contours, compass — rendered inside the map SVG. */
export function JourneyMapBackground({ fogStartPercent }: JourneyMapBackgroundProps) {
  const { w, h } = JOURNEY_MAP_VIEWBOX;
  const fogX = (fogStartPercent / 100) * w;

  return (
    <g aria-hidden>
      {/* Contour / elevation lines */}
      <path
        d={`M 0 ${h * 0.72} Q ${w * 0.22} ${h * 0.58} ${w * 0.38} ${h * 0.65} T ${w * 0.62} ${h * 0.55} T ${w} ${h * 0.68}`}
        fill="none"
        stroke="rgba(148, 163, 184, 0.08)"
        strokeWidth={1.5}
      />
      <path
        d={`M 0 ${h * 0.82} Q ${w * 0.3} ${h * 0.74} ${w * 0.5} ${h * 0.78} T ${w} ${h * 0.76}`}
        fill="none"
        stroke="rgba(148, 163, 184, 0.06)"
        strokeWidth={1}
      />
      <path
        d={`M ${w * 0.05} ${h * 0.35} L ${w * 0.18} ${h * 0.22} L ${w * 0.32} ${h * 0.38} L ${w * 0.12} ${h * 0.48} Z`}
        fill="rgba(30, 41, 59, 0.35)"
        stroke="rgba(100, 116, 139, 0.12)"
        strokeWidth={1}
      />
      <path
        d={`M ${w * 0.58} ${h * 0.28} L ${w * 0.72} ${h * 0.12} L ${w * 0.88} ${h * 0.25} L ${w * 0.78} ${h * 0.42} Z`}
        fill="rgba(15, 23, 42, 0.45)"
        stroke="rgba(100, 116, 139, 0.1)"
        strokeWidth={1}
      />

      {/* Runic marks along unused territory */}
      {[0.12, 0.48, 0.84].map((xp) => (
        <g key={xp} transform={`translate(${w * xp}, ${h * 0.88})`} opacity={0.2}>
          <path d="M-6 0 L0 -8 L6 0 L0 8 Z" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth={0.8} />
        </g>
      ))}

      {/* Mist over future territory */}
      <defs>
        <linearGradient id="jmap-fog-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0)" />
          <stop offset="35%" stopColor="rgba(15, 23, 42, 0.55)" />
          <stop offset="100%" stopColor="rgba(8, 12, 20, 0.82)" />
        </linearGradient>
      </defs>
      <rect
        x={Math.max(0, fogX - w * 0.08)}
        y={0}
        width={w - Math.max(0, fogX - w * 0.08)}
        height={h}
        fill="url(#jmap-fog-gradient)"
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
