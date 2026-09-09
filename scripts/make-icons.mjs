/**
 * Génère un logo de secours (assets/logo.png, 1024×1024) si aucun n'est présent,
 * pour que `npx @capacitor/assets generate` ait toujours une source.
 *
 * Dépose ton vrai logo (le visuel stade + ballon + espion) en assets/logo.png :
 * ce script ne l'écrase jamais.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
const target = join(assets, 'logo.png');

if (!existsSync(assets)) mkdirSync(assets, { recursive: true });

if (existsSync(target)) {
  console.log('assets/logo.png déjà présent : conservé.');
} else {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <radialGradient id="glow" cx="72%" cy="18%" r="75%">
        <stop offset="0" stop-color="#ff2b2b" stop-opacity="0.6"/>
        <stop offset="1" stop-color="#ff2b2b" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1a1a1a"/>
        <stop offset="1" stop-color="#050505"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#bg)"/>
    <rect width="1024" height="1024" fill="url(#glow)"/>
    <g transform="translate(192 120) scale(10)" fill="#f5f5f5">
      <path d="M32 3c-8 0-13 3.5-14 9.5L17 21h-5c-4 0-6.5 1.6-6.5 3.2S8 27.5 12 27.5h40c4 0 6.5-1.7 6.5-3.3S56 21 52 21h-5l-1-8.5C45 6.5 40 3 32 3z"/>
      <path d="M32 29c-5.5 0-9.5 3.5-9.5 8.5 0 4.5 3.5 8.5 9.5 8.5s9.5-4 9.5-8.5C41.5 32.5 37.5 29 32 29z"/>
      <path d="M5 62c0-11 8.5-17 15-19.5L32 52l12-9.5C50.5 45 59 51 59 62H5z"/>
    </g>
    <rect x="112" y="820" width="800" height="72" rx="36" fill="#ff2b2b"/>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(target, png);
  console.log('assets/logo.png (secours) généré.');
}
