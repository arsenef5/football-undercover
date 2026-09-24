/**
 * QUI PEUT OBTENIR LA VERSION PRO, ET PAR QUEL CHEMIN.
 *
 * Sur l'App Store (et sur Google Play), un contenu payant ne peut se débloquer QUE par l'achat
 * intégré de la boutique. Apple a refusé la 1.0 pour cette raison précise (règle 3.1.1, 23/09/2026) :
 * la Version Pro s'activait avec un code. Toute l'app passe donc par ces deux règles, et nulle part
 * ailleurs :
 *
 *   - sur téléphone, la Pro n'existe que si le vrai achat intégré fonctionne. Tant que la boutique
 *     n'est pas ouverte (contrat « applications payantes » non signé), l'app est simplement la
 *     version gratuite : aucun écran Pro, aucun prix, aucune promesse, aucun code ;
 *   - les codes ne valent que sur le web, où aucune boutique n'impose ses règles.
 *
 * Le jour où la clé RevenueCat est renseignée et le produit créé, `purchasesAvailable` devient vrai
 * et tout ce qui concerne la Pro réapparaît de lui-même, avec un vrai bouton d'achat.
 */
import { isNative } from '../native';
import { purchasesAvailable } from './purchases';

/** Les codes Pro sont-ils acceptés ici ? Jamais dans une app publiée sur un store. */
export const codesAllowed = __PRO_CODES__ && !isNative;

/** Peut-on parler de la Version Pro ici ? Sur téléphone, seulement si l'achat peut aboutir. */
export const proOffered = !isNative || purchasesAvailable;
