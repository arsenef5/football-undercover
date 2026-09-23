/**
 * LA PARTIE FIGÉE À VIE.
 * Le carton blanc est éliminé, c'est à lui de tenter le mot des titulaires… et il ferme son
 * téléphone. Personne d'autre ne peut proposer, et personne ne peut juger une proposition qui
 * n'existe pas. Ce scénario vérifie que le groupe peut reprendre sans lui.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

const OUT = 'C:/Users/Admin/AppData/Local/Temp/claude/online4';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let browser;
for (const channel of ['chrome', 'msedge']) {
  try { browser = await chromium.launch({ headless: true, channel }); break; } catch {}
}

const NAMES = ['Arsène', 'Karim', 'Léa', 'Momo', 'Sofia'];
const joueurs = [];
for (const name of NAMES) {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 }, locale: 'fr-FR', isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`[${name}] ERREUR PAGE`, e.message));
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
  await tap(j.page, '^Rejoindre$', 1600);
}
await sleep(800);

// --- Le carton blanc doit être en jeu
const blancActif = await hote.page.evaluate(() => {
  const rows = [...document.querySelectorAll('.online-settings .row')];
  const row = rows.find((r) => /carton blanc/i.test(r.textContent || ''));
  const chip = row?.querySelector('.chip');
  if (!chip) return 'absent';
  if (!chip.classList.contains('on')) { chip.click(); return 'allumé'; }
  return 'déjà actif';
});
console.log('carton blanc :', blancActif);
await sleep(900);

// --- Distribution
await tap(hote.page, 'Lancer la partie', 2200);
let blanc = null;
for (const j of joueurs) {
  const mot = await j.page.evaluate(() => document.querySelector('.online-word .word')?.textContent?.trim() ?? '');
  if (/carton blanc/i.test(mot)) blanc = j;
  await tap(j.page, "C'est bon, je cache", 400);
}
if (!blanc) { console.log('✗ personne n’a le carton blanc, scénario impossible'); await browser.close(); process.exit(1); }
console.log('le carton blanc est :', blanc.name);
await sleep(1200);

// --- Tour de parole
for (let i = 0; i < 8; i++) {
  const etats = await Promise.all(joueurs.map((j) => txt(j.page)));
  const k = joueurs.findIndex((_, n) => /C'est à toi/.test(etats[n]));
  if (k < 0) break;
  await tap(joueurs[k].page, "J'ai fini de parler", 900);
}

// --- Tout le monde vote contre le carton blanc
await tap(hote.page, 'Passer au vote', 1500);
for (const j of joueurs) {
  // Le carton blanc ne peut pas voter contre lui-même : il vote au hasard, mais il vote.
  await j.page.evaluate((cible) => {
    const libres = [...document.querySelectorAll('.vote-card')].filter((b) => !b.disabled);
    (libres.find((b) => (b.textContent || '').includes(cible)) ?? libres[0])?.click();
  }, blanc.name);
  await sleep(400);
}
await sleep(3000);
const apresVote = await txt(hote.page);
console.log('phase après le vote :', /DERNIÈRE CHANCE/i.test(apresVote) ? 'dernière chance ✓' : apresVote.slice(0, 120));

// --- IL FERME SON TÉLÉPHONE SANS RÉPONDRE
await blanc.ctx.close();
console.log('→', blanc.name, 'ferme son téléphone sans proposer de mot');
const restants = joueurs.filter((j) => j !== blanc);

// --- On attend que le salon ouvre le droit de passer (20 s d'absence)
let bouton = false;
for (let i = 0; i < 16 && !bouton; i++) {
  await sleep(2500);
  bouton = await restants[0].page.evaluate(() =>
    [...document.querySelectorAll('button')].some((b) => /Passer sans sa réponse/i.test(b.textContent || '')),
  );
}
console.log('bouton de secours proposé :', bouton ? `OUI ✓ (après ${'~'}20 s)` : 'NON ✗');

if (bouton) {
  await tap(restants[1].page, 'Passer sans sa réponse', 2500);
  const suite = await txt(restants[0].page);
  console.log('la partie repart :', /TOUR \d|FIN DE PARTIE|Débattez/i.test(suite) ? 'OUI ✓' : 'NON ✗');
  console.log('écran :', suite.slice(0, 140));
}

for (const j of restants) await j.page.screenshot({ path: join(OUT, `${j.name}.png`) });
await browser.close();
