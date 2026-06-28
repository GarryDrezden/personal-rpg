type JourneyMapPathProps = {
  pathD: string;
  pathLength: number;
  progressOffset: number;
};

/** Muted future trail + golden progress trail with glow. */
export function JourneyMapPath({ pathD, pathLength, progressOffset }: JourneyMapPathProps) {
  return (
    <g>
      <defs>
        <filter id="jmap-path-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="jmap-path-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="jmap-gold-trail" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="25%" stopColor="#b45309" />
          <stop offset="60%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>

      {/* Road bed — wide dark base */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(8, 10, 18, 0.92)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Future / locked trail */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(51, 65, 85, 0.75)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner shadow on full path */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(15, 23, 42, 0.5)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Golden progress glow underlay */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#jmap-gold-trail)"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength || undefined}
        strokeDashoffset={progressOffset}
        opacity={0.45}
        filter="url(#jmap-path-glow)"
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
      {/* Golden progress core */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#jmap-gold-trail)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength || undefined}
        strokeDashoffset={progressOffset}
        filter="url(#jmap-path-soft-glow)"
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </g>
  );
}
