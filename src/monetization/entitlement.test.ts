import { describe, expect, it } from 'vitest';
import { ownsPro, PRO_PRODUCT_ID } from './entitlement';

describe('la Version Pro achetée sur l’App Store', () => {
  it('un achat de la Pro la donne', () => {
    expect(ownsPro([{ productIdentifier: PRO_PRODUCT_ID }])).toBe(true);
  });

  it('un achat remboursé ne la donne plus', () => {
    expect(ownsPro([{ productIdentifier: PRO_PRODUCT_ID, revocationDate: '2026-10-02T10:00:00Z' }])).toBe(false);
  });

  it('un rachat après remboursement la redonne', () => {
    expect(
      ownsPro([
        { productIdentifier: PRO_PRODUCT_ID, revocationDate: '2026-10-02T10:00:00Z' },
        { productIdentifier: PRO_PRODUCT_ID, revocationDate: null },
      ]),
    ).toBe(true);
  });

  it("l'achat d'un autre produit ne la donne pas", () => {
    expect(ownsPro([{ productIdentifier: 'autre_chose' }])).toBe(false);
    expect(ownsPro([])).toBe(false);
  });
});
