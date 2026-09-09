import { describe, expect, it } from 'vitest';
import {
  clampConfig,
  computeOutcome,
  counts,
  createGame,
  DEFAULT_WEIGHTS,
  eliminate,
  goToVote,
  isGuessLikelyCorrect,
  maxImpostors,
  nextRoundOrder,
  normalize,
  pickPair,
  POINTS,
  reorderSeats,
  resolveWhiteGuess,
  revealNext,
  shares,
  suggestConfig,
  validateConfig,
  WEIGHT_PRESETS,
} from './engine';
import { ALL_GROUPS, BASE_GROUPS, BASE_WORD_COUNT, countWords, countWordsByCategory, PRO_GROUPS, TOTAL_WORD_COUNT } from '../data/words';
import { pairFromGroup } from './engine';
import type { Category, Game, Seat, WordPair } from './types';

/** Générateur déterministe (mulberry32) pour des tests reproductibles. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seats = (n: number): Seat[] =>
  Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `Joueur ${i}`, avatar: '⚽', color: '#fff' }));

const PAIR: WordPair = { id: 't1', cat: 'joueur', pack: 'base', fr: ['Neymar', 'Vinícius Jr'], en: ['Neymar', 'Vinícius Jr'] };

function newGame(n: number, undercovers: number, mrWhite: boolean, seed = 1): Game {
  return createGame(seats(n), { undercovers, mrWhite }, [PAIR], { rng: seeded(seed) });
}

/** Force la partie en phase de vote (après distribution) pour tester les éliminations. */
function toVote(g: Game): Game {
  let x = g;
  while (x.phase === 'reveal') x = revealNext(x);
  return goToVote(x);
}

function idsWithRole(g: Game, role: string, alive = true) {
  return g.players.filter((p) => p.role === role && (!alive || p.alive)).map((p) => p.id);
}

describe('la base de mots', () => {
  it('offre au moins 400 mots gratuits (60 % de joueurs) et 1 000 mots au total', () => {
    expect(BASE_WORD_COUNT).toBeGreaterThanOrEqual(400);
    const byCat = countWordsByCategory(BASE_GROUPS);
    expect(byCat.joueur / BASE_WORD_COUNT).toBeGreaterThanOrEqual(0.55);
    expect(TOTAL_WORD_COUNT).toBeGreaterThanOrEqual(1000);
    expect(countWords(PRO_GROUPS)).toBe(TOTAL_WORD_COUNT - BASE_WORD_COUNT);
  });

  it('couvre les 8 catégories annoncées, dans la base gratuite', () => {
    const cats = new Set(BASE_GROUPS.map((g) => g.cat));
    const expected: Category[] = ['joueur', 'club', 'trophee', 'stade', 'competition', 'but', 'meme', 'style'];
    expected.forEach((c) => expect(cats.has(c)).toBe(true));
  });

  it("chaque groupe a au moins 2 mots, alignés FR/EN, sans doublon ni mot vide", () => {
    const ids = new Set(ALL_GROUPS.map((g) => g.id));
    expect(ids.size).toBe(ALL_GROUPS.length);
    ALL_GROUPS.forEach((g) => {
      expect(g.fr.length).toBeGreaterThanOrEqual(2);
      expect(g.en.length).toBe(g.fr.length);
      for (const lang of ['fr', 'en'] as const) {
        const seen = new Set<string>();
        g[lang].forEach((w) => {
          expect(w.trim()).not.toBe('');
          const key = normalize(w);
          expect(seen.has(key), `doublon « ${w} » dans ${g.id} (${lang})`).toBe(false);
          seen.add(key);
        });
      }
    });
    expect(PRO_GROUPS.every((g) => g.pack === 'pro')).toBe(true);
    expect(BASE_GROUPS.every((g) => g.pack === 'base')).toBe(true);
  });

  it('tire toujours deux mots différents du groupe, et fait varier les duos', () => {
    const rng = seeded(7);
    ALL_GROUPS.forEach((g) => {
      const p = pairFromGroup(g, rng);
      expect(p.fr[0]).not.toBe(p.fr[1]);
      expect(p.en[0]).not.toBe(p.en[1]);
      expect(p.id).toBe(g.id);
    });
    const big = BASE_GROUPS.find((g) => g.fr.length >= 8)!;
    const duos = new Set<string>();
    for (let i = 0; i < 60; i++) duos.add(pairFromGroup(big, rng).fr.slice().sort().join('|'));
    expect(duos.size).toBeGreaterThan(10);
  });

  it('sert les mots dans la langue demandée', () => {
    const pair: WordPair = { id: 'x', cat: 'trophee', pack: 'base', fr: ['Coupe du monde', 'Euro'], en: ['World Cup', 'Euros'] };
    const en = createGame(seats(3), { undercovers: 1, mrWhite: false }, [pair], { rng: seeded(3), lang: 'en' });
    expect(new Set([en.civilWord, en.undercoverWord])).toEqual(new Set(['World Cup', 'Euros']));
    const fr = createGame(seats(3), { undercovers: 1, mrWhite: false }, [pair], { rng: seeded(3) });
    expect(new Set([fr.civilWord, fr.undercoverWord])).toEqual(new Set(['Coupe du monde', 'Euro']));
  });
});

describe('les réglages de table', () => {
  it('garde toujours les civils majoritaires', () => {
    expect(maxImpostors(3)).toBe(1);
    expect(maxImpostors(4)).toBe(1);
    expect(maxImpostors(5)).toBe(2);
    expect(maxImpostors(8)).toBe(3);
    expect(maxImpostors(20)).toBe(9);
    for (let n = 3; n <= 20; n++) {
      const cfg = suggestConfig(n);
      expect(validateConfig(n, cfg)).toBeNull();
      expect(cfg.undercovers + (cfg.mrWhite ? 1 : 0)).toBeGreaterThanOrEqual(1);
    }
  });

  it('ramène une config trop ambitieuse dans les bornes', () => {
    expect(clampConfig(4, { undercovers: 3, mrWhite: true })).toEqual({ undercovers: 0, mrWhite: true });
    expect(clampConfig(4, { undercovers: 0, mrWhite: false })).toEqual({ undercovers: 1, mrWhite: false });
    expect(clampConfig(7, { undercovers: 5, mrWhite: false })).toEqual({ undercovers: 3, mrWhite: false });
  });

  it('refuse les tables injouables', () => {
    expect(validateConfig(2, { undercovers: 1, mrWhite: false })).toMatch(/au moins 3/);
    expect(validateConfig(4, { undercovers: 1, mrWhite: true })).toMatch(/Trop d'imposteurs/);
    expect(validateConfig(5, { undercovers: 0, mrWhite: false })).toMatch(/au moins un/);
    expect(validateConfig(5, { undercovers: 1, mrWhite: true })).toBeNull();
  });
});

describe('la distribution', () => {
  it('donne le bon nombre de rôles et les bons mots', () => {
    const g = newGame(7, 2, true);
    expect(idsWithRole(g, 'undercover')).toHaveLength(2);
    expect(idsWithRole(g, 'white')).toHaveLength(1);
    expect(idsWithRole(g, 'civil')).toHaveLength(4);
    expect(new Set([g.civilWord, g.undercoverWord])).toEqual(new Set(['Neymar', 'Vinícius Jr']));
    g.players.forEach((p) => {
      if (p.role === 'civil') expect(p.word).toBe(g.civilWord);
      if (p.role === 'undercover') expect(p.word).toBe(g.undercoverWord);
      if (p.role === 'white') expect(p.word).toBeNull();
      expect(p.alive).toBe(true);
    });
  });

  it('tire les rôles au sort : sur 200 tirages, chaque siège est parfois imposteur', () => {
    const seen = new Set<string>();
    for (let s = 0; s < 200; s++) {
      const g = newGame(5, 1, true, s);
      g.players.filter((p) => p.role !== 'civil').forEach((p) => seen.add(p.id));
    }
    expect(seen.size).toBe(5);
  });

  it('inverse parfois le sens de la paire', () => {
    const civilWords = new Set<string>();
    for (let s = 0; s < 50; s++) civilWords.add(newGame(4, 1, false, s).civilWord);
    expect(civilWords.size).toBe(2);
  });

  it('ne fait jamais parler le carton blanc en premier au tour 1, sauf option', () => {
    for (let s = 0; s < 100; s++) {
      const g = newGame(5, 1, true, s);
      const first = g.players.find((p) => p.id === g.speakingOrder[0])!;
      expect(first.role).not.toBe('white');
      expect(g.speakingOrder).toHaveLength(5);
    }
    let whiteFirst = 0;
    for (let s = 0; s < 200; s++) {
      const g = createGame(seats(4), { undercovers: 0, mrWhite: true }, [PAIR], { rng: seeded(s), whiteCanStart: true });
      const first = g.players.find((p) => p.id === g.speakingOrder[0])!;
      if (first.role === 'white') whiteFirst++;
    }
    expect(whiteFirst).toBeGreaterThan(20);
  });

  it('passe en discussion après que chacun a vu son mot', () => {
    let g = newGame(4, 1, false);
    expect(g.phase).toBe('reveal');
    for (let i = 0; i < 3; i++) {
      g = revealNext(g);
      expect(g.phase).toBe('reveal');
    }
    g = revealNext(g);
    expect(g.phase).toBe('discuss');
  });
});

describe('le choix des mots', () => {
  const pool: WordPair[] = [
    { id: 'a', cat: 'joueur', pack: 'base', fr: ['A1', 'A2'], en: ['A1', 'A2'] },
    { id: 'b', cat: 'stade', pack: 'base', fr: ['B1', 'B2'], en: ['B1', 'B2'] },
    { id: 'c', cat: 'meme', pack: 'base', fr: ['C1', 'C2'], en: ['C1', 'C2'] },
  ];

  it('ne tire jamais une catégorie à zéro', () => {
    for (let s = 0; s < 40; s++) {
      expect(pickPair(pool, { rng: seeded(s), weights: { stade: 1 } }).id).toBe('b');
      expect(pickPair(pool, { rng: seeded(s), weights: { joueur: 50, meme: 50 } }).id).not.toBe('b');
    }
  });

  it('respecte à peu près les curseurs (60 % joueurs sur 3 000 tirages)', () => {
    const rng = seeded(42);
    let joueurs = 0;
    const N = 3000;
    for (let i = 0; i < N; i++) {
      if (pickPair(BASE_GROUPS, { rng, weights: DEFAULT_WEIGHTS }).cat === 'joueur') joueurs++;
    }
    expect(joueurs / N).toBeGreaterThan(0.56);
    expect(joueurs / N).toBeLessThan(0.64);
    const sh = shares(DEFAULT_WEIGHTS);
    expect(sh.joueur).toBeCloseTo(0.6, 5);
    expect(Object.values(sh).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 5);
  });

  it('évite les paires récentes tant que possible, puis les réutilise', () => {
    for (let s = 0; s < 20; s++) {
      expect(pickPair(pool, { rng: seeded(s), exclude: ['a', 'b'] }).id).toBe('c');
    }
    expect(pickPair(pool, { rng: seeded(1), exclude: ['a', 'b', 'c'] })).toBeTruthy();
  });

  it('retombe sur un tirage uniforme si tous les curseurs sont à zéro ou hors pool', () => {
    expect(pickPair(pool, { rng: seeded(1), weights: { joueur: 0, stade: 0, meme: 0 } })).toBeTruthy();
    expect(pickPair(pool, { rng: seeded(1), weights: { but: 100 } })).toBeTruthy();
    expect(pickPair(pool, { rng: seeded(1), weights: WEIGHT_PRESETS.players }).cat).toBe('joueur');
  });
});

describe('les fins de partie', () => {
  it('les civils gagnent quand le dernier imposteur tombe, +2 chacun', () => {
    let g = toVote(newGame(4, 1, false));
    const [u] = idsWithRole(g, 'undercover');
    g = eliminate(g, u);
    expect(g.phase).toBe('over');
    expect(g.result?.winner).toBe('civils');
    const civils = idsWithRole(g, 'civil', false);
    expect(g.result?.winnerIds.sort()).toEqual(civils.sort());
    civils.forEach((id) => expect(g.result?.points[id]).toBe(POINTS.civil));
    expect(g.result?.points[u]).toBeUndefined();
  });

  it("l'undercover gagne quand il égale les civils, +10", () => {
    let g = toVote(newGame(5, 2, false));
    const [c1] = idsWithRole(g, 'civil');
    g = eliminate(g, c1);
    expect(counts(g.players)).toMatchObject({ civils: 2, undercovers: 2 });
    expect(g.phase).toBe('over');
    expect(g.result?.winner).toBe('undercovers');
    idsWithRole(g, 'undercover', false).forEach((id) => expect(g.result?.points[id]).toBe(POINTS.undercover));
  });

  it("l'undercover gagne aussi quand il ne reste qu'un civil", () => {
    let g = toVote(newGame(4, 1, false));
    const [c1, c2] = idsWithRole(g, 'civil');
    g = eliminate(g, c1);
    expect(g.phase).toBe('discuss');
    expect(g.round).toBe(2);
    g = eliminate(goToVote(g), c2);
    expect(g.result?.winner).toBe('undercovers');
  });

  it('un undercover éliminé marque quand même si son camp gagne', () => {
    let g = toVote(newGame(7, 2, false));
    const [u1] = idsWithRole(g, 'undercover');
    g = eliminate(g, u1);
    expect(g.phase).toBe('discuss');
    const civils = idsWithRole(g, 'civil');
    g = eliminate(goToVote(g), civils[0]);
    g = eliminate(goToVote(g), civils[1]);
    g = eliminate(goToVote(g), civils[2]);
    // 2 civils contre 1 undercover : la partie continue encore un tour.
    expect(g.phase).toBe('discuss');
    g = eliminate(goToVote(g), civils[3]);
    expect(g.result?.winner).toBe('undercovers');
    expect(g.result?.points[u1]).toBe(POINTS.undercover);
  });

  it('Mr. White éliminé doit deviner ; bonne réponse = il gagne seul, +6', () => {
    let g = toVote(newGame(5, 1, true));
    const [w] = idsWithRole(g, 'white');
    g = eliminate(g, w);
    expect(g.phase).toBe('whiteGuess');
    expect(g.pendingWhiteId).toBe(w);
    const done = resolveWhiteGuess(g, g.civilWord, true);
    expect(done.phase).toBe('over');
    expect(done.result?.winner).toBe('white');
    expect(done.result?.points).toEqual({ [w]: POINTS.white });
    expect(done.history[done.history.length - 1]).toMatchObject({ playerId: w, whiteGuessCorrect: true });
  });

  it('Mr. White qui se trompe : la partie continue sans lui', () => {
    let g = toVote(newGame(5, 1, true));
    const [w] = idsWithRole(g, 'white');
    g = resolveWhiteGuess(eliminate(g, w), 'n importe quoi', false);
    expect(g.phase).toBe('discuss');
    expect(g.round).toBe(2);
    expect(g.players.find((p) => p.id === w)?.alive).toBe(false);
    expect(g.speakingOrder).not.toContain(w);
  });

  it('sans undercover, le carton blanc survivant gagne en son nom (+6)', () => {
    let g = toVote(newGame(4, 0, true));
    const [c1, c2] = idsWithRole(g, 'civil');
    const [w] = idsWithRole(g, 'white');
    g = eliminate(g, c1);
    expect(g.phase).toBe('discuss');
    g = eliminate(goToVote(g), c2);
    expect(g.phase).toBe('over');
    expect(g.result?.winner).toBe('white');
    expect(g.result?.points).toEqual({ [w]: POINTS.white });
    expect(g.result?.winnerIds).toEqual([w]);
  });

  it('Mr. White vivant quand les imposteurs gagnent marque +6', () => {
    let g = toVote(newGame(5, 1, true));
    const [c1, c2] = idsWithRole(g, 'civil');
    g = eliminate(g, c1);
    g = eliminate(goToVote(g), c2);
    expect(g.result?.winner).toBe('undercovers');
    const [w] = idsWithRole(g, 'white', false);
    expect(g.result?.points[w]).toBe(POINTS.white);
  });

  it('ignore une élimination hors phase ou sur un joueur déjà sorti', () => {
    const g = newGame(4, 1, false);
    expect(eliminate(g, 'p0')).toBe(g);
    let v = toVote(g);
    v = eliminate(v, 'p0');
    const v2 = goToVote(v);
    expect(eliminate(v2, 'p0')).toBe(v2);
  });

  it('réorganiser les sièges garde le premier orateur et refuse les listes bancales', () => {
    const g = toVote(newGame(5, 1, true));
    const starter = g.speakingOrder[0];
    const ids = g.players.map((p) => p.id).reverse();
    const r = reorderSeats(g, ids);
    expect(r.players.map((p) => p.id)).toEqual(ids);
    expect(r.speakingOrder[0]).toBe(starter);
    expect(r.speakingOrder).toHaveLength(5);
    expect(reorderSeats(g, ids.slice(1))).toBe(g);
    expect(reorderSeats(g, [ids[0], ids[0], ids[1], ids[2], ids[3]])).toBe(g);
    expect(reorderSeats(newGame(5, 1, true), ids)).toMatchObject({ phase: 'reveal' });
    expect(reorderSeats(newGame(5, 1, true), ids).players.map((p) => p.id)).not.toEqual(ids);
  });

  it("l'ordre de parole tourne d'un siège à chaque tour et saute les éliminés", () => {
    let g = toVote(newGame(6, 2, false));
    const starter = g.speakingOrder[0];
    const next = nextRoundOrder({ ...g, players: g.players.map((p) => (p.id === 'p2' ? { ...p, alive: false } : p)) });
    expect(next).not.toContain('p2');
    expect(next[0]).not.toBe(starter);
    const seatIds = g.players.map((p) => p.id);
    const expectedStart = seatIds[(seatIds.indexOf(starter) + 1) % 6] === 'p2'
      ? seatIds[(seatIds.indexOf(starter) + 2) % 6]
      : seatIds[(seatIds.indexOf(starter) + 1) % 6];
    expect(next[0]).toBe(expectedStart);
    expect(computeOutcome(g.players)).toBeNull();
  });
});

describe('le verdict sur la réponse de Mr. White', () => {
  it('tolère accents, casse et prénom manquant', () => {
    expect(isGuessLikelyCorrect('mbappe', 'Mbappé')).toBe(true);
    expect(isGuessLikelyCorrect('Ronaldo', 'Cristiano Ronaldo')).toBe(true);
    expect(isGuessLikelyCorrect('ronaldo', 'Ronaldo (R9)')).toBe(true);
    expect(isGuessLikelyCorrect('Neymar Jr', 'Neymar')).toBe(true);
    expect(isGuessLikelyCorrect('la main de dieu', 'La Main de Dieu (Maradona 1986)')).toBe(true);
    expect(isGuessLikelyCorrect('parc des princes', 'Parc des Princes')).toBe(true);
  });

  it('refuse le vide, les mots trop courts et les mauvaises réponses', () => {
    expect(isGuessLikelyCorrect('', 'Neymar')).toBe(false);
    expect(isGuessLikelyCorrect('de', 'Kevin De Bruyne')).toBe(false);
    expect(isGuessLikelyCorrect('Vinicius', 'Neymar')).toBe(false);
    expect(isGuessLikelyCorrect('Ligue Europa', 'Ligue des champions')).toBe(false);
  });
});
