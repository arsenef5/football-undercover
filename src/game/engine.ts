import type {
  Category,
  Elimination,
  Game,
  GameConfig,
  GamePlayer,
  GameResult,
  Role,
  Seat,
  Winner,
  WordGroup,
  WordLang,
  WordPair,
} from './types';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 20;

/** Barème façon Undercover : le civil gagne peu, l'imposteur gagne gros. */
export const POINTS: Record<Role, number> = { civil: 2, undercover: 10, white: 6 };

export type Rng = () => number;

/** Nombre maximal d'imposteurs (undercovers + Mr. White) pour que les civils restent majoritaires. */
export function maxImpostors(playerCount: number): number {
  return Math.max(0, Math.floor((playerCount - 1) / 2));
}

/** Réglage conseillé selon la taille de la table. */
export function suggestConfig(playerCount: number): GameConfig {
  const undercovers = playerCount <= 5 ? 1 : playerCount <= 8 ? 2 : playerCount <= 12 ? 3 : 4;
  const mrWhite = playerCount >= 5;
  return clampConfig(playerCount, { undercovers, mrWhite });
}

/** Ramène une config dans les bornes valides sans jamais renvoyer une table injouable. */
export function clampConfig(playerCount: number, cfg: GameConfig): GameConfig {
  const max = maxImpostors(playerCount);
  const mrWhite = cfg.mrWhite;
  let undercovers = Math.max(0, Math.floor(cfg.undercovers));
  if (max <= 0) return { undercovers: 0, mrWhite: false };
  if (undercovers + (mrWhite ? 1 : 0) > max) {
    undercovers = Math.max(0, max - (mrWhite ? 1 : 0));
  }
  if (undercovers === 0 && !mrWhite) {
    undercovers = 1;
  }
  return { undercovers, mrWhite };
}

/** Message d'erreur (FR) si la config est injouable, sinon null. */
export function validateConfig(playerCount: number, cfg: GameConfig): string | null {
  if (playerCount < MIN_PLAYERS) return `Il faut au moins ${MIN_PLAYERS} joueurs.`;
  if (playerCount > MAX_PLAYERS) return `Maximum ${MAX_PLAYERS} joueurs.`;
  const impostors = cfg.undercovers + (cfg.mrWhite ? 1 : 0);
  if (impostors < 1) return 'Il faut au moins un Undercover ou un Mr. White.';
  if (impostors > maxImpostors(playerCount)) {
    return `Trop d'imposteurs pour ${playerCount} joueurs (max ${maxImpostors(playerCount)}).`;
  }
  return null;
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Poids relatifs par catégorie (curseurs). Une catégorie à 0 n'est jamais tirée. */
export type Weights = Partial<Record<Category, number>>;

export const ALL_CATEGORIES: Category[] = ['joueur', 'club', 'trophee', 'stade', 'competition', 'but', 'meme', 'style'];

/** Réglage de base demandé : 60 % de joueurs, le reste réparti sur les autres catégories. */
export const DEFAULT_WEIGHTS: Record<Category, number> = {
  joueur: 60,
  club: 8,
  trophee: 5,
  stade: 5,
  competition: 5,
  but: 7,
  meme: 5,
  style: 5,
};

export const WEIGHT_PRESETS: Record<'players' | 'mix' | 'balanced', Record<Category, number>> = {
  players: { joueur: 100, club: 0, trophee: 0, stade: 0, competition: 0, but: 0, meme: 0, style: 0 },
  mix: DEFAULT_WEIGHTS,
  balanced: { joueur: 12, club: 12, trophee: 12, stade: 12, competition: 12, but: 12, meme: 12, style: 12 },
};

/** Part effective (0..1) de chaque catégorie pour des poids donnés. */
export function shares(weights: Weights): Record<Category, number> {
  const total = ALL_CATEGORIES.reduce((s, c) => s + Math.max(0, weights[c] ?? 0), 0);
  const out = {} as Record<Category, number>;
  ALL_CATEGORIES.forEach((c) => {
    out[c] = total > 0 ? Math.max(0, weights[c] ?? 0) / total : 0;
  });
  return out;
}

export interface CreateGameOptions {
  rng?: Rng;
  /** Paires déjà jouées récemment : on les évite tant qu'il en reste d'autres. */
  exclude?: readonly string[];
  /** Curseurs par catégorie. Absent = tirage uniforme sur toutes les paires. */
  weights?: Weights;
  /** Langue des mots affichés (fr par défaut). */
  lang?: WordLang;
  /** Par défaut le carton blanc ne parle jamais en premier ; option pour l'autoriser. */
  whiteCanStart?: boolean;
  now?: number;
  id?: string;
}

/** Deux mots différents tirés dans un groupe : le duo change d'une partie à l'autre. */
export function pairFromGroup(group: WordGroup, rng: Rng): WordPair {
  const n = Math.min(group.fr.length, group.en.length);
  if (n < 2) throw new Error(`Groupe trop petit : ${group.id}`);
  const i = Math.floor(rng() * n);
  let j = Math.floor(rng() * (n - 1));
  if (j >= i) j += 1;
  return { id: group.id, cat: group.cat, pack: group.pack, fr: [group.fr[i], group.fr[j]], en: [group.en[i], group.en[j]] };
}

/**
 * Choisit une paire : d'abord la catégorie (au poids), puis un groupe dedans en évitant
 * ceux joués récemment, puis deux mots du groupe. Si tous les curseurs sont à zéro ou si
 * une catégorie pondérée n'a aucun groupe, on retombe sur un tirage uniforme.
 */
export function pickPair(groups: readonly WordGroup[], opts: CreateGameOptions = {}): WordPair {
  const rng = opts.rng ?? Math.random;
  const usable = groups.filter((g) => Math.min(g.fr.length, g.en.length) >= 2);
  if (usable.length === 0) throw new Error('Aucun mot disponible.');
  const exclude = new Set(opts.exclude ?? []);
  const fromPool = (pool0: readonly WordGroup[]) => {
    const pool1 = pool0.filter((g) => !exclude.has(g.id));
    const pool = pool1.length > 0 ? pool1 : pool0;
    return pairFromGroup(pool[Math.floor(rng() * pool.length)], rng);
  };

  const weights = opts.weights;
  if (!weights) return fromPool(usable);

  const byCat = new Map<Category, WordGroup[]>();
  usable.forEach((g) => {
    const list = byCat.get(g.cat);
    if (list) list.push(g);
    else byCat.set(g.cat, [g]);
  });
  const cats = [...byCat.keys()].filter((c) => (weights[c] ?? 0) > 0);
  if (cats.length === 0) return fromPool(usable);

  const total = cats.reduce((s, c) => s + (weights[c] ?? 0), 0);
  let r = rng() * total;
  let chosen = cats[cats.length - 1];
  for (const c of cats) {
    const w = weights[c] ?? 0;
    if (r < w) {
      chosen = c;
      break;
    }
    r -= w;
  }
  return fromPool(byCat.get(chosen) ?? usable);
}

export function createGame(
  seats: readonly Seat[],
  cfgInput: GameConfig,
  pairs: readonly WordGroup[],
  opts: CreateGameOptions = {},
): Game {
  const rng = opts.rng ?? Math.random;
  const error = validateConfig(seats.length, cfgInput);
  if (error) throw new Error(error);
  const cfg = { undercovers: cfgInput.undercovers, mrWhite: cfgInput.mrWhite };

  const pair = pickPair(pairs, opts);
  const [wordA, wordB] = pair[opts.lang ?? 'fr'];
  const flip = rng() < 0.5;
  const civilWord = flip ? wordB : wordA;
  const undercoverWord = flip ? wordA : wordB;

  // Distribution des rôles : on mélange les sièges, les premiers deviennent imposteurs.
  const order = shuffle(seats, rng);
  const roleOf = new Map<string, Role>();
  order.forEach((s, i) => {
    if (i < cfg.undercovers) roleOf.set(s.id, 'undercover');
    else if (cfg.mrWhite && i === cfg.undercovers) roleOf.set(s.id, 'white');
    else roleOf.set(s.id, 'civil');
  });

  const players: GamePlayer[] = seats.map((s) => {
    const role = roleOf.get(s.id) ?? 'civil';
    return {
      ...s,
      role,
      word: role === 'civil' ? civilWord : role === 'undercover' ? undercoverWord : null,
      alive: true,
      eliminatedRound: null,
    };
  });

  const game: Game = {
    id: opts.id ?? `g_${Date.now().toString(36)}_${Math.floor(rng() * 1e6).toString(36)}`,
    startedAt: opts.now ?? Date.now(),
    players,
    pair,
    civilWord,
    undercoverWord,
    config: cfg,
    round: 1,
    phase: 'reveal',
    revealIndex: 0,
    speakingOrder: [],
    history: [],
    pendingWhiteId: null,
    result: null,
  };
  game.speakingOrder = firstRoundOrder(game, rng, opts.whiteCanStart ?? false);
  return game;
}

/** Ordre de parole du tour 1 : départ aléatoire, jamais le carton blanc sauf option contraire. */
export function firstRoundOrder(game: Game, rng: Rng, whiteCanStart = false): string[] {
  const alive = game.players.filter((p) => p.alive);
  const candidates = whiteCanStart ? alive : alive.filter((p) => p.role !== 'white');
  const starter = candidates[Math.floor(rng() * candidates.length)] ?? alive[0];
  return rotateFrom(alive.map((p) => p.id), starter.id);
}

/** Tour suivant : on avance d'un siège (vivant) par rapport au premier orateur précédent. */
export function nextRoundOrder(game: Game): string[] {
  const aliveIds = game.players.filter((p) => p.alive).map((p) => p.id);
  if (aliveIds.length === 0) return [];
  const prevStarter = game.speakingOrder[0];
  const seatIds = game.players.map((p) => p.id);
  const start = seatIds.indexOf(prevStarter);
  for (let k = 1; k <= seatIds.length; k++) {
    const id = seatIds[(start + k) % seatIds.length];
    if (aliveIds.includes(id)) return rotateFrom(aliveIds, id);
  }
  return aliveIds;
}

/**
 * Nouvel ordre des sièges (liste complète des ids). L'ordre de parole du tour courant
 * est recalculé en gardant le même premier orateur. Refusé pendant la distribution
 * (l'index de révélation suit les sièges) ou si la liste n'est pas une permutation.
 */
export function reorderSeats(game: Game, ids: readonly string[]): Game {
  if (game.phase === 'reveal' || game.phase === 'over') return game;
  const byId = new Map(game.players.map((p) => [p.id, p]));
  const valid =
    ids.length === game.players.length && new Set(ids).size === ids.length && ids.every((id) => byId.has(id));
  if (!valid) return game;
  const players = ids.map((id) => byId.get(id)!);
  const aliveIds = players.filter((p) => p.alive).map((p) => p.id);
  const starter = game.speakingOrder[0];
  const speakingOrder = aliveIds.includes(starter) ? rotateFrom(aliveIds, starter) : aliveIds;
  return { ...game, players, speakingOrder };
}

function rotateFrom(ids: string[], startId: string): string[] {
  const i = ids.indexOf(startId);
  if (i < 0) return ids;
  return [...ids.slice(i), ...ids.slice(0, i)];
}

export function revealNext(game: Game): Game {
  if (game.phase !== 'reveal') return game;
  const next = game.revealIndex + 1;
  if (next >= game.players.length) return { ...game, revealIndex: next, phase: 'discuss' };
  return { ...game, revealIndex: next };
}

export function goToVote(game: Game): Game {
  if (game.phase !== 'discuss') return game;
  return { ...game, phase: 'vote' };
}

export function backToDiscussion(game: Game): Game {
  if (game.phase !== 'vote') return game;
  return { ...game, phase: 'discuss' };
}

export interface Counts {
  civils: number;
  undercovers: number;
  whites: number;
  alive: number;
}

export function counts(players: readonly GamePlayer[]): Counts {
  let civils = 0;
  let undercovers = 0;
  let whites = 0;
  for (const p of players) {
    if (!p.alive) continue;
    if (p.role === 'civil') civils++;
    else if (p.role === 'undercover') undercovers++;
    else whites++;
  }
  return { civils, undercovers, whites, alive: civils + undercovers + whites };
}

/**
 * Fin de partie ?
 * - Titulaires : plus aucun imposteur en vie.
 * - Imposteurs : il ne reste qu'un titulaire, ou les undercovers sont aussi nombreux que les titulaires.
 *   S'il n'y a plus (ou pas) d'undercover en vie, c'est le carton blanc survivant qui gagne en son nom.
 */
export function computeOutcome(players: readonly GamePlayer[]): Winner | null {
  const c = counts(players);
  if (c.undercovers + c.whites === 0) return 'civils';
  if (c.civils <= 1 || c.civils <= c.undercovers) return c.undercovers === 0 ? 'white' : 'undercovers';
  return null;
}

export function eliminate(game: Game, playerId: string): Game {
  if (game.phase !== 'vote' && game.phase !== 'discuss') return game;
  const target = game.players.find((p) => p.id === playerId);
  if (!target || !target.alive) return game;

  const players = game.players.map((p) =>
    p.id === playerId ? { ...p, alive: false, eliminatedRound: game.round } : p,
  );
  const entry: Elimination = { round: game.round, playerId, role: target.role };
  const next: Game = { ...game, players, history: [...game.history, entry] };

  if (target.role === 'white') {
    return { ...next, phase: 'whiteGuess', pendingWhiteId: playerId };
  }
  return advanceAfterElimination(next);
}

/** Verdict sur la proposition de Mr. White (le groupe peut corriger le verdict suggéré). */
export function resolveWhiteGuess(game: Game, guess: string, correct: boolean): Game {
  if (game.phase !== 'whiteGuess' || !game.pendingWhiteId) return game;
  const whiteId = game.pendingWhiteId;
  const history = game.history.map((h, i) =>
    i === game.history.length - 1 && h.playerId === whiteId
      ? { ...h, whiteGuess: guess, whiteGuessCorrect: correct }
      : h,
  );
  const next: Game = { ...game, history, pendingWhiteId: null };
  if (correct) return finish(next, 'white', [whiteId]);
  return advanceAfterElimination(next);
}

function advanceAfterElimination(game: Game): Game {
  const winner = computeOutcome(game.players);
  if (winner) return finish(game, winner);
  const advanced: Game = { ...game, round: game.round + 1, phase: 'discuss' };
  return { ...advanced, speakingOrder: nextRoundOrder(advanced) };
}

/**
 * Attribution des points (par équipe) :
 * - Titulaires gagnants : +2 pour chaque titulaire (même éliminé : le camp a gagné).
 * - Undercovers gagnants : +10 pour chaque undercover, +6 pour un carton blanc encore en vie.
 * - Carton blanc gagnant : +6 pour celui qui a deviné, ou pour chaque carton blanc encore en vie.
 */
export function finish(game: Game, winner: Winner, whiteWinnerIds: string[] = []): Game {
  const points: Record<string, number> = {};
  const winnerIds: string[] = [];
  const award = (id: string, pts: number) => {
    points[id] = (points[id] ?? 0) + pts;
    if (!winnerIds.includes(id)) winnerIds.push(id);
  };
  if (winner === 'civils') {
    game.players.filter((p) => p.role === 'civil').forEach((p) => award(p.id, POINTS.civil));
  } else if (winner === 'undercovers') {
    game.players.filter((p) => p.role === 'undercover').forEach((p) => award(p.id, POINTS.undercover));
    game.players.filter((p) => p.role === 'white' && p.alive).forEach((p) => award(p.id, POINTS.white));
  } else {
    const ids =
      whiteWinnerIds.length > 0
        ? whiteWinnerIds
        : game.players.filter((p) => p.role === 'white' && p.alive).map((p) => p.id);
    ids.forEach((id) => award(id, POINTS.white));
  }
  const result: GameResult = { winner, winnerIds, points };
  return { ...game, phase: 'over', result, pendingWhiteId: null };
}

/** Retire accents, ponctuation et parenthèses : « Cristiano Ronaldo (CR7) » → « cristiano ronaldo ». */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[«»"'’`]/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function significantTokens(s: string): string[] {
  return normalize(s)
    .split(' ')
    .filter((t) => t.length > 2);
}

/**
 * Verdict suggéré pour la proposition de Mr. White. Tolérant : « ronaldo » vaut pour
 * « Cristiano Ronaldo », « neymar jr » vaut pour « Neymar ». Le groupe garde le dernier mot.
 */
export function isGuessLikelyCorrect(guess: string, word: string): boolean {
  const g = normalize(guess);
  const w = normalize(word);
  if (!g) return false;
  if (g === w) return true;
  const gt = significantTokens(guess);
  const wt = significantTokens(word);
  if (gt.length === 0 || wt.length === 0) return false;
  const sub = (a: string[], b: string[]) => a.every((t) => b.includes(t));
  return sub(gt, wt) || sub(wt, gt);
}

export function roleLabel(role: Role): string {
  return role === 'civil' ? 'Civil' : role === 'undercover' ? 'Undercover' : 'Mr. White';
}

export function alivePlayers(game: Game): GamePlayer[] {
  return game.players.filter((p) => p.alive);
}

export function playerById(game: Game, id: string): GamePlayer | undefined {
  return game.players.find((p) => p.id === id);
}
