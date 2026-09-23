/**
 * LE JOUEUR QUI CLAQUE LA PORTE EN PLEINE MANCHE.
 * C'était la panne la plus grave du mode en ligne : il disparaissait de la liste tout en restant
 * dans l'ordre de parole, et l'écran de TOUS les autres devenait noir. Il devenait aussi
 * inéliminable, donc son camp gagnait par forfait.
 */
import { chromium } from 'playwright-core';
const BASE = 'http://127.0.0.1:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let erreurs = 0;

let browser;
for (const c of ['chrome', 'msedge']) { try { browser = await chromium.launch({ headless: true, channel: c }); break; } catch {} }
const ouvrir = async (name) => {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 }, locale: 'fr-FR', isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => { erreurs++; console.log(`[${name}] ERREUR PAGE`, e.message.slice(0, 120)); });
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
for (const n of ['Arsène', 'Karim', 'Léa', 'Momo']) joueurs.push(await ouvrir(n));
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
  await tap(j.page, '^Rejoindre$', 1700);
}
await sleep(700);
await tap(hote.page, 'Lancer la partie', 2200);
for (const j of joueurs) await tap(j.page, "C'est bon, je cache", 400);
await sleep(1500);

// --- Un joueur appuie sur la flèche retour en plein tour de parole
const parti = joueurs[3];
await parti.page.evaluate(() => document.querySelector('.screen-head button, .back, [aria-label="Retour"]')?.click());
await sleep(500);
await parti.ctx.close();
console.log('→', parti.name, 'a quitté par la flèche retour, en pleine manche');
await sleep(2000);

const restants = joueurs.slice(0, 3);
const vues = await Promise.all(restants.map((j) => txt(j.page)));
const noir = vues.filter((v) => v.trim().length < 40).length;
console.log('écrans noirs :', noir === 0 ? 'aucun ✓' : `${noir} ✗`);
console.log('erreurs de page :', erreurs === 0 ? 'aucune ✓' : `${erreurs} ✗`);
console.log('le partant reste visible :', vues.every((v) => v.includes(parti.name)) ? 'oui ✓' : 'NON ✗');

// --- La manche continue et il reste éliminable
for (let i = 0; i < 8; i++) {
  const e = await Promise.all(restants.map((j) => txt(j.page)));
  const k = restants.findIndex((_, n) => /C'est à toi/.test(e[n]));
  if (k < 0) break;
  await tap(restants[k].page, "J'ai fini de parler", 900);
}
// Le salon doit sauter tout seul le tour du partant ; sinon quelqu'un peut le passer à la main.
for (let i = 0; i < 10; i++) {
  const e = await Promise.all(restants.map((j) => txt(j.page)));
  const k = restants.findIndex((_, n) => /C'est à toi/.test(e[n]));
  if (k >= 0) { await tap(restants[k].page, "J'ai fini de parler", 900); continue; }
  if (/Passer au suivant/i.test(e[0])) { await tap(restants[0].page, 'Passer au suivant', 1400); continue; }
  break;
}
await tap(hote.page, 'Passer au vote', 1600);
const votable = await restants[0].page.evaluate((nom) =>
  [...document.querySelectorAll('.vote-card')].some((b) => (b.textContent || '').includes(nom)), parti.name);
console.log('le partant reste éliminable :', votable ? 'oui ✓' : 'NON ✗');
for (const j of restants) {
  await j.page.evaluate((nom) => {
    const libres = [...document.querySelectorAll('.vote-card')].filter((b) => !b.disabled);
    (libres.find((b) => (b.textContent || '').includes(nom)) ?? libres[0])?.click();
  }, parti.name);
  await sleep(400);
}
await sleep(3000);
const fin = await txt(restants[0].page);
console.log('la manche se conclut :', /ÉLIMIN|TOUR 2|DERNIÈRE CHANCE|FIN DE PARTIE/i.test(fin) ? 'oui ✓' : fin.slice(0, 120));
console.log('erreurs de page au total :', erreurs);
await browser.close();
