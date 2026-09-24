/**
 * 1.1 : l'App Store répond avec le produit « Version Pro ». On simule sa réponse (crochet de
 * développement __fuFakeOffer) et on vérifie ce que voit l'utilisateur iPhone :
 *   - l'offre apparaît, avec le prix de l'App Store ;
 *   - l'écran Pro propose l'achat et la restauration, JAMAIS de code ;
 *   - la capture de l'écran d'achat sert à la revue Apple du produit.
 */
import { chromium } from 'playwright-core';
const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = 'C:/Dev/football-undercover/store/screenshots/iap-review.png';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let browser;
for (const c of ['chrome', 'msedge']) { try { browser = await chromium.launch({ headless: true, channel: c }); break; } catch {} }
const ctx = await browser.newContext({ viewport: { width: 428, height: 926 }, deviceScaleFactor: 3, locale: 'fr-FR', isMobile: true, hasTouch: true });
await ctx.addInitScript(() => { window.webkit = { messageHandlers: { bridge: { postMessage() {} } } }; });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'domcontentloaded' });
await sleep(1200);
const texte = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
const avant = await texte();
console.log('avant la réponse de l’App Store, Pro visible :', /Version Pro/.test(avant) ? 'OUI ✗' : 'non ✓');
await page.evaluate(() => window.__fuFakeOffer('2,99 €'));
await sleep(500);
const apres = await texte();
console.log('après la réponse, offre visible sur l’accueil :', /Version Pro/.test(apres) ? 'oui ✓' : 'NON ✗');
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => /Version Pro/.test(b.textContent || ''))?.click());
await sleep(900);
const pro = await texte();
console.log('bouton d’achat au prix de l’App Store :', /Passer en Pro · 2,99 €/i.test(pro) ? 'oui ✓' : 'NON ✗');
console.log('bouton de restauration :', /Restaurer mes achats/i.test(pro) ? 'oui ✓' : 'NON ✗');
console.log('aucun code proposé :', /J'ai un code|code/i.test(pro) ? 'CODE PRÉSENT ✗' : 'aucun ✓');
await page.screenshot({ path: OUT });
console.log('capture pour la revue :', OUT);
await browser.close();
