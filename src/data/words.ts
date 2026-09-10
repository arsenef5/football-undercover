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

/** Les deux mots d'une paire dans la langue de jeu choisie. */
export function pairWords(pair: WordPair, lang: WordLang): [string, string] {
  return pair[lang];
}
