/**
 * Publicité AdMob (bannière + interstitiel) pour la version gratuite.
 * - Consentement RGPD (formulaire UMP) puis, sur iOS, demande de suivi (ATT) avant la première annonce.
 * - Bannière adaptative en bas d'écran, hors écrans de partie ; sa hauteur est publiée dans
 *   la variable CSS --ad-h pour remonter la barre d'onglets.
 * - Un interstitiel toutes les INTERSTITIAL_EVERY_GAMES parties, sur l'écran de résultat.
 * Sur le web, tout est silencieux.
 */
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  InterstitialAdPluginEvents,
  type AdMobBannerSize,
} from '@capacitor-community/admob';
import { AD_UNITS, INTERSTITIAL_EVERY_GAMES, USE_TEST_ADS } from './config';

const platform = Capacitor.getPlatform();
export const adsAvailable = platform === 'ios' || platform === 'android';

const bannerId = platform === 'ios' ? AD_UNITS.banner.ios : AD_UNITS.banner.android;
const interstitialId = platform === 'ios' ? AD_UNITS.interstitial.ios : AD_UNITS.interstitial.android;

let initialized = false;
let initializing: Promise<void> | null = null;
let canRequestAds = false;
let bannerVisible = false;
let interstitialReady = false;
let enabled = true;

function setAdHeight(px: number): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--ad-h', `${Math.max(0, Math.round(px))}px`);
}

/** Initialisation + consentement. Idempotent, jamais bloquant pour l'UI. */
export async function initAds(): Promise<void> {
  if (!adsAvailable || initialized) return;
  if (initializing) return initializing;
  initializing = (async () => {
    try {
      await AdMob.initialize({ initializeForTesting: USE_TEST_ADS });
      const info = await AdMob.requestConsentInfo();
      let status = info.status;
      if (status === AdmobConsentStatus.REQUIRED && info.isConsentFormAvailable) {
        const after = await AdMob.showConsentForm();
        status = after.status;
        canRequestAds = after.canRequestAds;
      } else {
        canRequestAds = info.canRequestAds;
      }
      if (platform === 'ios') {
        try {
          const t = await AdMob.trackingAuthorizationStatus();
          if (t.status === 'notDetermined') await AdMob.requestTrackingAuthorization();
        } catch {
          /* ignore */
        }
      }
      await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
        setAdHeight(bannerVisible ? size.height : 0);
      });
      initialized = true;
      if (canRequestAds) void prepareInterstitial();
    } catch {
      initialized = false;
    } finally {
      initializing = null;
    }
  })();
  return initializing;
}

/** Version Pro → plus jamais d'annonce (bannière retirée immédiatement). */
export function setAdsEnabled(v: boolean): void {
  enabled = v;
  if (!v) void removeBanner();
}

/*
 * La bannière est une vue native au-dessus de la page : elle cacherait le bas des feuilles
 * (langues, confirmations…) et de la fenêtre promo. On la masque tant qu'une surcouche est ouverte.
 */
let bannerWanted = false;
let overlays = 0;

async function applyBanner(): Promise<void> {
  if (bannerWanted && overlays === 0) await showBanner();
  else await hideBanner();
}

/** L'App dit si la bannière a sa place sur l'écran courant (hors partie, version gratuite). */
export function setBannerWanted(v: boolean): void {
  bannerWanted = v;
  void applyBanner();
}

/** Une feuille / fenêtre s'ouvre : bannière masquée jusqu'à sa fermeture. */
export function suppressBanner(): void {
  overlays += 1;
  void applyBanner();
}

export function releaseBanner(): void {
  overlays = Math.max(0, overlays - 1);
  void applyBanner();
}

export async function showBanner(): Promise<void> {
  if (!adsAvailable || !enabled) return;
  await initAds();
  if (!initialized || !canRequestAds) return;
  try {
    if (bannerVisible) {
      await AdMob.resumeBanner();
      return;
    }
    await AdMob.showBanner({
      adId: bannerId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: USE_TEST_ADS,
    });
    bannerVisible = true;
  } catch {
    bannerVisible = false;
    setAdHeight(0);
  }
}

export async function hideBanner(): Promise<void> {
  if (!adsAvailable || !bannerVisible) return;
  try {
    await AdMob.hideBanner();
  } catch {
    /* ignore */
  }
  setAdHeight(0);
}

export async function removeBanner(): Promise<void> {
  if (!adsAvailable) return;
  try {
    if (bannerVisible) await AdMob.removeBanner();
  } catch {
    /* ignore */
  }
  bannerVisible = false;
  setAdHeight(0);
}

async function prepareInterstitial(): Promise<void> {
  if (!adsAvailable || !enabled || !initialized || !canRequestAds || interstitialReady) return;
  try {
    await AdMob.prepareInterstitial({ adId: interstitialId, isTesting: USE_TEST_ADS });
    interstitialReady = true;
  } catch {
    interstitialReady = false;
  }
}

/** Affiche un interstitiel si c'est le moment (toutes les N parties) et qu'il est prêt. */
export async function showInterstitialIfDue(gamesPlayed: number): Promise<boolean> {
  if (!adsAvailable || !enabled) return false;
  if (gamesPlayed <= 0 || gamesPlayed % INTERSTITIAL_EVERY_GAMES !== 0) return false;
  await initAds();
  if (!interstitialReady) {
    void prepareInterstitial();
    return false;
  }
  try {
    // On attend la fermeture de l'annonce (60 s max) : ce qui suit (promo Pro) ne doit pas passer dessous.
    const dismissed = new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 60_000);
      void AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        window.clearTimeout(timer);
        resolve();
      }).then((handle) => {
        void dismissed.then(() => handle.remove());
      });
    });
    await AdMob.showInterstitial();
    interstitialReady = false;
    await dismissed;
    void prepareInterstitial();
    return true;
  } catch {
    interstitialReady = false;
    return false;
  }
}
