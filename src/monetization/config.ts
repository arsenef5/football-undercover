import { PRO_EXTRA_COMBOS } from '../data/words';

/**
 * Identifiants de monétisation.
 *
 * AdMob : compte d'Arsène (éditeur pub-8681861872152811), apps et blocs créés le 11/09/2026.
 * `USE_TEST_ADS` à true sert les annonces de TEST Google (à utiliser en développement : cliquer
 * ses propres vraies pubs fait bannir le compte). En production les vrais blocs ci-dessous
 * servent dès que Google a approuvé le compte et les apps (jusqu'à quelques jours, sinon
 * « no fill » silencieux). Les App ID sont aussi dans AndroidManifest.xml et Info.plist.
 */

export const USE_TEST_ADS = import.meta.env.DEV;

/** Identifiants d'app AdMob (aussi à reporter dans les projets natifs). */
export const ADMOB_APP_ID = {
  android: 'ca-app-pub-8681861872152811~7468383282',
  ios: 'ca-app-pub-8681861872152811~8888064711',
};

const TEST_UNITS = {
  banner: { android: 'ca-app-pub-3940256099942544/6300978111', ios: 'ca-app-pub-3940256099942544/2934735716' },
  interstitial: { android: 'ca-app-pub-3940256099942544/1033173712', ios: 'ca-app-pub-3940256099942544/4411468910' },
};

const REAL_UNITS = {
  banner: { android: 'ca-app-pub-8681861872152811/8720543750', ios: 'ca-app-pub-8681861872152811/5850486182' },
  interstitial: { android: 'ca-app-pub-8681861872152811/2817128735', ios: 'ca-app-pub-8681861872152811/1552500178' },
};

/** Blocs d'annonces : ceux de Google en test, les vrais en production. */
export const AD_UNITS = USE_TEST_ADS ? TEST_UNITS : REAL_UNITS;

/** Un interstitiel après CHAQUE partie terminée (version gratuite seulement) — demande d'Arsène, 12/09/2026. */
export const INTERSTITIAL_EVERY_GAMES = 1;

/**
 * Identifiant du produit non consommable « Version Pro » dans App Store Connect (créé le 24/09/2026,
 * identifiant Apple 6815841155, 2,99 € en France). Le prix affiché vient TOUJOURS de l'App Store.
 */
export { PRO_PRODUCT_ID } from './entitlement';

/**
 * Promesse marketing « +N combinaisons » : le vrai apport de la version Pro (duos absents de la version
 * gratuite), arrondi à la cinquantaine inférieure pour rester toujours en dessous de la réalité.
 */
export const PRO_COMBOS_CLAIM = Math.floor(PRO_EXTRA_COMBOS / 50) * 50;

