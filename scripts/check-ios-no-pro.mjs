/**
 * RÈGLE 3.1.1 D'APPLE : la build iOS ne doit rien proposer ni débloquer hors achat intégré.
 * On fait croire à l'app qu'elle tourne dans l'app iOS (le pont natif de Capacitor) et on parcourt
 * chaque écran qui parlait de la Version Pro. On y cherche : Pro, prix, code, achat.
 * On part d'un appareil qui avait DÉJÀ un code et le mode créateur allumés (un testeur TestFlight),
 * le cas le plus piégeux.
 */
import { chromium } from 'playwright-core';
const BASE = process.argv[2] ?? 'http://localhost:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let browser;
for (const c of ['chrome', 'msedge']) { try { browser = await chromium.launch({ headless: true, channel: c }); break; } catch {} }

const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, locale: 'fr-FR', isMobile: true, hasTouch: true });
const WEB = process.argv.includes('--web');
if (!WEB) {
  await ctx.addInitScript(() => {
    // Le pont que l'app iOS injecte : Capacitor se croit alors sur iPhone.
    window.webkit = { messageHandlers: { bridge: { postMessage() {} } } };
  });
}
const page = await ctx.newPage();
const erreurs = [];
page.on('pageerror', (e) => erreurs.push(e.message));
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
const plateforme = await page.evaluate(() => window.Capacitor?.getPlatform?.());
console.log('plateforme vue par l’app :', plateforme);

// Un testeur qui avait un code et le mode créateur allumés.
await page.evaluate(() => {
  const k = Object.keys(localStorage).find((x) => /state|store|fu\./i.test(x) && localStorage.getItem(x)?.includes('"settings"'));
  console.log('cle', k);
});
const cle = await page.evaluate(() => Object.keys(localStorage).find((x) => localStorage.getItem(x)?.includes('"settings"')) ?? null);
if (cle) {
  await page.evaluate((k) => {
    const s = JSON.parse(localStorage.getItem(k));
    s.settings.proCode = 'FU-TIKITAKA-8DE9';
    s.settings.premium = true;
    s.settings.creatorMode = true;
    localStorage.setItem(k, JSON.stringify(s));
  }, cle);
  await page.reload({ waitUntil: 'domcontentloaded' });
}
console.log('ancien code et mode créateur injectés :', cle ? 'oui' : 'NON (clé de stockage introuvable)');
await sleep(1500);

const MOTIFS = /Version Pro|Passe en Pro|Passer en Pro|€|J'ai un code|code Pro|Réservé à la Version Pro|avec Pro|Découvrir la Version Pro|mode créateur/i;
const texte = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
const cliquer = async (re) => page.evaluate((src) => {
  const r = new RegExp(src, 'i');
  const el = [...document.querySelectorAll('button, a, [role="tab"]')].find((b) => r.test(b.textContent || '') || r.test(b.getAttribute('aria-label') || ''));
  el?.click();
  return !!el;
}, re);

// Fermer une éventuelle fenêtre de consentement / langue
for (const re of ['Continuer', 'Plus tard', 'Fermer', 'OK', 'Accepter', 'Refuser']) await cliquer(`^${re}$`);
await sleep(600);

const bilan = [];
const verifier = async (nom) => {
  const t = await texte();
  const m = t.match(MOTIFS);
  bilan.push({ nom, ok: !m, trouve: m ? t.slice(Math.max(0, m.index - 40), m.index + 60) : '', debut: t.slice(0, 50) });
};

await verifier('Accueil');
await cliquer('Plus|Réglages|Settings'); await sleep(800);
await verifier('Réglages');
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await sleep(300);
await verifier('Réglages (bas)');
await cliquer('^Accueil$|Jouer|Home'); await sleep(600);
await cliquer('Nouvelle partie'); await sleep(900);
await verifier('Nouvelle partie');

for (const b of bilan) console.log(b.ok ? '✓' : '✗', b.nom.padEnd(18), `[écran : ${b.debut}]`, b.ok ? '' : `→ « ${b.trouve} »`);
console.log('erreurs de page :', erreurs.length ? erreurs.slice(0, 3) : 'aucune');
await page.screenshot({ path: 'C:/Users/Admin/AppData/Local/Temp/claude/ios-sans-pro.png' });
await browser.close();
