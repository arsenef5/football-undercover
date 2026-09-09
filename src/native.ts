/**
 * Ponts vers le natif (Capacitor). Tout est enveloppé dans des try/catch :
 * dans le navigateur ces appels échouent silencieusement, l'app reste jouable.
 */
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

export const isNative = Capacitor.isNativePlatform();

let hapticsEnabled = true;

export function setHapticsEnabled(v: boolean): void {
  hapticsEnabled = v;
}

function vibrateFallback(ms: number | number[]): void {
  try {
    if (!isNative && typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
  } catch {
    /* ignore */
  }
}

/** Petit retour tactile (bouton). */
export async function tap(): Promise<void> {
  if (!hapticsEnabled) return;
  try {
    if (isNative) await Haptics.impact({ style: ImpactStyle.Light });
    else vibrateFallback(8);
  } catch {
    /* ignore */
  }
}

/** Retour marqué (révélation, élimination). */
export async function thump(): Promise<void> {
  if (!hapticsEnabled) return;
  try {
    if (isNative) await Haptics.impact({ style: ImpactStyle.Heavy });
    else vibrateFallback(30);
  } catch {
    /* ignore */
  }
}

export async function notify(kind: 'success' | 'warning' | 'error'): Promise<void> {
  if (!hapticsEnabled) return;
  try {
    if (isNative) {
      const type =
        kind === 'success' ? NotificationType.Success : kind === 'warning' ? NotificationType.Warning : NotificationType.Error;
      await Haptics.notification({ type });
    } else {
      vibrateFallback(kind === 'success' ? [20, 40, 20] : [40, 30, 40]);
    }
  } catch {
    /* ignore */
  }
}

/** Barre de statut sombre, splash masqué : appelé une fois au montage. */
export async function setupNativeUi(): Promise<void> {
  if (!isNative) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    /* ignore */
  }
  try {
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setBackgroundColor({ color: '#0A0A0A' });
    }
  } catch {
    /* ignore */
  }
  try {
    await SplashScreen.hide();
  } catch {
    /* ignore */
  }
}

/** Bouton retour Android : renvoie une fonction de désabonnement. */
export function onHardwareBack(handler: () => boolean): () => void {
  if (!isNative) return () => {};
  const sub = CapApp.addListener('backButton', () => {
    const handled = handler();
    if (!handled) void CapApp.minimizeApp();
  });
  return () => {
    void sub.then((s) => s.remove());
  };
}
