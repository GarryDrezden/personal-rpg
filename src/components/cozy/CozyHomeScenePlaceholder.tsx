/** Soft SVG stand-in for the village home scene — never technical PLACEHOLDER text. */
export function CozyHomeScenePlaceholder({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`cozy-home-scene ${className}`}
      role="img"
      aria-label="Дом героя — тёплый деревенский дом у сада"
      data-testid="cozy-home-scene-art"
    >
      <svg
        className="cozy-home-scene__svg"
        viewBox="0 0 640 360"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="chs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff6e4" />
            <stop offset="55%" stopColor="#eef3e4" />
            <stop offset="100%" stopColor="#dfe8d2" />
          </linearGradient>
          <linearGradient id="chs-hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9c99a" />
            <stop offset="100%" stopColor="#8fa574" />
          </linearGradient>
          <radialGradient id="chs-sun" cx="78%" cy="22%" r="22%">
            <stop offset="0%" stopColor="#ffe08a" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#f0c45a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f0c45a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="640" height="360" fill="url(#chs-sky)" />
        <circle cx="500" cy="78" r="90" fill="url(#chs-sun)" />
        <ellipse cx="320" cy="320" rx="380" ry="90" fill="url(#chs-hill)" opacity="0.85" />
        <ellipse cx="120" cy="300" rx="140" ry="50" fill="#9eb384" opacity="0.55" />
        <ellipse cx="520" cy="305" rx="160" ry="55" fill="#a8bc8c" opacity="0.5" />

        {/* Path */}
        <path
          d="M300 330 C310 280 318 250 330 220 L360 220 C348 255 340 290 350 330 Z"
          fill="#d8c3a0"
          opacity="0.85"
        />

        {/* House body */}
        <rect x="230" y="168" width="180" height="110" rx="6" fill="#f3e6cf" />
        <rect x="230" y="168" width="180" height="110" rx="6" fill="#c9a878" opacity="0.12" />
        <path d="M218 174 L320 108 L422 174 Z" fill="#b8895a" />
        <path d="M218 174 L320 108 L422 174 Z" fill="#8a6540" opacity="0.18" />

        {/* Chimney */}
        <rect x="370" y="120" width="22" height="42" rx="2" fill="#a67c52" />

        {/* Door */}
        <rect x="300" y="210" width="40" height="68" rx="3" fill="#8a6540" />
        <circle cx="332" cy="246" r="3" fill="#e8d5a8" />

        {/* Warm window */}
        <rect x="250" y="198" width="36" height="32" rx="3" fill="#f6d278" />
        <rect x="254" y="202" width="28" height="24" rx="2" fill="#ffe9a8" opacity="0.85" />
        <path d="M268 198 V230 M250 214 H286" stroke="#c9a050" strokeWidth="1.5" opacity="0.55" />

        <rect x="354" y="198" width="36" height="32" rx="3" fill="#f6d278" />
        <rect x="358" y="202" width="28" height="24" rx="2" fill="#ffe9a8" opacity="0.85" />
        <path d="M372 198 V230 M354 214 H390" stroke="#c9a050" strokeWidth="1.5" opacity="0.55" />

        {/* Bushes */}
        <ellipse cx="210" cy="268" rx="36" ry="22" fill="#6d8464" opacity="0.85" />
        <ellipse cx="190" cy="262" rx="22" ry="16" fill="#5c7858" opacity="0.7" />
        <ellipse cx="430" cy="268" rx="40" ry="24" fill="#6d8464" opacity="0.85" />
        <ellipse cx="455" cy="260" rx="24" ry="18" fill="#5c7858" opacity="0.7" />

        {/* Soft leaf accents */}
        <ellipse cx="96" cy="210" rx="18" ry="28" transform="rotate(-28 96 210)" fill="#5c7858" opacity="0.22" />
        <ellipse cx="560" cy="200" rx="16" ry="26" transform="rotate(24 560 200)" fill="#5c7858" opacity="0.2" />
      </svg>

      <p className="cozy-home-scene__caption">Иллюстрация дома готовится</p>
    </div>
  );
}
