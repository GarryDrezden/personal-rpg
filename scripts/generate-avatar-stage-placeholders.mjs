import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../public/game-assets/themes');

const themes = [
  {
    id: 'cozy',
    bg0: '#f7f0e4',
    bg1: '#c8d9b8',
    body: '#d4a574',
    skin: '#e8c4a0',
    hair: '#6b8f5e',
    accent: '#5c4a32',
    badgeText: '#f7f0e4',
    label: 'Уютный путь',
  },
  {
    id: 'dark-fantasy',
    bg0: '#171329',
    bg1: '#0a1020',
    body: '#3d3558',
    skin: '#c4a882',
    hair: '#1e293b',
    accent: '#fbbf24',
    badgeText: '#171329',
    label: 'Тёмный путь',
  },
];

const genders = ['male', 'female'];

let count = 0;
for (const theme of themes) {
  for (const gender of genders) {
    const dir = path.join(root, theme.id, 'avatars/placeholders', gender);
    fs.mkdirSync(dir, { recursive: true });
    for (let s = 1; s <= 20; s += 1) {
      const nn = String(s).padStart(2, '0');
      const bodyW = 66 + Math.round((20 - s) * 1.2);
      const bodyTop = 300 - Math.round(s * 1.5);
      const left = 256 - bodyW;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="640" viewBox="0 0 512 640" role="img" aria-label="Avatar stage ${s} placeholder">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.bg0}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="640" fill="url(#g)"/>
  <ellipse cx="256" cy="560" rx="140" ry="28" fill="${theme.accent}" opacity=".22"/>
  <path d="M${left} ${bodyTop + 120}c0-70 30-120 ${bodyW}-120s${bodyW} 50 ${bodyW} 120v40H${left}z" fill="${theme.body}"/>
  <circle cx="256" cy="250" r="58" fill="${theme.skin}"/>
  <path d="M200 220c10-40 40-60 56-60s46 20 56 60" fill="${theme.hair}"/>
  <rect x="186" y="36" width="140" height="36" rx="10" fill="${theme.accent}" opacity=".9"/>
  <text x="256" y="62" text-anchor="middle" font-family="Georgia,serif" font-size="20" fill="${theme.badgeText}">Стадия ${s}</text>
  <text x="256" y="610" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="${theme.accent}" opacity=".85">${theme.label}</text>
</svg>
`;
      fs.writeFileSync(path.join(dir, `stage-${nn}.svg`), svg, 'utf8');
      count += 1;
    }
  }
}

console.log(`generated ${count} avatar stage placeholders`);
