// Types partagés du moteur de jeu. Aucune dépendance React ici : le moteur est pur.

export type Role = 'civil' | 'undercover' | 'white';

export type Category =
  | 'joueur'
  | 'club'
  | 'trophee'
  | 'stade'
  | 'competition'
  | 'but'
  | 'meme'
  | 'style';

export type Pack = 'base' | 'pro';

/** Langue des mots de jeu (indépendante de la langue des menus). */
export type WordLang = 'fr' | 'en';

/**
 * Un groupe de mots proches (ex. « grandes compétitions » : Coupe du monde, Euro, Ligue des champions…).
 * À chaque partie, le jeu tire DEUX mots différents du groupe : les duos changent, personne ne les retient.
 * `fr` et `en` sont alignés index par index.
 */
export interface WordGroup {
  id: string;
  cat: Category;
  pack: Pack;
  fr: string[];
  en: string[];
}

/** Le duo tiré pour une partie (dérivé d'un groupe). `id` = id du groupe, pour éviter de le rejouer trop vite. */
export interface WordPair {
  id: string;
  cat: Category;
  pack: Pack;
  fr: [string, string];
  en: [string, string];
}

/** Un siège autour de la table : ce que le moteur a besoin de savoir d'un joueur. */
export interface Seat {
  id: string;
  name: string;
  avatar: string;
  color: string;
  /** Photo du joueur (data URL), facultative. */
  photo?: string | null;
}

export interface GamePlayer extends Seat {
  role: Role;
  /** null pour Mr. White. */
  word: string | null;
  alive: boolean;
  eliminatedRound: number | null;
}

export interface GameConfig {
  undercovers: number;
  mrWhite: boolean;
}

export type Phase = 'reveal' | 'discuss' | 'vote' | 'whiteGuess' | 'over';

export type Winner = 'civils' | 'undercovers' | 'white';

export interface Elimination {
  round: number;
  playerId: string;
  role: Role;
  whiteGuess?: string;
  whiteGuessCorrect?: boolean;
}

export interface GameResult {
  winner: Winner;
  /** Joueurs qui marquent des points. */
  winnerIds: string[];
  points: Record<string, number>;
}

export interface Game {
  id: string;
  startedAt: number;
  players: GamePlayer[];
  pair: WordPair;
  civilWord: string;
  undercoverWord: string;
  config: GameConfig;
  round: number;
  phase: Phase;
  /** Index du joueur qui doit voir son mot pendant la distribution. */
  revealIndex: number;
  /** Ordre de parole du tour courant (ids). */
  speakingOrder: string[];
  history: Elimination[];
  /** Mr. White éliminé qui doit encore deviner. */
  pendingWhiteId: string | null;
  result: GameResult | null;
}
