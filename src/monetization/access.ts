/**
 * QUI PEUT OBTENIR LA VERSION PRO, ET QUAND LA PROPOSER.
 *
 * Sur l'App Store, un contenu payant ne se débloque QUE par l'achat intégré d'Apple. La 1.0 a été
 * refusée pour cette raison (règle 3.1.1, 23/09/2026) : la Version Pro s'activait avec un code.
 * Toute l'app passe par les règles ci-dessous, et nulle part ailleurs.
 *
 *   - `storeExists` : une vraie boutique existe-t-elle ici ? Sur téléphone, seulement là où
 *     l'achat intégré est branché. Sans elle, personne n'a la Pro, code mémorisé ou pas.
 *   - `proOfferedNow()` / `useProOffered()` : peut-on PROPOSER la Pro maintenant ? Sur téléphone,
 *     seulement quand l'App Store a répondu avec le produit et son prix. On n'affiche jamais un
 *     bouton d'achat qui ne peut pas aboutir.
 *   - `codesAllowed` : les codes ne valent que sur le web (et sont absents du binaire des stores,
 *     voir __PRO_CODES__ dans vite.config.ts).
 */
import { useEffect, useState } from 'react';
import { isNative } from '../native';
import { currentOffer, onOfferChange, purchasesAvailable } from './purchases';

/** Les codes Pro sont-ils acceptés ici ? Jamais dans une app publiée sur un store. */
export const codesAllowed = __PRO_CODES__ && !isNative;

/** Une vraie boutique existe-t-elle ici ? Sur le web, la Pro passe par les codes. */
export const storeExists = !isNative || purchasesAvailable;

/** Peut-on proposer la Pro à cet instant ? */
export function proOfferedNow(): boolean {
  return !isNative || currentOffer() !== null;
}

/** La même règle pour un écran : il se redessine quand l'App Store répond. */
export function useProOffered(): boolean {
  const [offered, setOffered] = useState(proOfferedNow);
  useEffect(() => {
    setOffered(proOfferedNow());
    return onOfferChange(() => setOffered(proOfferedNow()));
  }, []);
  return offered;
}
