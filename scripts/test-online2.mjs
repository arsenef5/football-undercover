/**
 * Partie en ligne à 4, avec un joueur qui DISPARAÎT en plein vote.
 * Vérifie : le tour de parole avance, un absent ne bloque ni la parole ni le dépouillement,
 * et le mot d'un joueur ne fuite jamais sur le téléphone d'un autre.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

const OUT = process.argv[2] ?? 'C:/Users/Admin/AppData/Local/Temp/claude/online3';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let browser;
for (const channel of ['chrome', 'msedge']) {
  try {
    browser = await chromium.launch({ headless: true, channel });
    break;
  } catch {}
}

const NAMES = ['Arsène', 'Karim', 'Léa', 'Momo'];
const joueurs = [];
for (const name of NAMES) {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 }, locale: 'fr-FR', isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`[${name}] ERREUR`, e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  joueurs.push({ name, page, ctx });
}

const tap = async (p, re, wait = 700) => {
  const ok = await p.evaluate((src) => {
    const r = new RegExp(src, 'i');
    const b = [...document.querySelectorAll('button')].find((b) => r.test(b.textContent || ''));
    if (!b) return false;
    b.click();
    return true;
  }, re);
  await sleep(wait);
  return ok;
};
const txt = (p) => p.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));

// --- Salon
const hote = joueurs[0];
await tap(hote.page, 'Jouer en ligne', 800);
await hote.page.locator('.input').first().fill(hote.name);
await tap(hote.page, 'Créer un salon', 2500);
const code = await hote.page.evaluate(() => document.querySelector('.room-code strong')?.textContent?.trim() ?? '');
console.log('salon :', code);
for (const j of joueurs.slice(1)) {
  await tap(j.page, 'Jouer en ligne', 700);
  await j.page.locator('.input').first().fill(j.name);
  await j.page.locator('.code-field').fill(code);
  await tap(j.page, '^Rejoindre$', 1800);
}
await sleep(1000);

// --- Réglages : le capitaine met 1 undercover et garde le carton blanc
const reglages = await txt(hote.page);
console.log('réglages visibles :', /Réglages du salon/.test(reglages) ? 'oui' : 'NON');

// --- Distribution
await tap(hote.page, 'Lancer la partie', 2000);
const mots = [];
for (const j of joueurs) {
  const mot = await j.page.evaluate(() => document.querySelector('.online-word .word')?.textContent?.trim() ?? '');
  mots.push({ name: j.name, mot });
  await tap(j.page, "C'est bon, je cache", 500);
}
console.log('mots :', mots.map((m) => `${m.name}=${m.mot}`).join(' | '));
await sleep(1500);

// --- Tour de parole : chacun dit qu'il a fini
let tours = [];
for (let i = 0; i < 6; i++) {
  const etats = await Promise.all(joueurs.map((j) => txt(j.page)));
  const parlant = joueurs.findIndex((_, k) => /C'est à toi/.test(etats[k]));
  if (parlant < 0) break;
  tours.push(joueurs[parlant].name);
  await tap(joueurs[parlant].page, "J'ai fini de parler", 1200);
}
console.log('ont parlé dans l’ordre :', tours.join(' → '));
const apresTours = await txt(hote.page);
console.log('après les tours :', /Débattez/.test(apresTours) ? 'place au débat ✓' : apresTours.slice(0, 80));

// --- Vote, avec un joueur qui disparaît
await tap(hote.page, 'Passer au vote', 1500);
const parti = joueurs[3];
await parti.ctx.close();
console.log('→', parti.name, 'a fermé son téléphone');
await sleep(1500);
for (const j of joueurs.slice(0, 3)) {
  await j.page.evaluate(() => {
    const c = [...document.querySelectorAll('.vote-card')].filter((b) => !b.disabled);
    c[0]?.click();
  });
  await sleep(500);
}
await sleep(2500);
const fin = await txt(hote.page);
console.log('après le vote :', fin.slice(0, 150));
console.log('manche débloquée malgré l’absent :', /LA DERNIÈRE CHANCE|FIN DE PARTIE|TOUR 2|ÉLIMIN/i.test(fin) ? 'OUI ✓' : 'NON ✗');

// --- Étanchéité
const distincts = [...new Set(mots.map((m) => m.mot))];
let fuite = null;
for (const j of joueurs.slice(0, 3)) {
  const vu = await j.page.evaluate(() => document.body.innerText + ' ' + JSON.stringify(localStorage));
  const mien = mots.find((m) => m.name === j.name).mot;
  for (const autre of distincts) if (autre && autre !== mien && vu.includes(autre)) fuite = `${j.name} voit « ${autre} »`;
}
console.log('étanchéité :', fuite ?? 'aucun mot étranger ✓');

for (const j of joueurs.slice(0, 3)) await j.page.screenshot({ path: join(OUT, `${j.name}.png`) });
await browser.close();
