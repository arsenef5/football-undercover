/**
 * APRÈS LA PREMIÈRE PARTIE, PLUS PERSONNE N'ENTRE NI NE SORT.
 * Une partie à 3 se termine en un vote. Le capitaine rouvre le salon d'attente, un quatrième ami
 * arrive, et on relance. C'est le déroulé d'une vraie soirée.
 */
import { chromium } from 'playwright-core';
const BASE = 'http://127.0.0.1:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let browser;
for (const channel of ['chrome', 'msedge']) {
  try { browser = await chromium.launch({ headless: true, channel }); break; } catch {}
}
const ouvrir = async (name) => {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 }, locale: 'fr-FR', isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`[${name}] ERREUR PAGE`, e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  return { name, page, ctx };
};
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

const joueurs = [];
for (const n of ['Arsène', 'Karim', 'Léa']) joueurs.push(await ouvrir(n));
const hote = joueurs[0];
await tap(hote.page, 'Jouer en ligne', 800);
await hote.page.locator('.input').first().fill(hote.name);
await tap(hote.page, 'Créer un salon', 2500);
const code = await hote.page.evaluate(() => document.querySelector('.room-code strong')?.textContent?.trim() ?? '');
console.log('salon :', code);
const rejoindre = async (j) => {
  await tap(j.page, 'Jouer en ligne', 700);
  await j.page.locator('.input').first().fill(j.name);
  await j.page.locator('.code-field').fill(code);
  await tap(j.page, '^Rejoindre$', 1800);
};
for (const j of joueurs.slice(1)) await rejoindre(j);
await sleep(700);

// --- Une partie complète
await tap(hote.page, 'Lancer la partie', 2200);
for (const j of joueurs) await tap(j.page, "C'est bon, je cache", 400);
await sleep(1200);
for (let i = 0; i < 6; i++) {
  const e = await Promise.all(joueurs.map((j) => txt(j.page)));
  const k = joueurs.findIndex((_, n) => /C'est à toi/.test(e[n]));
  if (k < 0) break;
  await tap(joueurs[k].page, "J'ai fini de parler", 900);
}
await tap(hote.page, 'Passer au vote', 1400);
for (const j of joueurs) {
  await j.page.evaluate(() => [...document.querySelectorAll('.vote-card')].filter((b) => !b.disabled)[0]?.click());
  await sleep(400);
}
await sleep(3000);

// --- Si le carton blanc sort, il tente un mot et le groupe refuse : la partie doit se terminer.
for (const j of joueurs) {
  const vu = await txt(j.page);
  if (/quel était le mot/i.test(vu)) {
    await j.page.locator('.input').first().fill('Zidane');
    await tap(j.page, 'Valider', 1500);
  }
}
for (const j of joueurs) await tap(j.page, '^Non|Raté|Perdu', 1500);
await sleep(2000);

let ecran = await txt(hote.page);
console.log('partie terminée :', /FIN DE PARTIE/i.test(ecran) ? 'oui ✓' : ecran.slice(0, 90));

// --- Rouvrir le salon
const rouvert = await tap(hote.page, "Retour au salon", 2000);
console.log('bouton « retour au salon » :', rouvert ? 'présent ✓' : 'ABSENT ✗');
ecran = await txt(hote.page);
console.log('de retour dans le salon :', /Lancer la partie|En attente/i.test(ecran) ? 'oui ✓' : ecran.slice(0, 90));

// --- Un quatrième ami arrive
const sofia = await ouvrir('Sofia');
await rejoindre(sofia);
await sleep(1200);
const vuParSofia = await txt(sofia.page);
console.log('Sofia est entrée :', new RegExp(code).test(vuParSofia) ? 'oui ✓' : vuParSofia.slice(0, 90));
const chezHote = await txt(hote.page);
console.log('le capitaine voit 4 joueurs :', /Sofia/.test(chezHote) ? 'oui ✓' : 'NON ✗');

// --- Et on relance
await tap(hote.page, 'Lancer la partie', 2200);
const relance = await txt(sofia.page);
console.log('nouvelle partie distribuée à Sofia :', /TON MOT|Carton blanc|C'est bon, je cache/i.test(relance) ? 'oui ✓' : relance.slice(0, 90));
await browser.close();
