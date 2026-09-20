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

export function normalizeCode(s: string): string {
  return s
    .toUpperCase()
    .replace(/[IL|]/g, '')
    .replace(/[^A-Z]/g, '')
    .slice(0, CODE_LENGTH);
}

export type OnlinePhase = 'lobby' | 'reveal' | 'discuss' | 'vote' | 'whiteGuess' | 'over';

export interface RoomPlayer {
  id: string;
  name: string;
  color: string;
  host: boolean;
  connected: boolean;
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
  config: { undercovers: number; mrWhite: boolean; lang: WordLang };
  category: Category | null;
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
  | { t: 'hello'; code: string; seatId: string; name: string; color: string }
  | { t: 'config'; undercovers?: number; mrWhite?: boolean; lang?: WordLang }
  | { t: 'start' }
  | { t: 'seen' }
  | { t: 'toVote' }
  | { t: 'vote'; target: string }
  | { t: 'guess'; text: string }
  | { t: 'judge'; correct: boolean }
  | { t: 'again' }
  | { t: 'kick'; target: string }
  | { t: 'ping' };

export type ServerMsg =
  | { t: 'room'; room: RoomView; you: string }
  | { t: 'private'; priv: PrivateView | null }
  | { t: 'error'; code: 'full' | 'started' | 'unknown-room' | 'bad-name' | 'kicked' | 'not-host' | 'bad-move'; message: string }
  | { t: 'pong' };

/** Pseudos : courts, sans emoji (les emoji servent à contourner les filtres de mots). */
export function cleanName(raw: string): string {
  return raw
    .replace(/[^\p{L}\p{N} '-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 14);
}
