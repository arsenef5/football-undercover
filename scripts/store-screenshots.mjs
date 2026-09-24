/**
 * Captures App Store, dans l'ordre d'affichage voulu : le JEU d'abord, l'accueil en dernier
 * (guideline 2.3.3 : les captures doivent montrer l'app en cours d'utilisation).
 * iPhone 6,5" = 1284 × 2778 (viewport 428 × 926 ×3), iPad 13" = 2048 × 2732 (1024 × 1366 ×2).
 *
 * L'app se croit dans l'app iOS (pont natif simulé) : la capture montre donc EXACTEMENT ce que
 * voit un utilisateur de l'App Store, version gratuite comprise. Une capture qui montrerait la
 * Version Pro ou un mot réservé à la Pro promettrait un contenu absent (règle 2.3 d'Apple).
 *   npm run dev   puis   node scripts/store-screenshots.mjs
 */
import { mkdirSync, rmSync } from 'node:fs';
import { chromium } from 'playwright-core';

const ROOT = 'C:/Dev/football-undercover/store/screenshots';
const BASE = process.argv[2] ?? 'http://localhost:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let browser;
for (const channel of ['chrome', 'msedge']) {
  try {
    browser = await chromium.launch({ headless: true, channel });
    break;
  } catch {}
}

async function shootDevice({ dir, width, height, scale }) {
  rmSync(`${ROOT}/${dir}`, { recursive: true, force: true });
  mkdirSync(`${ROOT}/${dir}`, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, locale: 'fr-FR', isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    window.webkit = { messageHandlers: { bridge: { postMessage() {} } } };
  });
  const page = await ctx.newPage();
  const shot = (n) => page.screenshot({ path: `${ROOT}/${dir}/${n}.png` });
  const tap = async (re, wait = 800) => {
    const ok = await page.evaluate((src) => {
      const r = new RegExp(src, 'i');
      const b = [...document.querySelectorAll('button')].find((b) => r.test(b.textContent || ''));
      if (!b) return false;
      b.click();
      return true;
    }, re);
    await sleep(wait);
    return ok;
  };
  const openCard = () =>
    page.evaluate(() => {
      const e = [...document.querySelectorAll('[role="button"]')].find((e) => /Appuie/i.test(e.textContent || ''));
      if (!e) return false;
      e.click();
      return true;
    });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await sleep(700);
  await shot('7-accueil');

  await tap('^Nouvelle partie', 500);
  for (const n of ['Arsène', 'Karim', 'Léa', 'Momo', 'Inès']) {
    await page.locator('.quick-add input').fill(n);
    await page.locator('.quick-add input').press('Enter');
    await sleep(120);
  }
  await sleep(500);
  await shot('5-nouvelle-partie');

  await tap('^Lancer la partie', 900);
  await tap('Jouer sans filmer', 700);
  await shot('2-passe-le-telephone');
  await openCard();
  await sleep(1100);
  await shot('1-mot-secret');
  for (let i = 0; i < 5; i++) {
    if (i > 0) {
      if (!(await openCard())) break;
      await sleep(700);
    }
    await tap("C'est bon, je cache", 800);
  }
  await sleep(900);
  await shot('3-ordre-de-parole');

  await tap('Passer au vote', 900);
  await shot('4-vote');
  const g = await page.evaluate(() => JSON.parse(localStorage.getItem('fu.game.v1') || 'null'));
  const uc = g.players.findIndex((p) => p.role === 'undercover');
  await page.evaluate((i) => [...document.querySelectorAll('.vote-card')][i]?.click(), uc);
  await sleep(600);
  await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => /Éliminer/i.test(b.textContent || '')).pop()?.click());
  await sleep(1600);
  await tap('Voir le résultat|Tour suivant', 2200);

  // On va jusqu'au bout : deuxième tour, carton blanc éliminé, dernière chance, résultat.
  for (let round = 0; round < 4; round++) {
    const fini = await page.evaluate(() => /Fin de partie/i.test(document.querySelector('.screen-header .title')?.textContent || ''));
    if (fini) break;
    if (await tap('Passer au vote', 1200)) {
      const gg = await page.evaluate(() => JSON.parse(localStorage.getItem('fu.game.v1') || 'null'));
      const vivant = gg.players.findIndex((p) => !p.eliminated && p.role !== 'civil');
      const cible = vivant >= 0 ? vivant : gg.players.findIndex((p) => !p.eliminated);
      await page.evaluate((i) => [...document.querySelectorAll('.vote-card')][i]?.click(), cible);
      await sleep(600);
      await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => /Éliminer/i.test(b.textContent || '')).pop()?.click());
      await sleep(1800);
    }
    if (await tap('Laisser deviner', 1400)) {
      const champ = await page.$('input[type="text"], input:not([type]), textarea');
      if (champ) {
        await champ.fill('Mbappé');
        await sleep(400);
        await tap('^Valider$', 1600);
        await tap('^Raté$', 2200);
      }
    }
    await tap('Voir le résultat|Tour suivant', 2400);
  }
  await sleep(1200);
  await shot('6-resultat');

  await ctx.close();
  console.log('ok', dir);
}

await shootDevice({ dir: 'ios-6.5', width: 428, height: 926, scale: 3 });
await shootDevice({ dir: 'ipad-13', width: 1024, height: 1366, scale: 2 });
await browser.close();
