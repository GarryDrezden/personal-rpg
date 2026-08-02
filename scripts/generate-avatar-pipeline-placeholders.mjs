/**
 * Generates same-theme gender placeholders + Hero State overlays for Avatar Assets Pipeline v1.
 * Does NOT generate final stage-01..20 body art.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../public/game-assets/themes');

const themes = [
  {
    id: 'cozy',
    bg0: '#f7f0e4',
    bg1: '#d7e4c0',
    body: '#d4a574',
    skin: '#e8c4a0',
    hair: '#6b8f5e',
    accent: '#5c4a32',
    label: 'Cozy',
  },
  {
    id: 'dark-fantasy',
    bg0: '#171329',
    bg1: '#0a1020',
    body: '#3d3558',
    skin: '#c4a882',
    hair: '#1e293b',
    accent: '#fbbf24',
    label: 'Dark Fantasy',
  },
];

const genders = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'neutral', label: 'Neutral' },
];

const heroStates = [
  { id: 'depleted', opacity: 0.35, color: '#64748b' },
  { id: 'steady', opacity: 0.18, color: '#94a3b8' },
  { id: 'energized', opacity: 0.28, color: '#f59e0b' },
  { id: 'strong', opacity: 0.34, color: '#fbbf24' },
];

function genderPlaceholderSvg(theme, gender) {
  const bodyW = gender.id === 'neutral' ? 70 : gender.id === 'female' ? 58 : 72;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1024" viewBox="0 0 768 1024" role="img" aria-label="${theme.label} ${gender.label} avatar placeholder">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.bg0}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </linearGradient>
  </defs>
  <rect width="768" height="1024" fill="url(#g)"/>
  <rect x="24" y="24" width="720" height="976" rx="28" fill="none" stroke="${theme.accent}" stroke-width="3" stroke-dasharray="10 8" opacity=".45"/>
  <ellipse cx="384" cy="900" rx="180" ry="36" fill="${theme.accent}" opacity=".2"/>
  <path d="M${384 - bodyW} 620c0-110 40-180 ${bodyW}-180s${bodyW} 70 ${bodyW} 180v60H${384 - bodyW}z" fill="${theme.body}" opacity=".85"/>
  <circle cx="384" cy="380" r="88" fill="${theme.skin}"/>
  <path d="M300 340c16-60 60-90 84-90s68 30 84 90" fill="${theme.hair}"/>
  <text x="384" y="120" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="${theme.accent}">Placeholder</text>
  <text x="384" y="160" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="${theme.accent}" opacity=".8">${theme.label} · ${gender.label}</text>
</svg>
`;
}

function heroStateOverlaySvg(theme, state) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1024" viewBox="0 0 768 1024" role="img" aria-hidden="true">
  <defs>
    <radialGradient id="aura" cx="50%" cy="70%" r="55%">
      <stop offset="0%" stop-color="${state.color}" stop-opacity="${state.opacity}"/>
      <stop offset="70%" stop-color="${state.color}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="768" height="1024" fill="url(#aura)"/>
  <rect x="18" y="18" width="732" height="988" rx="24" fill="none" stroke="${state.color}" stroke-width="4" opacity="${Math.min(0.55, state.opacity + 0.15)}"/>
</svg>
`;
}

let count = 0;
for (const theme of themes) {
  for (const gender of genders) {
    const dir = path.join(root, theme.id, 'avatars/placeholders');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, `${gender.id}.svg`),
      genderPlaceholderSvg(theme, gender),
      'utf8',
    );
    count += 1;

    // Ensure stage art folders exist for drops.
    if (gender.id !== 'neutral') {
      const stageDir = path.join(root, theme.id, 'avatars', gender.id);
      fs.mkdirSync(stageDir, { recursive: true });
      const keep = path.join(stageDir, '.gitkeep');
      if (!fs.existsSync(keep)) fs.writeFileSync(keep, '');
    } else {
      const neu = path.join(root, theme.id, 'avatars/neutral');
      fs.mkdirSync(neu, { recursive: true });
      fs.writeFileSync(
        path.join(neu, 'placeholder.svg'),
        genderPlaceholderSvg(theme, gender),
        'utf8',
      );
      count += 1;
    }
  }

  const hsDir = path.join(root, theme.id, 'avatars/hero-state');
  fs.mkdirSync(hsDir, { recursive: true });
  for (const state of heroStates) {
    fs.writeFileSync(
      path.join(hsDir, `${state.id}-overlay.svg`),
      heroStateOverlaySvg(theme, state),
      'utf8',
    );
    count += 1;
  }
}

// art-source scaffold (non-runtime)
const artRoot = path.resolve(__dirname, '../art-source/avatar-generation');
for (const theme of themes) {
  for (const g of ['male', 'female']) {
    const dir = path.join(artRoot, theme.id, g);
    fs.mkdirSync(dir, { recursive: true });
    const readme = path.join(dir, 'README.md');
    if (!fs.existsSync(readme)) {
      fs.writeFileSync(
        readme,
        `# ${theme.label} / ${g}\n\nSource / generated work-in-progress.\nExport approved stages to \`public/game-assets/themes/${theme.id}/avatars/${g}/stage-XX.webp\`.\n`,
        'utf8',
      );
    }
  }
}

console.log(`generated ${count} pipeline placeholder/overlay files + art-source scaffold`);
