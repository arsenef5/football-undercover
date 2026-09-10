import type { Category, Pack, WordGroup, WordLang, WordPair } from '../game/types';
import { BASE } from './groups/base';
import { PRO_MORE } from './groups/pro-more';
import { PRO_PLAYERS } from './groups/pro-players';
import type { GroupDef } from './groups/types';

/**
 * Base de mots : des GROUPES de mots proches, bilingues. À chaque partie le moteur tire
 * deux mots différents d'un groupe, donc les duos changent (Coupe du monde / Euro une fois,
 * Coupe du monde / Ligue des champions la fois suivante…).
 *
 * - pack « base » (gratuit) : `src/data/groups/base.ts`
 * - pack « pro » (sans pub) : `pro-players.ts` (joueurs par ressemblance) + `pro-more.ts`
 */

export const CATEGORY_ORDER: Category[] = ['joueur', 'club', 'trophee', 'stade', 'competition', 'but', 'meme', 'style'];

function build(defs: GroupDef[], pack: Pack): WordGroup[] {
  const counters: Partial<Record<Category, number>> = {};
  return defs.map((def) => {
    const n = (counters[def.cat] ?? 0) + 1;
    counters[def.cat] = n;
    const fr = def.words.map((w) => (typeof w === 'string' ? w : w[0]));
    const en = def.words.map((w) => (typeof w === 'string' ? w : w[1]));
    return { id: `${pack}-${def.cat}-${n}`, cat: def.cat, pack, fr, en };
  });
}

export const BASE_GROUPS: WordGroup[] = build(BASE, 'base');
export const PRO_GROUPS: WordGroup[] = build([...PRO_PLAYERS, ...PRO_MORE], 'pro');
export const ALL_GROUPS: WordGroup[] = [...BASE_GROUPS, ...PRO_GROUPS];

/** Groupes disponibles selon la version (gratuite ou Pro). */
export function groupsFor(premium: boolean): WordGroup[] {
  return premium ? ALL_GROUPS : BASE_GROUPS;
}

/** Nombre de mots (et non de groupes) : c'est ce qu'on affiche à l'utilisateur. */
export function countWords(groups: readonly WordGroup[]): number {
  return groups.reduce((s, g) => s + g.fr.length, 0);
}

export function countWordsByCategory(groups: readonly WordGroup[]): Record<Category, number> {
  const out: Record<Category, number> = { joueur: 0, club: 0, trophee: 0, stade: 0, competition: 0, but: 0, meme: 0, style: 0 };
  groups.forEach((g) => (out[g.cat] += g.fr.length));
  return out;
}

export const BASE_WORD_COUNT = countWords(BASE_GROUPS);
export const PRO_WORD_COUNT = countWords(PRO_GROUPS);
export const TOTAL_WORD_COUNT = countWords(ALL_GROUPS);

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * Nombre de combinaisons DISTINCTES : un duo = deux mots différents d'un même groupe (ce que le
 * jeu tire réellement). Un même duo présent dans plusieurs groupes ne compte qu'une fois.
 * C'est le chiffre parlant pour le joueur, bien plus que le nombre de mots (décision d'Arsène, 10/09/2026).
 */
export function countCombos(groups: readonly WordGroup[]): number {
  const seen = new Set<string>();
  for (const g of groups) {
    for (let i = 0; i < g.fr.length; i++) for (let j = i + 1; j < g.fr.length; j++) seen.add(pairKey(g.fr[i], g.fr[j]));
  }
  return seen.size;
}

export function countCombosByCategory(groups: readonly WordGroup[]): Record<Category, number> {
  const out: Record<Category, number> = { joueur: 0, club: 0, trophee: 0, stade: 0, competition: 0, but: 0, meme: 0, style: 0 };
  for (const cat of CATEGORY_ORDER) out[cat] = countCombos(groups.filter((g) => g.cat === cat));
  return out;
}

export const BASE_COMBO_COUNT = countCombos(BASE_GROUPS);
export const TOTAL_COMBO_COUNT = countCombos(ALL_GROUPS);
/** Ce que la version Pro ajoute réellement : les duos absents de la version gratuite. */
export const PRO_EXTRA_COMBOS = TOTAL_COMBO_COUNT - BASE_COMBO_COUNT;

/** Les deux mots d'une paire dans la langue de jeu choisie. */
export function pairWords(pair: WordPair, lang: WordLang): [string, string] {
  return pair[lang];
}
