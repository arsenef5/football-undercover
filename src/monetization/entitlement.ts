/**
 * La règle qui décide si l'on possède la Version Pro, isolée pour être testée sans téléphone.
 * Un achat remboursé ou révoqué par Apple porte une date de révocation : il ne vaut plus rien.
 */
export const PRO_PRODUCT_ID = 'fu_pro';

export interface ProofOfPurchase {
  productIdentifier: string;
  revocationDate?: string | null;
}

export function ownsPro(list: readonly ProofOfPurchase[]): boolean {
  return list.some((t) => t.productIdentifier === PRO_PRODUCT_ID && !t.revocationDate);
}
