/**
 * Fenêtre promotionnelle « Version Pro » : affichée de temps en temps après une publicité
 * (une interstitielle sur deux), jamais deux fois en 12 h. Sur le web, où il n'y a pas de
 * pub, elle apparaît toutes les 6 parties pour pouvoir la tester.
 */
import { adsAvailable } from './ads';

const KEY = 'fu.promo.lastShown';
export const PROMO_MIN_INTERVAL_MS = 12 * 60 * 60 * 1000;
export const PROMO_EVERY_ADS = 2;
export const PROMO_EVERY_GAMES_WITHOUT_ADS = 6;

let interstitialsShown = 0;

function lastShown(): number {
  try {
    return Number(localStorage.getItem(KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function markPromoShown(): void {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/** À appeler après l'écran de résultat : la promo est-elle due ? */
export function promoDue(gamesPlayed: number, interstitialShown: boolean): boolean {
  if (Date.now() - lastShown() < PROMO_MIN_INTERVAL_MS) return false;
  if (interstitialShown) {
    interstitialsShown += 1;
    return interstitialsShown % PROMO_EVERY_ADS === 0;
  }
  if (!adsAvailable) return gamesPlayed > 0 && gamesPlayed % PROMO_EVERY_GAMES_WITHOUT_ADS === 0;
  return false;
}

/* Petit bus d'événements : n'importe quel écran peut demander la promo, l'App l'affiche. */
type Listener = () => void;
const listeners = new Set<Listener>();

export function requestProPromo(): void {
  listeners.forEach((l) => l());
}

// Aperçu en développement (console ou Playwright) : window.__fuPromo() affiche la promo.
if (import.meta.env.DEV && typeof window !== 'undefined') (window as unknown as { __fuPromo?: () => void }).__fuPromo = requestProPromo;

export function onProPromo(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
