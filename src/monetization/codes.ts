/**
 * Codes d'accès Pro hors boutique (Arsène et ses amis, testeurs). L'app ne contient que les
 * empreintes SHA-256 : retirer une ligne révoque le code à la mise à jour suivante. Les codes
 * en clair sont chez Arsène. Un code accepté est gardé dans les réglages (`proCode`) et vaut
 * Version Pro sur cet appareil, indépendamment de la boutique.
 */
const HASHES = new Set<string>([
  '95b56766ade2832c718b6db2650f085ce96c4a633aced62b2b13315bc25f469e', // créateur
  '6498a7e873726cea16f4a281b22ec5be5d477565f47c3e8f5c2bcf8ae5d122a9',
  '1b46dcefd89b646dc9b596bdc42d012f3b24bc422aabfe063e80b781c63b4e13',
  'f1a22a8a08c760ca3db9b7e9296fdd6465a2dc72b9ae2d4017b81e29f29c5871',
  'cab4a8678da9aa2bad6e1c8701f190c34343f7136afdbe1cf491924e800baa6a',
  '47f520ae0ad5cbdc19ee6c64c448d75c4db2932114fecd9f4a77b14cc6378221',
  'a113abc1e9d5593d3d81552403a8beb0dda0e16a238341caac231b87c210bd3b',
  '2ebe82a8e11a72ee4d5fc09079a5c9a0f9c3408b0ca824f63dcde7737c4e59df',
  'c869115563ca9a90e37a5001928bb21d913e77bd4ae984d0dab93caa5850689c',
  '010648e15cff2ca3a78ce8d30db5cf026af3eaf68d2efd7d4b5d4c0c8fb7e3c4',
  'f34181dd02572a069aa152755d8f42e486da37862fb00219216665188df78315',
]);

/** Majuscules, sans espaces ; les tirets bas et espaces deviennent des tirets. */
export function normalizeCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

async function sha256Hex(text: string): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;
  const buf = await subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Vrai si le code (quelle que soit sa casse) fait partie des codes valides. */
export async function checkProCode(raw: string): Promise<boolean> {
  const code = normalizeCode(raw);
  if (!code) return false;
  const hex = await sha256Hex(code);
  return hex !== null && HASHES.has(hex);
}
