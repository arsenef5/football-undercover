/**
 * ACHAT INTÉGRÉ « VERSION PRO », BRANCHÉ DIRECTEMENT SUR L'APP STORE (StoreKit 2).
 *
 * Pas d'intermédiaire, pas de compte tiers, pas de clé secrète : l'app demande le produit à Apple,
 * Apple encaisse, et la preuve d'achat est vérifiée sur l'appareil (StoreKit ne remonte que les
 * transactions signées par Apple). Pour un achat unique à 2,99 €, c'est la bonne mesure.
 *
 * Trois règles :
 *   - la boutique n'existe que sur iPhone et iPad pour l'instant (Google Play n'a pas de fiche) ;
 *   - on ne propose la Pro QUE lorsque l'App Store a répondu avec le produit et son prix. Un bouton
 *     d'achat qui ne peut pas aboutir est un motif de refus Apple, et le prix vient toujours de la
 *     boutique, jamais d'un texte écrit dans l'app ;
 *   - un achat remboursé ne vaut plus rien : on écarte toute transaction révoquée.
 */
import { Capacitor } from '@capacitor/core';
import { NativePurchases } from '@capgo/native-purchases';
import { ownsPro, PRO_PRODUCT_ID } from './entitlement';

export { ownsPro };

export interface ProOffer {
  /** Prix localisé fourni par l'App Store (« 2,99 € », « $2.99 »…). */
  priceString: string;
  title: string;
  productId: string;
}

export type PurchaseOutcome = { ok: true } | { ok: false; cancelled: boolean; pending?: boolean; message?: string };

/** La boutique est-elle branchée sur cette plateforme ? */
export const purchasesAvailable = Capacitor.getPlatform() === 'ios';


/* ------------------------------------------------------------------ l'offre, observable */

let offer: ProOffer | null = null;
const offerListeners = new Set<(o: ProOffer | null) => void>();

function setOffer(o: ProOffer | null) {
  offer = o;
  offerListeners.forEach((l) => l(o));
}

/** L'offre telle que l'App Store l'a donnée, ou null tant qu'il n'a pas répondu. */
export function currentOffer(): ProOffer | null {
  return offer;
}

export function onOfferChange(cb: (o: ProOffer | null) => void): () => void {
  offerListeners.add(cb);
  return () => {
    offerListeners.delete(cb);
  };
}

let enCours: Promise<ProOffer | null> | null = null;

/**
 * Demande le produit à l'App Store. Une panne passagère ne fait pas disparaître une offre déjà
 * obtenue : on garde la dernière réponse valable.
 */
export function fetchProOffer(): Promise<ProOffer | null> {
  if (!purchasesAvailable) return Promise.resolve(null);
  if (enCours) return enCours;
  enCours = (async () => {
    try {
      const { products } = await NativePurchases.getProducts({ productIdentifiers: [PRO_PRODUCT_ID] });
      const p = products.find((x) => x.identifier === PRO_PRODUCT_ID);
      if (p && p.priceString) setOffer({ priceString: p.priceString, title: p.title, productId: p.identifier });
      else if (!offer) setOffer(null);
    } catch {
      /* réseau, produit pas encore validé : on réessaiera au prochain retour dans l'app */
    } finally {
      enCours = null;
    }
    return offer;
  })();
  return enCours;
}

/** null = boutique indisponible ou injoignable : on garde alors ce qu'on savait. */
export async function fetchProActive(): Promise<boolean | null> {
  if (!purchasesAvailable) return null;
  try {
    const { purchases } = await NativePurchases.getPurchases();
    return ownsPro(purchases);
  } catch {
    return null;
  }
}

export async function purchasePro(o: ProOffer): Promise<PurchaseOutcome> {
  if (!purchasesAvailable) return { ok: false, cancelled: false, message: 'unavailable' };
  try {
    const t = await NativePurchases.purchaseProduct({ productIdentifier: o.productId, quantity: 1 });
    if (ownsPro([t])) return { ok: true };
    // Réponse inattendue : on se fie à la liste des achats, qui fait foi.
    return (await fetchProActive()) ? { ok: true } : { ok: false, cancelled: false, message: 'not-active' };
  } catch (e) {
    const message = String((e as { message?: string })?.message ?? e);
    if (/cancel/i.test(message)) return { ok: false, cancelled: true };
    // « Demander à acheter » (contrôle parental) : l'achat attend l'accord d'un parent.
    if (/pending/i.test(message)) return { ok: false, cancelled: false, pending: true };
    return { ok: false, cancelled: false, message };
  }
}

/** Restaurer : on resynchronise avec l'App Store, puis on relit les achats. */
export async function restorePro(): Promise<boolean | null> {
  if (!purchasesAvailable) return null;
  let synchronise = true;
  try {
    await NativePurchases.restorePurchases();
  } catch {
    // L'utilisateur a refusé de se connecter, ou pas de réseau : on lit quand même ce qu'on a.
    synchronise = false;
  }
  const active = await fetchProActive();
  // Sans synchronisation, « rien trouvé » ne prouve rien : on dit que la boutique est injoignable
  // plutôt qu'« aucun achat », qui ferait croire à l'acheteur que son achat a disparu.
  if (!synchronise && !active) return null;
  return active;
}

/**
 * Achat fait ailleurs (code d'offre utilisé dans l'App Store, accord parental donné plus tard,
 * autre appareil) ou remboursement : StoreKit prévient, on relit la liste qui fait foi.
 */
export function onProChange(cb: (active: boolean) => void): () => void {
  if (!purchasesAvailable) return () => {};
  let vivant = true;
  let retirer: (() => void) | null = null;
  void NativePurchases.addListener('transactionUpdated', (t) => {
    if (t.productIdentifier !== PRO_PRODUCT_ID) return;
    void fetchProActive().then((active) => {
      if (vivant && active !== null) cb(active);
    });
  })
    .then((h) => {
      if (vivant) retirer = () => void h.remove();
      else void h.remove();
    })
    .catch(() => undefined);
  return () => {
    vivant = false;
    retirer?.();
  };
}

/*
 * Captures d'écran et vérifications en développement uniquement : simuler la réponse de l'App Store.
 * Ce code disparaît de la build de production (import.meta.env.DEV vaut false).
 */
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __fuFakeOffer?: (price?: string) => void }).__fuFakeOffer = (price = '2,99 €') =>
    setOffer({ priceString: price, title: 'Version Pro', productId: PRO_PRODUCT_ID });
}
