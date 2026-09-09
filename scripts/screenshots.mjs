/**
 * Captures d'écran pour les stores, avec le Chrome (ou Edge) déjà installé sur le PC.
 *
 *   npm run dev            # serveur de développement dans un terminal
 *   npm run screenshots    # → store/screenshots/<jeu>/<langue>/*.png
 *
 * Jeux produits : iphone-6.9 (1320×2868), iphone-6.7 (1290×2796), android (1080×1920).
 * Variables : BASE_URL (défaut http://localhost:5173), LANGS (défaut "fr,en"), CHROME_PATH.
 */
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173';
const LANGS = (process.env.LANGS ?? 'fr,en').split(',');

const DEVICES = {
  'iphone-6.9': { width: 440, height: 956, scale: 3 },
  'iphone-6.7': { width: 430, height: 932, scale: 3 },
  android: { width: 360, height: 640, scale: 3 },
};

/** Joueurs et équipe de démonstration injectés dans le stockage local. */
const demoState = {
  version: 1,
  players: [
    ['p1', 'Kylian', '#FF2B2B'],
    ['p2', 'Léa', '#37D67A'],
    ['p3', 'Arsène', '#1AC8ED'],
    ['p4', 'Mathilde', '#8B5CF6'],
    ['p5', 'Tom', '#FFC21A'],
    ['p6', 'Zoé', '#F43F8E'],
  ].map(([id, name, color], i) => ({ id, name, avatar: '⚽', color, points: [24, 18, 14, 12, 8, 6][i], wins: [3, 2, 2, 1, 1, 0][i], games: 5, createdAt: 1 })),
  teams: [{ id: 't1', name: 'TEAM 1', playerIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'], createdAt: 1, undercovers: null, white: null, auto: true }],
  settings: null, // rempli par langue
  session: { p1: 12, p2: 10, p3: 2, p4: 2, p5: 0, p6: 6 },
  recentPairIds: [],
  lastSetup: { playerIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'], teamId: 't1', undercovers: null, mrWhite: null },
  gamesPlayed: 5,
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

async function clickText(page, text) {
  const ok = await page.evaluate((t) => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim().toLowerCase().includes(t.toLowerCase()));
    if (b) b.click();
    return !!b;
  }, text);
  if (!ok) throw new Error(`Bouton introuvable : ${text}`);
  await sleep(450);
}

async function shoot(page, dir, name) {
  await page.screenshot({ path: join(dir, `${name}.png`) });
  console.log('  ✓', name);
}

async function run(browser, deviceName, device, lang) {
  const dir = join(root, 'store', 'screenshots', deviceName, lang);
  mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: device.scale,
    isMobile: true,
    hasTouch: true,
    locale: lang === 'fr' ? 'fr-FR' : 'en-GB',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const state = {
    ...demoState,
    settings: { premium: true, haptics: false, showCategory: true, whiteSeesCategory: true, whiteCanStart: false, timerSeconds: 60, uiLang: lang, wordLang: lang, weights: { joueur: 60, trophee: 7, stade: 7, competition: 7, but: 7, meme: 6, style: 6 } },
  };
  await page.addInitScript((s) => {
    if (!localStorage.getItem('fu.screenshots')) {
      localStorage.setItem('fu.state.v1', JSON.stringify(s));
      localStorage.removeItem('fu.game.v1');
      localStorage.setItem('fu.screenshots', '1');
    }
  }, state);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('fu.screenshots'));
  await sleep(900);
  console.log(`${deviceName} / ${lang}`);

  await shoot(page, dir, '01-accueil');

  // Équipes
  await page.evaluate(() => [...document.querySelectorAll('.tabbar button')][1].click());
  await sleep(500);
  await shoot(page, dir, '02-equipes');

  // Nouvelle partie (équipe préchargée)
  await clickText(page, lang === 'fr' ? 'Jouer avec' : 'Play with');
  await shoot(page, dir, '03-nouvelle-partie');

  // Distribution : carte recto puis verso
  await clickText(page, lang === 'fr' ? 'Lancer la partie' : 'Start the game');
  await sleep(500);
  await shoot(page, dir, '04-carte-recto');
  await page.evaluate(() => document.querySelector('.flip')?.click());
  await sleep(1000);
  await shoot(page, dir, '05-carte-verso');

  // Discussion
  await clickText(page, lang === 'fr' ? "C'est bon, je cache" : 'Got it');
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => document.querySelector('.flip')?.click());
    await sleep(800);
    await clickText(page, lang === 'fr' ? "C'est bon, je cache" : 'Got it');
  }
  await clickText(page, lang === 'fr' ? 'Commencer' : 'Start');
  await shoot(page, dir, '06-discussion');

  // Vote
  await clickText(page, lang === 'fr' ? 'Passer au vote' : 'Go to the vote');
  await shoot(page, dir, '07-vote');

  // Classement
  await page.evaluate(() => {
    const quit = [...document.querySelectorAll('.screen-header .icon-btn')].pop();
    quit?.click();
  });
  await sleep(300);
  await clickText(page, lang === 'fr' ? 'Quitter' : 'Quit');
  await page.evaluate(() => [...document.querySelectorAll('.tabbar button')][2].click());
  await sleep(500);
  await shoot(page, dir, '08-classement');

  await context.close();
}

const browser = await launch();
try {
  for (const [deviceName, device] of Object.entries(DEVICES)) {
    for (const lang of LANGS) {
      await run(browser, deviceName, device, lang);
    }
  }
} finally {
  await browser.close();
}
console.log('Captures dans store/screenshots/');
