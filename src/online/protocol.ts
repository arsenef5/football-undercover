/**
 * MODE EN LIGNE 🌐 — le langage commun entre les téléphones et le serveur de salons.
 *
 * Règle absolue de ce fichier : le serveur ne met JAMAIS dans `RoomView` un mot ou un rôle que
 * le joueur n'a pas le droit de connaître. Le mot secret ne voyage que dans `PrivateView`, sur la
 * seule connexion de son propriétaire. C'est ce qui rend le bluff possible à distance : un joueur
 * qui inspecte la mémoire de son téléphone ne trouve que SA part.
 */
import type { Category, Role, WordLang, Winner } from '../game/types';

/** Alphabet des codes de salon : ni I, ni O, ni Q (confusions avec 1, 0 et O à l'oral). */
export const CODE_ALPHABET = 'ABCDEFGHJKLMNPRSTUVWXYZ';
export const CODE_LENGTH = 4;

export function isRoomCode(s: string): boolean {
  const c = s.toUpperCase();
  return c.length === CODE_LENGTH && [...c].every((ch) => CODE_ALPHABET.includes(ch));
}

/**
 * Nettoie ce que le joueur tape. On ne supprime QUE les lettres absentes de l'alphabet des codes :
 * I, O et Q ne sont jamais tirées (confusions avec 1, 0 et O), donc les rencontrer ici est une
 * faute de frappe. Attention : ne jamais supprimer une lettre que le serveur peut tirer, sinon
 * une partie des codes devient impossible à saisir.
 */
export function normalizeCode(s: string): string {
  return [...s.toUpperCase()].filter((c) => CODE_ALPHABET.includes(c)).join('').slice(0, CODE_LENGTH);
}

export type OnlinePhase = 'lobby' | 'reveal' | 'discuss' | 'vote' | 'whiteGuess' | 'over';

export interface RoomPlayer {
  id: string;
  name: string;
  color: string;
  host: boolean;
  connected: boolean;
  /** A quitté la table : affiché jusqu'à la fin de la manche, mais il ne reviendra pas. */
  gone: boolean;
  alive: boolean;
  /** A vu son mot (phase de distribution). */
  seen: boolean;
  /** A voté ce tour-ci — jamais POUR QUI, sinon le vote n'est plus secret. */
  voted: boolean;
  /** Rôle, uniquement une fois révélé publiquement (élimination ou fin de partie). */
  role: Role | null;
  /** Points du joueur sur la session du salon. */
  points: number;
}

export interface RoomView {
  code: string;
  phase: OnlinePhase;
  round: number;
  players: RoomPlayer[];
  /** Ordre de parole du tour (identifiants), vide hors discussion. */
  speakingOrder: string[];
  /** À qui c'est de parler. null = tout le monde a parlé, place au débat. */
  turnId: string | null;
  config: { undercovers: number; mrWhite: boolean; lang: WordLang };
  category: Category | null;
  /** Secondes restantes avant le dépouillement d'office, null hors vote. */
  voteEndsIn: number | null;
  /** Secondes restantes laissées au carton blanc pour répondre, null hors dernière chance. */
  guessEndsIn: number | null;
  /** Vrai quand le salon accepte de reprendre sans la réponse du carton blanc (il a quitté la table). */
  canSkipWhite: boolean;
  /** Vrai quand le salon accepte de passer l'orateur en cours (capitaine, ou orateur absent). */
  canSkipTurn: boolean;
  lastElimination: { id: string; name: string; role: Role } | null;
  whiteGuess: { id: string; name: string; guess: string | null } | null;
  result: {
    winner: Winner;
    civilWord: string;
    undercoverWord: string;
    lines: { id: string; name: string; role: Role; points: number }[];
  } | null;
  /** Ce que l'hôte doit corriger avant de pouvoir lancer, ou null si tout va bien. */
  blocked: string | null;
}

/** La part privée d'un joueur : son mot, son rôle. Envoyée à lui seul. */
export interface PrivateView {
  role: Role;
  word: string | null;
  category: Category;
}

export type ClientMsg =
  | { t: 'hello'; code: string; seatId: string; name: string; color: string; token?: string }
  | { t: 'config'; undercovers?: number; mrWhite?: boolean; lang?: WordLang; pro?: boolean }
  | { t: 'start' }
  | { t: 'seen' }
  | { t: 'ready' }
  | { t: 'leave' }
  | { t: 'spoke' }
  | { t: 'skip' }
  | { t: 'toVote' }
  | { t: 'vote'; target: string }
  | { t: 'guess'; text: string }
  | { t: 'judge'; correct: boolean }
  | { t: 'again' }
  | { t: 'toLobby' }
  | { t: 'kick'; target: string }
  | { t: 'report'; target: string }
  | { t: 'ping' };

export type ServerMsg =
  | { t: 'room'; room: RoomView; you: string }
  | { t: 'private'; priv: PrivateView | null }
  | { t: 'welcome'; seatId: string; token: string }
  | { t: 'error'; code: 'full' | 'started' | 'unknown-room' | 'bad-name' | 'kicked' | 'not-host' | 'bad-move' | 'taken'; message: string }
  | { t: 'reported' }
  | { t: 'pong' };

/** Pseudos : courts, sans emoji (les emoji servent à contourner les filtres de mots). */
export function cleanName(raw: string): string {
  return raw
    .replace(/[^\p{L}\p{N} '-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 14);
}

/*
 * Un pseudo tapé par un joueur s'affiche sur l'écran des autres : c'est du contenu d'utilisateur,
 * et les stores demandent alors un filtre. Liste volontairement courte et lisible ; elle sera
 * étoffée avant l'ouverture au public. Le filtre tourne des DEUX côtés : le téléphone pour le
 * confort, le salon parce que c'est lui qui fait foi.
 */
const INTERDITS = [
  'connard', 'connasse', 'enculé', 'encule', 'pute', 'putain', 'salope', 'batard', 'bâtard',
  'nique', 'niquer', 'ntm', 'pd', 'tapette', 'bougnoule', 'negro', 'nègre', 'youpin', 'bicot',
  'fuck', 'fucker', 'shit', 'bitch', 'cunt', 'nigger', 'nigga', 'faggot', 'whore', 'rape',
  'hitler', 'nazi',
];

/** Rend le mot interdit trouvé dans le pseudo, ou null s'il est acceptable. */
export function badWord(name: string): string | null {
  const nu = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
  return INTERDITS.find((m) => nu.includes(m.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, ''))) ?? null;
}

export function nameError(raw: string): 'court' | 'grossier' | null {
  const n = cleanName(raw);
  if (n.length < 2) return 'court';
  if (badWord(n)) return 'grossier';
  return null;
}
