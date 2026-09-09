/**
 * Achat intégré « Version Pro » via RevenueCat (App Store + Google Play).
 * Sur le web, ou tant que les clés sont des placeholders, tout est indisponible et silencieux.
 */
import { Capacitor } from '@capacitor/core';
import { Purchases, type CustomerInfo, type PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { isPlaceholderKey, PRO_ENTITLEMENT_ID, PRO_PRODUCT_ID, REVENUECAT_API_KEY } from './config';

export interface ProOffer {
  priceString: string;
  title: string;
  pkg: PurchasesPackage;
}

export type PurchaseOutcome = { ok: true } | { ok: false; cancelled: boolean; message?: string };

const platform = Capacitor.getPlatform();
const apiKey = platform === 'ios' ? REVENUECAT_API_KEY.ios : platform === 'android' ? REVENUECAT_API_KEY.android : '';

/** Vrai quand la boutique peut fonctionner : app native + vraie clé RevenueCat. */
export const purchasesAvailable = Capacitor.isNativePlatform() && apiKey !== '' && !isPlaceholderKey(apiKey);

let configured = false;

export async function initPurchases(): Promise<boolean> {
  if (!purchasesAvailable || configured) return configured;
  try {
    await Purchases.configure({ apiKey });
    configured = true;
  } catch {
    configured = false;
  }
  return configured;
}

function isPro(info: CustomerInfo | undefined | null): boolean {
  if (!info) return false;
  const active = info.entitlements?.active ?? {};
  if (active[PRO_ENTITLEMENT_ID]?.isActive) return true;
  // Filet de sécurité : le produit a été acheté même si le droit n'est pas (encore) mappé.
  return (info.allPurchasedProductIdentifiers ?? []).includes(PRO_PRODUCT_ID);
}

/** null = boutique indisponible (web, clé absente, réseau). */
export async function fetchProActive(): Promise<boolean | null> {
  if (!(await initPurchases())) return null;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return isPro(customerInfo);
  } catch {
    return null;
  }
}

export async function fetchProOffer(): Promise<ProOffer | null> {
  if (!(await initPurchases())) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    const packages = current?.availablePackages ?? [];
    const pkg =
      packages.find((p) => p.product.identifier === PRO_PRODUCT_ID) ??
      current?.lifetime ??
      packages[0] ??
      null;
    if (!pkg) return null;
    return { priceString: pkg.product.priceString, title: pkg.product.title, pkg };
  } catch {
    return null;
  }
}

export async function purchasePro(offer: ProOffer): Promise<PurchaseOutcome> {
  if (!(await initPurchases())) return { ok: false, cancelled: false, message: 'unavailable' };
  try {
    const result = await Purchases.purchasePackage({ aPackage: offer.pkg });
    return isPro(result.customerInfo) ? { ok: true } : { ok: false, cancelled: false, message: 'not-active' };
  } catch (e) {
    const err = e as { userCancelled?: boolean; message?: string; code?: string | number };
    const cancelled = err?.userCancelled === true || String(err?.code) === '1' || /cancel/i.test(err?.message ?? '');
    return { ok: false, cancelled, message: err?.message };
  }
}

export async function restorePro(): Promise<boolean | null> {
  if (!(await initPurchases())) return null;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return isPro(customerInfo);
  } catch {
    return null;
  }
}

/** Notifie quand le droit change (achat sur un autre appareil, remboursement…). */
export function onProChange(cb: (active: boolean) => void): () => void {
  if (!purchasesAvailable) return () => {};
  let id: string | null = null;
  void initPurchases().then(async (ok) => {
    if (!ok) return;
    try {
      id = await Purchases.addCustomerInfoUpdateListener((info) => cb(isPro(info)));
    } catch {
      /* ignore */
    }
  });
  return () => {
    if (id) void Purchases.removeCustomerInfoUpdateListener({ listenerToRemove: id }).catch(() => undefined);
  };
}
