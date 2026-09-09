/**
 * Identifiants de monétisation.
 *
 * Tant que `USE_TEST_ADS` est vrai, l'app sert les annonces de TEST fournies par Google
 * (jamais de vraies pubs, jamais de revenus, aucun risque de bannissement AdMob).
 * Quand les comptes existent : coller les vrais identifiants ci-dessous, passer
 * `USE_TEST_ADS` à false, et reporter les App ID dans AndroidManifest.xml / Info.plist.
 */

export const USE_TEST_ADS = true;

/** Identifiants d'app AdMob (aussi à reporter dans les projets natifs). */
export const ADMOB_APP_ID = {
  android: 'ca-app-pub-3940256099942544~3347511713', // TEST Google — remplacer
  ios: 'ca-app-pub-3940256099942544~1458002511', // TEST Google — remplacer
};

/** Blocs d'annonces. Les valeurs de test sont celles publiées par Google. */
export const AD_UNITS = {
  banner: {
    android: 'ca-app-pub-3940256099942544/6300978111',
    ios: 'ca-app-pub-3940256099942544/2934735716',
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
  },
};

/** Un interstitiel toutes les N parties terminées (version gratuite seulement). */
export const INTERSTITIAL_EVERY_GAMES = 3;

/** RevenueCat : clés publiques (une par plateforme) et identifiants produit / droit. */
export const REVENUECAT_API_KEY = {
  android: 'goog_REMPLACER_PAR_LA_CLE_PUBLIQUE_ANDROID',
  ios: 'appl_REMPLACER_PAR_LA_CLE_PUBLIQUE_IOS',
};

/** Identifiant du produit non consommable dans App Store Connect et Google Play. */
export const PRO_PRODUCT_ID = 'fu_pro';

/** Prix de référence affiché tant que la boutique n'a pas répondu (le vrai prix vient du store). */
export const PRO_PRICE_LABEL = '2,99 €';

/** Promesse marketing « +1 000 mots » : arrondi volontaire, toujours inférieur au vrai nombre de mots Pro. */
export const PRO_WORDS_CLAIM = 1000;

/** Identifiant du droit (« entitlement ») configuré dans RevenueCat. */
export const PRO_ENTITLEMENT_ID = 'pro';

export function isPlaceholderKey(key: string): boolean {
  return key.includes('REMPLACER');
}
