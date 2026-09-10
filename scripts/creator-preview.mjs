/**
 * Aperçu du montage du MODE CRÉATEUR 🎥 : joue une partie filmée dans le Chrome (ou Edge) du PC et
 * enregistre chaque incrustation telle qu'elle sort dans la vidéo (1080×1920), plus quelques écrans
 * de l'app. Sans caméra sur le PC, une photo tient lieu de rush.
 *
 *   npm run dev
 *   node scripts/creator-preview.mjs --backdrop selfie.jpg --faces a.jpg,b.jpg [--out dossier]
 *
 * Variables : BASE_URL (défaut http://127.0.0.1:5173), CHROME_PATH.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5173';
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const OUT = opt('--out') ?? join(root, 'store', 'creator-preview');
const backdropPath = opt('--backdrop');
const facePaths = (opt('--faces') ?? '').split(',').filter(Boolean);

const dataUrl = (p) => `data:image/${extname(p).toLowerCase() === '.png' ? 'png' : 'jpeg'};base64,${readFileSync(p).toString('base64')}`;
const faces = facePaths.map(dataUrl);

/** Cinq joueurs : photos en alternance, le troisième sans photo (initiales). */
const NAMES = ['Arsène', 'Karim', 'Léa', 'Momo', 'Inès'];
const COLORS = ['#FF2B2B', '#1AC8ED', '#37D67A', '#FFC21A', '#8B5CF6'];
const players = NAMES.map((name, i) => ({
  id: `p${i}`,
  name,
  avatar: '⚽',
  color: COLORS[i],
  photo: i === 2 || faces.length === 0 ? null : faces[i % faces.length],
  points: 0,
  wins: 0,
  games: 0,
  createdAt: 1,
}));
const ids = players.map((p) => p.id);
const state = {
  version: 1,
  players,
  teams: [{ id: 't1', name: 'TEAM 1', playerIds: ids, createdAt: 1, undercovers: 1, white: true, auto: false }],
  settings: { premium: true, haptics: false, creatorMode: true, uiLang: 'fr', wordLang: 'fr', timerSeconds: 0 },
  session: {},
  recentPairIds: [],
  lastSetup: { playerIds: ids, teamId: 't1', undercovers: 1, mrWhite: true },
  gamesPlayed: 0,
  lastRecordedGameId: null,
};

async function launch() {
  const opts = { headless: true };
  if (process.env.CHROME_PATH) return chromium.launch({ ...opts, executablePath: process.env.CHROME_PATH });
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ ...opts, channel });
    } catch {
      /* essaie le suivant */
    }
  }
  throw new Error('Aucun Chrome/Edge trouvé : définis CHROME_PATH.');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Helpers exécutés dans la page. */
const click = (page, re) =>
  page.evaluate((src) => {
    const re = new RegExp(src, 'i');
    const b = [...document.querySelectorAll('button')].find((b) => re.test(b.textContent || ''));
    if (!b) return false;
    b.click();
    return true;
  }, re);
const title = (page) => page.evaluate(() => document.querySelector('.screen-header .title')?.textContent ?? '');
const openCard = (page) =>
  page.evaluate(() => {
    const e = [...document.querySelectorAll('[role="button"]')].find((e) => /Appuie/i.test(e.textContent || ''));
    if (!e) return false;
    e.click();
    return true;
  });
const game = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('fu.game.v1') || 'null'));

let n = 0;
async function frame(page, name) {
  const data = await page.evaluate(() => window.__fuRecorder?.canvas.toDataURL('image/png') ?? null);
  if (!data) throw new Error(`pas de canvas pour ${name}`);
  n++;
  const file = join(OUT, `${String(n).padStart(2, '0')}-video-${name}.png`);
  writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  console.log('→', file);
}
async function shot(page, name) {
  n++;
  const file = join(OUT, `${String(n).padStart(2, '0')}-app-${name}.png`);
  await page.screenshot({ path: file });
  console.log('→', file);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, locale: 'fr-FR', isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate((s) => {
    localStorage.setItem('fu.state.v1', JSON.stringify(s));
    localStorage.removeItem('fu.game.v1');
  }, state);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.__fuRecorder, null, { timeout: 15000 });
  if (backdropPath) {
    await page.evaluate(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            window.__fuRecorder.backdrop = img;
            resolve(true);
          };
          img.src = src;
        }),
      dataUrl(backdropPath),
    );
  }

  // Préparation → distribution (l'enregistrement démarre au lancement).
  await click(page, '^Nouvelle partie');
  await sleep(500);
  await shot(page, 'setup');
  await click(page, '^Lancer la partie');
  await sleep(1200);
  await page.waitForFunction(() => window.__fuRecorder?.status === 'recording', null, { timeout: 15000 });
  const g = await game(page);
  const white = g.players.find((p) => p.role === 'white');
  const undercover = g.players.find((p) => p.role === 'undercover');
  console.log('rôles :', g.players.map((p) => `${p.name}=${p.role}`).join(', '));

  let revealShots = 0;
  for (let i = 0; i < g.players.length; i++) {
    if (!(await openCard(page))) break;
    await sleep(700);
    const p = g.players[i];
    if (revealShots === 0 || p.role === 'white' || p.role === 'undercover') {
      await frame(page, `reveal-${p.role}`);
      if (revealShots === 0) await shot(page, 'reveal');
      revealShots++;
    }
    await click(page, 'cache');
    await sleep(800);
  }
  await click(page, '^Commencer$');
  await sleep(1200);
  await frame(page, 'discussion');
  await shot(page, 'discussion');

  // Vote collectif : « le groupe vote X », puis la carte d'élimination du carton blanc.
  await click(page, 'vote');
  await sleep(500);
  await shot(page, 'vote');
  const whiteIndex = g.players.findIndex((p) => p.id === white?.id);
  await page.evaluate((i) => [...document.querySelectorAll('.vote-card')][i]?.click(), whiteIndex);
  await sleep(400);
  await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => /Éliminer/i.test(b.textContent || '')).pop()?.click());
  await sleep(500);
  await frame(page, 'vote');
  await sleep(1300);
  await frame(page, 'elimination-white');
  await sleep(1200);
  await click(page, 'Laisser deviner');
  await sleep(2600); // la carte d'élimination reste 3,2 s à l'image
  await frame(page, 'guess-question');
  await page.evaluate(() => {
    const input = document.querySelector('input.input');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Zidane');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await sleep(150);
  await click(page, '^Valider$');
  await sleep(300);
  await click(page, '^Raté$');
  await sleep(700);
  await frame(page, 'guess-verdict');

  // Tour suivant : l'undercover tombe, fin de partie.
  await sleep(2500);
  if (/^Tour/i.test(await title(page))) {
    await click(page, 'vote');
    await sleep(500);
    const ucIndex = g.players.findIndex((p) => p.id === undercover?.id);
    await page.evaluate((i) => [...document.querySelectorAll('.vote-card')][i]?.click(), ucIndex);
    await sleep(400);
    await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => /Éliminer/i.test(b.textContent || '')).pop()?.click());
    await sleep(1150);
    await frame(page, 'elimination-undercover');
    await shot(page, 'elimination');
    await sleep(1200);
    await click(page, 'Voir le résultat|Tour suivant');
    await sleep(3600); // la carte d'élimination finit avant le résultat
  }
  console.log('écran :', await title(page));
  await frame(page, 'result');
  await shot(page, 'result');

  // Écran d'édition d'un joueur (photo).
  await sleep(6500);
  await click(page, '^Terminer$');
  await sleep(500);
  await page.evaluate(() => [...document.querySelectorAll('.tabbar button')].pop()?.click());
  await sleep(400);
  await click(page, 'Gérer les joueurs');
  await sleep(500);
  await page.click('.row', { timeout: 3000 }).catch(() => undefined);
  await sleep(700);
  await shot(page, 'player-photo');

  await browser.close();
  console.log('terminé :', n, 'images dans', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
